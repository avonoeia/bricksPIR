const ObjectId = require("mongodb").ObjectId;
const Report = require("../models/reportModel");
const Project = require("../models/projectModel");
const { projectUpdator, cumulative_progress_in_report } = require("../utility/projectUpdator");
const { findOneAndUpdate } = require("../models/reportModel");

// Get reports
async function getReports(req, res) {
    const { position, access } = req.user;

    let reports = [];
    if (position == "admin") {
        reports = [...(await Report.find())];
    } else {
        for (let i = 0; i < access.length; i++) {
            const fetchedReports = await Report.find({ project_id: access[i] });
            if (fetchedReports) {
                reports = [...reports, ...fetchedReports];
            }
        }
    }

    return res.status(200).json({ reports_list: [...reports].reverse() });
}

async function getReport(req, res) {
    const { position, access } = req.user;
    const { report_id } = req.params;

    if (!ObjectId.isValid(report_id.trim())) {
        return res.status(400).json({ error: "Unexpected error" });
    }

    let report = {};
    let project = {};
    if (position == "admin") {
        report = await Report.findOne({ _id: report_id });
        project = await Project.findOne({ _id: report.project_id });
    } else {
        report = await Report.findOne({ _id: report_id });
        project = await Project.findOne({ _id: report.project_id });
        const project_id = report.project_id.toString();
        if (!access.find((ele) => ele === project_id)) {
            return res
                .status(403)
                .json({ error: "You do not have access to this report" });
        }
    }

    report.contract_start_date = project.contract_start_date;
    report.contract_completion_date = project.contract_completion_date;

    return res.status(200).json({
        report_details: {
            ...report,
        },
    });
}

// Start a new report
async function startNewReport(req, res) {
    const { project_id, activity_description, deadline } = req.body;
    const { _id, name, position } = req.user;

    console.log(
        "StartNewReport contoller triggered at",
        new Date(),
        "by",
        name
    );

    const project = await Project.findOne({ _id: project_id });

    if (!project) {
        return res.status(400).send("Unexpected Error");
    }

    if (position === "data_entry_operator") {
        if (
            !project.roles.data_entry_operator.find(
                (element) => element.split(" - ")[1] === _id.toString()
            )
        ) {
            return res
                .status(403)
                .json({ error: "You do not have access to this project" });
        }
    }
    if (position === "site_manager") {
        if (
            !project.roles.site_manager.find(
                (element) => element.split(" - ")[1] === _id.toString()
            )
        ) {
            return res
                .status(403)
                .json({ error: "You do not have access to this project" });
        }
    }

    const reportDocument = {
        ...req.body,
        status: "pending approval",
        contractor: project.contractor,
        employer: project.employer,
        contract_start_date: project.contract_start_date,
        contract_completion_date: project.contract_completion_date,
        created: [name, new Date()],
    };

    try {
        const newReport = await Report.create({ ...reportDocument });
        if (newReport) {
            return res
                .status(200)
                .json({ message: "Report successfully started.", newReport });
        }
    } catch (err) {
        console.log(err);
    }
}

// Take report inputs
async function resubmitReport(req, res) {
    const { newReport } = req.body;
    const { _id, position } = req.user;
    const { report_id } = req.params;

    const report = await Report.findOne({ _id: report_id });
    const project = await Project.findOne({ _id: report.project_id });

    if (!project || !report) {
        return res.status(400).json({ error: "Unexpected error." });
    }

    if (position === "data_entry_operator") {
        if (
            !project.roles.data_entry_operator.find(
                (element) => element.split(" - ")[1] === _id.toString()
            )
        ) {
            return res
                .status(403)
                .json({ error: "You do not have access to this project" });
        }
    }
    if (position === "site_manager") {
        if (
            !project.roles.site_manager.find(
                (element) => element.split(" - ")[1] === _id.toString()
            )
        ) {
            return res
                .status(403)
                .json({ error: "You do not have access to this project" });
        }
    }

    if (report.status == "approved") {
        return res
            .status(400)
            .json({ error: "Report has already been approved." });
    }

    try {
        const updatedReport = await Report.findOneAndReplace(
            { _id: report_id },
            {
                ...newReport,
                approved_by: [],
                status: "pending approval",
            },
            { new: true }
        );

        return res.status(200).json({
            message: "Report data successfully entered.",
            updatedReport,
        });
    } catch (err) {
        console.log(err);
    }
}

