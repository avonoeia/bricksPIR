import React, { useState, useEffect } from "react"
import { useAuthContext } from "./../../hooks/useAuthContext"
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Link } from "react-router-dom"

import Navbar from "./../../components/navbar/Navbar"

const queryClient = new QueryClient()

function PendingReportsContainer() {
    const { user } = useAuthContext()
    const [reports, setReports] = useState("")

    const fetchReportsData = async () => {
        const response = await fetch('/api/reports/', {
            headers: {'Authorization': `Bearer ${user.token}`},
        })
        return response.json()
    }

    function setData(data) {
        setReports([...data.reports_list.filter(report => report.status == "pending approval")])
    }

    const { isLoading, error, data } = useQuery({
        queryKey: "reports",
        queryFn: fetchReportsData,
        onSuccess: setData
    })

    return (
        <div className="container">
            <div className="blue-label">
                Pending Reports
            </div>
            <div className="container-main-block">
                {   
                    reports && reports.length > 0 ? (
                    reports.map((report, index) => (
                        <div key={report._id} className="general-card">
                            <div className="blue-label-box">
                                <span>{index+1}</span> 
                            </div>
                            <div className="general-card-main-block">
                                <p style={{"margin": "0px 0px 5px 0px"}}><strong>Name of work:</strong> {report.project_name}</p>
                                <p style={{"margin": "0px 0px 5px 0px"}}><strong>Project ID:</strong> {report.project_id}</p>
                                <p style={{"margin": "0px 0px 5px 0px"}}><strong>Duration:</strong> {report.duration[0]} to {report.duration[1]}</p>
                                <p style={{"margin": "0px 0px 5px 0px"}}><strong>Created by:</strong> {report.created[0]} on {report.created[1].split("T")[0]} </p>
                            </div>
                            <div className="general-card-button-container">
                                <Link to={`/reports/${report._id}`}>
                                    <button className="small-button">
                                        View Details
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )) ) : <div style={{"textAlign": "center", "width": "100%"}}>Pending queue is empty</div>
                }
            </div>
        </div>
    )
}

function PreviousReportsContainer() {
    const { user } = useAuthContext()
    const [reports, setReports] = useState("")

    const fetchReportsData = async () => {
        const response = await fetch('/api/reports/', {
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-type': 'application/json'
            },
        })
        return response.json()
    }

    function setData(data) {
        setReports([...data.reports_list.filter(report => report.status != "pending approval")])
    }

    const { isLoading, error, data } = useQuery({
        queryKey: "reports",
        queryFn: fetchReportsData,
        onSuccess: setData
    })
    
    return (
        <div className="container">
            <div className="blue-label">
                Previous Reports
            </div>
            <div className="container-main-block">
                {   
                    reports && reports.length > 0 ? (
                    reports.map((report, index) => (
                        <div key={report._id} className="general-card">
                            <div className="blue-label-box">
                                <span>{index+1}</span> 
                            </div>
                            <div className="general-card-main-block">
                            <p style={{"margin": "0px 0px 5px 0px"}}><strong>Name of work:</strong> {report.project_name}</p>
                                <p style={{"margin": "0px 0px 5px 0px"}}><strong>Report ID:</strong> {report._id}</p>
                                <p style={{"margin": "0px 0px 5px 0px"}}><strong>Duration:</strong> {report.duration[0]} to {report.duration[1]}</p>
                                <p style={{"margin": "0px 0px 5px 0px"}}><strong>Created by:</strong> {report.created[0]} on {report.created[1].split("T")[0]} <strong>Submitted:</strong> {report.updatedAt.split("T")[0]} </p>
                            </div>
                            <div className="general-card-button-container">
                                <Link to={`/reports/approved/${report._id}`}>
                                    <button className="small-button">
                                        View Details
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )) ) : "No previously submitted reports"
                }
            </div>
        </div>
    )
}

export default function Reports() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Navbar pageName="reports" />
                <main>
                    <div className="page-route">/ Reports <Link to="/reports/new-report"><button style={{"marginLeft": "1rem"}} className="small-button">New Report</button></Link> </div>
                    <PendingReportsContainer />
                    <PreviousReportsContainer />
                </main>
            </QueryClientProvider>
        </>
    )
}