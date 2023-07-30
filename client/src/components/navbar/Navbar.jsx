import React, { useReducer, useState } from "react"
import { useLogout } from '../../hooks/useLogout'
import { Link } from "react-router-dom"
import { useAuthContext } from "../../hooks/useAuthContext"
import './navbar.css'

export default function Navbar (props) {
    const { logout } = useLogout()
    const { user } = useAuthContext()
    const selected = props.pageName

    function handleLogout(event) {
        logout()
    }
    
    return (
        <nav>
            <div className="top">
                <div className="logo">BricksPIR</div>
                <hr />
                <ul>
                    {/* <Link to='/' className="link-styling"><li id="dashboard" className={selected === "dashboard" ? "selected nav-option" : "nav-option"}>Dashboard</li></Link> */}
                    <Link to='/projects' className="link-styling"><li id="projects" className={selected === "projects" ? "selected nav-option" : "nav-option"}>Projects</li></Link>
                    <Link to='/reports' className="link-styling"><li id="reports" className={selected === "reports" ? "selected nav-option" : "nav-option"}>Reports</li></Link>
                    <Link to='/profile' className="link-styling"><li id="profile" className={selected === "profile" ? "selected nav-option" : "nav-option"}>Profile</li></Link>
                    {
                        user.position === "admin" ? 
                        <>
                            <hr className="navbar-break" />
                            <Link to='/equipments' className="link-styling"><li id="equipments" className={selected === "equipments" ? "selected nav-option" : "nav-option"}>Equipments</li></Link>
                            <Link to='/users' className="link-styling"><li id="equipments" className={selected === "users" ? "selected nav-option" : "nav-option"}>Users</li></Link>
                        </>
                        :
                        ""
                    }
                </ul>
            </div>
            <div className="bottom">
                Logged in as:
                <p style={{"margin": "3px 0px"}}><strong>{user.name}</strong></p>
                <button className="small-button" style={{"borderRadius": "5px", "marginBottom": "0px"}} onClick={handleLogout}>Log out</button>
            </div>
        </nav>
    )
}