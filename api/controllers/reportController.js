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

// Get limited report data
async function getLimitedPreviousReports(req, res) {
    const { pageNumber } = req.params;
    const { position, access } = req.user;

    const projection = 'project_name project_id duration created updatedAt status'
    const pageSize = 10;

    let reports = [];
    if (position == "admin") {
        reports = [...(
            await Report.find({ status: "approved" }, projection)
                .sort({ updatedAt: -1 })
                .skip(pageSize * (pageNumber - 1))
                .limit(pageSize)
        )];
    } else {
        for (let i = 0; i < access.length; i++) {
            const fetchedReports = await Report.find({ project_id: access[i], status: "approved" }, projection)
                .sort({ updatedAt: -1 })
                .skip(pageSize * (pageNumber - 1))
                .limit(pageSize);

            if (fetchedReports) {
                reports = [...reports, ...fetchedReports];
            }
        }
    }

    return res.status(200).json({ reports_list: [...reports] });
}

// Get limited report data
async function getLimitedPendingReports(req, res) {
    const { position, access } = req.user;

    const projection = 'project_name project_id duration created updatedAt status'

    let reports = [];
    if (position == "admin") {
        reports = [...(
            await Report.find({ status: "pending approval" }, projection)
                .sort({ updatedAt: -1 })
        )];
    } else {
        for (let i = 0; i < access.length; i++) {
            const fetchedReports = await Report.find({ project_id: access[i], status: "pending approval" }, projection)
                .sort({ updatedAt: -1 })

            if (fetchedReports) {
                reports = [...reports, ...fetchedReports];
            }
        }
    }

    return res.status(200).json({ reports_list: [...reports] });
}

// Get limited report data
async function getLimitedRejectedReports(req, res) {
    const { position, access } = req.user;

    const projection = 'project_name project_id duration created updatedAt status'

    let reports = [];
    if (position == "admin") {
        reports = [...(
            await Report.find({ status: "rejected" }, projection)
                .sort({ updatedAt: -1 })
        )];
    } else {
        for (let i = 0; i < access.length; i++) {
            const fetchedReports = await Report.find({ project_id: access[i], status: "rejected" }, projection)
                .sort({ updatedAt: -1 })

            if (fetchedReports) {
                reports = [...reports, ...fetchedReports];
            }
        }
    }

    return res.status(200).json({ reports_list: [...reports] });
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
    console.log(project, project.roles, project.roles["project_manager"])

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

    if (position === "project_manager") {
        if (
            !project.roles["project_manager"].find(
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

// Project Manager Reject
async function rejectReport(req, res) {
    const { newReport } = req.body;
    const { _id, position } = req.user;
    const { report_id } = req.params;

    if (position != "project_manager") {
        return res.status(403).json({ error: "Unauthorized" });
    }

    if (!ObjectId.isValid(report_id.trim())) {
        return res.status(400).json({ error: "Unexpected error" });
    }

    const report = await Report.findOne({ _id: report_id });

    if (!report.required_approvals.find(elem => elem.split(" - ")[1] == _id.toString())) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    if (report.approved_by.find(elem => elem.split(" - ")[1] == _id.toString())) {
        return res.status(400).json({ error: "You have already approved this report" });
    }

    try {
        const updatedReport = await Report.findOneAndReplace(
            { _id: report_id },
            {
                ...newReport,
                approved_by: [],
                status: 'rejected',
                report_rejection: newReport.report_rejection
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

    if (report.status != "rejected") {
        return res
            .status(400)
            .json({ error: "Report has either already been approved or is still pending approval." });
    }

    try {
        delete newReport._id
        const resubmittedReport = await Report.create({
            ...newReport,
            status: "pending approval",
            resubmission: report_id
        })
        
        if (resubmittedReport) {
            const updatedReport = await Report.findOneAndReplace(
                { _id: report_id },
                {
                    ...newReport,
                    approved_by: [],
                    report_rejection: {
                        ...report.report_rejection,
                        resubmitted: resubmitReport._id,
                    },
                    status: "rejected resubmitted",
                },
                { new: true }
            );
        }  else {
            return res.status(400).json({ error: "Unexpected error." });
        }

        return res.status(200).json({
            message: "Report data successfully entered.",
            resubmittedReport,
        });
    } catch (err) {
        console.log(err);
    }
}

// Approve report
async function approveReport(req, res) {
    const { report_id } = req.params;
    const { _id, position } = req.user;

    if (position != "project_manager") {
        return res.status(403).json({ error: "Unauthorized" });
    }

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
    rejectReport,
    resubmitReport,
    approveReport,
    getLimitedPreviousReports,
    getLimitedPendingReports,
    getLimitedRejectedReports,
};