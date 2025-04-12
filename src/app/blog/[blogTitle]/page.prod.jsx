'use client'
import React, { useState, useEffect } from 'react';
import FormatContent from "../../../components/FormatText.prod"
import styles from "../../../styles/pages/translatorProfile.module.css"

const BlogPage = ({ params }) => {
    const { blogTitle } = params;
    const [content, setContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        const checkImage = async () => {
            try {
                const jpgResponse = await fetch(`/images/${blogTitle}.jpg`);
                if (jpgResponse.ok) {
                    setImageSrc(`/images/${blogTitle}.jpg`);
                } else {
                    const pngResponse = await fetch(`/images/${blogTitle}.png`);
                    if (pngResponse.ok) {
                        setImageSrc(`/images/${blogTitle}.png`);
                    } else {
                        setImageSrc('/images/blog_banner.jpg');
                    }
                }
            } catch (error) {
                setImageSrc('/images/blog_banner.jpg');
            }
        };

        const fetchContent = async () => {
            const res = await fetch(`/api/blog/getSingle?title=${blogTitle}`);
            const data = await res.json();
            setContent(data.content);
            setIsLoading(false);
        };

        checkImage();
        fetchContent();
    }, [blogTitle]);

    return (
        <div className={styles.translatorPage}>
            <div className={styles.heroSection}>
                <img
                    className={styles.fullBackgroundImage}
                    src={imageSrc}
                    alt="blog background"
                />
                <div className={styles.titleOverlay}>
                    <span className={styles.nameEnglish}>{blogTitle.replaceAll('%20', ' ')}</span>
                </div>
            </div>

            <div className={styles.mainSection}>
                <div id="about" className={styles.description}>
                    <div className={styles.descriptionContent}>
                        {isLoading ? (
                            <div className={styles.loading}>Loading...</div>
                        ) : (
                            <>  
                                <h1 className={styles.nameInDescription}>{blogTitle.replaceAll('%20', ' ')}</h1>
                                <FormatContent content={content} className={styles.descriptionText} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogPage;
