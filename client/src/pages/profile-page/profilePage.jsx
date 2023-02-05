import React, { useState } from "react"
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { useAuthContext } from "./../../hooks/useAuthContext"

import Navbar from "./../../components/navbar/Navbar"

const queryClient = new QueryClient()

function ProjectComponent() {
    const { user } = useAuthContext()
    const [profile, setProfile] = useState("")

    async function fetchProfileData() {
        const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/users/profile`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        return response.json()
    }

    function setProfileData(data) {
        setProfile({...data.user_details._doc})
    }

    const { isLoading, data, error } = useQuery({
        queryKey: 'profile',
        queryFn: fetchProfileData,
        onSuccess: setProfileData
    })

    return (
        <>
            {
                isLoading ? "Loading..." : (
                    <>
                        {
                            profile && (
                                <>
                                    <div className="container">
                                        <div className="blue-label">
                                            Profile
                                        </div>
                                        <div className="container-main-block" style={{"width": "100%"}}>
                                            <div className="text-field-block">
                                                <div className="text-label">Name</div>
                                                <div className="text-field">{profile.name}</div>
                                            </div>
                                        </div>

                                        <div className="container-main-block" style={{"width": "100%"}}>
                                            <div className="text-field-block">
                                                <div className="text-label">Email</div>
                                                <div className="text-field">{profile.email}</div>
                                            </div>
                                        </div>

                                        <div className="container-main-block" style={{"width": "30%"}}>
                                            <div className="text-field-block">
                                                <div className="text-label">Position</div>
                                                <div className="text-field">{profile.position}</div>
                                            </div>
                                        </div>

                                        <div className="container-main-block" style={{"width": "30%"}}>
                                            <div className="text-field-block">
                                                <div className="text-label">Access</div>
                                                <div className="text-field">{profile.access.map(item => <>{item}<br /></>)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        }
                    </>
                )
            }
        </>
    )
}

export default function Profile() {
    return (
        <QueryClientProvider client={queryClient}>
            <Navbar pageName="profile" />
            <main>
            <div className="page-route">/ Profile </div>
                <ProjectComponent />
            </main>
        </QueryClientProvider>
    )
}