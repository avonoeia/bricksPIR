import React from "react"

export default function ReportDetails({ project, report, setReport, status }) {

    return (
        <div className="container">
            <div className="blue-label">
                Report Details
            </div>
            <div className="container-main-block">
                <div className="text-field-block" style={{"width": "40%"}}>
                    <div className="text-label">Site Manager</div>
                    <div className="text-field">
                        {
                            project.site_manager.map(user => user)
                        }
                    </div>
                </div>

                <div className="text-field-block" style={{"width": "40%"}}>
                    <div className="text-label">Data Entry Operator</div>
                    <div className="text-field">
                        {
                            project.data_entry_operator.map(user => user)
                        }
                    </div>
                </div>

                

                { status ? (
                    <>
                        <hr className="black-separator" />
                        <div className="text-field-block" style={{"width": "40%"}}>
                            <div className="text-label">Required Approvals</div>
                            <div className="text-field">
                                {
                                    report.required_approvals.map(user => user)
                                }
                            </div>
                        </div>
                        <div className="text-field-block" style={{"width": "40%"}}>
                            <div className="text-label">Approved By</div>
                            <div className="text-field">
                                {
                                    report.approved_by.map(user => user)
                                }
                            </div>
                        </div>
                    </>
                ) : ""}

                <hr className="black-separator" />
                <div className="text-field-block" style={{"width": "100%"}}>
                    <div className="text-label">Report Duration</div>
                    <div className="text-field">
                        From
                        <input 
                            style={{"margin": "10px 10px"}} 
                            type="date" 
                            value={report.duration[0]}
                            required={true}
                            onChange={(e) => {
                                setReport(data => {
                                    const newDuration = data.duration
                                    newDuration[0] = e.target.value
                                    return {
                                        ...data, 
                                        duration: [...newDuration]
                                    }
                                })
                            }} 
                        />
                        To
                        <input 
                            style={{"margin": "10px 10px"}} 
                            type="date" 
                            value={report.duration[1]} 
                            required={true} 
                            onChange={(e) => {
                                setReport(data => {
                                    const newDuration = data.duration
                                    newDuration[1] = e.target.value
                                    return {
                                        ...data, 
                                        duration: [...newDuration]
                                    }
                                })
                            }} 
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}