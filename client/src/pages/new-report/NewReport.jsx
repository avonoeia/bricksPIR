import React, { useState, useEffect } from "react";
import { useAuthContext } from "./../../hooks/useAuthContext";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

import Navbar from "../../components/navbar/Navbar";
import ProjectDetails from "../../components/report/ProjectDetails";
import ReportDetails from "../../components/report/ReportDetails";
import Activities from "../../components/report/Activities";
import Materials from "../../components/report/Materials";
import Equipments from "../../components/report/Equipments";
import Labour from "../../components/report/Labour";
import Visitors from "../../components/report/Visitors";
import "./NewReport.css";

const queryClient = new QueryClient();

function Project({ project, setProject, setReport }) {
    const { user } = useAuthContext();
    const [projectData, setProjectData] = useState("");
    const [selected, setSelected] = useState("");

    const fetchProjectData = async () => {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL || ""}/api/projects/get-limited-projects-data`,
            {
                headers: { Authorization: `Bearer ${user.token}` },
            }
        );
        return response.json();
    };

    function setData(data) {
        setProjectData([...data.projects_list]);
    }

    const { isLoading, error, data } = useQuery({
        queryKey: "project-selection",
        queryFn: fetchProjectData,
        onSuccess: setData,
    });

    async function handleConfirm(event) {
        event.preventDefault();
        await fetch(`${import.meta.env.VITE_API_URL || ""}/api/projects/details/${selected.trim()}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
            .then(response => response.json())
            .then(data => {
                data = data.project_details
                setProject({
                    ...data,
                    site_manager: [...data.roles.site_manager],
                    data_entry_operator: [...data.roles.data_entry_operator],
                    project_manager: [...data.roles.project_manager]
                })
                setReport(prevReport => ({
                    ...prevReport,
                    project_name: data.project_name,
                    project_id: data._id,
                    required_approvals: [...data.roles.project_manager]
                }))
            })
    }

    return (
        <div className="container">
            <div className="blue-label">
                {project ? "Project Details" : "Select Project"}
            </div>
            <div className="container-main-block">
                {project ? (
                    <ProjectDetails project={project} />
                ) : (
                    <div
                        className="input-field-block"
                        style={{ margin: "10px auto", width: "50%" }}
                    >
                        <label htmlFor="select-project">Select Project</label>
                        <select
                            className="input-field"
                            value={selected}
                            style={{ width: "95%" }}
                            onChange={(event) =>
                                setSelected(event.target.value)
                            }
                            name="project-selection"
                            id="project-selection"
                        >
                            <option value="" disabled>
                                Select Project
                            </option>
                            {projectData &&
                                projectData.map((oneProject) => (
                                    <option
                                        key={oneProject._id}
                                        value={oneProject._id}
                                    >
                                        {oneProject.project_name} -{" "}
                                        {oneProject._id}
                                    </option>
                                ))}
                        </select>

                        <div
                            className="tiny-button"
                            style={{ width: "140px" }}
                            onClick={handleConfirm}
                        >
                            Confirm
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function NewReport() {
    const { user } = useAuthContext();
    const [project, setProject] = useState("");
    const [report, setReport] = useState({
        project_name: "",
        project_id: "",
        weather: "",
        site_conditions: "",
        required_approvals: [],
        approved_by: [],
        duration: ["", ""],
        activities: [],
        visitors: [],
        materials: [],
        equipments: [],
        labour: [],
        contraints: "",
        status: "",
        created: "",
    });

    useEffect(() => {
        if (project) {
            const equipmentsArr = project.equipments.map((eqp) => ({
                ...eqp,
                hours: 0,
                status: "working",
            }));
            setReport((data) => ({ ...data, equipments: [...equipmentsArr] }));
        }
    }, [project]);

    function handleSubmit(e) {
        e.preventDefault();

        const reportDocument = {
            ...report,
            required_approvals: [...project.roles.project_manager]
        };

        const submitReport = async () => {
            const response = await fetch(
                `${
                    import.meta.env.VITE_API_URL || ""
                }/api/reports/start-new-report`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify(reportDocument),
                }
            );

            if (response.ok) {
                window.location.replace("/reports");
            }
        };

        submitReport();
    }

    return (
        <QueryClientProvider client={queryClient}>
            <Navbar pageName="reports" />
            <main>
                <div className="page-route">/ Reports / New Report </div>
                <Project
                    project={project}
                    setReport={setReport}
                    setProject={setProject}
                />
                <form onSubmit={handleSubmit}>
                    {project ? (
                        <>
                            <ReportDetails
                                project={project}
                                report={report}
                                setReport={setReport}
                                status={report.status}
                            />
                            <Activities
                                project={project}
                                report={report}
                                setReport={setReport}
                            />
                            <Materials
                                project={project}
                                report={report}
                                setReport={setReport}
                            />
                            <Equipments
                                project={project}
                                report={report}
                                setReport={setReport}
                            />
                            <Labour report={report} setReport={setReport} />
                            <Visitors report={report} setReport={setReport} />
                            <button className="small-button">Submit</button>
                        </>
                    ) : (
                        ""
                    )}
                </form>
            </main>
        </QueryClientProvider>
    );
}
