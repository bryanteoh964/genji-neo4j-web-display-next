import { useState, useEffect } from 'react';
import { Edit, Save, X, User, Calendar, Mail, MapPin, Link as LinkIcon, MessageSquare, Heart, BookOpen, Eye, EyeOff, Pencil, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import styles from '../../styles/pages/userHomePage.module.css';
import FormatContent from '../FormatText.prod';
import Pagination from '../Pagination.prod';

export default function UserHomePage({ userid }) {
    const { data: session } = useSession();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [activeTab, setActiveTab] = useState('comments');

    // const [sectionsVisible, setSectionsVisible] = useState({
    //     comments: true,
    //     contributions: true,
    //     favorites: true
    // });

    const [profile, setProfile] = useState({
        bio: '',
        location: '',
        occupation: '',
        displayName: ''
    });

    // Comments state
    const [userComments, setUserComments] = useState([]);
    const [commentsPage, setCommentsPage] = useState(1);
    const [commentsTotalPages, setCommentsTotalPages] = useState(1);
    const [commentsLoading, setCommentsLoading] = useState(true);

    // Contributions state
    const [userContributions, setUserContributions] = useState([]);
    const [contributionsPage, setContributionsPage] = useState(1);
    const [contributionsTotalPages, setContributionsTotalPages] = useState(1);
    const [contributionsLoading, setContributionsLoading] = useState(true);

    // Favorites state
    const [userFavorites, setUserFavorites] = useState([]);
    const [favoritesPage, setFavoritesPage] = useState(1);
    const [favoritesTotalPages, setFavoritesTotalPages] = useState(1);
    const [favoritesLoading, setFavoritesLoading] = useState(true);

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
                occupation: data.occupation || '',
                displayName: data.name || ''
            });

            // Check if current logged-in user is viewing their own profile
            if (session?.user) {
                const currentUserResponse = await fetch('/api/user/me');
                if (currentUserResponse.ok) {
                    const currentUser = await currentUserResponse.json();
                    setIsCurrentUser(currentUser._id === userid);
                }
            }
        } catch (error) {
            setError(error.message);
        }
    };

    // Fetch user's basic information
    useEffect(() => {
        fetchUserData();
    }, [userid, session]);

    // Fetch user's comments with pagination
    const fetchUserComments = async (page = 1) => {
        if (!session) return;
        
        try {
            const response = await fetch(`/api/user/getComments?userId=${userid}&page=${page}&limit=5`);
            if (response.ok) {
                const data = await response.json();
                setUserComments(data.comments || []);
                setCommentsPage(data.currentPage || 1);
                setCommentsTotalPages(data.totalPages || 1);
            }
        } catch (error) {
            console.error('Failed to fetch user comments:', error);
        } finally {
            setCommentsLoading(false);
        }
    };

    // Handle comments pagination
    const handleCommentsPageChange = (newPage) => {
        if (newPage < 1 || newPage > commentsTotalPages || newPage === commentsPage || commentsLoading) {
            return;
        }
        setCommentsPage(newPage);
        fetchUserComments(newPage);
    };

    // Fetch user's contributions with pagination
    const fetchUserContributions = async (page = 1) => {
        if (!session) return;
        
        try {
            const response = await fetch(`/api/user/getContributions?userId=${userid}&page=${page}&limit=8`);
            if (response.ok) {
                const data = await response.json();
                setUserContributions(data.contributions || []);
                setContributionsPage(data.currentPage || 1);
                setContributionsTotalPages(data.totalPages || 1);
            }
        } catch (error) {
            console.error('Failed to fetch user contributions:', error);
        } finally {
            setContributionsLoading(false);
        }
    };

    // Handle contributions pagination
    const handleContributionsPageChange = (newPage) => {
        if (newPage < 1 || newPage > contributionsTotalPages || newPage === contributionsPage || contributionsLoading) {
            return;
        }
        setContributionsPage(newPage);
        fetchUserContributions(newPage);
    };

    // Fetch user's favorite poems with pagination
    const fetchUserFavorites = async (page = 1) => {
        if (!session) return;
        
        try {
            const response = await fetch(`/api/user/getFavorites?userId=${userid}&page=${page}&limit=2`);
            if (response.ok) {
                const data = await response.json();
                setUserFavorites(data.favs || []);
                setFavoritesPage(data.currentPage || 1);
                setFavoritesTotalPages(data.totalPages || 1);
            }
        } catch (error) {
            console.error('Failed to fetch user favorites:', error);
        } finally {
            setFavoritesLoading(false);
        }
    };

    // Handle favorites pagination
    const handleFavoritesPageChange = (newPage) => {
        if (newPage < 1 || newPage > favoritesTotalPages || newPage === favoritesPage || favoritesLoading) {
            return;
        }
        setFavoritesPage(newPage);
        fetchUserFavorites(newPage);
    };

    // Init data fetching
    useEffect(() => {
        if (user) {
            if (session) {
                fetchUserComments();
                fetchUserContributions();
                fetchUserFavorites();
            }
            setLoading(false);
        }
    }, [user, session]);

    // Handle updating profile information
    const handleProfileUpdate = async () => {
        try {
            const response = await fetch('/api/user/updateProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bio: profile.bio,
                    location: profile.location,
                    occupation: profile.occupation,
                    displayName: profile.displayName,
                    userId: userid,
                    version: user.version || 0
                }),
            });

            if (response.ok) {
                // Update the user state with the new information
                setUser(prevUser => ({
                    ...prevUser,
                    bio: profile.bio,
                    location: profile.location,
                    occupation: profile.occupation,
                    displayName: profile.displayName
                }));
                setIsEditingProfile(false);
                alert('Profile updated successfully');
                fetchUserData();
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
            setIsEditingProfile(false);
            fetchUserData();
        }
    };

    // Toggle section visibility
    const toggleSectionVisibility = (section) => {
        setSectionsVisible(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
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

    // Render the login prompt for non-authenticated users
    const renderLoginPrompt = () => (
        <div className={styles.loginPromptContainer}>
            <div className={styles.loginPrompt}>
                <LogIn size={24} className={styles.loginIcon} />
                <h3>Sign in to view this content</h3>
                <p>Please sign in to see {user.name}&apos; comments, contributions, and favorite poems.</p>
                <div className={styles.loginActions}>
                    <Link href="/api/auth/signin" className={styles.signInButton}>
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );

    // Tab Navigation - accessible to logged-in users only
    const renderTabs = () => {
        if (!session) return null;
        
        return (
            <div className={styles.tabNav}>
                <button 
                    className={`${styles.tabButton} ${activeTab === 'comments' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('comments')}
                >
                    COMMENTS
                </button>
                <button 
                    className={`${styles.tabButton} ${activeTab === 'contributions' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('contributions')}
                >
                    CONTRIBUTIONS
                </button>
                <button 
                    className={`${styles.tabButton} ${activeTab === 'favorites' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('favorites')}
                >
                    FAVORITE POEMS
                </button>
            </div>
        );
    };

    return (
        <div className={styles.userHomePage}>
            {/* Top edit profile button (only visible for current user) */}
            {isCurrentUser && (
                <div className={styles.topEditButtonContainer}>
                    <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className={styles.topEditButton}
                    >
                        {isEditing ? 'View your profile' : 'Edit your profile'}
                    </button>
                </div>
            )}
            
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
                    {isEditingProfile ? (
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
                    
                    {isEditingProfile ? (
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
                                    <label>Occupation</label>
                                    <input
                                        type="text"
                                        value={profile.occupation}
                                        onChange={(e) => setProfile({...profile, occupation: e.target.value})}
                                        placeholder="Occupation at Organization"
                                        className={styles.occupationInput}
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
                                        setIsEditingProfile(false);
                                        // Reset form to original values
                                        setProfile({
                                            bio: user.bio || '',
                                            location: user.location || '',
                                            occupation: user.occupation || '',
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
                                {user.occupation && (
                                    <span className={styles.userOccupation}>
                                        <BookOpen size={16} />
                                        {user.occupation}
                                    </span>
                                )}
                            </div>
                            
                            {isCurrentUser && isEditing && (
                                <button 
                                    onClick={() => (setIsEditing(true), setIsEditingProfile(true))}
                                    className={styles.editButton}
                                >
                                    <Pencil size={16} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            <div className={styles.contentSection}>
                {session ? (
                    <>
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

                        {/* Tab Navigation */}
                        {renderTabs()}

                        {/* Tab Content */}
                        <div className={styles.tabContent}>
                            {/* Comments Tab */}
                            {activeTab === 'comments' && (
                                <div className={styles.tabPanel}>
                                    <h2 className={styles.tabContentTitle}>RECENT COMMENTS</h2>
                                    
                                    {commentsLoading ? (
                                        <div className={styles.loadingState}>Loading comments...</div>
                                    ) : userComments.length === 0 ? (
                                        <div className={styles.emptyState}>No comments yet</div>
                                    ) : (
                                        <>
                                            <div className={styles.commentsList}>
                                                {userComments.map(comment => (
                                                    <div key={comment._id} className={styles.commentCard}>
                                                        <div className={styles.commentHeader}>
                                                            <FormatContent content={comment.content} className={styles.commentText}/>
                                                            <span className={styles.commentDate}>
                                                                {formatDate(comment.createdAt)}
                                                            </span>
                                                        </div>
                                                        <div className={styles.commentMeta}>
                                                            <span className={styles.commentLocation}>
                                                                In {comment.pageType}{' '}
                                                                <Link 
                                                                    href={`/${comment.pageType === 'poem' ? 'poems' : 'characters' }/${comment.pageType === 'poem' ? comment.identifier.replace('-', '/') : comment.identifier}`}
                                                                    className={styles.commentLink}
                                                                >
                                                                    {comment.identifier}
                                                                </Link>
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {commentsTotalPages > 1 && (
                                                <Pagination
                                                    currentPage={commentsPage}
                                                    totalPages={commentsTotalPages}
                                                    onPageChange={handleCommentsPageChange}
                                                    disabled={commentsLoading}
                                                />
                                            )}
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Contributions Tab */}
                            {activeTab === 'contributions' && (
                                <div className={styles.tabPanel}>
                                    <h2 className={styles.tabContentTitle}>CONTRIBUTIONS</h2>
                                    
                                    {contributionsLoading ? (
                                        <div className={styles.loadingState}>Loading contributions...</div>
                                    ) : userContributions.length === 0 ? (
                                        <div className={styles.emptyState}>No contributions yet</div>
                                    ) : (
                                        <>
                                            <div className={styles.contributionsList}>
                                                {userContributions.map(contribution => (
                                                    <div key={contribution._id} className={styles.contributionCard}>
                                                        <div className={styles.contributionContent}>
                                                            <h3 className={styles.contributionTitle}>
                                                                {contribution.pageType.charAt(0).toUpperCase() + contribution.pageType.slice(1)}
                                                            </h3>
                                                            <Link 
                                                                href={`/${contribution.pageType === 'poem' ? 'poems' : 'characters' }/${contribution.pageType === 'poem' ? contribution.identifier.replace('-', '/') : contribution.identifier}`}
                                                                className={styles.contributionLink}
                                                            >
                                                                {contribution.identifier}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {contributionsTotalPages > 1 && (
                                                <Pagination
                                                    currentPage={contributionsPage}
                                                    totalPages={contributionsTotalPages}
                                                    onPageChange={handleContributionsPageChange}
                                                    disabled={contributionsLoading}
                                                />
                                            )}
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Favorites Tab */}
                            {activeTab === 'favorites' && (
                                <div className={styles.tabPanel}>
                                    <h2 className={styles.tabContentTitle}>FAVORITE POEMS</h2>
                                    
                                    {favoritesLoading ? (
                                        <div className={styles.loadingState}>Loading favorite poems...</div>
                                    ) : userFavorites.length === 0 ? (
                                        <div className={styles.emptyState}>No favorite poems yet</div>
                                    ) : (
                                        <>
                                            <div className={styles.favoritesList}>
                                                {userFavorites.map(favorite => (
                                                    <Link 
                                                        key={favorite.poemId}
                                                        href={`/poems/${favorite.chapterNum}/${favorite.poemNum}`}
                                                        className={styles.favoriteCard}
                                                    >
                                                        <div className={styles.favoriteContent}>
                                                            <h3 className={styles.favoriteTitle}>
                                                                Chapter {favorite.chapterNum} {favorite.chapterName}, Poem {favorite.poemNum}
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
                                            </div>
                                            
                                            {favoritesTotalPages > 1 && (
                                                <Pagination
                                                    currentPage={favoritesPage}
                                                    totalPages={favoritesTotalPages}
                                                    onPageChange={handleFavoritesPageChange}
                                                    disabled={favoritesLoading}
                                                />
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    // Login prompt for non-authenticated users
                    renderLoginPrompt()
                )}
            </div>
        </div>
    );
}