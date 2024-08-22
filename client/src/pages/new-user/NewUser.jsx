import React from "react"
import { useAuthContext } from "../../hooks/useAuthContext"

import Navbar from "../../components/navbar/Navbar"

export default function NewUser() {
    const { user } = useAuthContext()
    const [newUser, setNewUser] = React.useState({
        name: "",
        position: "",
        email: "",
        phone: "",
        access: [],
        password: ""
    })
    const [message, setMessage] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    console.log(isLoading)

    async function handleSubmit(e) {
        e.preventDefault()
        setIsLoading(true)
        setMessage("Loading...")
        await fetch(`${import.meta.env.VITE_API_URL || ""}/api/users/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify(newUser)
        })
            .then(res => res.json())
            .then(data => {
                setMessage(data.message)
                setIsLoading(false)
                setNewUser({
                    name: "",
                    position: "",
                    email: "",
                    phone: "",
                    access: [],
                    password: ""
                })
            })
    }

    return (
        <div>
            <Navbar pageName="users" />
            <main>
                <div className="page-route">/ Users / New User</div>
                <div className="container">
                    <div className="blue-label">New User</div>
                    <form className="container-main-block" onSubmit={handleSubmit}>

                        <div className="input-field-block" style={{width: "100%"}}>
                            <label htmlFor="Name">Name <span style={{color: "red"}}>*</span></label>
                            <input 
                                type="text" 
                                name="name"
                                id="Name"
                                value={newUser.name}
                                onChange={(e) => setNewUser(prevUser => ({...prevUser, [e.target.name]: e.target.value}))} 
                                required={true}
                            />
                        </div>

                        <div className="input-field-block" style={{width: "100%"}}>
                            <label htmlFor="Email">Email <span style={{color: "red"}}>*</span></label>
                            <input 
                                type="email"
                                name="email" 
                                id="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser(prevUser => ({...prevUser, [e.target.name]: e.target.value}))} 
                                required={true}
                            />
                        </div>

                        <div className="input-field-block" style={{width: "100%"}}>
                            <label htmlFor="Email">Phone</label>
                            <input 
                                type="phone"
                                name="phone" 
                                id="phone"
                                value={newUser.phone}
                                onChange={(e) => setNewUser(prevUser => ({...prevUser, [e.target.name]: e.target.value}))} 
                            />
                        </div>
                            
                            {/* Users position guide */}
                            <div className="text-field-block" style={{width: "40%", padding: "10px", border: "1px solid #a3a3a3"}}>
                                <div className="text-label" style={{color: "rgb(103, 103, 240)"}}>User Guide</div>
                                <div className="text-field">
                                    <strong>Project Managers:</strong> These users must approve reports but cannot edit reports. <br />
                                    <strong>Site Managers:</strong> These users can create and edit reports. <br />
                                    <strong>Data Entry Operator:</strong> These users can only create reports. <br />
                                    <strong>Admin:</strong> Most privileged users. Have access to all projects and functionalities.
                                </div>
                            </div>

                        <div className="input-field-block" style={{width: "100%"}}>
                            <label htmlFor="Name">Position / Role <span style={{color: "red"}}>*</span></label>
                            <select 
                                className="input-field"
                                name="position"
                                id="position"
                                value={newUser.position}
                                onChange={(e) => setNewUser(prevUser => ({...prevUser, [e.target.name]: e.target.value}))} 
                                required={true}
                            >
                                <option value="" disabled>--- Select user position / role ---</option>
                                <option value="project_manager">Project Manager</option>
                                <option value="site_manager">Site Manager</option>
                                <option value="data_entry_operator">Date Entry Operator</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        
                        {!isLoading && <button disabled={isLoading} className="small-button" style={{"margin": "10px auto", display: "block"}}>Create</button>}
                        {
                            message && <div className="message" style={{ margin: "15px auto", "display": "block", width: "100%" }}>{message}</div>
                        }
                    </form>
                </div>
            </main>
        </div>
  )
}