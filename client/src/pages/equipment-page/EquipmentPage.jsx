import React, { useState } from "react";

import { useAuthContext } from "../../hooks/useAuthContext";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Link } from "react-router-dom";

import Navbar from "../../components/navbar/Navbar";

const queryClient = new QueryClient();

function Transfer({ user, current_location, equipment }) {
    const [location, setLocation] = useState(current_location);
    const [projects, setProjects] = useState("");

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

    function setProjectData(data) {
        setProjects([
            ...data.projects_list,
            { project_name: "unassigned", _id: "undefined" },
        ]);
    }

    const { isLoading, error, data } = useQuery({
        queryKey: "transfer_location",
        queryFn: fetchProjectData,
        onSuccess: setProjectData,
    });

    function handleSubmit() {
        if (
            location.split(" ")[0] === equipment.current_location.project_name
        ) {
            return;
        }

        const equipmentDocument = {
            equipment_id: equipment._id,
            new_project_name: location.split(" ")[0],
            new_project_id: location.split(" ")[1],
        };

        const submitEquipment = async () => {
            const response = await fetch(
                `${
                    import.meta.env.VITE_API_URL || ""
                }/api/equipments/transfer-equipment/`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                    body: JSON.stringify(equipmentDocument),
                }
            );

            if (response.ok) {
                window.location.replace("/equipments");
            }

            return response.json();
        };

        submitEquipment();
    }

    return (
        <div className="input-fix-field-container" style={{ width: "50%" }}>
            <div className="text-field-block" style={{ width: "100%" }}>
                <div
                    className="text-label"
                    style={{
                        fontSize: "30px",
                        color: "rgb(103, 103, 240)",
                    }}
                >
                    Transfer to another Project
                </div>
            </div>
            <select
                className="input-field"
                value={location}
                onChange={(event) => {
                    setLocation(event.target.value);
                }}
                name="current_location"
                id="current_location"
            >
                {projects &&
                    projects.map((oneProject) => (
                        <option
                            key={oneProject._id}
                            value={`${oneProject.project_name} ${oneProject._id}`}
                        >
                            {oneProject.project_name} - {oneProject._id}
                        </option>
                    ))}
            </select>
            {location.split(" ")[0] !==
            equipment.current_location.project_name ? (
                <button
                    className="small-button"
                    style={{ marginTop: "30px", display: "block" }}
                    onClick={handleSubmit}
                >
                    Transfer
                </button>
            ) : (
                <>
                    <br />
                    <br />
                    <span className="text-label" style={{ fontSize: "12px" }}>
                        Choose a different project to transfer to.
                    </span>
                </>
            )}
        </div>
    );
}

function EquipmentContainer() {
    const { user } = useAuthContext();
    const [equipment, setEquipment] = useState("");

    const fetchEquipmentsData = async () => {
        const arr = window.location.href.split("/");
        const equipment_id = arr[arr.length - 1];

        const response = await fetch(
            `${
                import.meta.env.VITE_API_URL || ""
            }/api/equipments/details/${equipment_id}`,
            {
                headers: { Authorization: `Bearer ${user.token}` },
            }
        );
        return response.json();
    };

    function setData(data) {
        setEquipment(data.equipment_details);
    }

    const { isLoading, error, data } = useQuery({
        queryKey: "equipments",
        queryFn: fetchEquipmentsData,
        onSuccess: setData,
    });

    return (
        <>
            {isLoading ? (
                "Loading..."
            ) : (
                <>
                    {equipment && (
                        <>
                            <div className="container">
                                <div className="blue-label">Equipment</div>
                                <div
                                    className="container-main-block"
                                    style={{ width: "100%" }}
                                >
                                    <div className="text-field-block">
                                        <div className="text-label">ID</div>
                                        <div className="text-field">
                                            {equipment.id}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="container-main-block"
                                    style={{ width: "100%" }}
                                >
                                    <div className="text-field-block">
                                        <div className="text-label">
                                            Category
                                        </div>
                                        <div className="text-field">
                                            {equipment.category}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="container-main-block"
                                    style={{ width: "100%" }}
                                >
                                    <div className="text-field-block">
                                        <div className="text-label">Status</div>
                                        <div className="text-field">
                                            {equipment.status}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="container-main-block"
                                    style={{ width: "100%" }}
                                >
                                    <div
                                        className="text-field-block"
                                        style={{ width: "100%" }}
                                    >
                                        <div className="text-label">
                                            Current Location
                                        </div>
                                        <div className="text-field">
                                            <Link
                                                to={`/projects/${equipment.current_location.project_id}`}
                                            >
                                                {
                                                    equipment.current_location
                                                        .project_name
                                                }{" "}
                                            </Link>
                                            since{" "}
                                            {new Date(
                                                equipment.transferred_on.split(
                                                    "T"
                                                )[0]
                                            )
                                                .toString()
                                                .split(" ")
                                                .slice(0, 4)
                                                .map((data) => ` ${data}`)}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="container-main-block"
                                    style={{ width: "100%" }}
                                >
                                    <div
                                        className="text-field-block"
                                        style={{ width: "100%" }}
                                    >
                                        <div className="text-label">
                                            Transferred On:
                                        </div>
                                        <div className="text-field">
                                            {new Date(
                                                equipment.transferred_on.split(
                                                    "T"
                                                )[0]
                                            )
                                                .toString()
                                                .split(" ")
                                                .slice(0, 4)
                                                .map((data) => ` ${data}`)}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="container-main-block"
                                    style={{ width: "100%" }}
                                >
                                    <div
                                        className="text-field-block"
                                        style={{ width: "100%" }}
                                    >
                                        <div className="text-label">
                                            Location History
                                        </div>
                                        <div className="text-field">
                                            {equipment.history.length > 0
                                                ? equipment.history.map(
                                                      (item) => (
                                                          <React.Fragment
                                                              key={item}
                                                          >
                                                              Transferred from{" "}
                                                              {item.location} on{" "}
                                                              {new Date(
                                                                  equipment.transferred_on.split(
                                                                      "T"
                                                                  )[0]
                                                              )
                                                                  .toString()
                                                                  .split(" ")
                                                                  .slice(0, 4)
                                                                  .map(
                                                                      (data) =>
                                                                          ` ${data}`
                                                                  )}
                                                              <br />
                                                          </React.Fragment>
                                                      )
                                                  )
                                                : "No history found."}
                                        </div>
                                    </div>
                                </div>

                                <hr className="black-separator" />

                                <Transfer
                                    user={user}
                                    current_location={`${equipment.current_location.project_name} ${equipment.current_location.project_id}`}
                                    equipment={equipment}
                                />
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    );
}

export default function EquipmnetPage() {
    const { user } = useAuthContext();

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Navbar pageName="equipments" />
                <main>
                    <div className="page-route">
                        / Equipments{" "}
                        {user.position == "admin" ? (
                            <Link to="/equipments/new-equipment">
                                <button
                                    style={{ marginLeft: "1rem" }}
                                    className="small-button"
                                >
                                    New
                                </button>
                            </Link>
                        ) : (
                            ""
                        )}
                    </div>
                    <EquipmentContainer />
                </main>
            </QueryClientProvider>
        </>
    );
}
