'use client';

import React, { useState, useEffect } from 'react';
import styles from '../styles/components/adminBlogEditor.module.css';

const AdminBlogEditor = ({ blog, onUpdate, onCreate, onClose, onDelete }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (blog) {
            setTitle(blog.title || '');
            setContent(blog.content || '');
            setIsEditing(blog.isNew || false);
        }
    }, [blog]);

    const handleSave = async () => {
        if (!title.trim()) {
            setMessage('Title is required');
            return;
        }

        if (!content.trim()) {
            setMessage('Content is required');
            return;
        }

        setIsSaving(true);
        setMessage('');

        try {
            let result;
            if (blog.isNew) {
                result = await onCreate(title.trim(), content);
            } else {
                result = await onUpdate(title.trim(), content);
            }

            if (result.success) {
                setMessage('Blog saved successfully!');
                setIsEditing(false);
                // Clear message after 3 seconds
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage(`Error: ${result.error}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (blog.isNew) {
            onClose();
        } else {
            // Reset to original values
            setTitle(blog.title || '');
            setContent(blog.content || '');
            setIsEditing(false);
        }
        setMessage('');
    };

    const handleEdit = () => {
        setIsEditing(true);
        setMessage('');
        setShowDeleteConfirm(false);
    };

    const handleDelete = async () => {
        if (!onDelete) return;
        
        setIsDeleting(true);
        setMessage('');

        try {
            const result = await onDelete(blog.title);
            if (result.success) {
                setMessage('Blog deleted successfully!');
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                setMessage(`Error: ${result.error}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    if (!blog) {
        return null;
    }

    return (
        <div className={styles.editorContainer}>
            <div className={styles.editorHeader}>
                <div className={styles.titleSection}>
                    {isEditing ? (
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter blog title..."
                            className={styles.titleInput}
                            disabled={isSaving}
                        />
                    ) : (
                        <h1 className={styles.blogTitle}>{title}</h1>
                    )}
                </div>

                <div className={styles.actionButtons}>
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className={`${styles.button} ${styles.saveButton}`}
                            >
                                {isSaving ? 'Saving...' : (blog.isNew ? 'Create' : 'Save')}
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={isSaving}
                                className={`${styles.button} ${styles.cancelButton}`}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleEdit}
                                className={`${styles.button} ${styles.editButton}`}
                                disabled={isDeleting}
                            >
                                Edit
                            </button>
                            {!blog.isNew && onDelete && (
                                <>
                                    {showDeleteConfirm ? (
                                        <>
                                            <button
                                                onClick={handleDelete}
                                                disabled={isDeleting}
                                                className={`${styles.button} ${styles.deleteConfirmButton}`}
                                            >
                                                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteConfirm(false)}
                                                disabled={isDeleting}
                                                className={`${styles.button} ${styles.cancelButton}`}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setShowDeleteConfirm(true)}
                                            disabled={isDeleting}
                                            className={`${styles.button} ${styles.deleteButton}`}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </>
                            )}
                            <button
                                onClick={onClose}
                                className={`${styles.button} ${styles.closeButton}`}
                                disabled={isDeleting}
                            >
                                Close
                            </button>
                        </>
                    )}
                </div>
            </div>

            {message && (
                <div className={`${styles.message} ${
                    message.startsWith('Error') ? styles.error : styles.success
                }`}>
                    {message}
                </div>
            )}

            <div className={styles.editorContent}>
                {blog.authorEmail && (
                    <div className={styles.metadata}>
                        <span className={styles.author}>Author: {blog.authorEmail}</span>
                        {blog.isUser && <span className={styles.userBadge}>User Blog</span>}
                    </div>
                )}

                <div className={styles.contentSection}>
                    <label className={styles.contentLabel}>Content:</label>
                    {isEditing ? (
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter blog content..."
                            className={styles.contentTextarea}
                            disabled={isSaving}
                            rows={20}
                        />
                    ) : (
                        <div className={styles.contentDisplay}>
                            {content ? (
                                <div 
                                    className={styles.renderedContent}
                                    dangerouslySetInnerHTML={{ 
                                        __html: content.replace(/\n/g, '<br>') 
                                    }}
                                />
                            ) : (
                                <p className={styles.emptyContent}>No content available</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminBlogEditor;
