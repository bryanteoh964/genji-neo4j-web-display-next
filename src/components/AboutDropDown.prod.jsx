import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useIsAdmin } from '../hooks/useAuth';
import styles from '../styles/pages/moreDropDown.module.css';

const MoreDropDown = () => {
    // State to track if the dropdown is open or closed
    const [isOpen, setIsOpen] = useState(false);
    const { isAdmin } = useIsAdmin();

    // Ref to reference the dropdown container element
    const dropdownRef = useRef(null);

    const pathname = usePathname();

    // Toggles the dropdown open/close state
    const handleMenuClick = () => {
        setIsOpen(!isOpen);
    };

    // Closes the dropdown if the user clicks outside of it
    const handleClickOutside = (event) => {
        // Check if the click was outside the dropdown element
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    // Adds an event listener to detect clicks outside the dropdown
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Cleanup: Remove the event listener when the component unmounts
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const isActive = (path) => {
        if (path === '/') {
            return pathname === path;
        }
        return pathname.startsWith(path);
    };

    const isAnyLinkActive = () => {
        const paths = [
            '/aboutThisSite',
            '/user-guide',
            '/Sources',
            '/translators',
            '/teamMembers',
            '/methodology',
            '/collaborate',
            '/administrator',
        ];
        return paths.some(path => isActive(path));
    };

    return (
        <div
            ref={dropdownRef}
            className={`${styles.AboutDropdown} ${isOpen ? styles.open : ''}`}
        >
            <button 
                onClick={handleMenuClick} 
                className={`${styles.moreButton} ${isAnyLinkActive() ? styles.active : ''}`}
            >
                about
            </button>

            {/* Render the dropdown options only if the dropdown is open */}
            {isOpen && <MoreOptions setIsOpen={setIsOpen} isAdmin={isAdmin} />}
        </div>
    );
};

const MoreOptions = ({ setIsOpen, isAdmin }) => {
    const pathname = usePathname();

    const isActive = (path) => {
        if (path === '/') {
            return pathname === path;
        }
        return pathname.startsWith(path);
    };

    return (
        <div className={styles.moreOptions}>

            <Link 
                href="/aboutThisSite" 
                className={`${styles.moreLink} ${isActive('/aboutThisSite') ? styles.active : ''}`} 
                onClick={() => setIsOpen(false)}
            >
                this site
            </Link>

            <Link 
                href="/user-guide" 
                className={`${styles.moreLink} ${isActive('/user-guide') ? styles.active : ''}`} 
                onClick={() => setIsOpen(false)}
            >
                user guide
            </Link>

            <Link 
                href="/Sources" 
                className={`${styles.moreLink} ${isActive('/Sources') ? styles.active : ''}`} 
                onClick={() => setIsOpen(false)}
            >
                sources
            </Link>

            <Link 
                href="/translators/Arthur Waley" 
                className={`${styles.moreLink} ${isActive('/translators') ? styles.active : ''}`} 
                onClick={() => setIsOpen(false)}
            >
                translators
            </Link>

            <Link 
                href="/teamMembers" 
                className={`${styles.moreLink} ${isActive('/teamMembers') ? styles.active : ''}`} 
                onClick={() => setIsOpen(false)}
            >
                team members
            </Link>

            <Link 
                href="/methodology" 
                className={`${styles.moreLink} ${isActive('/methodology') ? styles.active : ''}`} 
                onClick={() => setIsOpen(false)}
            >
                methodology
            </Link>

            <Link 
                href="/collaborate" 
                className={`${styles.moreLink} ${isActive('/collaborate') ? styles.active : ''}`} 
                onClick={() => setIsOpen(false)}
            >
                collaborate
            </Link>

            <Link 
                href="https://docs.google.com/forms/d/e/1FAIpQLScY8ZrN5JlW-GJoeOWuJ9l4LPOwSViTMQBfEAJc4Z1O3ahK2w/viewform?usp=header" 
                target="_blank"
                className={styles.moreLink} 
                onClick={() => setIsOpen(false)}
            >
                report an error
            </Link>

            {isAdmin && (
                <Link 
                    href="/administrator" 
                    className={`${styles.moreLink} ${isActive('/administrator') ? styles.active : ''}`} 
                    onClick={() => setIsOpen(false)}
                >
                    administrator
                </Link>
            )}
        </div>
    );
};

export default MoreDropDown;