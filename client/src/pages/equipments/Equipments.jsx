import React from "react"

import Navbar from "../../components/navbar/Navbar"

import { useAuthContext } from "../../hooks/useAuthContext"
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Link } from "react-router-dom"

export default function Equipments() {
    const { user } = useAuthContext()

    return (
        <>
            <Navbar pageName="equipments" />
            <main>
                <div className="page-route">/ Equipments </div>
                <div className="container">
                    <div className="blue-label">Equipments</div>

                    Equipments page

                </div>
            </main>
        </>
    )
}