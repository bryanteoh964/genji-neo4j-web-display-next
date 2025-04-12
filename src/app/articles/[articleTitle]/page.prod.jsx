'use client'
import React, { useState, useEffect } from 'react';
import FormatContent from "../../../components/FormatText.prod"
import styles from "../../../styles/pages/translatorProfile.module.css"

const ArticlePage = ({ params }) => {
    const { articleTitle } = params;
    const [content, setContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        const checkImage = async () => {
            try {
                const jpgResponse = await fetch(`/images/${articleTitle}.jpg`);
                if (jpgResponse.ok) {
                    setImageSrc(`/images/${articleTitle}.jpg`);
                } else {
                    const pngResponse = await fetch(`/images/${articleTitle}.png`);
                    if (pngResponse.ok) {
                        setImageSrc(`/images/${articleTitle}.png`);
                    } else {
                        setImageSrc('/images/default_article.jpg');
                    }
                }
            } catch (error) {
                setImageSrc('/images/default_article.jpg');
            }
        };

        const fetchContent = async () => {
            const res = await fetch(`/api/articles/getSingle?title=${articleTitle}`);
            const data = await res.json();
            setContent(data.content);
            setIsLoading(false);
        };

        checkImage();
        fetchContent();
    }, [articleTitle]);

    return (
        <div className={styles.translatorPage}>
            <div className={styles.heroSection}>
                <img
                    className={styles.fullBackgroundImage}
                    src={imageSrc}
                    alt="article background"
                />
                <div className={styles.titleOverlay}>
                    <span className={styles.nameEnglish}>{articleTitle.replaceAll('%20', ' ')}</span>
                </div>
            </div>

            <div className={styles.mainSection}>
                <div id="about" className={styles.description}>
                    <div className={styles.descriptionContent}>
                        {isLoading ? (
                            <div className={styles.loading}>Loading...</div>
                        ) : (
                            <>  
                                <h1 className={styles.nameInDescription}>{articleTitle.replaceAll('%20', ' ')}</h1>
                                <FormatContent content={content} className={styles.descriptionText} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ArticlePage;
