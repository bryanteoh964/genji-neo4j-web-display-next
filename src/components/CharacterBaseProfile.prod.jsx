'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from '../styles/pages/characterBaseProfile.module.css';

export default function CharactersListPage() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const res = await fetch('/api/character_names');
        if (!res.ok) throw new Error('Failed to fetch characters');
        const data = await res.json();
        setCharacters(data);
      } catch (error) {
        console.error("Error fetching characters:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Open dropdown when typing in search
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  };


  // Filter characters based on search term
  const filteredCharacters = characters.filter(character => {
    const characterName = character.name || character;
    return characterName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen &&
        !event.target.closest(`.${styles.analysisPanel}`) &&
        event.target !== searchInputRef.current) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (loading) return <p>Loading characters...</p>;
  if (error) return <p>Error loading characters: {error}</p>;
  if (characters.length === 0) return <p>No characters found.</p>;

  return (
    <div className={styles.characterProfilePage}>
      <div className={styles.heroSection}>
        <img
          className={styles.fullBackgroundImage}
          src="/images/character_banner2.png"
          alt="Character background"
        />
      </div>
      <div className={styles.characterProfileContainer}>
        {/* Search Dropdown Section */}
        <div className={styles.analysisPanel}>
          <div className={styles.panelHeader}>
            <input
              ref={searchInputRef}
              type="text"
              className={styles.panelHeaderSearch}
              placeholder="Search Characters..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div className={styles.panelMedium} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            </div>
            <div 
              className={`${styles.toggleArrow} ${isDropdownOpen ? styles.arrowExpanded : styles.arrowCollapsed}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              ▼
            </div>
          </div>

          {/* Dropdown content */}
          <div className={`${styles.panelContent} ${isDropdownOpen ? styles.expanded : ''}`}>
            <div className={styles.scrollableList}>
              {filteredCharacters.length > 0 ? (
                filteredCharacters.map((character, index) => {
                  const characterName = character.name || character;
                  return (
                    <div key={index} className={styles.characterItem}>
                        <Link 
                            href={`/characters/${encodeURIComponent(characterName)}`}
                            style={{ textDecoration: 'none' }}
                        >
                            <button className={styles.characterButton}>
                            {characterName}
                            </button>
                        </Link>
                    </div>
                  );
                })
              ) : (
                <div className={styles.noResults}>No Characters Found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}