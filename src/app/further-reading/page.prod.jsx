'use client'
import React, { useState, useEffect } from 'react';
import FormatContent from "../../components/FormatText.prod"
import styles from "../../styles/pages/blogTemplate.module.css"

const BlogPage = () => {
    const [content, setContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sources, setSources] = useState([]);

    useEffect(() => {
        const fetchContent = async () => {
            const res = await fetch(`/api/blog/getSingle?title=Further Reading`);
            const data = await res.json();
            setContent(data.content);
            setIsLoading(false);
        };

        const fetchSources = async () => {
            const res = await fetch(`/api/source/getSources`);
            const data = await res.json();
            setSources(data);
        };

        fetchContent();
        fetchSources();
    }, []);

    return (
        <div className={styles.translatorPage}>
            <div className={styles.heroSection}>
                <img
                    className={styles.fullBackgroundImage}
                    src={`/images/further_reading_banner.png`}
                    alt="further reading banner"
                />
                {/* <div className={styles.titleOverlay}>
                    <span className={styles.nameEnglish}>ABOUT</span>
                </div> */}
            </div>

            <div className={styles.mainSection}>
                <div className={styles.analysisSources}>
                    {/* Left Side - Panels with Toggles */}
                    <div className={styles.analysisLeft}>
                        <div className={styles.descriptionSources}>
                            <div className={styles.descriptionContentSources}>
                                {isLoading ? (
                                    <div className={styles.loading}>Loading...</div>
                                ) : (
                                    <>  
                                        <FormatContent content={content} className={styles.descriptionText} />
                                    </>
                                )}
                            </div>
                        </div> 
                    </div>
                </div>

                <div className={styles.rightSideSources}>
                    {/* sources section */}
                    <h2 className={styles.translationsHeader}>BOOKS AND ARTICLES ON GENJI POETRY</h2>

                    {isLoading ? (
                        <div className={styles.loading}>Loading...</div>
                    ) : (
                        <div className={styles.sourcesScrollContainer}>
                            {sources.map((source, index) => (
                                <div key={index} className={styles.translationCard}>
                                    <div className={styles.translationContent}>
                                        <FormatContent content={source.title}/>
                                    </div>
                                    <span className={styles.translatorName} style={{backgroundColor: 'rgba(154, 152, 152, 0.66)'}}>{source.author}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BlogPage;
