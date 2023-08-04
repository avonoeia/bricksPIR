import React from "react"

export default function Labour({ report, setReport}) {
    const [labour, setLabour] = React.useState({
        no: "",
        description: "",
        planned: "",
        actual: "",
    })

    return (
        <div className="container">
            <div className="blue-label">
                Labour Log
            </div>
            <div className="container-main-block">
            
            <div className="input-fix-field-container">
                <div className="text-field-block" style={{"width": "100%"}}>
                    <div className="text-label" style={{"fontSize": "30px", "color": "rgb(103, 103, 240)"}}>Labour Log Information</div>
                </div>

                <div className="input-field-block" style={{"width": "30%"}}>
                    <div className="text-label">Description</div>
                    <input 
                        type="text" 
                        name="labour-description"
                        value={labour.description}
                        disabled={report.status === "approved" || report.status == "pending approval"}
                        onChange={(e) => setLabour(data => ({
                            ...data,
                            description: e.target.value
                        }))} 
                    />
                </div>
                
                <div className="input-field-block" style={{"width": "10%"}}>
                    <div className="text-label">Planned</div>
                    <input type="number" 
                        className="input-field" 
                        style={{"width": "100px"}} 
                        name="usage" 
                        value={labour.planned} 
                        disabled={report.status === "approved"}
                        onChange={(e) => setLabour(data => ({
                            ...data,
                            planned: e.target.value
                        }))} 
                    />
                </div>

                <div className="input-field-block" style={{"width": "10%"}}>
                    <div className="text-label">Actual</div>
                    <input type="number" 
                        className="input-field" 
                        style={{"width": "100px"}} 
                        name="usage" 
                        value={labour.actual} 
                        disabled={report.status === "approved"}
                        onChange={(e) => setLabour(data => ({
                            ...data,
                            actual: e.target.value
                        }))} 
                    />
                </div>

                <div className="tiny-button input-fix-form-submit" 
                    style={{
                        "marginLeft": "20px",
                        "marginTop": "42px"
                    }}
                    onClick={() => {
                        if (report.status != "approved" && labour.description && labour.planned && labour.actual) {
                            setReport(data => ({
                                ...data,
                                labour: [
                                    ...data.labour,
                                    { ...labour, "no": data.labour.length+1 }
                                ]
                            }))
                            setLabour({
                                no: "",
                                description: "",
                                planned: "",
                                actual: ""
                            })
                        }
                }}>Add</div>
            </div>

            <hr className="black-separator" />

                <table style={{"width": "60%"}}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Description</th>
                            <th>Planned</th>
                            <th>Actual</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            report.labour.length > 0 ? (
                                report.labour.map(labour => (
                                    <tr key={labour.no}>
                                        <td>{labour.no}</td>
                                        <td>{labour.description}</td>
                                        <td>{labour.planned}</td>
                                        <td>{labour.actual}</td>
                                        {
                                            report.status != "approved" ? (
                                            <td style={{"width": "15px"}}>
                                            <div className="tiny-button" style={{"margin": 0, "background": "linear-gradient(88.94deg, #E81A37 0.66%, #FF495A 99.1%)", "borderRadius": "50%", "width": "15px", "height": "15px", "fontSize": "10px", "lineHeight": "15px"}} onClick={(event) => {
                                            const newLabour = report.labour.filter(item => item.no != labour.no)
                                            setReport(data => ({...data, labour: newLabour}))
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