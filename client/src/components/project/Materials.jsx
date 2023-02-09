import React, { useState } from "react"
import { useAuthContext } from "../../hooks/useAuthContext"
import { Link } from "react-router-dom"

export default function Materials({ project, setProject }) {
    const { user } = useAuthContext()
    const [newMaterial, setNewMaterial] = useState({
        material: "",
        unit: "",
        history: [],
        stock: []
    })
    const [addStock, setAddStock] = useState({
        material: "",
        unit: "",
        supplier: "",
        amount: ""
    })
    const [selectedMaterial, setSelectedMaterial] = useState({
        material: "",
        unit: "",
        history: [],
        stock: []
    })

    function handleAdd(e) {
        const arr = window.location.href.split('/')
        const project_id = arr[arr.length - 1]

        const add = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/projects/add-material/${project_id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-type': 'application/json'
                },
                method: 'PATCH',
                body: JSON.stringify({newMaterial: newMaterial})
            }) 
            
            if (response.ok) {
                setProject(data => ({
                    ...data,
                    materials: [...data.materials, newMaterial]
                }))
                setNewMaterial({
                    material: "",
                    unit: "",
                    history: [],
                    stock: []
                })
            }
        }
        
        if (newMaterial.material && newMaterial.unit) {
            add()
        }
    }

    function handleAddStock(e) {
        const arr = window.location.href.split('/')
        const project_id = arr[arr.length - 1]

        const add = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/projects/add-stock/${project_id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-type': 'application/json'
                },
                method: 'PATCH',
                body: JSON.stringify({addStock: addStock})
            }) 
            
            if (response.ok) {
                const { updatedMaterials } = await response.json()

                if (selectedMaterial.material == addStock.material) {
                    setSelectedMaterial(data => ({
                        ...data,
                        stock: [...updatedMaterials.find(i => i.material == addStock.material).stock]
                    }))
                }
                setProject(data => ({
                    ...data,
                    materials: [...updatedMaterials]
                }))
                setAddStock({
                    material: "",
                    unit: "",
                    supplier: "",
                    amount: ""
                })
            }
        }
        
        if (addStock.material && addStock.supplier && addStock.amount) {
            add()
        }
    }

    return (
        <div className="container">
            <div className="blue-label">
                Materials
            </div>
            <div className="container-main-block">
                <table style={{"width": "60%"}}>
                    <thead>
                        <tr>
                            <th>Material</th>
                            <th>Unit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            project.materials.length > 0 ? (
                                project.materials.map(material => (
                                    <tr key={material.material}>
                                            <td>{material.material}</td>
                                            <td>{material.unit}</td>
                                    </tr>
                                ))
                            ) : <tr><td colSpan={"5"}>No activities added</td></tr>
                        }
                    </tbody>
                </table>

                { (user.position === "site_manager" || user.position == "data_entry_operator") ? (
                    <>
                        <hr className="black-separator" style={{"margin": "40px 0px"}} />

                        <div className="text-field-block" style={{"width": "100%"}}>
                            <label htmlFor="select-material">Add to stock</label>
                            <select 
                                className="input-field" value={addStock.material} 
                                style={{"width": "25%"}}
                                onChange={(event) => setAddStock(data => ({
                                    ...data,
                                    material: event.target.value, 
                                    unit: project.materials.find(i => i.material == event.target.value).unit,
                                }))} 
                                name="add-stock-selection" id="add-stock-selection"
                            >
                                <option value="" disabled>Select Material</option>
                                { project.materials.length > 0 && (
                                    project.materials.map(material => (
                                        <option key={material.material} value={material.material}>{material.material}</option>)
                                    )
                                )}
                            </select>
                        </div>

                        { 
                            addStock.material && (
                                <>
                                    <div className="input-fix-field-container">
                                        <div className="text-field-block" style={{"width": "100%"}}>
                                            <div className="text-label" style={{"fontSize": "30px", "color": "rgb(103, 103, 240)"}}>New Stock</div>
                                        </div>
                                        <div className="text-field-block" style={{"width": "15%"}}>
                                            <div className="text-label">Unit</div>
                                            <div className="text-field">{addStock.unit}</div>
                                        </div>
                                        <div className="input-field-block" style={{"width": "30%"}}>
                                            <div className="text-label">Supplier</div>
                                            <input type="text" 
                                                className="input-field" 
                                                style={{"width": "350px"}} 
                                                name="supplier" 
                                                value={addStock.supplier} 
                                                onChange={(e) => setAddStock(data => ({
                                                    ...data,
                                                    supplier: e.target.value
                                                }))} 
                                            />
                                        </div>
                                        <div className="input-field-block" style={{"width": "10%"}}>
                                            <div className="text-label">Amount</div>
                                            <input type="number" 
                                                className="input-field" 
                                                style={{"width": "100px"}} 
                                                name="usage" 
                                                value={addStock.amount} 
                                                onChange={(e) => setAddStock(data => ({
                                                    ...data,
                                                    amount: e.target.value
                                                }))} 
                                            />
                                        </div>
                                        <div className="tiny-button" 
                                            style={{
                                                "marginLeft": "20px",
                                                "marginTop": "42px"
                                            }}
                                            onClick={handleAddStock}
                                        >Add</div>
                                    </div>
                                </>
                            )
                        }
                    </>
                    ) 
                    : ""
                }


                <hr className="black-separator" style={{"margin": "40px 0px"}} />

                <div className="text-field-block" style={{"width": "100%"}}>
                    <label htmlFor="select-material">Material Logs</label>
                    <select 
                        className="input-field" value={selectedMaterial.material} 
                        style={{"width": "25%"}}
                        onChange={(event) => setSelectedMaterial(data => ({
                            material: event.target.value, 
                            unit: project.materials.find(i => i.material == event.target.value).unit,
                            history: project.materials.find(i => i.material == event.target.value).history.reverse(),
                            stock: project.materials.find(i => i.material == event.target.value).stock.reverse()
                        }))} 
                        name="material-selection" id="material-selection"
                    >
                        <option value="" disabled>Select Material</option>
                        { project.materials.length > 0 && (
                            project.materials.map(material => (
                                <option key={material.material} value={material.material}>{material.material}</option>)
                            )
                        )}
                    </select>
                </div>

                { 
                    selectedMaterial.material && (
                        <>
                            <div className="text-field-block" style={{"width": "100%"}}>
                                <div className="text-label">Unit</div>
                                <div className="text-field">{selectedMaterial.unit}</div>
                            </div>

                            <div className="text-field-block" style={{"width": "48%", "marginRight": "15px"}}>
                                <div className="text-label">Usage</div>
                                <table style={{"width": "100%"}}>
                                    <thead>
                                        <tr>
                                            <th>Report ID</th>
                                            <th>Duration</th>
                                            <th>Usage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            selectedMaterial.history.length > 0 ? (
                                                selectedMaterial.history.map(data => (
                                                    <tr key={`${data[0]}`}>
                                                        <td><Link to={`/reports/${data[0]}`}>{data[0]}</Link></td>
                                                        <td>From {data[1][0]} to {data[1][1]}</td>
                                                        <td>{data[2]}</td>
                                                    </tr>
                                                ))
                                            ) : <tr><td colSpan={"3"}>No usage history data available</td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>

                            <div className="text-field-block" style={{"width": "48%"}}>
                                <div className="text-label">Receipts</div>
                                <table style={{"width": "100%"}}>
                                    <thead>
                                        <tr>
                                            <th>Supplier</th>
                                            <th>Date</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            selectedMaterial.stock.length > 0 ? (
                                                selectedMaterial.stock.map(data => (
                                                    <tr key={`${data[0]} ${data[1]}`}>
                                                        <td>{data[0]}</td>
                                                        <td>{data[1].split("T")[0]}</td>
                                                        <td>{data[2]}</td>
                                                    </tr>
                                                ))
                                            ) : <tr><td colSpan={"3"}>No stock history data available</td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )
                }

                {
                    user.position != "admin" && (
                        <>
                            <hr className="black-separator" />

                            <div className="input-fix-field-container">
                                <div className="text-field-block" style={{"width": "100%"}}>
                                    <div className="text-label" style={{"fontSize": "30px", "color": "rgb(103, 103, 240)"}}>New Material</div>
                                </div>

                                <div className="input-field-block" style={{"width": "30%"}}>
                                    <label htmlFor="material">Material Name</label>
                                    <input type="text" name="material" value={newMaterial.material} 
                                        onChange={(event) => {
                                        setNewMaterial((data) => ({
                                        ...data,
                                        [event.target.name]: event.target.value
                                        }))
                                        }} 
                                    />
                                </div>

                                <div className="input-field-block" style={{"width": "10%"}}>
                                    <label htmlFor="material-unit">Unit</label>
                                    <input style={{"width": "80px"}} type="text" name="unit" value={newMaterial.unit} 
                                        onChange={(event) => {
                                        setNewMaterial((data) => ({
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
                    )
                }
            </div>
        </div>
    )
}