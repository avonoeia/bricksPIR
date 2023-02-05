import React from "react"

export default function Equipment({ report, setReport}) {

    return (
        <div className="container">
            <div className="blue-label">
                Equipments Log
            </div>
            <div className="container-main-block">

                <table style={{"width": "40%"}}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Hours</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            report.equipments.length > 0 ? (
                                report.equipments.map(equipment => (
                                    <tr key={equipment.id}>
                                        <td>{equipment.id}</td>
                                        <td>{equipment.category}</td>
                                        <td>
                                            <input type="radio" 
                                                checked={equipment.status == "working"} 
                                                disabled={report.status === "approved"}
                                                className="radio-input" 
                                                name="status" 
                                                value="working"
                                                onChange={(event) => {
                                                    setReport(data => {
                                                        const newData = data.equipments
                                                        const targetIdx = newData.findIndex(i => i.serial_no == equipment.serial_no)
                                                        newData[targetIdx] = {
                                                            ...newData[targetIdx],
                                                            status: event.target.value
                                                        }
                                                        return {
                                                            ...data,
                                                            equipments: [
                                                                ...newData
                                                            ]
                                                        }
                                                    })
                                                }}
                                            /> Working 
                                            <input 
                                                type="radio" 
                                                checked={equipment.status == "non-working"} 
                                                disabled={report.status === "approved"}
                                                className="radio-input" 
                                                name="status" 
                                                value="non-working" 
                                                onChange={(event) => {
                                                    setReport(data => {
                                                        const newData = data.equipments
                                                        const targetIdx = newData.findIndex(i => i.serial_no == equipment.serial_no)
                                                        newData[targetIdx] = {
                                                            ...newData[targetIdx],
                                                            status: event.target.value
                                                        }
                                                        return {
                                                            ...data,
                                                            equipments: [
                                                                ...newData
                                                            ]
                                                        }
                                                    })
                                                }}
                                            /> Non-working
                                        </td>
                                        <td>
                                            <input 
                                                type="number" 
                                                value={equipment.hours} 
                                                disabled={report.status === "approved"}
                                                onChange={(event) => {
                                                    setReport(data => {
                                                        const newData = data.equipments
                                                        const targetIdx = newData.findIndex(i => i.serial_no == equipment.serial_no)
                                                        newData[targetIdx] = {
                                                            ...newData[targetIdx],
                                                            hours: event.target.value
                                                        }
                                                        return {
                                                            ...data,
                                                            equipments: [
                                                                ...newData
                                                            ]
                                                        }
                                                    })
                                                }} 
                                                required={true} 
                                                style={{
                                                    "width": "80px"
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : <tr><td colSpan={"4"}>No equipments associated with this project at the moment.</td></tr>
                        }
                    </tbody>
                </table>

            </div>
        </div>
    )
}