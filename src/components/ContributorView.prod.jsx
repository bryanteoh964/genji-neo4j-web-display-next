import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { UsersRound, UserSearch } from 'lucide-react';
import Link from 'next/link';
import styles from '../styles/pages/ContributorView.module.css';

const ContributorView = ({ pageType, identifier }) => {
const { data: session } = useSession();
const [contributors, setContributors] = useState([]);
const [userList, setUserList] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

// fetch contributors when contributors change
useEffect(() => {
  const fetchContributors = async () => {
      try {
        const response = await fetch(`/api/contributor/get?pageType=${pageType}&identifier=${identifier}`);
        if (response.ok) {
          const data = await response.json();
          setContributors(data.contributor);
        }
      } catch (error) {
        setError('Failed to load contributors');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContributors();
}, [pageType, identifier]);

// fetch user list for admin search (only when modal is opened)
// use email and name to search
useEffect(() => {
    const fetchUserList = async () => {
        try {
          const response = await fetch('/api/user/list');
          if (response.ok) {
            const data = await response.json();
            setUserList(data.users);
          }
        } catch (error) {
          setError('Failed to load user list');
        }
    };

    fetchUserList();
}, [session?.user?.role]);

const handleAddContributor = async (userId) => {
    try {
      const response = await fetch('/api/contributor/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageType, identifier, userId }),
      });

      if (response.ok) {
        // Refresh contributor list
        const updatedResponse = await fetch(`/api/contributor/get?pageType=${pageType}&identifier=${identifier}`);
        const data = await updatedResponse.json();
        setContributors(data.contributor);
        setSearchTerm('');
      }
    } catch (error) {
      setError('Failed to add contributor');
    }
};

const handleRemoveContributor = async (userId) => {
    try {
      const response = await fetch('/api/contributor/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageType, identifier, userId }),
      });

      if (response.ok) {
        setContributors(contributors.filter(c => c.contributor !== userId));
      }
    } catch (error) {
      setError('Failed to remove contributor');
    }
};

const filteredUsers = userList.filter(user => 
    (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.googleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    !contributors.some(c => c.contributor === user._id)
);

if (isLoading) return <div>Loading...</div>;
if (error) return <div className={styles.error}>{error}</div>;

return (
    <div className={styles.container}>
      <ul className={styles.contributorViewContainer}>
        {contributors.map((contributor) => {
          const user = userList.find(u => u._id === contributor.contributor);
            return (
              <li key={contributor.contributor} className={styles.contributorItem}>
                <Link href={`/userhomepage/${contributor.contributor}`} className={styles.contributorLink}>
                  {user?.image && (
                    <img
                      src={user.image}
                      alt={user.name}
                      className={styles.avatar}
                    />
                  )}
                  <span>{user?.name || user?.email || contributor.contributor}</span>
                </Link>
                {session?.user?.role === 'admin' && (
                  <button
                    onClick={() => handleRemoveContributor(contributor.contributor)}
                    className={styles.removeButton}
                  >
                    Remove
                  </button>
                )}
              </li>
          );
        })}
      </ul>
            
      {session?.user?.role === 'admin' && (
        <div className={styles.contributorSearchSection}>
          <div className={styles.contributorSearchInputContainer}>
            <UserSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.contributorSearchInput}
            />
          </div>
          
          {searchTerm && (
            <ul className={styles.contributorSearchResults}>
              {filteredUsers.map((user) => (
                <li
                  key={user._id}
                  className={styles.contributorSearchResultItem}
                  onClick={() => handleAddContributor(user._id)}
                >
                  <div className={styles.userInfo}>
                    {user.image && (
                      <img
                        src={user.image}
                        alt={user.name}
                        className={styles.avatar}
                      />
                    )}
                    <span>{user.name || user.email}</span>
                  </div>
                  <button className={styles.addButton}>Add</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ContributorView;