import React, { useState } from "react"
import { useAuthContext } from "../../hooks/useAuthContext"
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

const queryClient = new QueryClient()

import Navbar from "../../components/navbar/Navbar"
import ProjectDetails from "../../components/report/ProjectDetails"
import Activities from "../../components/project/Activities"
import Materials from "../../components/project/Materials"
import Equipments from "../../components/project/Equipments"
import Labour from "../../components/project/Labour"

function ProjectPageComponent() {
    const { user } = useAuthContext()
    const [project, setProject] = useState("")

    const fetchData = async () => {
        const arr = window.location.href.split('/')
        const project_id = arr[arr.length - 1]

        const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/projects/details/${project_id}`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        return response.json()
    }
    
    const setData = (data) => {
        setProject({ 
            ...data.project_details, 
            project_manager: data.project_details.roles.project_manager,
            site_manager: data.project_details.roles.site_manager, 
            data_entry_operator: data.project_details.roles.data_entry_operator 
        })
    }

    const { isLoading, error, data } = useQuery({
        queryKey: "project-page",
        queryFn: fetchData,
        onSuccess: setData
    })

    return (
        <>
            {
                isLoading ? "Loading" : (project ? (
                    <>
                        <div className="container">
                            <div className="blue-label">
                                Project Details
                            </div>
                            <div className="container-main-block">
                                { project && <ProjectDetails project={project} />}
                            </div>
                        </div>

                        <div className="container">
                            <div className="blue-label">
                                Project Staff
                            </div>
                            <div className="container-main-block">
                            <div className="text-field-block" style={{"width": "40%"}}>
                                <div className="text-label">Project Manager</div>
                                    <div className="text-field">
                                        {
                                            project.project_manager.map(user => user)
                                        }
                                    </div>
                                </div>

                                <div className="text-field-block" style={{"width": "40%"}}>
                                    <div className="text-label">Site Manager</div>
                                    <div className="text-field">
                                        {
                                            project.site_manager.map(user => user)
                                        }
                                    </div>
                                </div>

                                <div className="text-field-block" style={{"width": "40%"}}>
                                    <div className="text-label">Data Entry Operator</div>
                                    <div className="text-field">
                                        {
                                            project.data_entry_operator.map(user => user)
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Activities project={project} setProject={setProject} />
                        <Materials project={project} setProject={setProject} />
                        <Equipments project={project} setProject={setProject} />
                        <Labour project={project} setProject={setProject} />
                    </>
                ) : "" )
            }
        </>
    )
}


export default function ProjectPage() {

    return (
        <QueryClientProvider client={queryClient}>
            <Navbar pageName="projects" />
            <main>
                <div className="page-route">/ Projects / View Project</div>
                <ProjectPageComponent />
            </main>
        </QueryClientProvider>
    )
}