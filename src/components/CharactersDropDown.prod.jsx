import React, { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/pages/searchDropDown.module.css';

const CharactersDropDown = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleMenuClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`${styles.searchDropdown} ${isOpen ? styles.open : ''}`}>
            <button onClick={handleMenuClick} className={styles.searchButton}>
                Characters 
            </button>

            {isOpen && <SearchOptions setIsOpen={setIsOpen} />}
        </div>
    );
};

const SearchOptions = ({ setIsOpen }) => {
    return (
        <div className={styles.searchOptions}>
            <Link href="/characters" className={styles.searchLink} onClick={() => setIsOpen(false)}>
                Diagram
            </Link>
            <Link href="/characters/timeline" className={styles.searchLink} onClick={() => setIsOpen(false)}>
                Timeline 
            </Link>
            <Link href="/characters/map" className={styles.searchLink} onClick={() => setIsOpen(false)}>
                Map 
            </Link>
        </div>
    );
};

export default CharactersDropDown;