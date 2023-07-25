import { forwardRef } from "react";
import Logo from "../../assets/logo.jpeg";
import "./Print.css";

const ContentToPrint = forwardRef((props, ref) => {
    return (
        <div tabIndex={"1"} className="print-container" ref={ref}>
            <div className="header">
                <img
                    src={Logo}
                    alt="Bricks & bridges logo"
                    style={{ width: "200px", height: "78px" }}
                />
                <div className="header-info">
                    <h1>Project Quality Plan</h1>
                    <h2>Daily Progress Report</h2>
                    <h2>
                        {new Date(props.reportData.created[1])
                            .toString()
                            .split(" ")
                            .slice(0, 4)
                            .map((data) => ` ${data}`)}
                    </h2>
                </div>
            </div>

            <hr />

            <div className="table">
                <div className="section">
                    <div className="section-header rotate">PROJECT</div>
                    <div className="section-body">
                        <div className="row">
                            <div className="th">Name of work</div>
                            <div className="td">
                                {props.reportData.project_name}
                            </div>
                        </div>

                        <div className="row">
                            <div className="th">Employer</div>
                            <div className="td">
                                {props.reportData.employer}
                            </div>
                        </div>

                        <div className="row">
                            <div className="th">Contractor</div>
                            <div className="td">
                                {props.reportData.contractor}
                            </div>
                        </div>

                        <div className="row">
                            <div className="th">Contract Start</div>{" "}
                            <div className="td">
                                {new Date(props.reportData.contract_start_date.split("T")[0])
                                    .toString()
                                    .split(" ")
                                    .slice(0, 4)
                                    .map((data) => ` ${data}`)}
                            </div>
                            <div className="th">Contract End</div>{" "}
                            <div className="td">
                                {new Date(props.reportData.contract_completion_date.split("T")[0])
                                    .toString()
                                    .split(" ")
                                    .slice(0, 4)
                                    .map((data) => ` ${data}`)}
                            </div>
                        </div>

                        <div className="row">
                            <div className="th">Time Elapsed</div>
                            <div className="td">
                                {Math.round(
                                    (new Date(props.reportData.updatedAt) -
                                        new Date(
                                            props.reportData.contract_start_date.split(
                                                "T"
                                            )[0]
                                        ).getTime()) /
                                        (1000 * 3600 * 24)
                                )}{" "}
                                day(s)
                            </div>
                            <div className="th">Time Remaining</div>
                            <div className="td">
                                {Math.round(
                                    (new Date(
                                        props.reportData.contract_completion_date.split(
                                            "T"
                                        )[0]
                                    ).getTime() -
                                        new Date(props.reportData.updatedAt)) /
                                        (1000 * 3600 * 24)
                                )}{" "}
                                day(s)
                            </div>
                        </div>
                    </div>
                </div>

                <hr />

                <div className="section">
                    <div className="section-header" style={{}}>
                        METADATA
                    </div>
                    <div className="section-body">
                        <div className="row">
                            <div className="th">Weather</div>
                            <div className="td">Rainy</div>
                            <div className="th">Conditions</div>
                            <div className="td">Slushy</div>
                        </div>

                        <div className="row">
                            <div className="th">From</div>
                            <div className="td">
                                {props.reportData.duration[0]}
                            </div>
                            <div className="th">To</div>
                            <div className="td">
                                {props.reportData.duration[1]}
                            </div>
                        </div>

                        <div className="row">
                            <div className="th">Created on</div>
                            <div className="td">
                                {new Date(props.reportData.created[1])
                                    .toString()
                                    .split(" ")
                                    .slice(0, 4)
                                    .map((data) => ` ${data}`)}
                            </div>

                            <div className="th">Approved on</div>
                            <div className="td">
                                {new Date(props.reportData.updatedAt.split("T")[0])
                                    .toString()
                                    .split(" ")
                                    .slice(0, 4)
                                    .map((data) => ` ${data}`)}
                            </div>
                        </div>

                        <div className="row">
                            <div className="th">Approved By</div>
                            <div className="td">
                                {props.reportData.approved_by.map((person) => (
                                    <span
                                        key={person}
                                        style={{ display: "block" }}
                                    >
                                        {person}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {props.reportData.activities.length > 0 && (
                    <>
                        <hr />

                        <div className="section">
                            <div className="section-header">ACTIVITIES</div>
                            <div className="section-body">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Activity</th>
                                            <th>Unit</th>
                                            <th>Planned</th>
                                            <th>Achieved</th>
                                            <th>Level</th>
                                            <th>Grid Line</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {props.reportData.activities.map(
                                            (data) => {
                                                return (
                                                    <tr key={data.no}>
                                                        <td>{data.activity}</td>
                                                        <td>{data.unit}</td>
                                                        <td>{data.planned}</td>
                                                        <td>{data.achieved}</td>
                                                        <td>{data.level}</td>
                                                        <td>
                                                            {data.grid_line}
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {props.reportData.materials.length > 0 && (
                    <>
                        <hr />

                        <div className="section">
                            <div className="section-header">MATERIALS</div>
                            <div className="section-body">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Material</th>
                                            <th>Unit</th>
                                            <th>Usage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {props.reportData.materials.map(
                                            (data) => {
                                                return (
                                                    <tr key={data.material}>
                                                        <td>{data.material}</td>
                                                        <td>{data.unit}</td>
                                                        <td>{data.usage}</td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {props.reportData.materials.length > 0 && (
                    <>
                        <hr />

                        <div className="section">
                            <div className="section-header">EQUIPMENT</div>
                            <div className="section-body">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Category</th>
                                            <th>Status</th>
                                            <th>Hours</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {props.reportData.equipments.map(
                                            (data) => {
                                                return (
                                                    <tr key={data.id}>
                                                        <td>{data.id}</td>
                                                        <td>{data.category}</td>
                                                        <td>{data.status}</td>
                                                        <td>{data.hours}</td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                <div className="section"></div>

                {props.reportData.labour.length > 0 && (
                    <>
                        <hr />

                        <div className="section">
                            <div className="section-header">LABOUR</div>
                            <div className="section-body">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Description</th>
                                            <th>Planned</th>
                                            <th>Actual</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {props.reportData.labour.map(
                                            (data) => {
                                                return (
                                                    <tr key={data.description}>
                                                        <td>
                                                            {data.description}
                                                        </td>
                                                        <td>{data.planned}</td>
                                                        <td>{data.actual}</td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {props.reportData.visitors.length > 0 && (
                    <>
                        <hr />

                        <div className="section">
                            <div className="section-header">VISITORS</div>
                            <div className="section-body">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Organization</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {props.reportData.visitors.map(
                                            (data) => {
                                                return (
                                                    <tr key={data.name}>
                                                        <td>{data.name}</td>
                                                        <td>
                                                            {data.organization}
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
});

export default ContentToPrint;
