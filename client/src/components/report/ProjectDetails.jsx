import React from "react"

export default function ProjectDetails({ project }) {
    
    return (
        <>
            <div className="text-field-block" style={{"width": "100%"}}>
                <div className="text-label">Name of work</div>
                <div className="text-field">{project.project_name}</div>
            </div>

            <div className="text-field-block" style={{"width": "40%"}}>
                <div className="text-label">Employer</div>
                <div className="text-field">{project.employer}</div>
            </div>

            <div className="text-field-block" style={{"width": "40%"}}>
                <div className="text-label">Contractor</div>
                <div className="text-field">{project.contractor}</div>
            </div>

            <div className="text-field-block" style={{"width": "40%"}}>
                <div className="text-label">Contract Start Date</div>
                <div className="text-field">{project.contract_start_date.split("T")[0]}</div>
            </div>

            <div className="text-field-block" style={{"width": "40%"}}>
                <div className="text-label">Contract End Date</div>
                <div className="text-field">{project.contract_completion_date.split("T")[0]}</div>
            </div>
        </>
    )
}