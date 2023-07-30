import React from "react";
import { Link } from "react-router-dom"

import { useAuthContext } from "../../hooks/useAuthContext"
import Navbar from "../../components/navbar/Navbar"

export default function Users() {
    const { user } = useAuthContext()
    return (
        <>
                <Navbar pageName="users" />
                <main>
                    <div className="page-route">/ Users { user.position == "admin" ? <Link to="/equipments/new-equipment"><button style={{"marginLeft": "1rem"}} className="small-button">New</button></Link> : "" }</div>
                </main>
        </>
    )
}
