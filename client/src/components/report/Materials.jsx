import React from "react"

export default function Materiails({ project, report, setReport}) {
    const [selectedMaterial, setSelectedMaterial] = React.useState({
        material: "",
        unit: "",
        usage: "",
    })

    return (
        <div className="container">
            <div className="blue-label">
                Materials
            </div>
            <div className="container-main-block">
                <div className="text-field-block" style={{"width": "100%"}}>
                    <label htmlFor="select-material">Select Material</label>
                    <select 
                        className="input-field" value={selectedMaterial.material} 
                        style={{"width": "25%"}}
                        disabled={report.status === "approved"}
                        onChange={(event) => setSelectedMaterial(data => ({
                            ...data, 
                            material: event.target.value, 
                            unit: project.materials.find(i => i.material == event.target.value).unit,
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
                    selectedMaterial.material ? (
                    <>
                        <div className="text-field-block" style={{"width": "15%"}}>
                            <div className="text-label">Unit</div>
                            <div className="text-field">{selectedMaterial.unit}</div>
                        </div>
                        <div className="input-field-block" style={{"width": "10%"}}>
                            <div className="text-label">Usage</div>
                            <input type="number" 
                                className="input-field" 
                                style={{"width": "100px"}} 
                                name="usage" 
                                value={selectedMaterial.usage} 
                                onChange={(e) => setSelectedMaterial(data => ({
                                    ...data,
                                    usage: e.target.value
                                }))} 
                            />
                        </div>
                        <div className="tiny-button" 
                            style={{
                                "marginLeft": "20px",
                                "marginTop": "42px"
                            }}
                            onClick={() => {
                                if (!report.materials.find(item => item.material == selectedMaterial.material)
                                    && selectedMaterial.material && selectedMaterial.usage
                                ) {
                                    setReport(data => ({
                                        ...data,
                                        materials: [
                                            ...data.materials,
                                            { ...selectedMaterial }
                                        ]
                                    }))
                                    setSelectedMaterial({
                                        material: "",
                                        unit: "",
                                        usage: ""
                                    })
                                }
                        }}>Add</div>
                    </>
                ) : ""}

                <hr className="black-separator" />

                <table style={{"width": "60%"}}>
                    <thead>
                        <tr>
                            <th>Material</th>
                            <th>Unit</th>
                            <th>Usage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            report.materials.length > 0 ? (
                                report.materials.map(material => (
                                    <tr key={material.material}>
                                        <td>{material.material}</td>
                                        <td>{material.unit}</td>
                                        <td>{material.usage}</td>
                                        {
                                            report.status != "approved" ? (
                                            <td style={{"width": "15px"}}>
                                            <div className="tiny-button" style={{"margin": 0, "background": "linear-gradient(88.94deg, #E81A37 0.66%, #FF495A 99.1%)", "borderRadius": "50%", "width": "15px", "height": "15px", "fontSize": "10px", "lineHeight": "15px"}} onClick={(event) => {
                                            const newMaterials = report.materials.filter(item => item.material != material.material)
                                            setReport(data => ({...data, materials: newMaterials}))
                                            }}>X</div></td>
                                            )
                                            : 
                                            ""
                                        }
                                    </tr>
                                ))
                            ) : <tr><td colSpan={"4"}>No activities added</td></tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}