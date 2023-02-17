import React from "react"
import { Link } from "react-router-dom"

export default function LoginError() {
    return (
        <div>
            You have to be logged in to be able to view this page.
            <Link to='/login'>
                <button className="small-button" style={{"display": "block", "margin": "20px auto"}}>Login</button>
            </Link>
        </div>
    )
}