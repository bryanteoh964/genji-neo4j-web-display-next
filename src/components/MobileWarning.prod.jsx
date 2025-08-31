'use client';

import { useState, useEffect } from 'react';
import styles from '../styles/MobileWarning.module.css';

const MobileWarning = () => {
    const [showWarning, setShowWarning] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            
            // Show warning only once per session for mobile users
            if (mobile && !sessionStorage.getItem('mobileWarningShown')) {
                setShowWarning(true);
                sessionStorage.setItem('mobileWarningShown', 'true');
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleClose = () => {
        setShowWarning(false);
    };

    if (!showWarning || !isMobile) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3>Mobile Experience</h3>
                    <button onClick={handleClose} className={styles.closeButton}>
                        ×
                    </button>
                </div>
                <div className={styles.content}>
                    <p>
                        Welcome to The Tale of Genji<br />Poem Database!
                    </p>
                    <ul>
                        <li>🔎 Perform quick poem text searches</li>
                        <li>📚 View all available poem translations</li>
                        <li>📖 View the “About This Site” page</li>
                    </ul>
                    <p>
                        For the full experience with all features, please visit us on a desktop or laptop.
                    </p>
                </div>
                <div className={styles.footer}>
                    <button onClick={handleClose} className={styles.continueButton}>
                        Continue to Mobile Site
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileWarning;
