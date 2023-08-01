import React from "react";
import { Link } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

import { useAuthContext } from "../../hooks/useAuthContext";
import Navbar from "../../components/navbar/Navbar";

const queryClient = new QueryClient();

function UserContainer({ user }) {
    const [users, setUsers] = React.useState("");

    const fetchUsersData = async () => {
        const arr = window.location.href.split("/");
        const user_id = arr[arr.length - 1];

        const response = await fetch(
            `${
                import.meta.env.VITE_API_URL || ""
            }/api/users/get-user/${user_id}`,
            {
                headers: { Authorization: `Bearer ${user.token}` },
            }
        );
        return response.json();
    };

    function setData(data) {
        setUsers({ ...data.user_details._doc });
    }

    const { isLoading, error, data } = useQuery({
        queryKey: "users",
        queryFn: fetchUsersData,
        onSuccess: setData,
    });

    return (
        <>
            <div className="container">
                <div className="blue-label">User Details</div>
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        <div
                            className="container-main-block"
                            style={{ width: "100%" }}
                        >
                            <div className="text-field-block">
                                <div className="text-label">System ID</div>
                                <div className="text-field">{users._id}</div>
                            </div>
                        </div>

                        <div
                            className="container-main-block"
                            style={{ width: "100%" }}
                        >
                            <div className="text-field-block">
                                <div className="text-label">Name</div>
                                <div className="text-field">{users.name}</div>
                            </div>
                        </div>

                        <div
                            className="container-main-block"
                            style={{ width: "100%" }}
                        >
                            <div className="text-field-block">
                                <div className="text-label">Email</div>
                                <div className="text-field">{users.email}</div>
                            </div>
                        </div>

                        <div
                            className="container-main-block"
                            style={{ width: "100%" }}
                        >
                            <div className="text-field-block">
                                <div className="text-label">Position</div>
                                <div className="text-field">
                                    {users.position}
                                </div>
                            </div>
                        </div>

                        <div
                            className="container-main-block"
                            style={{ width: "100%" }}
                        >
                            <div className="text-field-block">
                                <div className="text-label">Access</div>
                                <div className="text-field">
                                    {users.access && users.access.length > 0
                                        ? users.access.map((id, index) => (
                                            <>
                                            {index+1}. <Link to={`/projects/${id}`}>
                                                  {id}
                                                  <br />
                                              </Link>
                                            </>
                                          ))
                                        : user.position == "admin" ? "Privileged account. Unrestricted access." : "No access"}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default function UserPage() {
    const { user } = useAuthContext();

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Navbar pageName="users" />
                <main>
                    <div className="page-route">
                        / Users{" "}
                        {user.position == "admin" ? (
                            <Link to="/users/new-user">
                                <button
                                    style={{ marginLeft: "1rem" }}
                                    className="small-button"
                                >
                                    New
                                </button>
                            </Link>
                        ) : (
                            ""
                        )}
                    </div>
                    <UserContainer user={user} />
                </main>
            </QueryClientProvider>
        </>
    );
}
