import React, { useState, useEffect } from "react"
import { useAuthContext } from "../../hooks/useAuthContext"
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

const queryClient = new QueryClient()

import Navbar from "../../components/navbar/Navbar"
import ProjectDetails from "../../components/report/ProjectDetails"
import ReportDetails from "../../components/report/ReportDetails"
import Activities from "../../components/report/Activities"
import Materials from "../../components/report/Materials"
import Equipments from "../../components/report/Equipments"
import Labour from "../../components/report/Labour"
import Visitors from "../../components/report/Visitors"

function ReportPageComponent({ project, setProject, report, setReport }) {
    const { user } = useAuthContext()

    const fetchReportData = async () => {
        const arr = window.location.href.split('/')
        const report_id = arr[arr.length - 1]

        const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/reports/get-report/${report_id}`, {
            headers: {'Authorization': `Bearer ${user.token}`},
        })
        return response.json()
    }

    const fetchProjectData = async (project_id) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/projects/details/${project_id}`, {
            headers: {'Authorization': `Bearer ${user.token}`},
        })
        return response.json()
    }

    const fetchAllData = async () => {
        let reportData = await fetchReportData()
        let projectData = await fetchProjectData(reportData.report_details._doc.project_id)
        
        return { report: reportData.report_details._doc, project: projectData.project_details  }
    }

    function setData(data) {
        setProject({ 
            ...data.project,
            site_manager: data.project.roles.site_manager,
            data_entry_operator: data.project.roles.data_entry_operator 
        })
        setReport({ ...data.report })
        
    }

    const { isLoading, error, data } = useQuery({
        queryKey: "report-page",
        queryFn: fetchAllData,
        onSuccess: setData
    })

    return (
        <>
            {
                isLoading ? "Loading" : (
                    <>
                        <div className="container">
                            <div className="blue-label">
                                Project Details
                            </div>
                            <div className="container-main-block">
                            {
                                project &&
                                <ProjectDetails project={project} />
                            }
                            </div>
                        </div>
                        { project && 
                            <>
                                <ReportDetails project={project} report={report} setReport={setReport} status={report.status} />
                                <Activities project={project} report={report} setReport={setReport} />
                                <Materials project={project} report={report} setReport={setReport} />
                                <Equipments project={project} report={report} setReport={setReport} />
                                <Labour report={report} setReport={setReport} />
                                <Visitors report={report} setReport={setReport} />
                            </>
                        }
                    </>
                )
            }
        </>
    )
}

export default function ReportPage() {
    const { user } = useAuthContext()
    const [report, setReport] = useState("")
    const [project, setProject] = useState("")

    function handleApprove(e) {
        const approve = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/reports/approve-report/${report._id}`, {
                "headers": {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-type': 'application/json'
                },
                "method": 'PATCH'
            })

            if (response.ok) {
                window.location.replace('/reports')
            }
        }

        approve()
    }

    function handleResubmit(e) {
        const arr = window.location.href.split('/')
        const report_id = arr[arr.length - 1]

        const reportDocument = {
            ...report
        }

        const resubmitReport = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/reports/resubmit/${report_id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({newReport: reportDocument})
            })

            if (response.ok) {
                window.location.replace('/reports')
            }
        }

        resubmitReport()
    }

    
    return (
        <QueryClientProvider client={queryClient}>
            <Navbar pageName="reports" />
            <main>
                <div className="page-route">/ Reports / View Report</div>
                <form>
                    <ReportPageComponent project={project} setProject={setProject} report={report} setReport={setReport} />
                    {
                        report && report.status != "approved" && user.position == "site_manager" ? (
                            <>
                                <h6 style={{"width": "100%", "margin": "0", "textAlign": "left"}}>* Clicking approve attaches your digital signature with this report.</h6>
                                <h6 style={{"width": "100%", "margin": "0", "color": "red", "textAlign": "left"}}>* Should you choose to make changes and resubmit this report, all other site managers will have to re-approve this report with your changes.</h6>
                            </>
                        ) : ""
                    }
                    
                    <div className="input-field-block" style={{"width": "100%", "margin": "20px auto"}}>
                        {report && report.status != "approved" && user.position == "site_manager" ? 
                            (
                            <>
                                <div className="small-button" style={{"lineHeight": "43px", "display": "inline-block", "margin": "0px 10px"}} onClick={handleApprove}>Approve</div>
                                <div className="small-button" style={{"background": "linear-gradient(88.94deg, #e81a1a 0.66%, #ff4949 99.1%)", "lineHeight": "43px", "display": "inline-block", "margin": "0px 10px"}} onClick={handleResubmit}>Resubmit</div>
                            </>
                            ) : ""
                        }
                    </div>
                </form>
            </main>
        </QueryClientProvider>
    )
}
