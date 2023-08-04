import React, { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Link } from "react-router-dom";

export default function Activities({ project, setProject }) {
    const { user } = useAuthContext();
    const [newActivity, setNewActivity] = useState({
        activity: "",
        unit: "",
        total_planned: "",
        total_achieved: 0,
        history: [],
    });

    const [selectedActivity, setSelectedActivity] = useState({
        activity: "",
        unit: "",
        total_achieved: "",
        total_planned: "",
        history: [],
    });

    console.log(selectedActivity)

    function handleAdd(e) {
        const arr = window.location.href.split("/");
        const project_id = arr[arr.length - 1];

        const add = async () => {
            const response = await fetch(
                `${
                    import.meta.env.VITE_API_URL || ""
                }/api/projects/add-activity/${project_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-type": "application/json",
                    },
                    method: "PATCH",
                    body: JSON.stringify({ newActivity }),
                }
            );

            if (response.ok) {
                setProject((data) => ({
                    ...data,
                    activities: [...data.activities, newActivity],
                }));
                setNewActivity({
                    activity: "",
                    unit: "",
                    total_planned: "",
                    total_achieved: 0,
                    history: [],
                });
            }
        };

        if (
            newActivity.activity &&
            newActivity.unit &&
            newActivity.total_planned
        ) {
            add();
        }
    }

    return (
        <div className="container">
            <div className="blue-label">Activities</div>
            <div className="container-main-block">
                <table style={{ width: "60%" }}>
                    <thead>
                        <tr>
                            <th>Activity</th>
                            <th>Unit</th>
                            <th>Total Planned</th>
                            <th>Total Achieved</th>
                        </tr>
                    </thead>
                    <tbody>
                        {project.activities.length > 0 ? (
                            project.activities.map((activity) => (
                                <tr key={activity.activity}>
                                    <td>{activity.activity}</td>
                                    <td>{activity.unit}</td>
                                    <td>{activity.total_planned}</td>
                                    <td>{activity.total_achieved}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={"5"}>No activities added</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <hr
                    className="black-separator"
                    style={{ margin: "40px 0px" }}
                />

                <div className="text-field-block" style={{ width: "100%" }}>
                    <label htmlFor="select-material">Activity Logs</label>
                    <select
                        className="input-field"
                        value={selectedActivity.activity}
                        style={{ width: "25%" }}
                        onChange={(event) =>
                            setSelectedActivity((data) => ({
                                activity: event.target.value,
                                unit: project.activities.find(
                                    (i) => i.activity == event.target.value
                                ).unit,
                                history: project.activities
                                    .find(
                                        (i) => i.activity == event.target.value
                                    )
                                    .history.reverse(),
                                total_planned: project.activities.find(
                                    (i) => i.activity == event.target.value
                                ).total_planned,
                                total_achieved: project.activities.find(
                                    (i) => i.activity == event.target.value
                                ).total_achieved,
                            }))
                        }
                        name="material-selection"
                        id="material-selection"
                    >
                        <option value="" disabled>
                            Select Activity
                        </option>
                        {project.activities.length > 0 &&
                            project.activities.map((activity) => (
                                <option
                                    key={activity.activity}
                                    value={activity.activity}
                                >
                                    {activity.activity}
                                </option>
                            ))}
                    </select>
                </div>

                {selectedActivity.activity && (
                    <>
                        <div
                            className="text-field-block"
                            style={{ width: "100%" }}
                        >
                            <div className="text-label">Unit</div>
                            <div className="text-field">
                                {selectedActivity.unit}
                            </div>
                            <div className="text-label">Total Planned</div>
                            <div className="text-field">
                                {selectedActivity.total_planned}
                            </div>
                            <div className="text-label">
                                Cumulative Achieved
                            </div>
                            <div className="text-field">
                                {selectedActivity.total_achieved}
                            </div>
                        </div>

                        <div
                            className="text-field-block"
                            style={{ width: "100%", marginRight: "15px" }}
                        >
                            <div className="text-label">Progress breakdown</div>
                            <table style={{ width: "100%" }}>
                                <thead>
                                    <tr>
                                        <th>Report ID</th>
                                        <th>Date</th>
                                        <th>Total Achieved</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedActivity.history.length > 0 ? (
                                        selectedActivity.history.map((data) => (
                                            <tr key={`${data[0]}`}>
                                                <td>
                                                    <Link
                                                        to={`/reports/approved/${data[0]}`}
                                                    >
                                                        {data[0]}
                                                    </Link>
                                                </td>
                                                <td>
                                                    {new Date(data[1])
                                                        .toString()
                                                        .split(" ")
                                                        .slice(1, 4)
                                                        .map(
                                                            (data) => ` ${data}`
                                                        )}
                                                </td>
                                                <td>{data[2]}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={"3"}>
                                                No progress history data
                                                available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {user.position == "admin" && (
                    <>
                        <hr className="black-separator" />

                        <div className="input-fix-field-container">
                            <div
                                className="text-field-block"
                                style={{ width: "100%" }}
                            >
                                <div
                                    className="text-label"
                                    style={{
                                        fontSize: "30px",
                                        color: "rgb(103, 103, 240)",
                                    }}
                                >
                                    New Activity
                                </div>
                            </div>
                            <div
                                className="input-field-block"
                                style={{ width: "30%" }}
                            >
                                <label htmlFor="activity">Activity</label>
                                <input
                                    type="text"
                                    name="activity"
                                    value={newActivity.activity}
                                    onChange={(event) => {
                                        setNewActivity((data) => ({
                                            ...data,
                                            [event.target.name]:
                                                event.target.value,
                                        }));
                                    }}
                                />
                            </div>

                            <div
                                className="input-field-block"
                                style={{ width: "10%" }}
                            >
                                <label htmlFor="unit">Unit</label>
                                <input
                                    style={{ width: "80px" }}
                                    type="text"
                                    name="unit"
                                    value={newActivity.unit}
                                    onChange={(event) => {
                                        setNewActivity((data) => ({
                                            ...data,
                                            [event.target.name]:
                                                event.target.value,
                                        }));
                                    }}
                                />
                            </div>

                            <div
                                className="input-field-block"
                                style={{ width: "40%" }}
                            >
                                <label htmlFor="unit">Total Planned</label>
                                <input
                                    style={{ width: "80px" }}
                                    type="number"
                                    name="total_planned"
                                    value={newActivity.total_planned}
                                    onChange={(event) => {
                                        setNewActivity((data) => ({
                                            ...data,
                                            [event.target.name]:
                                                event.target.value,
                                        }));
                                    }}
                                />
                            </div>

                            <div
                                className="input-field-block"
                                style={{ width: "10%" }}
                            >
                                <div
                                    className="tiny-button input-fix-field-submit"
                                    style={{
                                        lineHeight: "30px",
                                        textAlign: "center",
                                        marginTop: "43px",
                                    }}
                                    onClick={handleAdd}
                                >
                                    Add
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
