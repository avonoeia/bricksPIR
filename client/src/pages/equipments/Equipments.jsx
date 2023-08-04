import React, { useState, useEffect } from "react"

import { useAuthContext } from "../../hooks/useAuthContext"
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Link } from "react-router-dom"

import Navbar from "../../components/navbar/Navbar"

const queryClient = new QueryClient()

function EquipmentsContainer() {
    const { user } = useAuthContext()
    const [equipments, setEquipments] = useState("")

    const fetchEquipmentsData = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/equipments/`, {
            headers: {'Authorization': `Bearer ${user.token}`},
        })
        return response.json()
    }

    function setData(data) {
        setEquipments([...data.equipments_list])
    }

    const { isLoading, error, data } = useQuery({
        queryKey: "equipments",
        queryFn: fetchEquipmentsData,
        onSuccess: setData
    })

    return (
        <>
        {
            isLoading ? "Loading..." : (
                <>
                    <div className="container">
                        <div className="blue-label">
                            Equipments
                        </div>
                        <div className="container-main-block">
                            {   
                                equipments &&
                                equipments.map((equipment, index) => (
                                    <div key={equipment._id} className="general-card">
                                        <div className="blue-label-box">
                                            {index+1}
                                        </div>
                                        <div className="general-card-main-block">
                                            <p style={{"margin": "0px 0px 5px 0px"}}><strong>ID:</strong> {equipment.id}</p>
                                            <p style={{"margin": "0px 0px 5px 0px"}}><strong>Category:</strong> {equipment.category}</p>
                                            <p style={{"margin": "0px 0px 5px 0px"}}><strong>Status:</strong> {equipment.status}</p>
                                            <p style={{"margin": "0px 0px 5px 0px"}}><strong>Current Location:</strong> {equipment.current_location.project_name}</p>
                                        </div>
                                        <div className="general-card-button-container">
                                            <Link to={`/equipments/${equipment._id}`}>
                                                <button className="small-button">
                                                    View Details
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </>
            )
        }
        </>
    )
}

export default function Equipments() {
    const { user } = useAuthContext()

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Navbar pageName="equipments" />
                <main>
                    <div className="page-route">/ Equipments { user.position == "admin" ? <Link to="/equipments/new-equipment"><button style={{"marginLeft": "1rem"}} className="small-button">New</button></Link> : "" }</div>
                    <EquipmentsContainer />
                </main>
            </QueryClientProvider>
        </>
    )
}