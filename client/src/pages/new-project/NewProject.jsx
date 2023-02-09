import React, { useState } from "react"
import { useAuthContext } from "./../../hooks/useAuthContext"
import { QueryClient, QueryClientProvider, useQuery } from "react-query";


import Navbar from "../../components/navbar/Navbar"
import "./NewProject.css"

const queryClient = new QueryClient()

function NewProjectFormContainer({ newProject, setNewProject }) {
    const { user } = useAuthContext()

    const [newActivity, setNewActivity] = useState({
        activity: "",
        unit: "",
        total_planned: "",
        total_achieved: 0,
        history: []
    })
    const [users, setUsers] = useState("")
    const [newSiteManager, setNewSiteManager] = useState("")
    const [newDataEntryOperator, setNewDataEntryOperator] = useState("")

    const fetchUsersData = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/users/`, {
            headers: {'Authorization': `Bearer ${user.token}`},
        })
        return response.json()
    }

    function setData(data) {
        setUsers([...data.users_list])
    }

    const { isLoading, error, data } = useQuery({
        queryKey: "users",
        queryFn: fetchUsersData,
        onSuccess: setData
    })
    

    return (
        <div className="container">
            <div className="blue-label">
                New Project
            </div>
            <div className="container-main-block">

                <div className="input-field-block" style={{"width": "100%"}}>
                    <label htmlFor="name-of-work">Name of work</label>
                    <input type="text" name="name_of_work" value={newProject.name_of_work} required={true}
                        onChange={(event) => {
                            setNewProject((data) => ({
                                ...data,
                                [event.target.name]: event.target.value
                            }))
                        }} 
                    />
                </div>

                <div className="input-field-block" style={{"width": "50%"}}>
                    <label htmlFor="employer">Employer</label>
                    <input type="text" name="employer" value={newProject.employer} required={true}
                        onChange={(event) => {
                            setNewProject((data) => ({
                                ...data,
                                [event.target.name]: event.target.value
                            }))
                        }} 
                    />
                </div>

                <div className="input-field-block" style={{"width": "50%"}}>
                    <label htmlFor="contractor">Contractor</label>
                    <input type="text" name="contractor" value={newProject.contractor} required={true}
                        onChange={(event) => {
                            setNewProject((data) => ({
                                ...data,
                                [event.target.name]: event.target.value
                            }))
                        }} 
                    />
                </div>

                <div className="input-field-block" style={{"width": "50%"}}>
                    <label htmlFor="contract_start_date">Contractor Start Date</label>
                    <input type="date" name="contract_start_date" value={newProject.contract_start_date} required={true}
                        onChange={(event) => {
                            setNewProject((data) => ({
                                ...data,
                                [event.target.name]: event.target.value
                            }))
                        }} 
                    />
                </div>

                <div className="input-field-block" style={{"width": "50%"}}>
                    <label htmlFor="contract_end_date">Contractor End Date</label>
                    <input type="date" name="contract_end_date" value={newProject.contract_end_date} required={true}
                        onChange={(event) => {
                            setNewProject((data) => ({
                                ...data,
                                [event.target.name]: event.target.value
                            }))
                        }} 
                    />
                </div>

                <hr className="black-separator" />

                <div className="input-fix-field-container">
                    <div className="input-field-block" style={{"width": "30%"}}>
                        <label htmlFor="activity">Activity</label>
                        <input type="text" name="activity" value={newActivity.activity} 
                            onChange={(event) => {
                                setNewActivity((data) => ({
                                    ...data,
                                    [event.target.name]: event.target.value
                                }))
                            }} 
                        />
                    </div>

                    <div className="input-field-block" style={{"width": "10%"}}>
                        <label htmlFor="unit">Unit</label>
                        <input style={{"width": "80px"}} type="text" name="unit" value={newActivity.unit} 
                            onChange={(event) => {
                                setNewActivity((data) => ({
                                    ...data,
                                    [event.target.name]: event.target.value
                                }))
                            }} 
                        />
                    </div>

                    <div className="input-field-block" style={{"width": "25%"}}>
                        <label htmlFor="unit">Total Planned</label>
                        <input style={{"width": "80px"}} type="number" name="total_planned" value={newActivity.total_planned} 
                            onChange={(event) => {
                                setNewActivity((data) => ({
                                    ...data,
                                    [event.target.name]: event.target.value
                                }))
                            }} 
                        />
                    </div>

                    <div className="input-field-block" style={{"width": "100%", "margin": 0}}>
                        <div className="tiny-button input-fix-field-submit" onClick={() => {
                            if (newActivity.activity && newActivity.unit && newActivity.total_planned) {
                                setNewProject(data => ({
                                    ...data,
                                    activities: [...data.activities, newActivity]
                                }))
                                setNewActivity({
                                    activity: "",
                                    unit: "",
                                    total_planned: "",
                                    total_achieved: 0
                                })
                            }
                        }}
                    >Add</div>
                    </div>
                </div>

                <table style={{"width": "60%"}}>
                    <thead>
                        <tr>
                            <th>Activity</th>
                            <th>Unit</th>
                            <th>Total Planned</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            newProject.activities.length > 0 ? (
                                newProject.activities.map(activity => (
                                    <tr key={activity.activity}>
                                        <td>{activity.activity}</td>
                                        <td>{activity.unit}</td>
                                        <td>{activity.total_planned}</td>
                                        <td style={{"width": "15px"}}>
                                            <div className="tiny-button" style={{"margin": 0, "background": "linear-gradient(88.94deg, #E81A37 0.66%, #FF495A 99.1%)", "borderRadius": "50%", "width": "15px", "height": "15px", "fontSize": "10px", "lineHeight": "15px"}} onClick={(event) => {
                                            const newActivities = newProject.activities.filter(item => item.activity != activity.activity)
                                            setNewProject(data => ({...data, activities: newActivities}))
                                        }}>X</div></td>
                                    </tr>
                                ))
                            ) : <tr><td colSpan={"3"}>No activities added</td></tr>
                        }
                    </tbody>
                </table>

                <hr className="black-separator" />
                
                <div className="input-field-block" style={{"width": "50%"}}>
                    <label htmlFor="activity">Site Manager</label>
                    <select 
                        className="input-field" value={newSiteManager} 
                        style={{"width": "95%"}}
                        onChange={(event) => setNewSiteManager(event.target.value)} 
                        name="site_manager" id="site_manager"
                    >
                        <option value="" disabled>Select User</option>
                        { users && (
                            users.filter(user => user.position == "site_manager").map(user => (
                                <option key={user._id} value={`${user.name} - ${user._id}`}>{user.name} - {user._id}</option>)
                            )
                        )}
                    </select>

                    <div className="tiny-button" onClick={() => {
                        if (!newProject.site_manager.find(item => item._id.toString() == newSiteManager.split(" - ")[1])) {
                            setNewProject(data => ({
                                ...data,
                                site_manager: [...data.site_manager, newSiteManager]
                            }))
                            setNewSiteManager("")
                        }
                    }}
                >Add</div>

                    <table style={{"width": "80%"}}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>ID / Digital Signature</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                newProject.site_manager.length > 0 ? (
                                    newProject.site_manager.map(user => (
                                        <tr key={user}>
                                            <td>{user.split(" - ")[0]}</td>
                                            <td>{user.split(" - ")[1]}</td>
                                            <td style={{"width": "15px"}}>
                                                <div className="tiny-button" style={{"margin": 0, "background": "linear-gradient(88.94deg, #E81A37 0.66%, #FF495A 99.1%)", "borderRadius": "50%", "width": "15px", "height": "15px", "fontSize": "10px", "lineHeight": "15px"}} onClick={(event) => {
                                                    const newNewSiteManager = newProject.site_manager.filter(item => item != `${user.split(" - ")[0]} - ${user.split(" - ")[1]}`)
                                                    setNewProject(data => ({...data, site_manager: newNewSiteManager}))
                                                }}>X</div>
                                            </td>
                                        </tr>
                                    ))
                                ) : <tr><td colSpan={"3"}>No user added</td></tr>
                            }
                        </tbody>
                    </table>
                </div>

                <div className="input-field-block" style={{"width": "50%"}}>
                    <label htmlFor="activity">Data Entry Operator</label>
                    <select 
                        className="input-field" value={newDataEntryOperator} 
                        style={{"width": "95%"}}
                        onChange={(event) => setNewDataEntryOperator(event.target.value)} 
                        name="data_entry_operator" id="data_entry_operator"
                    >
                        <option value="" disabled>Select User</option>
                        { users && (
                            users.filter(user => user.position == "data_entry_operator").map(user => (
                                <option key={user._id} value={`${user.name} - ${user._id}`}>{user.name} - {user._id}</option>)
                            )
                        )}
                    </select>
                    <div className="tiny-button" onClick={() => {
                        if (!newProject.data_entry_operator.find(item => item._id.toString() == newDataEntryOperator.split(" - ")[1])) {
                            setNewProject(data => ({
                                ...data,
                                data_entry_operator: [...data.data_entry_operator, newDataEntryOperator]
                            }))
                            setNewDataEntryOperator("")
                        }
                    }}>Add</div>

                    <table style={{"width": "80%"}}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>ID / Digital Signature</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                newProject.data_entry_operator.length > 0 ? (
                                    newProject.data_entry_operator.map(user => (
                                        <tr key={user}>
                                            <td>{user.split(" - ")[0]}</td>
                                            <td>{user.split(" - ")[1]}</td>
                                            <td style={{"width": "15px"}}>
                                                <div className="tiny-button" style={{"margin": 0, "background": "linear-gradient(88.94deg, #E81A37 0.66%, #FF495A 99.1%)", "borderRadius": "50%", "width": "15px", "height": "15px", "fontSize": "10px", "lineHeight": "15px"}} onClick={(event) => {
                                                    const newNewDataEntryOperator = newProject.activities.filter(item => item => item != `${user.split(" - ")[0]} - ${user.split(" - ")[1]}`)
                                                    setNewProject(data => ({...data, data_entry_operator: newNewDataEntryOperator}))
                                                }}>X</div>
                                            </td>
                                        </tr>
                                    ))
                                ) : <tr><td colSpan={"3"}>No user added</td></tr>
                            }
                        </tbody>
                    </table>
                </div>

                <hr className="black-separator" />
                
                <h6 style={{"width": "100%", "margin": "0"}}>
                    Please revise the project details before creating a new project. <span style={{"color": "red"}}>Once created, a project cannot be deleted.</span>
                </h6>

                <button className="small-button"
                    style={{
                        "width": "150px",
                        "lineHeight": "43px",
                        "textAlign": "center"
                    }}
                >
                    Create Project
                </button>
            </div>
        </div>
    )
}

export default function NewProject() {
    const { user } = useAuthContext()
    const [newProject, setNewProject] = useState({
        name_of_work: "",
        employer: "",
        contractor: "",
        contract_start_date: "",
        contract_end_date: "",
        activities: [],
        site_manager: [],
        data_entry_operator: [],
    })

    function handleSubmit(event) {
        event.preventDefault()
        const submitNewProject = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/projects/create-project`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(newProject)
            })
            
            if (response.ok) {
                window.location.href = "/projects"
            }
        }

        submitNewProject()
    }

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Navbar pageName="projects" />
                <main>
                    <div className="page-route">/ Projects / New Project</div>
                    <form onSubmit={handleSubmit}>
                        <NewProjectFormContainer newProject={newProject} setNewProject={setNewProject} />
                    </form>
                </main>
            </QueryClientProvider>
        </>
    )
}