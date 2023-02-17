import React, { useState, useEffect } from "react"
import { useAuthContext } from "../../hooks/useAuthContext"
import { Link } from "react-router-dom"


import Navbar from "../../components/navbar/Navbar"

function ReportContent({ reportData }) {
    return (
        <div className="container-main-block">
            <div className="report-box">
                {/* Report Information */}
                <div className="report-box-row">
                    <div>
                        Report created by {reportData.created[0]} on {reportData.created[1].split("T")[0]}. Approved 
                        on <strong>{reportData.updatedAt.split("T")[0]}</strong> at
                        time {new Date(reportData.updatedAt).toLocaleTimeString()}.
                    </div>
                </div>


                {/* Project Information */}
                <h2 className="heading">Project</h2>
                <div className="report-box-row">
                    <div>
                        <strong>Project Name:</strong> {reportData.project_name}
                    </div>
                    <div>
                        <strong>Project ID:</strong> {reportData.project_id}
                    </div>
                </div>
                <div className="report-box-row">
                    <div>
                        <strong>
                            Time Elapsed:
                        </strong> {Math.round((new Date(reportData.updatedAt) - new Date('2023-01-01').getTime()) / (1000 * 3600 * 24 ))} day(s)
                    </div>
                    <div>
                        <strong>
                            Time Remaining:
                        </strong> {Math.round((new Date('2023-02-28').getTime() - new Date(reportData.updatedAt).getTime()) / (1000 * 3600 * 24 ))}  day(s)
                    </div>
                </div>
                
                
                {/* Site Information Update */}
                <h2 className="heading">Site</h2>
                <div className="report-box-row">
                    <div>
                        <strong>Weather:</strong> No rain
                    </div>
                    <div>
                        <strong>From:</strong> 7am <strong>To:</strong> 10am
                    </div>
                    <div>
                        <strong>Site Conditions:</strong> Slushy
                    </div>
                </div>


                {/* Activities */}
                <h2 className="heading">Activities</h2>
                <div className="report-box-row">
                    <div>
                        <strong>No.</strong>
                    </div>
                    <div>
                        <strong>Activity</strong>
                    </div>
                    <div>
                        <strong>Unit</strong>
                    </div>
                    <div>
                        <strong>Level</strong>
                    </div>
                    <div>
                        <strong>Grid Line</strong>
                    </div>
                    <div>
                        <strong>Planned</strong>
                    </div>
                    <div>
                        <strong>Achieved</strong>
                    </div>
                </div>
                {
                    reportData.activities.length > 0 ? reportData.activities.map(act => (
                        <div key={act.no} className="report-box-row">
                            <div>{act.no}</div>
                            <div>{act.activity}</div>
                            <div>{act.unit}</div>
                            <div>{act.level}</div>
                            <div>{act.grid_line}</div>
                            <div>{act.planned}</div>
                            <div>{act.achieved}</div>

                        </div>
                    )) : "No activities"
                }
            </div>
        </div>
    )
}


export default function ReportApproved() {
    const { user } = useAuthContext()
    const [reportData, setReportData] = useState("")

    useEffect(() => {
        const arr = window.location.href.split('/')
        const report_id = arr[arr.length - 1]

        const fetchReports = async () => {
            let response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/reports/get-report/${report_id}`, {
                headers: {'Authorization': `Bearer ${user.token}`},
            })

            if (response.ok) {
                response = await response.json()
                setReportData(response.report_details._doc)
            }
        }

        fetchReports()
    }, [])

    console.log(reportData)
    return (
        <>
            <Navbar pageName="reports" />
            <main>
                <div className="page-route">/ Reports / Approved Reports</div>
                <div className="container">
                    <div className="blue-label">Report</div>

                    {
                        reportData ? (
                            <ReportContent reportData={reportData} />
                        ) : "Loading..."
                    }

                </div>
            </main>
        </>
    )
}