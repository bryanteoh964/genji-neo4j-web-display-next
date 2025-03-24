'use client'
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from '../styles/pages/characterDropDown.module.css';

const CharactersDropDown = ({ l }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleMenuClick = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div
            ref={dropdownRef}
            className={`${styles.charactersDropdown} ${isOpen ? styles.open : ''}`}
        >
            <button onClick={handleMenuClick} className={styles.charactersButton}>
                characters
            </button>

            {isOpen && <CharactersOptions setIsOpen={setIsOpen} l={l} />}
        </div>
    );
};

const CharactersOptions = ({ setIsOpen, l }) => {
    function searchCharacters(query) {
        const filter = query.toUpperCase();
        const characterItems = document.getElementsByClassName("characterItem");

        for (let i = 0; i < characterItems.length; i++) {
            const characterName = characterItems[i];
            const nameText = characterName.textContent || characterName.innerText;
            const simplifiedName = nameText.toUpperCase().replace("Ō", "O").replace("Ū", "U");
            
            if (simplifiedName.indexOf(filter) > -1) {
                characterItems[i].style.display = "";
            } else {
                characterItems[i].style.display = "none";
            }
        }
    }

    const sortedCharacters = [...l].sort();

    return (
        <div className={styles.charactersOptions}>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search Character"
                    onClick={(e) => {
                        if (e.target.value === '') {
                            searchCharacters('');
                        }
                    }}
                    onKeyUp={(e) => searchCharacters(e.target.value)}
                />
            </div>
            
            <ul className={styles.charactersList}>
                {sortedCharacters.map((characterName) => (
                    <li 
                        className="characterItem" 
                        key={characterName}
                    >
                        <Link
                            href={`/characters/${characterName}`}
                            className={styles.characterLink}
                            onClick={() => setIsOpen(false)}
                        >
                            {characterName}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CharactersDropDown;