import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from '../styles/pages/moreDropDown.module.css';

const MoreDropDown = () => {
    // State to track if the dropdown is open or closed
    const [isOpen, setIsOpen] = useState(false);

    // Ref to reference the dropdown container element
    const dropdownRef = useRef(null);

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

    return (
        <div
            ref={dropdownRef}
            className={`${styles.moreDropdown} ${isOpen ? styles.open : ''}`}
        >
            <button onClick={handleMenuClick} className={styles.moreButton}>
                more
            </button>

            {/* Render the dropdown options only if the dropdown is open */}
            {isOpen && <MoreOptions setIsOpen={setIsOpen} />}
        </div>
    );
};

const MoreOptions = ({ setIsOpen }) => {
    return (
        <div className={styles.moreOptions}>

            <Link href="/blog" className={styles.moreLink} onClick={() => setIsOpen(false)}>
                blog
            </Link>

            <Link href="/teamMembers" className={styles.moreLink} onClick={() => setIsOpen(false)}>
                team members
            </Link>

            <Link href="/collaborate" className={styles.moreLink} onClick={() => setIsOpen(false)}>
                collaborate
            </Link>

            <Link href="/Sources" className={styles.moreLink} onClick={() => setIsOpen(false)}>
                sources & resources
            </Link>

            <Link href="/translators" className={styles.moreLink} onClick={() => setIsOpen(false)}>
                translators
            </Link>

            <Link href="/characters/relationships" className={styles.moreLink} onClick={() => setIsOpen(false)}>
                relationships
            </Link>

            <Link href="/characters/map" className={styles.moreLink} onClick={() => setIsOpen(false)}>
                map
            </Link>

            <Link href="/characters/timeline" className={styles.moreLink} onClick={() => setIsOpen(false)}>
                timeline
            </Link>

            <Link href="https://docs.google.com/forms/d/e/1FAIpQLScY8ZrN5JlW-GJoeOWuJ9l4LPOwSViTMQBfEAJc4Z1O3ahK2w/viewform?usp=header" 
                  target="_blank"
                  className={styles.moreLink} onClick={() => setIsOpen(false)}>
                report an error
            </Link>
        </div>
    );
};

export default MoreDropDown;