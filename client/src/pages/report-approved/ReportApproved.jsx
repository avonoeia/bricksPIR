import React, { useState, useEffect, useRef } from "react"
import { useAuthContext } from "../../hooks/useAuthContext"
import ReactToPrint from 'react-to-print';
import { Link } from "react-router-dom"


import Navbar from "../../components/navbar/Navbar"
import ContentToPrint from "../../components/print/ContentToPrint.jsx"

function ReportContent({ reportData }) {
    return (
        <div className="container-main-block">
            <div className="report-box">
                {/* Report Information */}
                <div className="report-box-row">
                    <div>
                        Report created by <u>{reportData.created[0]}</u> on {reportData.created[1].split("T")[0]}. Approved 
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
                        </strong> {Math.round((new Date(reportData.updatedAt) - new Date(reportData.contract_start_date.split("T")[0]).getTime()) / (1000 * 3600 * 24 ))} day(s)
                    </div>
                    <div>
                        <strong>
                            Time Remaining:
                        </strong> {Math.round((new Date(reportData.contract_completion_date.split("T")[0]).getTime() - new Date(reportData.updatedAt).getTime()) / (1000 * 3600 * 24 ))}  day(s)
                    </div>
                </div>
                
                
                {/* Site Information Update */}
                <h2 className="heading">Site</h2>
                <div className="report-box-row">
                    <div>
                        <strong>Weather:</strong> {reportData.weather && reportData.weather}
                    </div>
                    <div>
                        <strong>From:</strong> {reportData.duration[0]} <strong>To:</strong> {reportData.duration[1]}
                    </div>
                    <div>
                        <strong>Site Conditions:</strong> {reportData.site_conditions && reportData.site_conditions}
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
                    <div>
                        <strong>Cumulative</strong>
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
                            <div>{act.cumulative_achieved && act.cumulative_achieved}</div>

                        </div>
                    )) : "No activities"
                }

                {/* Materials */}
                <h2 className="heading">Materials</h2>
                <div className="report-box-row">
                    <div>
                        <strong>Material</strong>
                    </div>
                    <div>
                        <strong>Unit</strong>
                    </div>
                    <div>
                        <strong>Usage</strong>
                    </div>
                </div>
                {
                    reportData.materials.length > 0 ? reportData.materials.map(mat => (
                        <div key={mat.material} className="report-box-row">
                            <div>{mat.material}</div>
                            <div>{mat.unit}</div>
                            <div>{mat.usage}</div>

                        </div>
                    )) : "No material record"
                }

                {/* Equipments */}
                <h2 className="heading">Equipments</h2>
                <div className="report-box-row">
                    <div>
                        <strong>ID</strong>
                    </div>
                    <div>
                        <strong>Category</strong>
                    </div>
                    <div>
                        <strong>Status</strong>
                    </div>
                    <div>
                        <strong>Hours</strong>
                    </div>
                </div>
                {
                    reportData.equipments.length > 0 ? reportData.equipments.map(eqp => (
                        <div key={eqp.id} className="report-box-row">
                            <div>{eqp.id}</div>
                            <div>{eqp.category}</div>
                            <div>{eqp.status}</div>
                            <div>{eqp.hours}</div>
                        </div>
                    )) : "No equipment record"
                }

                {/* Labour */}
                <h2 className="heading">Labour</h2>
                <div className="report-box-row">
                    <div>
                        <strong>No.</strong>
                    </div>
                    <div>
                        <strong>Description</strong>
                    </div>
                    <div>
                        <strong>Planned</strong>
                    </div>
                    <div>
                        <strong>Actual</strong>
                    </div>
                </div>
                {
                    reportData.labour.length > 0 ? reportData.labour.map(lab => (
                        <div key={lab.no} className="report-box-row">
                            <div>{lab.no}</div>
                            <div>{lab.description}</div>
                            <div>{lab.planned}</div>
                            <div>{lab.actual}</div>
                        </div>
                    )) : "No labour record"
                }

                {/* Visitors */}
                <h2 className="heading">Visitors</h2>
                <div className="report-box-row">
                    <div>
                        <strong>No.</strong>
                    </div>
                    <div>
                        <strong>Name</strong>
                    </div>
                    <div>
                        <strong>Organization</strong>
                    </div>
                </div>
                {
                    reportData.visitors.length > 0 ? reportData.visitors.map(visitor => (
                        <div key={visitor.no} className="report-box-row">
                            <div>{visitor.no}</div>
                            <div>{visitor.name}</div>
                            <div>{visitor.organization}</div>
                        </div>
                    )) : "No Visitor record"
                }
            </div>
        </div>
    )
}


export default function ReportApproved() {
    const { user } = useAuthContext()
    const [reportData, setReportData] = useState("")
    const printRef = useRef(null)
    console.log(reportData)

    useEffect(() => {
        const arr = window.location.href.split('/')
        const report_id = arr[arr.length - 1]

        const fetchReports = async () => {
            let response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/reports/get-report/${report_id}`, {
                headers: {'Authorization': `Bearer ${user.token}`},
            })

            if (response.ok) {
                response = await response.json()
                if (response.report_details._doc.status !== "approved") {
                    window.location.href = "/reports"
                }
                setReportData(response.report_details._doc)
            }
        }

        fetchReports()
    }, [])

    return (
        <>
            <Navbar pageName="reports" />
            <main>
                <div className="page-route">/ Reports / Approved Reports</div>
                <div className="container">
                    <div className="blue-label">Report</div>

                    {
                        reportData ? (
                            <>
                                <ReportContent reportData={reportData} />

                                <div style={{"display": "none"}}>
                                    <ContentToPrint 
                                        ref={printRef} 
                                        reportData={reportData}
                                    />
                                </div>

                                <ReactToPrint 
                                    trigger={() => <button className="small-button">Print</button>}
                                    content={() => printRef.current}
                                    pageStyle="@page { size: auto; margin: 5mm; }"
                                />
                            </>
                        ) : "Loading..."
                    }

                </div>
            </main>
        </>
    )
}