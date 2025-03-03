'use client'
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Archive, Check, X, EyeOff, Trash2, ChevronRight, AlertTriangle, CheckCircle, XCircle, Eye } from 'lucide-react';
import styles from '../../styles/pages/adminReviewNotification.module.css';

export default function AdminReviewPanel() {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingReviews, setPendingReviews] = useState([]);
  const [reviewedContent, setReviewedContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [user, setUser] = useState('');
  const [error, setError] = useState(null);
  // Track which notification is currently showing the disapprove options
  const [expandedDisapproveId, setExpandedDisapproveId] = useState(null);

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

  // Fetch pending review notifications
  const fetchPendingReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/notification/getAdminReview`);
      
      if (response.ok) {
        const data = await response.json();
        setPendingReviews(data.notifications || []);
        console.log(data.notifications);
      } else {
        showError('Failed to load pending reviews');
      }
    } catch (error) {
      console.error('Failed to fetch pending reviews:', error);
      showError('Failed to load pending reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch completed reviews
  const fetchCompletedReviews = async () => {
    try {
      setHistoryLoading(true);
      const response = await fetch(`/api/notification/getAdminCompletedReviews`);
      
      if (response.ok) {
        const data = await response.json();
        setReviewedContent(data.notifications || []);
      } else {
        showError('Failed to load review history');
      }
    } catch (error) {
      console.error('Failed to fetch completed reviews:', error);
      showError('Failed to load review history. Please try again.');
    } finally {
      setHistoryLoading(false);
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
        // Move from pending to reviewed
        const updatedNotification = {
          ...notification,
          reviewAction: 'approve',
          reviewedAt: new Date(),
          reviewedBy: user
        };
        
        // Remove from pending list
        setPendingReviews(prev => 
          prev.filter(n => n._id !== notification._id)
        );
        
        // Add to reviewed list
        setReviewedContent(prev => [updatedNotification, ...prev]);
        
        // Dispatch custom event for refreshing discussion area if on same page
        const event = new CustomEvent('content:moderated', {
          detail: {
            pageType: notification.pageType,
            identifier: notification.identifier,
            action: 'approve',
            relatedItem: notification.relatedItem
          }
        });
        window.dispatchEvent(event);
        
      } else if (response.status === 409) {
        showError('This notification has been modified. Refreshing...');
        fetchPendingReviews();
      } else if (response.status === 404) {
        showError('Notification no longer exists. Refreshing...');
        fetchPendingReviews();
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
        fetchPendingReviews();
        return false;
      } else if (response.status === 404) {
        showError('Notification no longer exists. Refreshing...');
        fetchPendingReviews();
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
      } catch (error) {
        if (error.message === 'Content no longer exists') {
          showError('Content no longer exists. Refreshing...');
          fetchPendingReviews();
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
        // Move from pending to reviewed
        const updatedNotification = {
          ...notification,
          reviewAction: 'hide',
          reviewedAt: new Date(),
          reviewedBy: user
        };
        
        // Remove from pending list
        setPendingReviews(prev => 
          prev.filter(n => n._id !== notification._id)
        );
        
        // Add to reviewed list
        setReviewedContent(prev => [updatedNotification, ...prev]);
        setExpandedDisapproveId(null);
        
        // Dispatch custom event for refreshing discussion area if on same page
        const event = new CustomEvent('content:moderated', {
          detail: {
            pageType: notification.pageType,
            identifier: notification.identifier,
            action: 'hide',
            relatedItem: notification.relatedItem
          }
        });
        window.dispatchEvent(event);
        
      } else if (response.status === 409) {
        showError('This content has been modified. Refreshing...');
        fetchPendingReviews();
        setExpandedDisapproveId(null);
      } else if (response.status === 404) {
        showError('Content no longer exists. Refreshing...');
        fetchPendingReviews();
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
          fetchPendingReviews();
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
        // Move from pending to reviewed
        const updatedNotification = {
          ...notification,
          reviewAction: 'delete',
          reviewedAt: new Date(),
          reviewedBy: user
        };
        
        // Remove from pending list
        setPendingReviews(prev => 
          prev.filter(n => n._id !== notification._id)
        );
        
        // Add to reviewed list
        setReviewedContent(prev => [updatedNotification, ...prev]);
        setExpandedDisapproveId(null);
        
        // Dispatch custom event for refreshing discussion area if on same page
        const event = new CustomEvent('content:moderated', {
          detail: {
            pageType: notification.pageType,
            identifier: notification.identifier,
            action: 'delete',
            relatedItem: notification.relatedItem
          }
        });
        window.dispatchEvent(event);
        
      } else if (response.status === 409) {
        showError('This content has been modified. Refreshing...');
        fetchPendingReviews();
        setExpandedDisapproveId(null);
      } else if (response.status === 404) {
        showError('Content no longer exists. Refreshing...');
        fetchPendingReviews();
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

  // Initial user fetch and data load
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      if (activeTab === 'pending') {
        fetchPendingReviews();
      } else {
        fetchCompletedReviews();
      }
    }
  }, [user, activeTab]);

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

  // Format content type label
  const getContentTypeLabel = (notification) => {
    if (notification.type === 'newComment' || notification.type === 'commentEdit') {
      return notification.type === 'newComment' ? 'New Comment' : 'Edited Comment';
    } else if (notification.type === 'newReply' || notification.type === 'replyEdit') {
      return notification.type === 'newReply' ? 'New Reply' : 'Edited Reply';
    }
    return 'Content';
  };

  // Render action icon based on review action
  const renderActionIcon = (action) => {
    switch (action) {
      case 'approve':
        return <CheckCircle size={16} className={styles.approveIcon} />;
      case 'hide':
        return <EyeOff size={16} className={styles.hideIcon} />;
      case 'delete':
        return <Trash2 size={16} className={styles.deleteIcon} />;
      case 'disapprove':
        return <XCircle size={16} className={styles.disapproveIcon} />;
      default:
        return null;
    }
  };

  // Render review items for the pending tab
  const renderPendingReviews = () => {
    if (loading && pendingReviews.length === 0) {
      return <div className={styles.loadingState}>Loading review items...</div>;
    }
    
    if (!loading && pendingReviews.length === 0) {
      return (
        <div className={styles.emptyState}>
          <p>No content waiting for review</p>
        </div>
      );
    }
    
    return (
      <div className={styles.reviewList}>
        {pendingReviews.map((notification) => (
          <div key={notification._id} className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
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
                <h3 className={styles.reviewTitle}>
                  {notification.senderName} <span className={styles.contentType}>{getContentTypeLabel(notification)}</span>
                </h3>
                <div className={styles.metaInfo}>
                  <span className={styles.timestamp}>
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </span>
                  <span className={styles.locationInfo}>
                    in <a 
                      href={getPageLink(notification.pageType, notification.identifier)}
                      className={styles.locationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {notification.pageType === 'poem' ? 'Poem ' : ''}{notification.identifier}
                    </a>
                  </span>
                </div>
              </div>
            </div>
            
            <div className={styles.reviewContent}>
              <p className={styles.contentText}>{notification.content}</p>
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
    );
  };

  // Render review items for the history tab
  const renderReviewHistory = () => {
    if (historyLoading && reviewedContent.length === 0) {
      return <div className={styles.loadingState}>Loading history...</div>;
    }
    
    if (!historyLoading && reviewedContent.length === 0) {
      return (
        <div className={styles.emptyState}>
          <Archive size={24} />
          <p>No review history available</p>
        </div>
      );
    }
    
    return (
      <div className={styles.reviewList}>
        {reviewedContent.map((notification) => (
          <div key={notification._id} className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
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
                <h3 className={styles.reviewTitle}>
                  {notification.senderName} <span className={styles.contentType}>{getContentTypeLabel(notification)}</span>
                </h3>
                <div className={styles.metaInfo}>
                  <span className={styles.actionLabel}>
                    {renderActionIcon(notification.reviewAction)}
                    {notification.reviewAction === 'approve' ? 'Approved' : 
                     notification.reviewAction === 'hide' ? 'Hidden' : 
                     notification.reviewAction === 'delete' ? 'Deleted' : 'Disapproved'}
                  </span>
                  <span className={styles.timestamp}>
                    {formatDistanceToNow(new Date(notification.reviewedAt || notification.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
            
            <div className={styles.reviewContent}>
              <p className={styles.contentText}>{notification.content}</p>
              <div className={styles.reviewFooter}>
                <span className={styles.locationInfo}>
                  in <a 
                    href={getPageLink(notification.pageType, notification.identifier)}
                    className={styles.locationLink}
                  >
                    {notification.pageType === 'poem' ? 'Poem ' : ''}{notification.identifier}
                  </a>
                </span>
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
            className={`${styles.tabButton} ${activeTab === 'pending' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <Clock size={18} />
            Pending Review
            {pendingReviews.length > 0 && 
              <span className={styles.badge}>{pendingReviews.length}</span>
            }
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'history' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <Archive size={18} />
            Review History
          </button>
        </div>
      </div>
      
      <div className={styles.content}>
        {activeTab === 'pending' && renderPendingReviews()}
        {activeTab === 'history' && renderReviewHistory()}
      </div>
    </div>
  );
}