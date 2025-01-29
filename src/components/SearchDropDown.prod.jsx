import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from '../styles/pages/searchDropDown.module.css';

const SearchDropDown = () => {
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
            className={`${styles.searchDropdown} ${isOpen ? styles.open : ''}`}
        >
            <button onClick={handleMenuClick} className={styles.searchButton}>
                Search
            </button>

            {/* Render the dropdown options only if the dropdown is open */}
            {isOpen && <SearchOptions setIsOpen={setIsOpen} />}
        </div>
    );
};

const SearchOptions = ({ setIsOpen }) => {
    return (
        <div className={styles.searchOptions}>
            <Link href="/search/search-by-metadata" className={styles.searchLink} onClick={() => setIsOpen(false)}>
                By Metadata
            </Link>
            <Link href="/search/search-by-keyword" className={styles.searchLink} onClick={() => setIsOpen(false)}>
                By Keyword
            </Link>
        </div>
    );
};

export default SearchDropDown;