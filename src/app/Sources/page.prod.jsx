'use client'
import React, { useState, useEffect } from 'react';
import FormatContent from "../../components/FormatText.prod"
import styles from "../../styles/pages/blogTemplate.module.css"

const BlogPage = () => {
    const [content, setContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sources, setSources] = useState([]);
    const translatorsInfo = [
        {
            name: "ARTHUR WALEY",
            info: "The Tale of Genji, translated by Arthur Waley, 1925-1933. \n[Reissued by Tuttle, 2010.](https://www.tuttlepublishing.com/books-by-country/the-tale-of-genji)"
        },
        {
            name: "EDWARD SEIDENSTICKER",
            info: "The Tale of Genji, translated by Edward Seidensticker, Knopf, 1976. \n[Reissued by Everyman's Library, 1993.](https://www.penguinrandomhouse.com/books/625140/the-tale-of-genji-by-murasaki-shikibu-translated-and-introduction-by-edward-g-seidensticker/)"
        },
        {
            name: "ROYALL TYLER",
            info: "[The Tale of Genji, translated by Royall Tyler. Penguin, 2002.](https://www.penguinrandomhouse.com/books/530271/the-tale-of-genji-by-murasaki-shikibu/)"
        },
        {
            name: "DENNIS WASHBURN",
            info: "[The Tale of Genji, translated by Dennis Washburn. Norton, 2016.](https://wwnorton.com/books/9780393353396)"
        },
        {
            name: "EDWARD CRANSTON",
            info: "Edwin Cranston's versions of the Genji poems can be found along with his commentary in [A Waka Anthology Volume Two: Grasses of Remembrance, Stanford University Press, 2006.](https://www.sup.org/books/title/?id=4046)"
        },
    ]

    useEffect(() => {
        const fetchContent = async () => {
            const res = await fetch(`/api/blog/getSingle?title=Sources`);
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
                    src={`/images/sources_banner.png`}
                    alt="sources banner"
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
                    {/* translators section */}
                    <h2 className={styles.translationsHeader}>TRANSLATION SOURCES</h2>
          
                    <div className={styles.translationCard}>
                        <div className={styles.translationContent}>
                           <FormatContent content={translatorsInfo[0].info}/>
                        </div>
                        <a href="/translators" className={styles.translatorName}>ARTHUR WALEY</a>
                    </div>

                    <div className={styles.translationCard}>
                        <div className={styles.translationContent}>
                            <FormatContent content={translatorsInfo[1].info}/>
                        </div>
                        <a href="/translators" className={styles.translatorName}>EDWARD SEIDENSTICKER</a>
                    </div>

                    <div className={styles.translationCard}>
                        <div className={styles.translationContent}>
                            <FormatContent content={translatorsInfo[2].info}/>
                        </div>
                        <a href="/translators" className={styles.translatorName}>ROYALL TYLER</a>
                    </div>

                    <div className={styles.translationCard}>
                        <div className={styles.translationContent}>
                            <FormatContent content={translatorsInfo[3].info}/>
                        </div>
                        <a href="/translators" className={styles.translatorName}>DENNIS WASHBURN</a>
                    </div>

                    <div className={styles.translationCard}>
                        <div className={styles.translationContent}>
                            <FormatContent content={translatorsInfo[4].info}/>
                        </div>
                        <a href="/translators" className={styles.translatorName}>EDWARD CRANSTON</a>
                    </div>

                    <br/>
                    {/* sources section */}
                    <h2 className={styles.translationsHeader}>OTHER SOURCES + RELATED ARTICLES</h2>

                    {isLoading ? (
                        <div className={styles.loading}>Loading...</div>
                    ) : (
                        sources.map((source, index) => (
                            <div key={index} className={styles.translationCard}>
                                <div className={styles.translationContent}>
                                    <FormatContent content={source.title.split(',').slice(2).join(',').replace(/"/g, '')}/>
                            </div>
                            <span className={styles.translatorName}>{source.author}</span>
                        </div>
                    )))}
                    
                </div>
            </div>
        </div>
    )
}

export default BlogPage;
