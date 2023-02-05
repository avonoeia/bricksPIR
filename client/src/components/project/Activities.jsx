import React, { useState } from "react"
import { useAuthContext } from "../../hooks/useAuthContext"

export default function Activities({ project, setProject }) {
    const { user } = useAuthContext()
    const [newActivity, setNewActivity] = useState({
        activity: "",
        unit: "",
        total_planned: "",
        total_achieved: 0,
        history: []
    })

    function handleAdd(e) {
        const arr = window.location.href.split('/')
        const project_id = arr[arr.length - 1]

        const add = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/projects/add-activity/${project_id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-type': 'application/json'
                },
                method: 'PATCH',
                body: JSON.stringify({newActivity})
            }) 
            
            if (response.ok) {
                setProject(data => ({
                    ...data,
                    activities: [...data.activities, newActivity]
                }))
                setNewActivity({
                    activity: "",
                    unit: "",
                    total_planned: "",
                    total_achieved: 0,
                    history: []
                })
            }
        }
        
        if (newActivity.activity && newActivity.unit && newActivity.total_planned) {
            add()
        }
    }
    
    return (
        <div className="container">
            <div className="blue-label">
                Activities
            </div>
            <div className="container-main-block">
                <table style={{"width": "60%"}}>
                    <thead>
                        <tr>
                            <th>Activity</th>
                            <th>Unit</th>
                            <th>Total Planned</th>
                            <th>Total Achieved</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            project.activities.length > 0 ? (
                                project.activities.map(activity => (
                                    <tr key={activity.activity}>
                                        <td>{activity.activity}</td>
                                        <td>{activity.unit}</td>
                                        <td>{activity.total_planned}</td>
                                        <td>{activity.total_achieved}</td>
                                    </tr>
                                ))
                            ) : <tr><td colSpan={"5"}>No activities added</td></tr>
                        }
                    </tbody>
                </table>

                {
                    user.position == "admin" && (
                        <>
                            <hr className="black-separator" />
                            
                            <div className="input-field-block" style={{"width": "30%"}}>
                                <label htmlFor="activity">Activity</label>
                                <input type="text" name="activity" value={newActivity.activity} 
                                    onChange={(event) => {
                                    setNewActivity((data) => ({
                                    ...data,
                                    [event.target.name]: event.target.value
                                    }))
                                    }} 
                                />
                            </div>

                            <div className="input-field-block" style={{"width": "10%"}}>
                                <label htmlFor="unit">Unit</label>
                                <input style={{"width": "80px"}} type="text" name="unit" value={newActivity.unit} 
                                    onChange={(event) => {
                                    setNewActivity((data) => ({
                                    ...data,
                                    [event.target.name]: event.target.value
                                    }))
                                }} 
                                />
                            </div>

                            <div className="input-field-block" style={{"width": "10%"}}>
                                <label htmlFor="unit">Total Planned</label>
                                <input style={{"width": "80px"}} type="number" name="total_planned" value={newActivity.total_planned} 
                                    onChange={(event) => {
                                    setNewActivity((data) => ({
                                    ...data,
                                    [event.target.name]: event.target.value
                                    }))
                                }} 
                                />
                            </div>

                            <div className="input-field-block" style={{"width": "10%"}}>
                                <div className="tiny-button" style={{"lineHeight": "30px", "textAlign": "center", "marginTop": "43px"}} onClick={handleAdd}>Add</div>
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    )
}