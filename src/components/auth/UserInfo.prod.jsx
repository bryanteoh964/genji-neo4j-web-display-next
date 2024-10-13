'use client'
import { useState, useEffect } from 'react'
import { signOut } from "next-auth/react"

const UserInfo = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInCache = localStorage.getItem('userData');
        if (userInCache) {
            setUser(JSON.parse(userInCache));
            setLoading(false);
            return;
        }

        const response = await fetch('api/user');
        if(!response.ok) {
            throw new Error('failed to fetch user info');
        }
        const data = await response.json();

        localStorage.setItem('userData', JSON.stringify(data));
        setUser(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData()
  }, [])

  // func to refesh user info
  const refreshData = async () => {
    setLoading(true);
    try {
        const response = await fetch('api/user');
        if(!response.ok) {
            throw new Error('failed to fetch user info');
        }
        const data = await response.json();
        localStorage.setItem('userData', JSON.stringify(data));
        setUser(data);
    } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
  }

  if (loading) return <div>Loading user information...</div>
  if (error) return <div>Error: {error}</div>
  if (!user) return <div>No user found</div>

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <button onClick={refreshData}>Refresh Data</button>
      <button onClick={() => signOut({ callbackUrl: '/' })}>Log out</button>
    </div>
  )
}

export default UserInfo