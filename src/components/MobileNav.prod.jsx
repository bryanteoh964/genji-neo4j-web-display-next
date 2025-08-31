'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from '../styles/MobileNavigation.module.css';
import { SignIn } from './auth/signin-button.prod';
import MobileLogo from './MobileLogo.prod';

const MobileNavigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: session } = useSession();
    const pathname = usePathname();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const isActive = (path) => {
        if (path === '/') {
            return pathname === path;
        }
        return pathname.startsWith(path);
    };

    // Priority pages for mobile
    const mobilePages = [
        { href: '/', label: 'Home' },
        { href: '/mobile-search', label: 'Mobile Poem Search' },
        { href: '/aboutThisSite', label: 'About This Site' }
    ];

    return (
        <div className={styles.mobileNavFrame}>
            <div className={styles.mobileNavContainer}>
                {/* Logo */}
                <div className={styles.logoContainer}>
                    <Link href="/" className={styles.logoLink} onClick={closeMenu}>
                        <MobileLogo className={styles.logoWrapper} />
                    </Link>
                </div>

                {/* Hamburger Menu Button */}
                <button 
                    className={styles.hamburger}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`}></span>
                    <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`}></span>
                    <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`}></span>
                </button>

                {/* Mobile Menu Overlay */}
                <div className={`${styles.mobileMenuOverlay} ${isMenuOpen ? styles.open : ''}`}>
                    <nav className={styles.mobileMenu}>
                        {mobilePages.map((page) => (
                            <Link
                                key={page.href}
                                href={page.href}
                                className={`${styles.mobileMenuLink} ${isActive(page.href) ? styles.active : ''}`}
                                onClick={closeMenu}
                            >
                                {page.label}
                            </Link>
                        ))}
                        
                        <div className={styles.mobileUserControls}>
                            <SignIn />
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default MobileNavigation;
