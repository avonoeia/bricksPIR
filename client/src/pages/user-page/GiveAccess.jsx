import React, { useState } from "react"

export default function GiveAccess({ user, users, setUsers }) {
    const [data, setData] = useState("");
    const [selected, setSelected] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("")

    async function fetchProjects() {
        if (data === "") {
            setIsLoading(true);
            await fetch(`${import.meta.env.VITE_API_URL || ""}/api/projects/`, {
                headers: { Authorization: `Bearer ${user.token}` },
            })
                .then((response) => response.json())
                .then((data) =>
                    setData(
                        data.projects_list.filter(
                            (project) => !users.access.includes(project._id)
                        )
                    )
                );
            setIsLoading(false);
        }
    }

    async function handleAdd(e) {
        e.preventDefault()

        if (selected !== "" && selected !== undefined) {
            let req_body = {
                user_id: users._id,
                project_id: selected
            }
            
            fetch(`${import.meta.env.VITE_API_URL || ""}/api/users/access-control/add`, {
                method: "PATCH",
                headers: { 
                    "Authorization": `Bearer ${user.token}`,
                    "Content-Type": "application/json"
                },
                cache: "no-cache",
                body: JSON.stringify(req_body)
            })
                .then(response => response.json())
                .then(data => {
                    setUsers(prevUser => { 
                        return {
                            ...prevUser,
                            access: data.newAccess
                        }
                    })
                    setMessage(data.message)
                    setSelected("")
                })
        }
    }

    return (
        <>
            <hr className="black-separator" />

            <div className="input-fix-field-container">
                <div className="text-field-block" style={{ width: "100%" }}>
                    <div
                        className="text-label"
                        style={{
                            fontSize: "30px",
                            color: "rgb(103, 103, 240)",
                        }}
                    >
                        Grant Access
                    </div>
                </div>
                <div
                    className="input-field-block"
                    style={{ width: "100%", marginBottom: "10px" }}
                >
                    <select
                        name="access"
                        className="input-field"
                        style={{ cursor: "pointer", margin: "10px" }}
                        value={selected}
                        id="project-selection"
                        onChange={(e) => setSelected(e.target.value)}
                        onClick={fetchProjects}
                    >
                        <option value="">--- Select Project ---</option>
                        {
                        
                            isLoading ? <option disabled>"Loading..."</option> : (
                                data && data.length > 0
                                    ? data.map((data) => {
                                  return (
                                      <option key={data._id} value={data._id}>
                                          {data.project_name}
                                      </option>
                                  );
                              })
                            : "This user cannot be added to any more projects."
                            )
                        }
                    </select>
                </div>

                <div className="input-field-block" style={{ width: "100%" }}>
                    <button style={{padding: "5px 10px", cursor: "pointer"}} onClick={handleAdd}>Confirm</button>
                </div>

                {
                    message && <div>{message}</div>
                }
            </div>
        </>
    );
}