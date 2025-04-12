'use client'
import React, { useState, useEffect } from 'react';
import FormatContent from "../../../../components/FormatText.prod"
import styles from "../../../../styles/pages/translatorProfile.module.css"

const TranslatorPage = ({ params }) => {
    const { name } = params;
    const [bio, setBio] = useState(null);
    const [fullName, setFullName] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchBio = async () => {
            const res = await fetch(`/api/translators?name=${name}`);
            const data = await res.json();
            setBio(data.bio);
            setFullName(data.fullName);
            setIsLoading(false);
        };
        fetchBio();
    }, [name]);

    return (
        <div className={styles.translatorPage}>
            <div className={styles.heroSection}>
                <img
                    className={styles.fullBackgroundImage}
                    src="/images/translator_banner.jpg"
                    alt="translator background"
                />
                <div className={styles.titleOverlay}>
                    <span className={styles.nameEnglish}>{fullName}</span>
                </div>
            </div>

            <div className={styles.mainSection}>
                <div id="about" className={styles.description}>
                    <div className={styles.descriptionContent}>
                        {isLoading ? (
                            <div className={styles.loading}>Loading...</div>
                        ) : (
                            <>
                                <span className={styles.nameInDescription}>
                                    {"About " + fullName || ''}
                                </span>
                                <FormatContent content={bio} className={styles.descriptionText} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TranslatorPage;
