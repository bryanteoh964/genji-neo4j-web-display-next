'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { UserSearch } from 'lucide-react';
import styles from '../../styles/pages/userView.module.css';

export default function UserView() {
    const [role, setRole] = useState('');
    const { data: session } = useSession();
    const [userList, setUserList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (session?.user?.role) {
            setRole(session.user.role);
        }

        const fetchUserList = async () => {
            try {
                const response = await fetch('/api/user/list');
                if (response.ok) {
                    const data = await response.json();
                    setUserList(data.users);
                    setSearchTerm('');
                }
            } catch (error) {
                console.error('Failed to load user list:', error);
            }
        }

        fetchUserList();
    }, [session]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    const filteredUsers = userList.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.googleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderUserNames = (user) => (
        <div className={styles.namesContainer}>
            {user.name && <span className={styles.userName}>{user.name}</span>}
            {user.googleName && <span className={styles.googleName}>Google: {user.googleName}</span>}
        </div>
    );

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>User Management</h1>
                <div className={styles.roleTag}>Role: {role}</div>
            </div>

            <div className={styles.searchSection}>
                <div className={styles.searchInputContainer}>
                    <UserSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>    

                {searchTerm && (
                    <div className={styles.searchResults}>
                        {filteredUsers.map((user) => (
                            <div key={user._id} className={styles.searchResultItem}>
                                <div className={styles.userBasicInfo}>
                                    {user.image && (
                                        <img
                                            src={user.image}
                                            alt={user.name || user.googleName}
                                            className={styles.avatar}
                                        />
                                    )}
                                    <div className={styles.userDetails}>
                                        <Link href={`/user-home-page/${user._id}`}>
                                            {renderUserNames(user)}
                                            <span className={styles.userEmail}>{user?.email}</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.container}>
                <div className={styles.userGrid}>
                    {userList.map((user) => (
                        <Link key={user._id} href={`/user-home-page/${user._id}`} className={styles.userCard}>
                            <div className={styles.userHeader}>
                                {user?.image ? (
                                    <img
                                        src={user.image}
                                        alt={user.name || user.googleName}
                                        className={styles.avatar}
                                    />
                                ) : (
                                    <div className={styles.avatarPlaceholder}>
                                        {(user?.name || user?.googleName || 'U')[0].toUpperCase()}
                                    </div>
                                )}
                                <div className={styles.userInfo}>
                                    {renderUserNames(user)}
                                    <p className={styles.userEmail}>{user?.email}</p>
                                </div>
                            </div>
                            <div className={styles.userStats}>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Joined:</span>
                                    <span className={styles.statValue}>{formatDate(user?.createdAt)}</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Last Login:</span>
                                    <span className={styles.statValue}>{formatDate(user?.lastLogIn)}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}