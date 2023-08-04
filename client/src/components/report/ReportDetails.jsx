import React from "react";
import { Link } from "react-router-dom";

export default function ReportDetails({ project, report, setReport, status }) {
    function handleNavigation1() {
        window.location.href = `/reports/${report.resubmission}`;
    }

    function handleNavigation2() {
        window.location.href = `/reports/${report.report_rejection.resubmission}`;
    }
    
    return (
        <div className="container">
            <div className="blue-label">Report Details</div>
            <div className="container-main-block">
                {(report.status == 'rejected' || report.status == "rejected resubmitted") && (
                    <div className="text-field-block" style={{ width: "100%", padding: "10px 20px", backgroundColor: "#ffef0078" }}>
                        <div className="text-field">
                            This report has been rejected by project manager <i>{report.report_rejection.by}</i>.
                        </div>
                        <div className="text-label">Reason for rejection</div>
                        <div className="text-field">
                            {report.report_rejection.reason}
                        </div>
                        {
                            report.report_rejection.resubmission && (
                                <div className="text-field">
                                    The revised and resubmitted version is now available at <u style={{"cursor": "pointer"}} onClick={handleNavigation2}>{report.report_rejection.resubmission}</u>.
                                </div>
                            )
                        }
                    </div>
                )}

                {
                    report.resubmission && (
                        <div className="text-field-block" style={{ width: "100%", backgroundColor: "#ffef0078", padding: "10px 20px" }}>
                            <div className="text-field">
                                This report is a resubmission of <u style={{"cursor": "pointer"}} onClick={handleNavigation1}>{report.resubmission}</u>.
                            </div>
                        </div>
                    )
                }

                <div className="text-field-block" style={{ width: "40%" }}>
                    <div className="text-label">Project Manager</div>
                    <div className="text-field">
                        {project.project_manager.map((user) => (
                            <React.Fragment key={user}>
                                {user}
                                <br />
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="text-field-block" style={{ width: "40%" }}>
                    <div className="text-label">Site Manager</div>
                    <div className="text-field">
                        {project.site_manager.map((user) => (
                            <React.Fragment key={user}>
                                {user}
                                <br />
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="text-field-block" style={{ width: "40%" }}>
                    <div className="text-label">Data Entry Operator</div>
                    <div className="text-field">
                        {project.data_entry_operator.map((user) => (
                            <React.Fragment key={user}>
                                {user}
                                <br />
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {status ? (
                    <>
                        <hr className="black-separator" />
                        <div
                            className="text-field-block"
                            style={{ width: "40%" }}
                        >
                            <div className="text-label">Required Approvals</div>
                            <div className="text-field">
                                {report.required_approvals.map((user) => user)}
                            </div>
                        </div>
                        <div
                            className="text-field-block"
                            style={{ width: "40%" }}
                        >
                            <div className="text-label">Approved By</div>
                            <div className="text-field">
                                {report.approved_by.map((user) => user)}
                            </div>
                        </div>
                    </>
                ) : (
                    ""
                )}

                <hr className="black-separator" />
                <div className="text-field-block" style={{ width: "100%" }}>
                    <div className="text-label">Work Duration</div>
                    <div className="text-field">
                        From time (24 hrs format)
                        <input
                            style={{ margin: "10px 10px" }}
                            type="time"
                            value={report.duration[0]}
                            disabled={
                                report.status == "approved" ||
                                report.status == "pending approval"
                            }
                            required={true}
                            onChange={(e) => {
                                setReport((data) => {
                                    const newDuration = data.duration;
                                    newDuration[0] = e.target.value;
                                    return {
                                        ...data,
                                        duration: [...newDuration],
                                    };
                                });
                            }}
                        />
                        To time (24 hrs format)
                        <input
                            style={{ margin: "10px 10px" }}
                            type="time"
                            value={report.duration[1]}
                            disabled={
                                report.status == "approved" ||
                                report.status == "pending approval"
                            }
                            required={true}
                            onChange={(e) => {
                                setReport((data) => {
                                    const newDuration = data.duration;
                                    newDuration[1] = e.target.value;
                                    return {
                                        ...data,
                                        duration: [...newDuration],
                                    };
                                });
                            }}
                        />
                    </div>
                </div>

                <hr className="black-separator" />
                <div className="text-field-block" style={{ width: "100%" }}>
                    <div className="text-label">Site</div>
                    <div className="text-field">
                        Weather
                        <select
                            style={{ margin: "10px" }}
                            className="input-field"
                            value={report.weather}
                            name="weather"
                            id="weather"
                            disabled={
                                report.status == "approved" ||
                                report.status == "pending approval"
                            }
                            onChange={(e) =>
                                setReport((data) => {
                                    return {
                                        ...data,
                                        weather: e.target.value,
                                    };
                                })
                            }
                        >
                            <option value="Normal">Normal</option>
                            <option value="Rainy">Rainy</option>
                        </select>
                        Site Conditions
                        <select
                            style={{ marginLeft: "10px" }}
                            className="input-field"
                            value={report.site_conditions}
                            name="weather"
                            id="weather"
                            onChange={(e) =>
                                setReport((data) => {
                                    return {
                                        ...data,
                                        site_conditions: e.target.value,
                                    };
                                })
                            }
                            disabled={
                                report.status == "approved" ||
                                report.status == "pending approval"
                            }
                        >
                            <option value="Dry">Dry</option>
                            <option value="Slusy">Slushy</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
