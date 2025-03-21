'use client'
import { useState, useEffect } from 'react';
import { signOut } from "next-auth/react";
import styles from '../../styles/pages/userInfo.module.css';
import { useSession } from 'next-auth/react';

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInCache = localStorage.getItem('userData');
        if (userInCache) {
          const userData = JSON.parse(userInCache);
          setUser(userData);
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
  }, [])

  // func to refresh user info
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
    <div className={styles.userInfoContainer}>
      <div className={styles.infoSection}>
        <div className={styles.userInfo}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Username</span>
            <span className={styles.value}>{user.name || 'Not set'}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Email</span>
            <span className={styles.email_value}>{user.email}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>User Homepage</span>
            <a href={`/userhomepage/${user._id}`}>
              <span className={styles.email_value}>Edit More on Homepage</span>
            </a>
          </div>
        </div>
        
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