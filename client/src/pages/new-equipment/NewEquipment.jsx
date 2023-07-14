import React, { useState, useEffect } from "react"
import { useAuthContext } from "./../../hooks/useAuthContext"
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

const queryClient = new QueryClient()

export default function NewEquipment() {
    const { user } = useAuthContext()
    

    function handleSubmit(e) {
        e.preventDefault();

        const reportDocument = {
            ...report
        }

        const submitReport = async () => {
            const response = await fetch(`${ import.meta.env.VITE_API_URL || '' }/api/reports/start-new-report`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(reportDocument)
            })

            if (response.ok) {
                window.location.replace('/reports')
            }
        }

        submitReport()
    }
    
    return (
        <QueryClientProvider client={queryClient}>
            <Navbar pageName="equipments" />
            <main>
                <div className="page-route">/ Equipments / New </div>
                
            </main>
        </QueryClientProvider>
    )
}