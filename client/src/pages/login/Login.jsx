import React, { useState } from "react"
import { useLogin } from "../../hooks/useLogin"
import "./Login.css"

export default function Login () {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { login, isLoading, error } = useLogin()
    
    function handleEmail(e) {
        setEmail(e.target.value)
    }

    function handlePassword(e) {
        setPassword(e.target.value)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        await login(email, password)
    }

    return (
        <div className="form-container">
            <form className="card" onSubmit={handleSubmit}>
                <h1>BricksPIR</h1>
                <input type="email" name="email" className="input-fields" value={email} placeholder="Enter your email" onChange={handleEmail} required/>
                <input type="password" name="password" className="input-fields" value={password} placeholder="Enter your password" onChange={handlePassword} required />
                <button className="login-button" disabled={isLoading}>Login</button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    )
}