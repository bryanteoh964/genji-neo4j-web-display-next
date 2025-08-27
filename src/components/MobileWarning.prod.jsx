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
                        Welcome to The Tale of Genji Poem Database! 
                        This mobile version provides access to our core features:
                    </p>
                    <ul>
                        <li>🏠 Home page with site overview</li>
                        <li>🔍 Poem search functionality</li>
                        <li>📖 About this site information</li>
                    </ul>
                    <p>
                        For the full experience with all features, please visit us on a desktop or tablet.
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
