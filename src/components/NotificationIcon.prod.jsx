'use client'
import { useState, useEffect, useRef } from 'react';
import { Bell, Check, X, EyeOff, Trash2, Clock, ChevronRight, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import styles from '../styles/pages/notificationIcon.module.css';

export default function NotificationIcon() {
  const [user, setUser] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [reviewNotifications, setReviewNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('notifications');
  const [loading, setLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  // Track which notification is currently showing the disapprove options
  const [expandedDisapproveId, setExpandedDisapproveId] = useState(null);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/user/me`);
      if (response.ok) {
        const data = await response.json();
        setUser(data._id);
        setIsAdmin(data.role === 'admin');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      showError('Failed to load user info. Please try again.');
    }
  };

  // Fetch unread notifications
  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/notification/getUnread?userId=${user}`);
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.notifications?.length || 0);
      } else {
        showError('Failed to load notifications. Please try again.');
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      showError('Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch admin review notifications
  const fetchReviewNotifications = async () => {
    if (!user || !isAdmin) return;
    
    try {
      setReviewLoading(true);
      const response = await fetch(`/api/notification/getAdminReview`);
      
      if (response.ok) {
        const data = await response.json();
        setReviewNotifications(data.notifications || []);
        setReviewCount(data.notifications?.length || 0);
      } else {
        showError('Failed to load review notifications. Please try again.');
      }
    } catch (error) {
      console.error('Failed to fetch review notifications:', error);
      showError('Failed to load review notifications. Please try again.');
    } finally {
      setReviewLoading(false);
    }
  };

  // Mark a single notification as read
  const markAsRead = async (notificationId, version) => {
    try {
      const response = await fetch('/api/notification/markRead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          notificationId,
          userId: user,
          version: version
        }),
      });
      
      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.filter(n => n._id !== notificationId)
        );
        setUnreadCount(prev => prev - 1);
      } else if (response.status === 409) {
        showError('This notification has been modified. Refreshing...');
        fetchNotifications();
      } else if (response.status === 404) {
        showError('Notification no longer exists. Refreshing...');
        fetchNotifications();
      } else {
        const data = await response.json();
        showError(data.message || 'Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      showError('Failed to mark notification as read. Please try again.');
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notification/markAllRead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user }),
      });
      
      if (response.ok) {
        setNotifications([]);
        setUnreadCount(0);
      } else {
        const data = await response.json();
        showError(data.message || 'Failed to mark all notifications as read');
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      showError('Failed to mark all notifications as read. Please try again.');
    }
  };

  // Admin approve content action
  const handleApprove = async (notification) => {
    try {
      const response = await fetch('/api/notification/resolveReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          notificationId: notification._id,
          userId: user,
          action: 'approve',
          version: notification.version || 0
        }),
      });
      
      if (response.ok) {
        // Remove from review notifications
        setReviewNotifications(prev => 
          prev.filter(n => n._id !== notification._id)
        );
        setReviewCount(prev => prev - 1);
      } else if (response.status === 409) {
        showError('This notification has been modified. Refreshing...');
        fetchReviewNotifications();
      } else if (response.status === 404) {
        showError('Notification no longer exists. Refreshing...');
        fetchReviewNotifications();
      } else {
        const data = await response.json();
        showError(data.message || 'Failed to approve content');
      }
    } catch (error) {
      console.error('Failed to approve content:', error);
      showError('Failed to approve content. Please try again.');
    }
  };

  // Admin disapprove (toggle disapprove options)
  const handleDisapproveToggle = (notificationId) => {
    if (expandedDisapproveId === notificationId) {
      setExpandedDisapproveId(null);
    } else {
      setExpandedDisapproveId(notificationId);
    }
  };

  // Admin mark the notification as disapproved (just updates the notification status)
  const markAsDisapproved = async (notification) => {
    try {
      const response = await fetch('/api/notification/resolveReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          notificationId: notification._id,
          userId: user,
          action: 'disapprove',
          version: notification.version || 0
        }),
      });
      
      if (response.status === 409) {
        showError('This notification has been modified. Refreshing...');
        fetchReviewNotifications();
        return false;
      } else if (response.status === 404) {
        showError('Notification no longer exists. Refreshing...');
        fetchReviewNotifications();
        return false;
      } else if (!response.ok) {
        const data = await response.json();
        showError(data.message || 'Failed to mark as disapproved');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to mark as disapproved:', error);
      showError('Failed to mark as disapproved. Please try again.');
      return false;
    }
  };

  // Handle hide content
  const handleHide = async (notification) => {
    // First mark the notification as disapproved
    const success = await markAsDisapproved(notification);
    if (!success) return;
    
    try {
      // Determine the endpoint based on notification type
      let endpoint;
      if (notification.type === 'newComment' || notification.type === 'commentEdit') {
        endpoint = '/api/discussionArea/hideComment';
      } else if (notification.type === 'newReply' || notification.type === 'replyEdit') {
        endpoint = '/api/discussionArea/hideReply';
      } else {
        console.error('Unknown notification type:', notification.type);
        showError('Unknown content type. Cannot hide.');
        return;
      }
      
      // First fetch the current content to get its latest version
      const getCurrentVersion = async () => {
        const checkEndpoint = notification.type.includes('Comment') 
          ? `/api/discussionArea/getComment?commentId=${notification.relatedItem}` 
          : `/api/discussionArea/getReply?replyId=${notification.relatedItem}`;
        
        try {
          const checkResponse = await fetch(checkEndpoint);
          if (checkResponse.ok) {
            const data = await checkResponse.json();
            return data.version || 0;
          } else if (checkResponse.status === 404) {
            throw new Error('Content no longer exists');
          } else {
            throw new Error('Failed to retrieve content');
          }
        } catch (error) {
          throw error;
        }
      };
      
      let currentVersion;
      try {
        currentVersion = await getCurrentVersion();
        // console.log('currentVersion', currentVersion);
      } catch (error) {
        if (error.message === 'Content no longer exists') {
          showError('Content no longer exists. Refreshing...');
          fetchReviewNotifications();
          setExpandedDisapproveId(null);
          return;
        } else {
          showError('Failed to retrieve current content version. Please try again.');
          return;
        }
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          _id: notification.relatedItem,
          version: currentVersion
        }),
      });
      
      if (response.ok) {
        // Remove from review notifications
        setReviewNotifications(prev => 
          prev.filter(n => n._id !== notification._id)
        );
        setReviewCount(prev => prev - 1);
        setExpandedDisapproveId(null);
      } else if (response.status === 409) {
        showError('This content has been modified. Refreshing...');
        fetchReviewNotifications();
        setExpandedDisapproveId(null);
      } else if (response.status === 404) {
        showError('Content no longer exists. Refreshing...');
        fetchReviewNotifications();
        setExpandedDisapproveId(null);
      } else {
        const data = await response.json();
        showError(data.message || 'Failed to hide content');
      }
    } catch (error) {
      console.error('Failed to hide content:', error);
      showError('Failed to hide content. Please try again.');
    }
  };

  // Handle delete content
  const handleDelete = async (notification) => {
    if (!confirm('Are you sure to delete this content? This action cannot be undone.')) {
      return;
    }
    
    // First mark the notification as disapproved
    const success = await markAsDisapproved(notification);
    if (!success) return;
    
    try {
      // Determine the endpoint based on notification type
      let endpoint;
      if (notification.type === 'newComment' || notification.type === 'commentEdit') {
        endpoint = '/api/discussionArea/deleteComment';
      } else if (notification.type === 'newReply' || notification.type === 'replyEdit') {
        endpoint = '/api/discussionArea/deleteReply';
      } else {
        console.error('Unknown notification type:', notification.type);
        showError('Unknown content type. Cannot delete.');
        return;
      }
      
      // First fetch the current content to get its latest version
      const getCurrentVersion = async () => {
        const checkEndpoint = notification.type.includes('Comment') 
          ? `/api/discussionArea/getComment?commentId=${notification.relatedItem}` 
          : `/api/discussionArea/getReply?replyId=${notification.relatedItem}`;
        
        try {
          const checkResponse = await fetch(checkEndpoint);
          if (checkResponse.ok) {
            const data = await checkResponse.json();
            return data.version || 0;
          } else if (checkResponse.status === 404) {
            throw new Error('Content no longer exists');
          } else {
            throw new Error('Failed to retrieve content');
          }
        } catch (error) {
          throw error;
        }
      };
      
      let currentVersion;
      try {
        currentVersion = await getCurrentVersion();
      } catch (error) {
        if (error.message === 'Content no longer exists') {
          showError('Content no longer exists. Refreshing...');
          fetchReviewNotifications();
          setExpandedDisapproveId(null);
          return;
        } else {
          showError('Failed to retrieve current content version. Please try again.');
          return;
        }
      }
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          _id: notification.relatedItem,
          userId: user,
          version: currentVersion
        }),
      });
      
      if (response.ok) {
        // Remove from review notifications
        setReviewNotifications(prev => 
          prev.filter(n => n._id !== notification._id)
        );
        setReviewCount(prev => prev - 1);
        setExpandedDisapproveId(null);
      } else if (response.status === 409) {
        showError('This content has been modified. Refreshing...');
        fetchReviewNotifications();
        setExpandedDisapproveId(null);
      } else if (response.status === 404) {
        showError('Content no longer exists. Refreshing...');
        fetchReviewNotifications();
        setExpandedDisapproveId(null);
      } else {
        const data = await response.json();
        showError(data.message || 'Failed to delete content');
      }
    } catch (error) {
      console.error('Failed to delete content:', error);
      showError('Failed to delete content. Please try again.');
    }
  };

  // Listen for clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setExpandedDisapproveId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initial user fetch
  useEffect(() => {
    fetchUser();
  }, []);

  // Fetch notifications when user is available
  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      if (isAdmin) {
        fetchReviewNotifications();
      }
    
      // We still want periodic polling for new notifications that might arrive
      // This is different from refreshing due to version conflicts
      const intervalId = setInterval(() => {
        fetchNotifications();
        if (isAdmin) {
          fetchReviewNotifications();
        }
      }, 30000);
      
      // Cleanup function
      return () => clearInterval(intervalId);
    }
  }, [user, isAdmin]);

  // Generate page link based on pageType and identifier
  const getPageLink = (pageType, identifier) => {
    if (pageType === 'poem') {
      const [chapter, poem] = identifier.split('-');
      return `/poems/${chapter}/${poem}`;
    } else if (pageType === 'character') {
      return `/characters/${identifier}`;
    } else {
      return `/${pageType}/${identifier}`;
    }
  };

  // Format notification text based on type
  const formatNotificationText = (notification) => {
    const senderName = notification.senderName || 'A user';
    
    switch (notification.type) {
      case 'newComment':
        return `${senderName} posted a new comment: "${notification.content}"`;
      case 'newReply':
        return `${senderName} posted a new reply: "${notification.content}"`;
      case 'commentEdit':
        return `${senderName} edited a comment: "${notification.content}"`;
      case 'replyEdit':
        return `${senderName} edited a reply: "${notification.content}"`;
      case 'reply':
        return `${senderName} replied to your comment: "${notification.content}"`;
      case 'like':
        return `${senderName} liked your comment`;
      default:
        return notification.content;
    }
  };

  // Get total count for badge
  const getTotalCount = () => unreadCount + (isAdmin ? reviewCount : 0);

  return (
    <div className={styles.notificationContainer} ref={dropdownRef}>
      <button 
        className={styles.notificationButton}
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {getTotalCount() > 0 && (
          <span className={styles.badge}>{getTotalCount()}</span>
        )}
      </button>
      
      {showDropdown && (
        <div className={styles.notificationDropdown}>
          {error && (
            <div className={styles.errorNotification}>
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}
          
          {isAdmin && (
            <div className={styles.tabsContainer}>
              <button
                className={`${styles.tabButton} ${activeTab === 'notifications' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                Notifications {unreadCount > 0 && <span className={styles.tabBadge}>{unreadCount}</span>}
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === 'review' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('review')}
              >
                Review {reviewCount > 0 && <span className={styles.tabBadge}>{reviewCount}</span>}
              </button>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <>
              <h3 className={styles.notificationHeader}>
                Notifications
                {unreadCount > 0 && (
                  <button 
                    className={styles.markAllRead}
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </button>
                )}
              </h3>
              
              <div className={styles.notificationList}>
                {loading && notifications.length === 0 && (
                  <p className={styles.loadingText}>Loading...</p>
                )}
                
                {!loading && notifications.length === 0 && (
                  <p className={styles.emptyText}>No new notifications</p>
                )}
                
                {notifications.map((notification) => (
                  <div key={notification._id} className={styles.notificationItem}>
                    <Link 
                      href={getPageLink(notification.pageType, notification.identifier)}
                      className={styles.notificationLink}
                      onClick={() => markAsRead(notification._id, notification.version)}
                    >
                      <div className={styles.notificationAvatar}>
                        {notification.senderImage ? (
                          <img src={notification.senderImage} alt="" className={styles.avatarImage} />
                        ) : (
                          <div className={styles.avatarFallback}>
                            {notification.senderName?.[0]?.toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                      
                      <div className={styles.notificationContent}>
                        <p className={styles.notificationText}>
                          {formatNotificationText(notification)}
                        </p>
                        <span className={styles.notificationTime}>
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </Link>
                    
                    <button 
                      className={styles.dismissButton}
                      onClick={() => markAsRead(notification._id, notification.version)}
                      aria-label="Mark as read"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {activeTab === 'review' && isAdmin && (
            <>
              <h3 className={styles.notificationHeader}>
                Content Review
              </h3>
              
              <div className={styles.notificationList}>
                {reviewLoading && reviewNotifications.length === 0 && (
                  <p className={styles.loadingText}>Loading...</p>
                )}
                
                {!reviewLoading && reviewNotifications.length === 0 && (
                  <p className={styles.emptyText}>No content to review</p>
                )}
                
                {reviewNotifications.map((notification) => (
                  <div key={notification._id} className={styles.reviewItem}>
                    <div className={styles.reviewItemHeader}>
                      <div className={styles.notificationAvatar}>
                        {notification.senderImage ? (
                          <img src={notification.senderImage} alt="" className={styles.avatarImage} />
                        ) : (
                          <div className={styles.avatarFallback}>
                            {notification.senderName?.[0]?.toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                      
                      <div className={styles.reviewInfo}>
                        <p className={styles.reviewUsername}>{notification.senderName}</p>
                        <span className={styles.notificationTime}>
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    
                    <div className={styles.reviewContent}>
                      <p>{notification.content}</p>
                      <div className={styles.locationInfo}>
                        <Clock size={12} />
                        <span>
                          In {notification.pageType}{' '}
                          <Link 
                            href={getPageLink(notification.pageType, notification.identifier)}
                            className={styles.locationLink}
                          >
                            {notification.identifier}
                          </Link>
                        </span>
                      </div>
                    </div>
                    
                    {/* Initial approve/disapprove buttons */}
                    {expandedDisapproveId !== notification._id ? (
                      <div className={styles.reviewActions}>
                        <button 
                          className={`${styles.actionButton} ${styles.approveButton}`}
                          onClick={() => handleApprove(notification)}
                          title="Approve"
                        >
                          <Check size={16} />
                          Approve
                        </button>
                        <button 
                          className={`${styles.actionButton} ${styles.disapproveButton}`}
                          onClick={() => handleDisapproveToggle(notification._id)}
                          title="Disapprove"
                        >
                          <X size={16} />
                          Disapprove <ChevronRight size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className={styles.disapproveOptions}>
                        <div className={styles.disapproveHeader}>
                          Select Action:
                        </div>
                        <div className={styles.disapproveActions}>
                          <button 
                            className={`${styles.actionButton} ${styles.hideButton}`}
                            onClick={() => handleHide(notification)}
                            title="Hide"
                          >
                            <EyeOff size={16} />
                            Hide
                          </button>
                          <button 
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                            onClick={() => handleDelete(notification)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                          <button 
                            className={`${styles.actionButton} ${styles.cancelButton}`}
                            onClick={() => setExpandedDisapproveId(null)}
                            title="Cancel"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}