// Approve report
async function approveReport(req, res) {
    const { report_id } = req.params;
    const { _id, position } = req.user;

    let report = "";

    try {
        const fetchedReport = await Report.findOne({ _id: report_id });
        if (
            fetchedReport.required_approvals.find(
                (id) => id.split(" - ")[1] == _id
            )
        ) {
            report = fetchedReport;
        } else {
            return res.status(403).send("Unauthorized");
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send(`No report with ${report_id}`);
    }

    let { status, required_approvals, approved_by } = report;

    if (approved_by.find((id) => id.split(" - ")[1] == _id)) {
        return res.status(400).send("You have already approved this project");
    }

    approved_by.push(
        required_approvals.find((id) => id.split(" - ")[1] == _id)
    );

    if (required_approvals.length === approved_by.length) {
        const update = await projectUpdator(report);
        const r_activities = cumulative_progress_in_report(update, report.activities)

        try {
            const updatedReport = await Report.findOneAndUpdate(
                { _id: report_id },
                { status: "approved", approved_by: [...approved_by], activities: [...r_activities] },
                { new: true }
            );
            const updatedProject = await Project.findOneAndUpdate(
                { _id: report.project_id },
                {
                    activities: [...update.activities],
                    materials: [...update.materials],
                    equipments: [...update.equipments],
                    labour: { ...update.labour },
                    visitors: [...update.visitors],
                },
                { new: true }
            );

            return res.status(200).json({
                message: "Success and report approved. Project updated.",
                updatedProject,
                updatedReport,
            });
        } catch (err) {
            console.log(err);
            return res.status(400).send("Unexpected error");
        }
    } else {
        return res.status(200).json({ message: "Success." });
    }
}

module.exports = {
    getReports,
    getReport,
    startNewReport,
    resubmitReport,
    approveReport,
};

// {
//     _id: new ObjectId("64a451b788e99eb4060211b1"),
//     project_name: 'BricksPIR',
//     project_id: '64a44ee5e2f34930d693383e',
//     required_approvals: [ 'Site Manager - 637b9af31b7d5f4691365ce8' ],
//     approved_by: [ 'Site Manager - 637b9af31b7d5f4691365ce8' ],
//     duration: [ '09:00', '17:00' ],
//     activities: [
//       {
//         no: 1,
//         activity: 'Coding',
//         unit: 'lines',
//         planned: '100',
//         achieved: '90',
//         level: '1',
//         grid_line: '1-1/2-2'
//       }
//     ],
//     visitors: [ { no: 1, name: 'Dog', organization: 'UTA' } ],
//     materials: [],
//     equipments: [],
//     labour: [ { no: 1, description: 'Engineer', planned: '1', actual: '1' } ],
//     status: 'approved',
//     created: [ 'Site Manager', 2023-07-04T17:07:03.828Z ],
//     createdAt: 2023-07-04T17:07:03.841Z,
//     updatedAt: 2023-07-04T17:07:23.740Z,
//     __v: 0
//   }
//   {
//     _id: new ObjectId("64a451b788e99eb4060211b1"),
//     project_name: 'BricksPIR',
//     project_id: '64a44ee5e2f34930d693383e',
//     required_approvals: [ 'Site Manager - 637b9af31b7d5f4691365ce8' ],
//     approved_by: [ 'Site Manager - 637b9af31b7d5f4691365ce8' ],
//     duration: [ '09:00', '17:00' ],
//     activities: [
//       {
//         no: 1,
//         activity: 'Coding',
//         unit: 'lines',
//         planned: '100',
//         achieved: '90',
//         level: '1',
//         grid_line: '1-1/2-2'
//       }
//     ],
//     visitors: [ { no: 1, name: 'Dog', organization: 'UTA' } ],
//     materials: [],
//     equipments: [],
//     labour: [ { no: 1, description: 'Engineer', planned: '1', actual: '1' } ],
//     status: 'approved',
//     created: [ 'Site Manager', 2023-07-04T17:07:03.828Z ],
//     createdAt: 2023-07-04T17:07:03.841Z,
//     updatedAt: 2023-07-04T17:07:23.740Z,
//     __v: 0
//   }
