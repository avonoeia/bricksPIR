import React, { useState, useEffect } from "react"

import { useAuthContext } from "../../../hooks/useAuthContext"
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Link } from "react-router-dom"

import Navbar from "../../../components/navbar/Navbar"

const queryClient = new QueryClient()

function ProjectsContainer() {
    const { user } = useAuthContext()
    const [projects, setProjects] = useState("")

    const fetchProjectsData = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/projects/get-limited-projects-data`, {
            headers: {'Authorization': `Bearer ${user.token}`},
        })
        return response.json()
    }

    function setData(data) {
        setProjects([...data.projects_list])
    }

    const { isLoading, error, data } = useQuery({
        queryKey: "projects",
        queryFn: fetchProjectsData,
        onSuccess: setData
    })

    return (
        <div className="container">
            <div className="blue-label">
                Projects
            </div>
            <div className="container-main-block">
                {   
                    projects &&
                    projects.map((project, index) => (
                        <div key={project._id} className="general-card">
                            <div className="blue-label-box">
                                {index+1}
                            </div>
                            <div className="general-card-main-block">
                                <p style={{"margin": "0px 0px 5px 0px"}}><strong>Name of work:</strong> {project.project_name}</p>
                                <p style={{"margin": "0px 0px 5px 0px"}}><strong>Project ID:</strong> {project._id}</p>
                                <p style={{"margin": "0px 0px 5px 0px"}}><strong>Contractor:</strong> {project.contractor}   <strong style={{"marginLeft": "20px"}}>Employer:</strong> {project.employer}</p>
                                <p style={{"margin": "0px 0px 5px 0px"}}><strong>Contract Start Date:</strong> {project.contract_start_date.split("T")[0]}    <strong style={{"marginLeft": "20px"}}>Contract End Date:</strong> {project.contract_completion_date.split("T")[0]}</p>
                            </div>
                            <div className="general-card-button-container">
                                <Link to={`/projects/${project._id}`}>
                                    <button className="small-button">
                                        View Details
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default function Projects() {
    const { user } = useAuthContext()

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Navbar pageName="projects" />
                <main>
                    <div className="page-route">/ Projects { user.position == "admin" ? <Link to="/projects/new-project"><button style={{"marginLeft": "1rem"}} className="small-button">New Project</button></Link> : "" }</div>
                    <ProjectsContainer />
                </main>
            </QueryClientProvider>
        </>
    )
}