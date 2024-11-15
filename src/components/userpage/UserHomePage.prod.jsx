import React, { useState, useEffect } from 'react';

export default function userHomePage({ userid }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/user/any?userid=${userid}`);
                if(!response.ok) {
                    throw new Error('failed to fetch user homepage info');
                }
                const data = await response.json();

                setUser(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchUserData();
    },[userid])

    if (loading) return <div>Loading user information...</div>
    if (error) return <div>Error: {error}</div>
    if (!user) return <div>No user found</div>

    return (
        <div>
            <span> UserName: </span>
            <span> {user.name} </span>
        </div>
    )

}