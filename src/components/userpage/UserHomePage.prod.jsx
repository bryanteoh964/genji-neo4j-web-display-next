import { useState, useEffect } from 'react';
import { Edit, Save, X, User, Calendar, Mail, MapPin, Link as LinkIcon, MessageSquare, Heart, BookOpen } from 'lucide-react';
import Link from 'next/link';
import styles from '../../styles/pages/userHomePage.module.css';

export default function UserHomePage({ userid }) {
    const [user, setUser] = useState(null);
    const [userComments, setUserComments] = useState([]);
    const [userContributions, setUserContributions] = useState([]);
    const [userFavorites, setUserFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        bio: '',
        location: '',
        website: '',
        displayName: ''
    });

    // Fetch user's basic information
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Get basic user info
                const response = await fetch(`/api/user/any?userid=${userid}`);
                if(!response.ok) {
                    throw new Error('Failed to fetch user homepage info');
                }
                const data = await response.json();
                setUser(data);
                
                // Initialize profile with existing data if available
                setProfile({
                    bio: data.bio || '',
                    location: data.location || '',
                    website: data.website || '',
                    displayName: data.displayName || data.name || ''
                });

                // Check if current logged-in user is viewing their own profile
                const currentUserResponse = await fetch('/api/user/me');
                if (currentUserResponse.ok) {
                    const currentUser = await currentUserResponse.json();
                    setIsCurrentUser(currentUser._id === userid);
                }
            } catch (error) {
                setError(error.message);
            }
        };

        fetchUserData();
    }, [userid]);

    // Fetch user's comments
    useEffect(() => {
        const fetchUserComments = async () => {
            try {
                const response = await fetch(`/api/user/comments?userid=${userid}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserComments(data.comments || []);
                }
            } catch (error) {
                console.error('Failed to fetch user comments:', error);
            }
        };

        if (user) {
            fetchUserComments();
        }
    }, [user, userid]);

    // Fetch user's contributions
    useEffect(() => {
        const fetchUserContributions = async () => {
            try {
                const response = await fetch(`/api/user/contributions?userid=${userid}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserContributions(data.contributions || []);
                }
            } catch (error) {
                console.error('Failed to fetch user contributions:', error);
            }
        };

        if (user) {
            fetchUserContributions();
        }
    }, [user, userid]);

    // Fetch user's favorite poems
    useEffect(() => {
        const fetchUserFavorites = async () => {
            try {
                const response = await fetch(`/api/user/favorites?userid=${userid}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserFavorites(data.favorites || []);
                }
            } catch (error) {
                console.error('Failed to fetch user favorites:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchUserFavorites();
        }
    }, [user, userid]);

    // Handle updating profile information
    const handleProfileUpdate = async () => {
        try {
            const response = await fetch('/api/user/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bio: profile.bio,
                    location: profile.location,
                    website: profile.website,
                    displayName: profile.displayName
                }),
            });

            if (response.ok) {
                // Update the user state with the new information
                setUser(prevUser => ({
                    ...prevUser,
                    bio: profile.bio,
                    location: profile.location,
                    website: profile.website,
                    displayName: profile.displayName
                }));
                setIsEditing(false);
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    if (loading) return <div className={styles.loading}>Loading user information...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;
    if (!user) return <div className={styles.noUser}>No user found</div>;

    return (
        <div className={styles.userHomePage}>
            <div className={styles.profileHeader}>
                <div className={styles.avatarSection}>
                    {user.image ? (
                        <img 
                            src={user.image} 
                            alt={`${user.name}'s profile`} 
                            className={styles.avatar}
                        />
                    ) : (
                        <div className={styles.avatarPlaceholder}>
                            <User size={60} />
                        </div>
                    )}
                </div>
                <div className={styles.userInfo}>
                    {isEditing ? (
                        <div className={styles.editNameSection}>
                            <input
                                type="text"
                                value={profile.displayName}
                                onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                                className={styles.nameInput}
                                placeholder="Display Name"
                            />
                        </div>
                    ) : (
                        <h1 className={styles.userName}>
                            {user.displayName || user.name || user.email}
                        </h1>
                    )}
                    
                    <div className={styles.userMeta}>
                        <span className={styles.joinDate}>
                            <Calendar size={16} />
                            Joined {formatDate(user.createdAt)}
                        </span>
                        {user.email && (
                            <span className={styles.userEmail}>
                                <Mail size={16} />
                                {user.email}
                            </span>
                        )}
                    </div>
                    
                    {isEditing ? (
                        <div className={styles.editProfile}>
                            <div className={styles.formGroup}>
                                <label>Bio</label>
                                <textarea
                                    value={profile.bio}
                                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                                    placeholder="Tell something about yourself"
                                    className={styles.bioInput}
                                />
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Location</label>
                                    <input
                                        type="text"
                                        value={profile.location}
                                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                                        placeholder="Location"
                                        className={styles.locationInput}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Website</label>
                                    <input
                                        type="text"
                                        value={profile.website}
                                        onChange={(e) => setProfile({...profile, website: e.target.value})}
                                        placeholder="Website"
                                        className={styles.websiteInput}
                                    />
                                </div>
                            </div>
                            <div className={styles.editActions}>
                                <button 
                                    onClick={handleProfileUpdate}
                                    className={styles.saveButton}
                                >
                                    <Save size={16} />
                                    Save
                                </button>
                                <button 
                                    onClick={() => {
                                        setIsEditing(false);
                                        // Reset form to original values
                                        setProfile({
                                            bio: user.bio || '',
                                            location: user.location || '',
                                            website: user.website || '',
                                            displayName: user.displayName || user.name || ''
                                        });
                                    }}
                                    className={styles.cancelButton}
                                >
                                    <X size={16} />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.profileDetails}>
                            {user.bio && <p className={styles.userBio}>{user.bio}</p>}
                            
                            <div className={styles.additionalInfo}>
                                {user.location && (
                                    <span className={styles.userLocation}>
                                        <MapPin size={16} />
                                        {user.location}
                                    </span>
                                )}
                                {user.website && (
                                    <a 
                                        href={user.website.startsWith('http') ? user.website : `https://${user.website}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={styles.userWebsite}
                                    >
                                        <LinkIcon size={16} />
                                        {user.website}
                                    </a>
                                )}
                            </div>
                            
                            {isCurrentUser && (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className={styles.editButton}
                                >
                                    <Edit size={16} />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            <div className={styles.contentSection}>
                <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <MessageSquare size={20} />
                        <span className={styles.statValue}>{userComments.length}</span>
                        <span className={styles.statLabel}>Comments</span>
                    </div>
                    <div className={styles.statCard}>
                        <BookOpen size={20} />
                        <span className={styles.statValue}>{userContributions.length}</span>
                        <span className={styles.statLabel}>Contributions</span>
                    </div>
                    <div className={styles.statCard}>
                        <Heart size={20} />
                        <span className={styles.statValue}>{userFavorites.length}</span>
                        <span className={styles.statLabel}>Favorites</span>
                    </div>
                </div>

                <div className={styles.tabsContainer}>
                    <div className={styles.tabContent}>
                        <h2 className={styles.sectionTitle}>Recent Comments</h2>
                        {userComments.length === 0 ? (
                            <p className={styles.emptyState}>No comments yet</p>
                        ) : (
                            <div className={styles.commentsList}>
                                {userComments.slice(0, 5).map(comment => (
                                    <div key={comment._id} className={styles.commentCard}>
                                        <div className={styles.commentContent}>
                                            <p className={styles.commentText}>{comment.content}</p>
                                            <div className={styles.commentMeta}>
                                                <span className={styles.commentDate}>
                                                    {formatDate(comment.createdAt)}
                                                </span>
                                                <Link 
                                                    href={`/poems/${comment.pageType === 'poem' ? comment.identifier.replace('-', '/') : comment.identifier}`}
                                                    className={styles.commentLink}
                                                >
                                                    View Post
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {userComments.length > 5 && (
                                    <Link href={`/user/${userid}/comments`} className={styles.viewAllLink}>
                                        View all comments
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={styles.tabContent}>
                        <h2 className={styles.sectionTitle}>Contributions</h2>
                        {userContributions.length === 0 ? (
                            <p className={styles.emptyState}>No contributions yet</p>
                        ) : (
                            <div className={styles.contributionsList}>
                                {userContributions.slice(0, 5).map(contribution => (
                                    <div key={contribution._id} className={styles.contributionCard}>
                                        <div className={styles.contributionContent}>
                                            <h3 className={styles.contributionTitle}>
                                                {contribution.pageType.charAt(0).toUpperCase() + contribution.pageType.slice(1)}
                                            </h3>
                                            <Link 
                                                href={`/${contribution.pageType}/${contribution.identifier}`}
                                                className={styles.contributionLink}
                                            >
                                                {contribution.identifier}
                                            </Link>
                                            <span className={styles.contributionDate}>
                                                {formatDate(contribution.date)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {userContributions.length > 5 && (
                                    <Link href={`/user/${userid}/contributions`} className={styles.viewAllLink}>
                                        View all contributions
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={styles.tabContent}>
                        <h2 className={styles.sectionTitle}>Favorite Poems</h2>
                        {userFavorites.length === 0 ? (
                            <p className={styles.emptyState}>No favorite poems yet</p>
                        ) : (
                            <div className={styles.favoritesList}>
                                {userFavorites.slice(0, 5).map(favorite => (
                                    <Link 
                                        key={favorite.poemId}
                                        href={`/poems/${favorite.chapterNum}/${favorite.poemNum}`}
                                        className={styles.favoriteCard}
                                    >
                                        <div className={styles.favoriteContent}>
                                            <h3 className={styles.favoriteTitle}>
                                                Chapter {favorite.chapterNum}, Poem {favorite.poemNum}
                                            </h3>
                                            <div className={styles.japaneseText}>
                                                {favorite.japanese && 
                                                    favorite.japanese.split('\n').map((line, index) => (
                                                        <p key={`line-${index}`} className={styles.japaneseLine}>
                                                            {line}
                                                        </p>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                {userFavorites.length > 5 && (
                                    <Link href={`/user/${userid}/favorites`} className={styles.viewAllLink}>
                                        View all favorites
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}