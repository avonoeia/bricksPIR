import React, { useState } from "react";
import { useAuthContext } from "./../../hooks/useAuthContext";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

export default function PendingReportsContainer() {
    const { user } = useAuthContext();
    const [reports, setReports] = useState("");

    const fetchReportsData = async () => {
        const response = await fetch("/api/reports/get-limited-pending-reports", {
            headers: { Authorization: `Bearer ${user.token}` },
        });
        return response.json();
    };

    function setData(data) {
        setReports([
            ...data.reports_list
        ]);
    }

    const { isLoading, error, data } = useQuery({
        queryKey: "reports",
        queryFn: fetchReportsData,
        onSuccess: setData,
    });

    return (
        <>
            {isLoading ? (
                "Loading..."
            ) : (
                <>
                    <div className="container">
                        <div className="blue-label">Pending Reports</div>
                        <div className="container-main-block">
                            {reports.length > 0 ? (
                                reports.map((report, index) => (
                                    <div
                                        key={report._id}
                                        className="general-card"
                                    >
                                        <div className="blue-label-box">
                                            <span>{index + 1}</span>
                                        </div>
                                        <div className="general-card-main-block">
                                            <p
                                                style={{
                                                    margin: "0px 0px 5px 0px",
                                                }}
                                            >
                                                <strong>Name of work:</strong>{" "}
                                                {report.project_name}
                                            </p>
                                            <p
                                                style={{
                                                    margin: "0px 0px 5px 0px",
                                                }}
                                            >
                                                <strong>Project ID:</strong>{" "}
                                                {report.project_id}
                                            </p>
                                            <p
                                                style={{
                                                    margin: "0px 0px 5px 0px",
                                                }}
                                            >
                                                <strong>Duration:</strong>{" "}
                                                {report.duration[0]} to{" "}
                                                {report.duration[1]}
                                            </p>
                                            <p
                                                style={{
                                                    margin: "0px 0px 5px 0px",
                                                }}
                                            >
                                                <strong>Created by:</strong>{" "}
                                                {report.created[0]} on{" "}
                                                {
                                                    report.created[1].split(
                                                        "T"
                                                    )[0]
                                                }{" "}
                                            </p>
                                        </div>
                                        <div className="general-card-button-container">
                                            <Link to={`/reports/${report._id}`}>
                                                <button className="small-button">
                                                    View Details
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div
                                    style={{
                                        textAlign: "center",
                                        width: "100%",
                                    }}
                                >
                                    Pending queue is empty
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
