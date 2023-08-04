import React from "react";
import { Link } from "react-router-dom"
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

import { useAuthContext } from "../../hooks/useAuthContext"
import Navbar from "../../components/navbar/Navbar"

const queryClient = new QueryClient()

function ProjectManagers({ users, queryStatus }) {
    return (
        <div className="container">
            <div className="blue-label">
                Project Managers
            </div>
            <div className="container-main-block">
                {
                    queryStatus.isLoading ? <div style={{"textAlign": "center", "width": "100%"}}>Loading...</div> : (
                        users && users.length > 0 ? (
                        users.filter(user => user.position == "project_manager").map((user, index) => (
                            <div key={user._id} className="general-card">
                                <div className="blue-label-box">
                                    <span>{index+1}</span>
                                </div>
                                <div className="general-card-main-block">
                                    <p style={{"margin": "0px 0px 5px 0px"}}><strong>Name:</strong> {user.name}</p>
                                    <p style={{"margin": "0px 0px 5px 0px"}}><strong>Email:</strong> {user.email}</p>
                                    <p style={{"margin": "0px 0px 5px 0px"}}><strong>Phone:</strong> {user.phone}</p>
                                    <p style={{"margin": "0px 0px 5px 0px"}}><strong>Position:</strong> {user.position}</p>
                                </div>
                                <div className="general-card-button-container">
                                    <Link to={`/users/${user._id}`}>
                                        <button className="small-button">
                                            View Details
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )) ) : <div style={{"textAlign": "center", "width": "100%"}}>No project managers found</div>
                    )
                }
            </div>
        </div>
    )
}

function SiteManagers({ users, queryStatus }) {
    return (
        <div className="container">
            <div className="blue-label">
                Site Managers
            </div>
            <div className="container-main-block">
                {
                    queryStatus.isLoading ? <div style={{"textAlign": "center", "width": "100%"}}>Loading...</div> : (
                        users && users.length > 0 ? (
                        users.filter(user => user.position == "site_manager").map((user, index) => (
                            <div key={user._id} className="general-card">
                                <div className="blue-label-box">
                                    <span>{index+1}</span>
                                </div>
                                <div className="general-card-main-block">
                                    <p style={{"margin": "0px 0px 5px 0px"}}><strong>Name:</strong> {user.name}</p>
                                    <p style={{"margin": "0px 0px 5px 0px"}}><strong>Email:</strong> {user.email}</p>
                                    <p style={{"margin": "0px 0px 5px 0px"}}><strong>Phone:</strong> {user.phone}</p>
                                    <p style={{"margin": "0px 0px 5px 0px"}}><strong>Position:</strong> {user.position}</p>
                                </div>
                                <div className="general-card-button-container">
                                    <Link to={`/users/${user._id}`}>
                                        <button className="small-button">
                                            View Details
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )) ) : <div style={{"textAlign": "center", "width": "100%"}}>No site managers found</div>
                    )
                }
            </div>
        </div>
    )
}

function DataEntryOperators({ users, queryStatus }) {
    return (
        <div className="container">
            <div className="blue-label" style={{"fontSize": "1rem"}}>
                Data Entry Operators
            </div>
            <div className="container-main-block">
                {
                    queryStatus.isLoading ? <div style={{"textAlign": "center", "width": "100%"}}>Loading...</div> : (
                        users && users.length > 0 ? (
                        users.filter(user => user.position == "data_entry_operator").map((user, index) => (
                            <div key={user._id} className="general-card">
                                <div className="blue-label-box">
                                    <span>{index+1}</span>
                                </div>
                                <div className="general-card-main-block">
                                    <p style={{"margin": "0px 0px 5px 0px"}}><strong>Name:</strong> {user.name}</p>
                                    <p style={{"margin": "0px 0px 5px 0px"}}><strong>Email:</strong> {user.email}</p>
                                    <p style={{"margin": "0px 0px 5px 0px"}}><strong>Phone:</strong> {user.phone}</p>
                                    <p style={{"margin": "0px 0px 5px 0px"}}><strong>Position:</strong> {user.position}</p>
                                </div>
                                <div className="general-card-button-container">
                                    <Link to={`/users/${user._id}`}>
                                        <button className="small-button">
                                            View Details
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )) ) : <div style={{"textAlign": "center", "width": "100%"}}>No site managers found</div>
                    )
                }
            </div>
        </div>
    )
}

function Admins({ users, queryStatus }) {
    return (
        <div className="container">
            <div className="blue-label">
                Admins
            </div>
            <div className="container-main-block">
                {
                    queryStatus.isLoading ? <div style={{"textAlign": "center", "width": "100%"}}>Loading...</div> : (
                        users && users.length > 0 ? (
                        users.filter(user => user.position == "admin").map((user, index) => (
                            <div key={user._id} className="general-card">
                                <div className="blue-label-box">
                                    <span>{index+1}</span>
                                </div>
                                <div className="general-card-main-block">
                                    <p style={{"margin": "0px 0px 5px 0px"}}><strong>Name:</strong> {user.name}</p>
                                    <p style={{"margin": "0px 0px 5px 0px"}}><strong>Email:</strong> {user.email}</p>
                                    <p style={{"margin": "0px 0px 5px 0px"}}><strong>Phone:</strong> {user.phone}</p>
                                    <p style={{"margin": "0px 0px 5px 0px"}}><strong>Position:</strong> {user.position}</p>
                                </div>
                                <div className="general-card-button-container">
                                    <Link to={`/users/${user._id}`}>
                                        <button className="small-button">
                                            View Details
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )) ) : <div style={{"textAlign": "center", "width": "100%"}}>No site managers found</div>
                    )
                }
            </div>
        </div>
    )
}


function UserContainer({ user }) {
    const [users, setUsers] = React.useState("")

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
        <>  
            <ProjectManagers users={users} queryStatus={{isLoading, error, data}} />
            <SiteManagers users={users} queryStatus={{isLoading, error, data}} />
            <DataEntryOperators users={users} queryStatus={{isLoading, error, data}} />
            <Admins users={users} queryStatus={{isLoading, error, data}} />
        </>
    )
}

export default function Users() {
    const { user } = useAuthContext()

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Navbar pageName="users" />
                <main>
                    <div className="page-route">/ Users { user.position == "admin" ? <Link to="/users/new-user"><button style={{"marginLeft": "1rem"}} className="small-button">New</button></Link> : "" }</div>
                    <UserContainer user={user} />
                </main>
            </QueryClientProvider>
        </>
    )
}
