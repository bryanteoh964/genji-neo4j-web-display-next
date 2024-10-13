'use client'
import { useState, useEffect } from 'react'
import { signOut } from "next-auth/react"

const UserInfo = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInCache = localStorage.getItem('userData');
        if (userInCache) {
          const userData = JSON.parse(userInCache);
          setUser(userData);
          setNewUsername(userData.username || '');
          setLoading(false)
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

    fetchUserData();
    refreshData();
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
        setNewUsername(data.username || '');
    } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
  }

  // func to update username
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/update/username', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newUsername }),
      })

    if (response.ok) {
      const updatedUser = { ...user, name: newUsername };
      setUser(updatedUser)
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      setIsEditing(false);
      alert('Username updated successfully');
    } else {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to update username: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to update username', error)
    setError(error.message || 'Failed to update username. Please try again.');
  }
};

  const handleUsernameChange = (e) => {
    setNewUsername(e.target.value);
  }

  if (loading) return <div>Loading user information...</div>
  if (error) return <div>Error: {error}</div>
  if (!user) return <div>No user found</div>

  return (
    <div>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            id="username"
            type="text"
            value={newUsername}
            onChange={handleUsernameChange}
          />
          <div>
            <button type="submit">Save</button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false)
                setNewUsername(user.username || '')
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <p>Username: {user.name || 'Not set'}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}

      <p>Email: {user.email}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={refreshData}>Refresh Data</button>
      <button onClick={() => signOut({ callbackUrl: '/' })}>Log out</button>
    </div>
  )
}

export default UserInfo