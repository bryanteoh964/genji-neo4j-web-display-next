'use client'
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Archive, Check, AlertTriangle } from 'lucide-react';
import styles from '../../styles/pages/userNotificationsLog.module.css';

export default function UserNotificationsLog() {
  const [activeTab, setActiveTab] = useState('unread');
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readLoading, setReadLoading] = useState(false);
  const [user, setUser] = useState('');
  const [error, setError] = useState(null);

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
      } else {
        showError('Failed to load user info');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      showError('Failed to load user info. Please try again.');
    }
  };

  // Fetch unread notifications
  const fetchUnreadNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/notification/getUnread?userId=${user}`);
      
      if (response.ok) {
        const data = await response.json();
        setUnreadNotifications(data.notifications || []);
      } else {
        showError('Failed to load notifications');
      }
    } catch (error) {
      console.error('Failed to fetch unread notifications:', error);
      showError('Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch read (archived) notifications
  const fetchReadNotifications = async () => {
    if (!user) return;
    
    try {
      setReadLoading(true);
      const response = await fetch(`/api/notification/getRead?userId=${user}`);
      
      if (response.ok) {
        const data = await response.json();
        setReadNotifications(data.notifications || []);
      } else {
        showError('Failed to load read notifications');
      }
    } catch (error) {
      console.error('Failed to fetch read notifications:', error);
      showError('Failed to load read notifications. Please try again.');
    } finally {
      setReadLoading(false);
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
          version: version || 0
        }),
      });
      
      if (response.ok) {
        // Move notification from unread to read list
        const notification = unreadNotifications.find(n => n._id === notificationId);
        if (notification) {
          // Remove from unread
          setUnreadNotifications(prev => prev.filter(n => n._id !== notificationId));
          
          // Add to read with updated properties
          const updatedNotification = {
            ...notification,
            isRead: true,
            readAt: new Date()
          };
          setReadNotifications(prev => [updatedNotification, ...prev]);
        }
      } else if (response.status === 409) {
        showError('This notification has been modified. Refreshing...');
        fetchUnreadNotifications();
      } else if (response.status === 404) {
        showError('Notification no longer exists. Refreshing...');
        fetchUnreadNotifications();
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
    if (unreadNotifications.length === 0) return;
    
    try {
      const response = await fetch('/api/notification/markAllRead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user }),
      });
      
      if (response.ok) {
        // Move all notifications from unread to read
        const updatedNotifications = unreadNotifications.map(notification => ({
          ...notification,
          isRead: true,
          readAt: new Date()
        }));
        
        setReadNotifications(prev => [...updatedNotifications, ...prev]);
        setUnreadNotifications([]);
      } else {
        const data = await response.json();
        showError(data.message || 'Failed to mark all notifications as read');
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      showError('Failed to mark all notifications as read. Please try again.');
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUser();
  }, []);

  // Fetch notifications when user ID is available
  useEffect(() => {
    if (user) {
      fetchUnreadNotifications();
      fetchReadNotifications();
    }
  }, [user]);

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
        return `${senderName} replied to your comment: "${notification.content}"`;
      case 'likeComment':
        return `${senderName} ${notification.content}`;
      case 'likeReply':
        return `${senderName} ${notification.content}`;
      default:
        return notification.content;
    }
  };

  const renderNotifications = (notifications, isLoading) => {
    if (isLoading && notifications.length === 0) {
      return <div className={styles.loadingState}>Loading notifications...</div>;
    }
    
    if (!isLoading && notifications.length === 0) {
      return (
        <div className={styles.emptyState}>
          {activeTab === 'unread' ? 'No unread notifications' : 'No notifications history'}
        </div>
      );
    }
    
    return (
      <div className={styles.notificationList}>
        {notifications.map((notification) => (
          <div key={notification._id} className={styles.notificationItem}>
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
              <div className={styles.notificationHeader}>
                <div className={styles.senderInfo}>
                  <h4 className={styles.senderName}>{notification.senderName}</h4>
                  <span className={styles.timestamp}>
                    {formatDistanceToNow(
                      new Date(notification.readAt || notification.createdAt), 
                      { addSuffix: true }
                    )}
                  </span>
                </div>
                
                {activeTab === 'unread' && (
                  <button
                    className={styles.markReadButton}
                    onClick={() => markAsRead(notification._id, notification.version)}
                    aria-label="Mark as read"
                  >
                    <Check size={18} />
                  </button>
                )}
              </div>
              
              <p className={styles.notificationText}>
                {formatNotificationText(notification)}
              </p>
              
              <div className={styles.notificationFooter}>
                <a 
                  href={getPageLink(notification.pageType, notification.identifier)}
                  className={styles.viewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View {notification.pageType === 'poem' ? 'poem' : notification.pageType}
                </a>
                
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {error && (
        <div className={styles.errorNotification}>
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}
      
      <div className={styles.header}>
        
        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tabButton} ${activeTab === 'unread' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('unread')}
          >
            <Bell size={18} />
            Unread
            {unreadNotifications.length > 0 && 
              <span className={styles.badge}>{unreadNotifications.length}</span>
            }
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'read' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('read')}
          >
            <Archive size={18} />
            History
          </button>
        </div>
        
        {activeTab === 'unread' && unreadNotifications.length > 0 && (
          <button
            className={styles.markAllReadButton}
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>
      
      <div className={styles.content}>
        {activeTab === 'unread' && renderNotifications(unreadNotifications, loading)}
        {activeTab === 'read' && renderNotifications(readNotifications, readLoading)}
      </div>
    </div>
  );
}