import React, { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/pages/searchDropDown.module.css';

const SearchDropDown = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleMenuClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`${styles.searchDropdown} ${isOpen ? styles.open : ''}`}>
            <button onClick={handleMenuClick} className={styles.searchButton}>
                Search
            </button>

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