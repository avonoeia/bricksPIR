import React, { useState } from "react"

export default function GiveAccess({ user, users, setUsers }) {
    const [data, setData] = useState("");
    const [removalSelected, setRemovalSelected] = useState("");
    const [message, setMessage] = useState("")

    React.useEffect(() => {
        setData(users.access)
    }, [users])

    async function handleRemove(e) {
        e.preventDefault()

        if (removalSelected != "" && removalSelected != undefined) {
            let req_body = {
                user_id: users._id,
                project_id: removalSelected
            }

            await fetch(`${import.meta.env.VITE_API_URL || ""}/api/users/access-control/remove`, {
                method: "PATCH",
                headers: { 
                    Authorization: `Bearer ${user.token}`,
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
                    setRemovalSelected("")
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
                        Remove Access
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
                        value={removalSelected}
                        id="project-selection"
                        onChange={(e) => setRemovalSelected(e.target.value)}
                    >
                        <option value="">--- Select Project ---</option>
                        {
                            data && data.length > 0
                            ? data.map((data) => {
                            return (
                                <option key={data} value={data}>
                                    {data}
                                </option>
                                );
                            }) : <option disabled>No Projects.</option>
                        }
                    </select>
                </div>

                <div className="input-field-block" style={{ width: "100%" }}>
                    <button style={{padding: "5px 10px", cursor: "pointer"}} onClick={handleRemove}>Confirm</button>
                </div>

                {
                    message && <div>{message}</div>
                }
            </div>
        </>
    );
}