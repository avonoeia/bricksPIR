import React, { useState } from "react"
import { useAuthContext } from "../../hooks/useAuthContext"
import { Link } from "react-router-dom"


export default function Equipments({ project, setProject }) {
    const { user } = useAuthContext()
    const [selectedEquipment, setSelectedEquipment] = useState({
        id: "",
        category: "",
        history: []
    })
    const [newEquipment, setNewEquipment] = useState({
        id: "",
        category: "",
        history: []
    })

    function handleAdd(e) {
        const arr = window.location.href.split('/')
        const project_id = arr[arr.length - 1]

        const add = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/projects/add-equipment/${project_id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-type': 'application/json'
                },
                method: 'PATCH',
                body: JSON.stringify({newEquipment: newEquipment})
            }) 
            
            if (response.ok) {
                const { updatedEquipments } = await response.json()
                setNewEquipment({
                    id: "",
                    category: "",
                    history: [],
                })
                setProject(data => ({
                    ...data,
                    equipments: [...updatedEquipments]
                }))
            }
        }
        
        if (newEquipment.category && newEquipment.id) {
            add()
        }
    }


    return (
        <div className="container">
            <div className="blue-label">
                Equipments
            </div>
            <div className="container-main-block">
                <table style={{"width": "60%"}}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            project.equipments.length > 0 ? (
                                project.equipments.map(equipment => (
                                    <tr key={equipment.id}>
                                            <td>{equipment.id}</td>
                                            <td>{equipment.category}</td>
                                    </tr>
                                ))
                            ) : <tr><td colSpan={"5"}>No equipment associated with this project.</td></tr>
                        }
                    </tbody>
                </table>

                <hr className="black-separator" style={{"margin": "40px 0px"}} />

                <div className="text-field-block" style={{"width": "100%"}}>
                    <label htmlFor="select-material">Equipment Logs</label>
                    <select 
                        className="input-field" value={selectedEquipment.id} 
                        style={{"width": "25%"}}
                        onChange={(event) => setSelectedEquipment(data => ({
                            id: event.target.value, 
                            category: project.equipments.find(i => i.id == event.target.value).category,
                            history: project.equipments.find(i => i.id == event.target.value).history.reverse(),
                        }))} 
                        name="material-selection" id="material-selection"
                    >
                        <option value="" disabled>Select Category</option>
                        { project.equipments.length > 0 && (
                            project.equipments.map(equipment => (
                                <option key={equipment.id} value={equipment.id}>{equipment.id} {equipment.category}</option>)
                            )
                        )}
                    </select>
                </div>

                {
                    selectedEquipment.category && (
                        <>

                            <div className="text-field-block" style={{"width": "20%"}}>
                                <div className="text-label">ID</div>
                                <div className="text-field">{selectedEquipment.id}</div>
                            </div>

                            <div className="text-field-block" style={{"width": "20%"}}>
                                <div className="text-label">Category</div>
                                <div className="text-field">{selectedEquipment.category}</div>
                            </div>

                            <table style={{"width": "70%"}}>
                                <thead>
                                    <tr>
                                        <th>Report ID</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Hours</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        selectedEquipment.history.length > 0 ? (
                                            selectedEquipment.history.map(equipment => (
                                                <tr key={equipment[0]}>
                                                    <td><Link to={`/reports/${equipment[0]}`}>{equipment[0]}</Link></td>
                                                    <td>{equipment[1].split("T")[0]}</td>
                                                    <td>{equipment[2][1]}</td>
                                                    <td>{equipment[2][0]}</td>
                                                </tr>
                                            ))
                                        ) : <tr><td colSpan={"4"}>No log data available</td></tr>
                                    } 
                                </tbody>
                            </table>
                        </>
                    )
                }

                {
                    user.position !== "" ? (
                        <>
                            <hr className="black-separator" style={{"margin": "40px 0px"}} />

                            <div className="input-fix-field-container">
                                <div className="text-field-block" style={{"width": "100%"}}>
                                    <div className="text-label" style={{"fontSize": "30px", "color": "rgb(103, 103, 240)"}}>New Equipment</div>
                                </div>

                                <div className="input-field-block" style={{"width": "30%"}}>
                                    <label htmlFor="equipment-id">ID</label>
                                    <input type="text" name="id" value={newEquipment.id} 
                                        onChange={(event) => {
                                        setNewEquipment((data) => ({
                                        ...data,
                                        [event.target.name]: event.target.value
                                        }))
                                        }} 
                                    />
                                </div>

                                <div className="input-field-block" style={{"width": "10%"}}>
                                    <label htmlFor="material-unit">Category</label>
                                    <input style={{"width": "80px"}} type="text" name="category" value={newEquipment.category} 
                                        onChange={(event) => {
                                        setNewEquipment((data) => ({
                                        ...data,
                                        [event.target.name]: event.target.value
                                        }))
                                    }} 
                                    />
                                </div>

                                <div className="input-field-block" style={{"width": "10%"}}>
                                    <div className="tiny-button input-fix-form-submit" style={{"lineHeight": "30px", "textAlign": "center", "marginTop": "43px"}} onClick={handleAdd}>Add</div>
                                </div>
                            </div>
                        </>
                    ) : ""
                }
            </div>
        </div>
    )
}