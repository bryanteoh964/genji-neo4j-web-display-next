import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../styles/pages/moreDropDown.module.css';

const MoreDropDown = () => {
    // State to track if the dropdown is open or closed
    const [isOpen, setIsOpen] = useState(false);

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
            '/blog',
            '/furtherReading',
            '/characters/relationships',
            '/characters/map',
            '/characters/timeline'
        ];
        return paths.some(path => isActive(path));
    };

    return (
        <div
            ref={dropdownRef}
            className={`${styles.moreDropdown} ${isOpen ? styles.open : ''}`}
        >
            <button 
                onClick={handleMenuClick} 
                className={`${styles.moreButton} ${isAnyLinkActive() ? styles.active : ''}`}
            >
                more
            </button>

            {/* Render the dropdown options only if the dropdown is open */}
            {isOpen && <MoreOptions setIsOpen={setIsOpen} />}
        </div>
    );
};

const MoreOptions = ({ setIsOpen }) => {
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
                href="/blog" 
                className={`${styles.moreLink} ${isActive('/blog') ? styles.active : ''}`} 
                onClick={() => setIsOpen(false)}
            >
                blog
            </Link>

            <Link 
                href="/furtherReading" 
                className={`${styles.moreLink} ${isActive('/furtherReading') ? styles.active : ''}`} 
                onClick={() => setIsOpen(false)}
            >
                further reading
            </Link>
            
            <Link 
                href="/characters/relationships" 
                className={`${styles.moreLink} ${isActive('/characters/relationships') ? styles.active : ''}`} 
                onClick={() => setIsOpen(false)}
            >
                relationships
            </Link>

            <Link 
                href="/characters/map" 
                className={`${styles.moreLink} ${isActive('/characters/map') ? styles.active : ''}`} 
                onClick={() => setIsOpen(false)}
            >
                map
            </Link>

            <Link 
                href="/characters/timeline" 
                className={`${styles.moreLink} ${isActive('/characters/timeline') ? styles.active : ''}`} 
                onClick={() => setIsOpen(false)}
            >
                timeline
            </Link>

        </div>
    );
};

export default MoreDropDown;