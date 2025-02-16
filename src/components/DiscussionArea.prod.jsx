import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Send, Edit, Trash2, EyeOff, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import styles from '../styles/pages/discussionArea.module.css';

const DiscussionArea = ({ pageType, identifier }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState('');
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');

  // 获取评论
  const fetchComments = async () => {
    try {
      const response = await fetch(
        `/api/discussionArea/getAllComment?pageType=${pageType}&identifier=${identifier}`
      );
      const data = await response.json();
      if (session?.user?.role === 'admin') {
        setComments(data.comments);
      } else {
        setComments(data.comments.filter(comment => !comment.isHidden));
      }
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
  }, [pageType, identifier, session]);

  // 添加评论
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

  // 更新评论
  const handleUpdateComment = async (commentId) => {
    try {
      const response = await fetch('/api/discussionArea/updateComment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: commentId,
          userId: user,
          content: editContent,
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

  // 隐藏/显示评论
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

  // 删除评论
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

  // 渲染单条评论
  const CommentItem = ({ comment }) => {
    const isAuthor = user === comment.user;
    const isAdmin = session?.user?.role === 'admin';
    const isEditing = editingComment === comment._id;

    return (
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

          {isEditing ? (
            <div>
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className={styles.editInput}
              />
              <div className={styles.editActions}>
                <button
                  onClick={() => handleUpdateComment(comment._id)}
                  className={styles.saveButton}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingComment(null)}
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
            {isAuthor && !isEditing && (
              <button
                onClick={() => {
                  setEditingComment(comment._id);
                  setEditContent(comment.content);
                }}
                className={`${styles.actionButton} ${styles.editButton}`}
              >
                <Edit size={16} />
                Edit
              </button>
            )}
            
            {(isAuthor || isAdmin) && (
              <button
                onClick={() => handleDelete(comment._id)}
                className={`${styles.actionButton} ${styles.deleteButton}`}
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => handleToggleHide(comment._id)}
                className={`${styles.actionButton} ${styles.hideButton}`}
              >
                {comment.isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
                {comment.isHidden ? 'Reveal' : 'Hide'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
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
        {comments?.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            no comments yet, be the first to comment!
          </div>
        ) : (
          comments?.map(comment => (
            <CommentItem key={comment._id} comment={comment} />
          ))
        )}
      </div> }
    </div>
  );
};

export default DiscussionArea;