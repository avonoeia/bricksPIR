import React, { useState, useEffect } from "react";
import { useAuthContext } from "./../../hooks/useAuthContext";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

import Navbar from "../../components/navbar/Navbar";

const queryClient = new QueryClient();

function NewEquipmentContainer() {
    const { user } = useAuthContext();
    const [projects, setProjects] = useState("");
    const [location, setLocation] = useState("unassigned undefined");
    const [newEquipment, setNewEquipment] = useState({
        id: "",
        category: "",
        description: "",
        status: "working",
        history: [],
        current_location: "",
        transferred_on: "",
    });

    const fetchProjectData = async () => {
        const response = await fetch(
            `${
                import.meta.env.VITE_API_URL || ""
            }/api/projects/get-projects-name-and-id`,
            {
                headers: { Authorization: `Bearer ${user.token}` },
            }
        );
        return response.json();
    };

    function setData(data) {
        setProjects([...data.projects_list]);
    }

    const { isLoading, error, data } = useQuery({
        queryKey: "current_location",
        queryFn: fetchProjectData,
        onSuccess: setData,
    });

    function handleSubmit(e) {
        e.preventDefault();

        const equipmentDocument = {
            ...newEquipment,
            current_location: {
                project_name: location.split(" ")[0],
                project_id: location.split(" ")[1],
            }
        };

        const submitEquipment = async () => {
            const response = await fetch(
                `${
                    import.meta.env.VITE_API_URL || ""
                }/api/equipments/create-equipment`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify(equipmentDocument),
                }
            );

            if (response.ok) {
                window.location.replace("/equipments");
            }
        };

        submitEquipment();
    }

    return (
        <div className="container">
            <div className="blue-label">New Equipment</div>
            <div className="container-main-block">
                <form onSubmit={handleSubmit}>
                    <div
                        className="input-field-block"
                        style={{ width: "100%" }}
                    >
                        <label htmlFor="unit">Equipment ID:</label>
                        <input
                            type="text"
                            name="id"
                            value={newEquipment.id}
                            onChange={(event) => {
                                setNewEquipment((data) => ({
                                    ...data,
                                    [event.target.name]: event.target.value,
                                }));
                            }}
                            required={true}
                        />
                    </div>

                    <div
                        className="input-field-block"
                        style={{ width: "100%" }}
                    >
                        <label htmlFor="category">Category:</label>
                        <input
                            type="text"
                            name="category"
                            value={newEquipment.category}
                            onChange={(event) => {
                                setNewEquipment((data) => ({
                                    ...data,
                                    [event.target.name]: event.target.value,
                                }));
                            }}
                            required={true}
                        />
                    </div>

                    <div
                        className="input-field-block"
                        style={{ width: "100%" }}
                    >
                        <label htmlFor="description">Description:</label>
                        <textarea
                            style={{ height: "100px" }}
                            name="description"
                            value={newEquipment.description}
                            onChange={(event) => {
                                setNewEquipment((data) => ({
                                    ...data,
                                    [event.target.name]: event.target.value,
                                }));
                            }}
                            
                        />
                    </div>

                    <div
                        className="input-field-block"
                        style={{ width: "100%" }}
                    >
                        <label htmlFor="status">Status:</label>
                        <select
                            className="input-field"
                            value={newEquipment.status}
                            onChange={(event) => {
                                setNewEquipment((data) => ({
                                    ...data,
                                    status: event.target.value,
                                }));
                            }}
                            name="status"
                            id="project-selection"
                        >
                            <option value="working">Working Condition</option>
                            <option value="non-working">
                                Non-working Condition
                            </option>
                        </select>
                    </div>

                    <hr />

                    <div
                        className="input-field-block"
                        style={{ width: "100%" }}
                    >
                        <label htmlFor="current_location">
                            Assign to project:
                        </label>
                        <select
                            className="input-field"
                            value={location}
                            onChange={(event) => {
                                setLocation(event.target.value);
                            }}
                            name="current_location"
                            id="current_location"
                        >
                            <option
                                value="unassigned undefined"
                            >
                                Assign later
                            </option>
                            {projects &&
                                projects.map((oneProject) => (
                                    <option
                                        key={oneProject._id}
                                        value={`${oneProject.project_name} ${oneProject._id}`}
                                    >
                                        {oneProject.project_name} -{" "}
                                        {oneProject._id}
                                    </option>
                                ))}
                        </select>
                        <button
                            className="small-button"
                            style={{ marginTop: "30px", display: "block" }}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function NewEquipment() {
    const { user } = useAuthContext();

    return (
        <QueryClientProvider client={queryClient}>
            <Navbar pageName="equipments" />
            <main>
                <div className="page-route">/ Equipments / New </div>
                <NewEquipmentContainer />
            </main>
        </QueryClientProvider>
    );
}
