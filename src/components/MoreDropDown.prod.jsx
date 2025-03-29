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

            <Link href="/characters/map" className={styles.moreLink} onClick={() => setIsOpen(false)}>
                map
            </Link>

            <Link href="/characters" className={styles.moreLink} onClick={() => setIsOpen(false)}>
                relationships
            </Link>

            <Link href="/characters/timeline" className={styles.moreLink} onClick={() => setIsOpen(false)}>
                timeline
            </Link>

            <Link href="/acknowledgements" className={styles.moreLink} onClick={() => setIsOpen(false)}>
                acknowledgements
            </Link>

            <Link href="/Sources" className={styles.moreLink} onClick={() => setIsOpen(false)}>
                sources & resources
            </Link>

            <Link href="/bug" className={styles.moreLink} onClick={() => setIsOpen(false)}>
                report a bug
            </Link>
        </div>
    );
};

export default MoreDropDown;