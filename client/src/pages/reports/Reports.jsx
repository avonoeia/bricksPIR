import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useAuthContext } from "./../../hooks/useAuthContext";
import { Link } from "react-router-dom";

import Navbar from "./../../components/navbar/Navbar";
import PreviousReportsContainer from "./PreviousReportsContainer";
import PendingReportsContainer from "./PendingReportsContainer";
import RejectedReportsContainer from "./RejectedReportContainer";

const queryClient = new QueryClient();

export default function Reports() {
    const {user} = useAuthContext();
    const [toggle, setToggle] = useState("pending");
    const [rejectedReports, setRejectedReports] = useState("");

    const handleClick = (event) => {
        setToggle(event.target.value);
    };

    useEffect(() => {
        async function fetchRejectedReports() {
            await fetch("/api/reports/get-limited-rejected-reports", {
                headers: { Authorization: `Bearer ${user.token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.reports_list.length > 0) {
                        setRejectedReports([...data.reports_list]);
                    }
                });
        }

        fetchRejectedReports();
    }, []);

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Navbar pageName="reports" />
                <main>
                    <div className="page-route">
                        / Reports{" "}
                        <Link to="/reports/new-report">
                            <button
                                style={{ marginLeft: "1rem" }}
                                className="small-button"
                            >
                                New Report
                            </button>
                        </Link>{" "}
                    </div>
                    <div
                        id="toggle-bar-container"
                        className="toggle-bar-container"
                    >
                        <button
                            className={
                                toggle == "pending"
                                    ? "toggle-item selected-toggle"
                                    : "toggle-item"
                            }
                            value="pending"
                            onClick={handleClick}
                        >
                            Pending
                        </button>
                        <button
                            className={
                                toggle == "approved"
                                    ? "toggle-item selected-toggle"
                                    : "toggle-item"
                            }
                            value="approved"
                            onClick={handleClick}
                        >
                            Approved
                        </button>
                        {rejectedReports && (
                            <button
                                className={
                                    toggle == "approved"
                                        ? "toggle-item selected-toggle"
                                        : "toggle-item"
                                }
                                value="rejected"
                                onClick={handleClick}
                            >
                                Rejected
                            </button>
                        )}
                    </div>
                    {toggle === "pending" && <PendingReportsContainer />}
                    {toggle === "approved" && <PreviousReportsContainer />}
                    {toggle === "rejected" && <RejectedReportsContainer rejectedReports={rejectedReports} />}
                </main>
            </QueryClientProvider>
        </>
    );
}
