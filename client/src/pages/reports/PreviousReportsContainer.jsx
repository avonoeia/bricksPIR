import React, { useState, useEffect } from "react";
import { useAuthContext } from "./../../hooks/useAuthContext";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

export default function PreviousReportsContainer() {
    const { user } = useAuthContext();
    const [reports, setReports] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [loadingState, setIsLoadingState] = useState(false)

    const fetchReportsData = async () => {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL || ""}/api/reports/get-limited-previous-reports/${pageNumber}`,
            {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-type": "application/json",
                },
            }
        );
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

    async function handleNext() {
        setPageNumber(pageNumber + 1);
    }

    async function HandlePrev() {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    }

    useEffect(() => {
        setIsLoadingState(true)
        
        async function fetchNewReportsData() {
            await  fetch(
                `${import.meta.env.VITE_API_URL || ""}/api/reports/get-limited-previous-reports/${pageNumber}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-type": "application/json",
                    },
                })
                .then((response) => response.json())
                .then(data => {
                    setReports([...data.reports_list])
                    setIsLoadingState(false)
                })
        }

        fetchNewReportsData();
    }, [pageNumber]);

    return (
        <>
            {isLoading ? (
                "Loading..."
            ) : (
                <>
                    <div className="container">
                        <div className="blue-label">Previous Reports</div>
                        <div className="container-main-block">
                            {reports.length > 0 ? (
                                <>
                                    {reports.map((report, index) => (
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
                                                    <strong>Report ID:</strong>{" "}
                                                    {report._id}
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
                                                    <strong>Submitted:</strong>{" "}
                                                    {report.updatedAt.split("T")[0]}{" "}
                                                </p>
                                            </div>
                                            <div className="general-card-button-container">
                                                <Link
                                                    to={`/reports/approved/${report._id}`}
                                                >
                                                    <button className="small-button">
                                                        View Details
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="toggle-bar-container" style={{"margin": "25px 0 0px 0"}}>
                                        {pageNumber > 1 && <button className={"toggle-item"} value="approved" onClick={HandlePrev}>{"<"} Prev</button>}
                                        <button className={"toggle-item"} value="pending" onClick={handleNext}>Next {">"}</button>
                                    </div>
                                </>
                            ) : (
                                <div
                                    style={{
                                        textAlign: "center",
                                        width: "100%",
                                    }}
                                >
                                    No previously submitted reports
                                    <div className="toggle-bar-container" style={{"margin": "25px 0 0px 0"}}>
                                        {pageNumber > 1 && <button className={"toggle-item"} value="approved" onClick={HandlePrev}>{"<"} Prev</button>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}