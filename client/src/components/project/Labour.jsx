import React, { useState } from "react" 
import { Link } from "react-router-dom"

export default function Labour({ project }) {
    return (
        <div className="container">
            <div className="blue-label">
                Labour
            </div>
            <div className="container-main-block">
                <table style={{"width": "60%"}}>
                    <thead>
                        <tr>
                            <th>Report</th>
                            <th>Description</th>
                            <th>Planned</th>
                            <th>Actual</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.keys(project.labour).length > 0 ? (
                                Object.keys(project.labour).map(key => (
                                    <React.Fragment key={Math.random()}>
                                        {
                                            project.labour[key].map((lbr, idx) => (
                                                <tr key={Math.random()}>
                                                    {idx == 0 && <td rowSpan={`${project.labour[key].length}`}><Link to={`/reports/approved/${key}`}>{key}</Link></td>}
                                                    <td>{lbr[0]}</td>
                                                    <td>{lbr[1]}</td>
                                                    <td>{lbr[2]}</td>
                                                </tr>
                                            ))
                                        }
                                    </React.Fragment>
                                ))
                            ) : <tr><td colSpan={"4"}>No data available</td></tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}