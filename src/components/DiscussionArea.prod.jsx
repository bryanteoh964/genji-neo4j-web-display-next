import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Send, Edit, Trash2, EyeOff, Eye, ThumbsUp, MessageCircle, ChevronDown, ChevronUp, Pin, PinOff, Unpin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import styles from '../styles/pages/discussionArea.module.css';

const ReplyInput = ({ onSubmit, onCancel, session, replyToUser }) => {
  const [content, setContent] = useState(replyToUser ? `@${replyToUser} ` : '');

  return (
    <div className={styles.replyInputWrapper}>
      <div className={styles.userAvatar}>
        {session.user.image ? (
          <img src={session.user.image} alt={session.user.name} className={styles.avatarImage} />
        ) : (
          <div className={styles.avatarFallback}>
            {session.user.name?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
      </div>
      <div className={styles.replyInputContainer}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={replyToUser ? `Reply to ${replyToUser}...` : "Write a reply..."}
          className={styles.replyInput}
        />
        <div className={styles.replyActions}>
          <button
            onClick={() => {
              onCancel();
              setContent('');
            }}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (content.trim()) {
                onSubmit(content);
                setContent('');
              }
            }}
            className={styles.saveButton}
            disabled={!content.trim()}
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};


const CommentItem = ({ 
  comment, 
  user, 
  session, 
  mainCommentId, 
  mainCommentUserName,
  onUpdate, 
  onDelete, 
  onToggleHide, 
  onLike, 
  onReply, 
  onUpdateReply, 
  onDeleteReply, 
  onLikeReply, 
  onToggleHideReply,
  onCancelEdit, 
  editingComment, 
  setEditingComment,
  onTogglePin 
}) => {
  const isAuthor = user === comment.user;
  const isAdmin = session?.user?.role === 'admin';
  const isEditing = editingComment === comment._id;
  const [localEditContent, setLocalEditContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setLocalEditContent(comment.content);
    }
  }, [isEditing, comment.content]);

  const handleReplySubmit = (content) => {
    onReply(mainCommentId || comment._id, content);
    setIsReplying(false);
  };

  return (
    <div className={styles.commentThread}>
      <div className={`${styles.commentCard} ${comment.isHidden ? styles.hiddenComment : ''}`}>
        <div className={styles.userAvatar}>
          {comment.userImage ? (
            <img src={comment.userImage} alt={comment.userName} className={styles.avatarImage} />
          ) : (
            <div className={styles.avatarFallback}>
              {comment.userName?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
        </div>

        <div className={styles.commentContent}>
          <div className={styles.commentHeader}>
            <span className={styles.userName}>{comment.userName}</span>
            <span className={styles.timestamp}>
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
            {isAdmin && comment.isHidden && (
              <span className={styles.hiddenBadge}>is hidden</span>
            )}
          </div>

        {comment.isPinned && (
          <div className={styles.pinnedBadge}>
              <Pin size={12} />
              Pinned by admin
          </div>
        )}

          {isEditing ? (
            <div>
              <input
                type="text"
                value={localEditContent}
                onChange={(e) => setLocalEditContent(e.target.value)}
                className={styles.editInput}
              />
              <div className={styles.editActions}>
                <button
                  onClick={() => onUpdate(comment._id, localEditContent)}
                  className={styles.saveButton}
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingComment(null);
                    onCancelEdit();
                  }}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className={styles.commentText}>{comment.content}</p>
          )}

          <div className={styles.actionButtons}>
            <button
              onClick={() => onLike(comment._id)}
              className={comment.isLikedByUser ? styles.likedButton : styles.likeButton}
            >
              <ThumbsUp size={16} />
              <span className={styles.likeCount}>{comment.likeCount || 0}</span>
            </button>

            <button
              onClick={() => setIsReplying(!isReplying)}
              className={styles.actionButton}
            >
              <MessageCircle size={16} />
              Reply
            </button>

            {comment.replies?.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className={`${styles.actionButton} ${styles.replyToggle}`}
              >
                {showReplies ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {showReplies ? 'Hide replies' : `${comment.replies.length} replies`}
              </button>
            )}

            {(isAuthor || isAdmin) && !isEditing && (
              <button
                onClick={() => {
                  setEditingComment(comment._id);
                  setLocalEditContent(comment.content);
                }}
                className={`${styles.actionButton} ${styles.editButton}`}
              >
                <Edit size={16} />
                Edit
              </button>
            )}
            
            {(isAuthor || isAdmin) && (
              <button
                onClick={() => onDelete(comment._id)}
                className={`${styles.actionButton} ${styles.deleteButton}`}
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => onToggleHide(comment._id)}
                className={`${styles.actionButton} ${styles.hideButton}`}
              >
                {comment.isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
                {comment.isHidden ? 'Reveal' : 'Hide'}
              </button>
            )}

            {isAdmin && !mainCommentId && (
                <button
                    onClick={() => onTogglePin(comment._id)}
                    className={`${styles.actionButton} ${styles.pinButton}`}
                    title={comment.isPinned ? "Unpin comment" : "Pin comment"}
                >
                    {comment.isPinned ? (
                        <>
                            <PinOff size={16} />
                            Unpin
                        </>
                    ) : (
                        <>
                            <Pin size={16} />
                            Pin
                        </>
                    )}
                </button>
            )}

          </div>
        </div>
      </div>

      {isReplying && (
        <div className={styles.replySection}>
          <ReplyInput
            session={session}
            onSubmit={handleReplySubmit}
            onCancel={() => setIsReplying(false)}
            replyToUser={mainCommentUserName == comment.userName ? '' : comment.userName} 
          />
        </div>
      )}

      {showReplies && comment.replies?.length > 0 && (
        <div className={styles.repliesSection}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              user={user}
              session={session}
              mainCommentId={mainCommentId || comment._id} 
              mainCommentUserName = {mainCommentUserName}
              onUpdate={onUpdateReply}
              onDelete={onDeleteReply}
              onLike={onLikeReply}
              onReply={onReply}
              onUpdateReply={onUpdateReply}
              onDeleteReply={onDeleteReply}
              onLikeReply={onLikeReply}
              onToggleHide={onToggleHideReply}
              onCancelEdit={onCancelEdit}
              editingComment={editingComment}
              setEditingComment={setEditingComment}
              onTogglePin={onTogglePin}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DiscussionArea = ({ pageType, identifier }) => {
  const { data: session } = useSession();
  const [rawComments, setRawComments] = useState([]);
  const [displayComments, setDisplayComments] = useState([]);
  const [user, setUser] = useState('');
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingComment, setEditingComment] = useState(null);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `/api/discussionArea/getAllComment?pageType=${pageType}&identifier=${identifier}&userId=${user}`
      );
      const data = await response.json();
      setRawComments(data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/user/me`);
      const data = await response.json();
      setUser(data._id);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchComments();
  }, [pageType, identifier]);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      setDisplayComments(rawComments);
    } else {
      const filteredComments = rawComments
        .filter(comment => !comment.isHidden)
        .map(comment => ({
          ...comment,
          replies: comment.replies?.filter(reply => !reply.isHidden) || []
        }));

      setDisplayComments(filteredComments);
    }
  }, [session, rawComments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch('/api/discussionArea/addComment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageType,
          identifier,
          userId: user,
          content: newComment,
        }),
      });

      if (response.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleUpdateComment = async (commentId, content) => {
    try {
      const response = await fetch('/api/discussionArea/updateComment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: commentId,
          userId: user,
          content: content,
        }),
      });

      if (response.ok) {
        setEditingComment(null);
        fetchComments();
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleToggleHide = async (commentId) => {
    try {
      const response = await fetch('/api/discussionArea/hideComment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: commentId
        }),
      });

      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Error toggling comment visibility:', error);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm('Are you sure to delete this comment?')) return;

    try {
      const response = await fetch('/api/discussionArea/deleteComment', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: commentId,
          userId: user
        }),
      });

      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleLike = async (commentId) => {
    try {
      const response = await fetch('/api/discussionArea/likeComment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: commentId,
          userId: user
        }),
      });

      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  const handleAddReply = async (commentId, content) => {
    try {
      const response = await fetch('/api/discussionArea/addReply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          baseCommentId: commentId,
          userId: user,
          content: content,
        }),
      });

      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const handleUpdateReply = async (replyId, content) => {
    try {
      const response = await fetch('/api/discussionArea/updateReply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: replyId,
          userId: user,
          content: content,
        }),
      });

      if (response.ok) {
        setEditingComment(null);
        fetchComments();
      }
    } catch (error) {
      console.error('Error updating reply:', error);
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!confirm('Are you sure to delete this reply?')) return;

    try {
      const response = await fetch('/api/discussionArea/deleteReply', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: replyId,
          userId: user
        }),
      });

      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  };

  const handleLikeReply = async (replyId) => {
    try {
      const response = await fetch('/api/discussionArea/likeReply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: replyId,
          userId: user
        }),
      });

      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Error updating reply like status:', error);
    }
  };

  const handleToggleHideReply = async (replyId) => {
    try {
      const response = await fetch('/api/discussionArea/hideReply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: replyId
        }),
      });

      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Error toggling reply visibility:', error);
    }
  };

  const handleTogglePin = async (commentId) => {
    try {
        const response = await fetch('/api/discussionArea/pinComment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                _id: commentId
            }),
        });

        if (response.ok) {
            fetchComments();
        }
    } catch (error) {
        console.error('Error toggling pin status:', error);
    }
};

  if (loading) {
    return <div className="flex justify-center p-8">loading comments...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputSection}>
        {session ? (
          <div className={styles.inputWrapper}>
            <div className={styles.userAvatar}>
              {session.user.image ? (
                <img src={session.user.image} alt={session.user.name} className={styles.avatarImage} />
              ) : (
                <div className={styles.avatarFallback}>
                  {session.user.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className={styles.inputContainer}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Post your comment..."
                className={styles.commentInput}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddComment();
                  }
                }}
              />
              <button
                onClick={handleAddComment}
                className={styles.sendButton}
                disabled={!newComment.trim()}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full p-4 text-center">
            <a href="/api/auth/signin" className="text-blue-500 hover:underline">
              Login to comment
            </a>
          </div>
        )}
      </div>

      {session && <div className={styles.commentsList}>
        {displayComments?.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            no comments yet, be the first to comment!
          </div>
        ) : (
          displayComments?.map(comment => (
            <CommentItem 
              key={comment._id} 
              comment={comment}
              user={user}
              session={session}
              mainCommentUserName={comment.userName}
              onUpdate={handleUpdateComment}
              onDelete={handleDelete}
              onToggleHide={handleToggleHide}
              onToggleHideReply={handleToggleHideReply}
              onLike={handleLike}
              onCancelEdit={() => setEditingComment(null)}
              onReply={handleAddReply}
              onUpdateReply={handleUpdateReply}
              onDeleteReply={handleDeleteReply}
              onLikeReply={handleLikeReply}
              editingComment={editingComment}
              setEditingComment={setEditingComment}
              onTogglePin={handleTogglePin}
            />
          ))
        )}
      </div>}
    </div>
  );
};

export default DiscussionArea;