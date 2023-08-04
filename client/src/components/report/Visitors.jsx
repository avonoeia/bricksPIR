import React from "react"

export default function Visitors({ report, setReport}) {
    const [visitor, setVisitor] = React.useState({
        no: "",
        name: "",
        organization: "",
    })

    return (
        <div className="container">
        <div className="blue-label">
            Visitors Log
        </div>
        <div className="container-main-block">

        <div className="input-fix-field-container">
            <div className="text-field-block" style={{"width": "100%"}}>
                <div className="text-label" style={{"fontSize": "30px", "color": "rgb(103, 103, 240)"}}>Visitor Log Information</div>
            </div>
            <div className="input-field-block" style={{"width": "30%"}}>
                <div className="text-label">Name</div>
                <input 
                    type="text" 
                    name="visitor-name"
                    value={visitor.name}
                    disabled={report.status === "approved" || report.status == "pending approval"}
                    onChange={(e) => setVisitor(data => ({
                        ...data,
                        name: e.target.value
                    }))} 
                />
            </div>
            
            <div className="input-field-block" style={{"width": "10%"}}>
                <div className="text-label">Organization</div>
                <input type="text" 
                    className="input-field" 
                    style={{"width": "100px"}} 
                    name="organization" 
                    value={visitor.organization} 
                    disabled={report.status === "approved" || report.status == "pending approval"}
                    onChange={(e) => setVisitor(data => ({
                        ...data,
                        organization: e.target.value
                    }))} 
                />
            </div>

            <div className="tiny-button" 
                style={{
                    "marginLeft": "20px",
                    "marginTop": "42px"
                }}
                disabled={report.status === "approved" || report.status == "pending approval"}
                onClick={() => {
                    if (
                        report.status != "approved" &&
                        !report.visitors.find(i => i.name.toLowerCase() == visitor.name.toLowerCase() && i.organization.toLowerCase() == visitor.organization.toLowerCase()) 
                        && visitor.name && visitor.organization) {
                        setReport(data => ({
                            ...data,
                            visitors: [
                                ...data.visitors,
                                { ...visitor, "no": data.visitors.length+1 }
                            ]
                        }))
                        setVisitor({
                            no: "",
                            name: "",
                            organization: ""
                        })
                    }
            }}>Add</div>
        </div>

        <hr className="black-separator" />

        <table style={{"width": "60%"}}>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Organization</th>
                </tr>
            </thead>
            <tbody>
                {
                    report.visitors.length > 0 ? (
                        report.visitors.map(visitor => (
                            <tr key={visitor.no}>
                                <td>{visitor.no}</td>
                                <td>{visitor.name}</td>
                                <td>{visitor.organization}</td>
                                {
                                    report.status != "approved" ? (
                                    <td style={{"width": "15px"}}>
                                    <div className="tiny-button" style={{"margin": 0, "background": "linear-gradient(88.94deg, #E81A37 0.66%, #FF495A 99.1%)", "borderRadius": "50%", "width": "15px", "height": "15px", "fontSize": "10px", "lineHeight": "15px"}} onClick={(event) => {
                                    const newVisitors = report.visitors.filter(item => item.no != visitor.no)
                                    setReport(data => ({...data, visitors: newVisitors}))
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