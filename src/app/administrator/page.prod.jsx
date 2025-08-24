'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminBlogEditor from '../../components/AdminBlogEditor.prod';
import styles from '../../styles/pages/administrator.module.css';

const AdministratorPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (status === 'loading') return;

        // Check if user is authenticated and has admin role
        if (!session) {
            router.push('/login');
            return;
        }

        // TODO: Add proper admin role check when role is implemented
        // For now, allowing all authenticated users
        // if (session.user.role !== 'admin') {
        //     router.push('/');
        //     return;
        // }

        fetchBlogs();
    }, [session, status, router]);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/blog/getBlogList');
            if (!response.ok) {
                throw new Error('Failed to fetch blogs');
            }
            const data = await response.json();
            setBlogs(data.titles || []);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBlogSelect = async (title) => {
        try {
            const response = await fetch(`/api/blog/getSingle?title=${encodeURIComponent(title)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch blog content');
            }
            const data = await response.json();
            setSelectedBlog({
                title,
                content: data.content,
                authorEmail: data.authorEmail,
                isUser: data.isUser
            });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleBlogUpdate = async (title, content) => {
        try {
            const response = await fetch('/api/administrator/updateBlog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content }),
            });

            if (!response.ok) {
                throw new Error('Failed to update blog');
            }

            // Update the selected blog content
            setSelectedBlog(prev => ({
                ...prev,
                content
            }));

            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const handleCreateBlog = async (title, content) => {
        try {
            const response = await fetch('/api/administrator/createBlog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content }),
            });

            if (!response.ok) {
                throw new Error('Failed to create blog');
            }

            // Refresh the blog list
            await fetchBlogs();
            
            // Select the newly created blog
            handleBlogSelect(title);

            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const handleDeleteBlog = async (title) => {
        try {
            const response = await fetch(`/api/administrator/deleteBlog?title=${encodeURIComponent(title)}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete blog');
            }

            // Refresh the blog list
            await fetchBlogs();
            
            // Clear selected blog if it was the deleted one
            if (selectedBlog?.title === title) {
                setSelectedBlog(null);
            }

            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}>Loading...</div>
            </div>
        );
    }

    if (!session) {
        return null; // Will redirect to login
    }

    return (
        <div className={styles.administratorContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Blog Administrator</h1>
                <p className={styles.subtitle}>Manage blog posts in the database</p>
            </div>

            <div className={styles.mainContent}>
                {/* Left Sidebar - Blog List */}
                <div className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <h2>Blog Posts</h2>
                        <button 
                            className={styles.createButton}
                            onClick={() => setSelectedBlog({ 
                                title: '', 
                                content: '', 
                                isNew: true 
                            })}
                        >
                            + New Blog
                        </button>
                    </div>

                    {error && (
                        <div className={styles.errorMessage}>
                            Error: {error}
                        </div>
                    )}

                    <div className={styles.blogList}>
                        {blogs.map((title) => (
                            <div
                                key={title}
                                className={`${styles.blogItem} ${
                                    selectedBlog?.title === title ? styles.active : ''
                                }`}
                                onClick={() => handleBlogSelect(title)}
                            >
                                <div className={styles.blogTitle}>{title}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Content Area - Editor */}
                <div className={styles.editorArea}>
                    {selectedBlog ? (
                        <AdminBlogEditor
                            blog={selectedBlog}
                            onUpdate={handleBlogUpdate}
                            onCreate={handleCreateBlog}
                            onDelete={handleDeleteBlog}
                            onClose={() => setSelectedBlog(null)}
                        />
                    ) : (
                        <div className={styles.noSelection}>
                            <h3>Select a blog post to edit</h3>
                            <p>Choose a blog from the list on the left, or create a new one.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdministratorPage;
