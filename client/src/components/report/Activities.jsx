import React from "react"

export default function Activities({ project, report, setReport}) {
    const [selectedActivity, setSelectedActivity] = React.useState({
        no: "",
        activity: "",
        unit: "",
        planned: "",
        achieved: "",
        level: "",
        grid_line: ""
    })

    return (
        <div className="container">
            <div className="blue-label">
                Activities
            </div>
            <div className="container-main-block">
                <div className="text-field-block" style={{"width": "100%"}}>
                    <label htmlFor="select-project">Select Activity</label>
                    <select 
                        className="input-field" value={selectedActivity.activity} 
                        style={{"width": "25%"}}
                        disabled={report.status === "approved"}
                        onChange={(event) => setSelectedActivity(data => ({
                            ...data, 
                            activity: event.target.value, 
                            unit: project.activities.find(i => i.activity == event.target.value).unit,
                        }))} 
                        name="activity-selection" id="activity-selection"
                    >
                        <option value="" disabled>Select Activity</option>
                        { project.activities.length > 0 && (
                            project.activities.map(activity => (
                                <option key={activity.activity} value={activity.activity}>{activity.activity}</option>)
                            )
                        )}
                    </select>
                </div>

                {
                    selectedActivity.activity ? (
                    <>
                        <div className="input-fix-field-container">
                            <div className="text-field-block" style={{"width": "100%"}}>
                                <div className="text-label" style={{"fontSize": "30px", "color": "rgb(103, 103, 240)"}}>Activity Description</div>
                            </div>
                            <div className="text-field-block" style={{"width": "15%"}}>
                                <div className="text-label">Unit</div>
                                <div className="text-field">{selectedActivity.unit}</div>
                            </div>

                            <div className="input-field-block" style={{"width": "10%"}}>
                                <div className="text-label">Level</div>
                                <input 
                                    type="number" 
                                    className="input-field" 
                                    style={{"width": "100px"}}
                                    value={selectedActivity.level}
                                    onChange={(e) => setSelectedActivity(data => ({
                                        ...data,
                                        level: e.target.value
                                    }))} 
                                />
                            </div>
                            {/* Break up grid description in x and y direction fields */}
                            <div className="input-field-block" style={{"width": "10%"}}>
                                <div className="text-label">Gridline</div>
                                <input 
                                    type="text" 
                                    className="input-field" 
                                    style={{"width": "100px"}}
                                    value={selectedActivity.grid_line}
                                    onChange={(e) => setSelectedActivity(data => ({
                                        ...data,
                                        grid_line: e.target.value
                                    }))} 
                                />
                            </div>
                            <div className="input-field-block" style={{"width": "10%"}}>
                                <div className="text-label">Planned</div>
                                <input type="number" 
                                    className="input-field" 
                                    style={{"width": "100px"}} 
                                    name="planned" 
                                    value={selectedActivity.planned} 
                                    onChange={(e) => setSelectedActivity(data => ({
                                        ...data,
                                        planned: e.target.value
                                    }))} 
                                />
                            </div>
                            <div className="input-field-block" style={{"width": "10%"}}>
                                <div className="text-label">Achieved</div>
                                <input 
                                    type="number" 
                                    className="input-field" 
                                    style={{"width": "100px"}}
                                    value={selectedActivity.achieved}
                                    onChange={(e) => setSelectedActivity(data => ({
                                        ...data,
                                        achieved: e.target.value
                                    }))} 
                                />
                            </div>
                            
                            <div className="tiny-button input-fix-form-submit" 
                                style={{
                                    "marginLeft": "20px",
                                    "marginTop": "42px"
                                }}
                                onClick={() => {
                                    if (
                                        selectedActivity.activity && selectedActivity.planned && selectedActivity.achieved
                                    ) {
                                        setReport(data => ({
                                            ...data,
                                            activities: [
                                                ...data.activities,
                                                { ...selectedActivity, "no": data.activities.length+1 }
                                            ]
                                        }))
                                        setSelectedActivity({
                                            activity: "",
                                            unit: "",
                                            planned: "",
                                            achieved: "",
                                            level: "",
                                            grid_line: ""
                                        })
                                    }
                            }}>Add</div>
                        </div>
                    </>
                ) : ""}

                <hr className="black-separator" />

                <table style={{"width": "60%"}}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Activity</th>
                            <th>Unit</th>
                            <th>Level</th>
                            <th>Grid Line</th>
                            <th>Planned</th>
                            <th>Achieved</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            report.activities.length > 0 ? (
                                report.activities.map(activity => (
                                    <tr key={activity.no}>
                                        <td>{activity.no}</td>
                                        <td>{activity.activity}</td>
                                        <td>{activity.unit}</td>
                                        <td>{activity.level}</td>
                                        <td>{activity.grid_line}</td>
                                        <td>{activity.planned}</td>
                                        <td>{activity.achieved}</td>
                                        {report.status != "approved" ? (
                                            <td style={{"width": "15px"}}>
                                            <div className="tiny-button" style={{"margin": 0, "background": "linear-gradient(88.94deg, #E81A37 0.66%, #FF495A 99.1%)", "borderRadius": "50%", "width": "15px", "height": "15px", "fontSize": "10px", "lineHeight": "15px"}} onClick={(event) => {
                                            const newActivities = report.activities.filter(item => item.no != activity.no)
                                            setReport(data => ({...data, activities: newActivities}))
                                            }}>X</div></td>) 
                                            : 
                                            ""
                                        }
                                    </tr>
                                ))
                            ) : <tr><td colSpan={"7"}>No activities added</td></tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}