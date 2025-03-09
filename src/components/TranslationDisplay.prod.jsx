'use client'
import { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Eye, EyeOff, Trash2, X, RefreshCw, AlertTriangle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import styles from '../styles/pages/TransDisplay.module.css';

const UserTranslationsDisplay = ({ pageType, identifier }) => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const modalRef = useRef(null);
  
  // Show error with auto-dismiss after 5 seconds
  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  // Fetch translations with retry logic
  const fetchTranslations = async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      const response = await fetch(`/api/translation/getAllTrans?pageType=${pageType}&identifier=${identifier}`);
      
      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        setTranslations(data.trans || []);
        setError(null);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
        throw new Error(errorData.message || `Server returned ${response.status}`);
      }
    } catch (err) {
      console.error('Error fetching translations:', err);
      showError('Failed to load translations. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Manual refresh handler with force option
  const handleRefresh = () => {
    if (refreshing) return;
    fetchTranslations();
  };

  // Handle hide translation
  const handleToggleHide = async (translationId, version) => {
    if (!isAdmin) return;
    
    try {
      setError(null); // Clear any existing errors
      
      const response = await fetch('/api/translation/hideTrans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          _id: translationId,
          version: version 
        }),
      });
      
      if (response.ok) {
        // Update local state to reflect the change
        setTranslations(prev => prev.map(t => 
          t._id === translationId ? { ...t, isHidden: !t.isHidden, version: (t.version || 0) + 1 } : t
        ));
      } else if (response.status === 409) {
        showError('This translation has been modified. Refreshing...');
        fetchTranslations();
      } else {
        const data = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        showError(data.message || 'Failed to update translation visibility');
      }
    } catch (err) {
      console.error('Error toggling translation visibility:', err);
      showError('Failed to update translation. Please try again.');
    }
  };

  // Handle delete translation
  const handleDelete = async (translationId, version) => {
    if (!isAdmin) return;
    if (!confirm('Are you sure you want to delete this translation?')) return;
    
    try {
      setError(null);
      
      const response = await fetch('/api/translation/deleteTrans', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          _id: translationId,
          userId: session?.user?.id || '',
          version: version 
        }),
      });
      
      if (response.ok) {
        // Remove deleted translation from the list
        setTranslations(prev => prev.filter(t => t._id !== translationId));
      } else if (response.status === 409) {
        showError('This translation has been modified. Refreshing...');
        fetchTranslations();
      } else if (response.status === 404) {
        showError('Translation no longer exists. Refreshing...');
        fetchTranslations();
      } else {
        const data = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        showError(data.message || 'Failed to delete translation');
      }
    } catch (err) {
      console.error('Error deleting translation:', err);
      showError('Failed to delete translation. Please try again.');
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);

  useEffect(() => {
    if (showModal && pageType && identifier) {
      fetchTranslations();
    }
  }, [showModal, pageType, identifier]);

  useEffect(() => {
    if (pageType && identifier) {
      fetchTranslations();
    }
  }, []);

  // Filter translations for regular users
  const visibleTranslations = isAdmin 
    ? translations 
    : translations.filter(t => !t.isHidden);

  return (
    <div className={styles.userTranslationsSection}>
      <div className={styles.translationsHeader}>
        <h3>USER TRANSLATIONS</h3>
        <button 
          className={styles.viewTranslationsButton} 
          onClick={() => setShowModal(true)}
        >
          View Translations ({visibleTranslations.length})
        </button>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} ref={modalRef}>
            <div className={styles.modalHeader}>
              <h3>User Translations</h3>
              <div className={styles.modalControls}>
                <button 
                  className={styles.refreshButton}
                  onClick={handleRefresh}
                  disabled={refreshing}
                  title="Refresh translations"
                >
                  <RefreshCw size={16} className={refreshing ? styles.spinning : ''} />
                </button>
                <button 
                  className={styles.closeButton}
                  onClick={() => setShowModal(false)}
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {error && (
              <div className={styles.errorAlert}>
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}
            
            <div className={styles.translationsList}>
              {loading && translations.length === 0 ? (
                <div className={styles.loadingMessage}>Loading translations...</div>
              ) : !loading && visibleTranslations.length === 0 ? (
                <div className={styles.emptyMessage}>No translations yet. Be the first to add one!</div>
              ) : (
                visibleTranslations.map((translation) => (
                  <div 
                    key={translation._id} 
                    className={`${styles.translationItem} ${translation.isHidden ? styles.hiddenTranslation : ''}`}
                  >
                    <div className={styles.userSection}>
                      <div className={styles.userInfoWrapper}>
                        <div className={styles.translationAvatar}>
                          {translation.userImage ? (
                            <img src={translation.userImage} alt="" className={styles.avatarImage} />
                          ) : (
                            <div className={styles.avatarFallback}>
                              {(translation.userName?.[0] || 'A').toUpperCase()}
                            </div>
                          )}
                        </div>
                        <span className={styles.translatorName}>
                          {translation.userName}
                        </span>
                      </div>
                      <span className={styles.translationDate}>
                        {formatDistanceToNow(new Date(translation.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <div className={styles.translationContent}>
                      <p>{translation.content}</p>
                      {translation.isHidden && isAdmin && (
                        <div className={styles.translationMeta}>
                          <span className={styles.hiddenBadge}>Hidden</span>
                        </div>
                      )}
                    </div>
                    
                    {isAdmin && (
                      <div className={styles.adminActions}>
                        <button
                          className={styles.toggleHideButton}
                          onClick={() => handleToggleHide(translation._id, translation.version || 0)}
                          title={translation.isHidden ? "Show translation" : "Hide translation"}
                        >
                          {translation.isHidden ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(translation._id, translation.version || 0)}
                          title="Delete translation"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
              
              {refreshing && translations.length > 0 && (
                <div className={styles.refreshingIndicator}>
                  <RefreshCw size={16} className={styles.spinning} />
                  <span>Refreshing...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTranslationsDisplay;