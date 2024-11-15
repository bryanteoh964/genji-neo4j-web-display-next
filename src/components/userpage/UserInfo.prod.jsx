'use client'
import { useState, useEffect } from 'react';
import { signOut } from "next-auth/react";
import styles from '../../styles/pages/userInfo.module.css';
import { useSession } from 'next-auth/react';

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const { data: session, update: updateSession } = useSession();

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

        const response = await fetch('api/user/me');
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
        const response = await fetch('api/user/me');
        if(!response.ok) {
            throw new Error('failed to fetch user info');
        }
        const data = await response.json();
        localStorage.setItem('userData', JSON.stringify(data));
        setUser(data);
        setNewUsername(data.username || '');

        await updateSession({
          ...session,
          user: {
            ...session.user,
            name: newUsername,
            role: data.role
          }
        });
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

      // update session username
      await updateSession({
        ...session,
        user: {
          ...session.user,
          name: newUsername
        }
      });

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
    <div className={styles.userInfoContainer}>
      <div className={styles.infoSection}>
        {isEditing ? (
          <form onSubmit={handleSubmit} className={styles.userForm}>
            <div className={styles.inputGroup}>
              <input
                id="username"
                type="text"
                value={newUsername}
                onChange={handleUsernameChange}
                className={styles.input}
                placeholder="Enter new username"
              />
            </div>
            <div className={styles.buttonGroup}>
            <button 
              type="submit" 
              className={`${styles.button} ${styles.primaryButton}`}
              // avoid empty input and no change
              disabled={!newUsername.trim() || newUsername.trim() === user.name}
            >
              Save
            </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setNewUsername(user.username || '')
                }}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.userInfo}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Username</span>
              <span className={styles.value}>{user.name || 'Not set'}</span>

              <button 
                onClick={() => setIsEditing(true)}
                className={styles.editButton}
              >
                Edit
              </button>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Email</span>
              <span className={styles.email_value}>{user.email}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Homepage</span>
              <a href={`/userhomepage/${user._id}`}>
                <span className={styles.email_value}>Homepage Link</span>
              </a>
            </div>
          </div>
        )}
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actionButtons}>
          <button 
            onClick={refreshData}
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            Refresh Data
          </button>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className={styles.logoutButton}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserInfo