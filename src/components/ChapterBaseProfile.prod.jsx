'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from '../styles/pages/characterBaseProfile.module.css'; // Can reuse or rename

export default function ChaptersListPage() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await fetch('/api/chapter_names');
        if (!res.ok) throw new Error('Failed to fetch chapters');
        const data = await res.json();
        setChapters(data);
      } catch (error) {
        console.error("Error fetching chapters:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchChapters();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  };

  const filteredChapters = chapters.filter(chapter => {
    const nameMatch = chapter.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const numberMatch = chapter.number?.toString().includes(searchTerm);
    return nameMatch || numberMatch;
  });
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDropdownOpen &&
        !event.target.closest(`.${styles.analysisPanel}`) &&
        event.target !== searchInputRef.current
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (loading) return <p>Loading chapters...</p>;
  if (error) return <p>Error loading chapters: {error}</p>;
  if (chapters.length === 0) return <p>No chapters found.</p>;

  return (
    <div className={styles.characterProfilePage}>
      <div className={styles.heroSection}>
        <img
          className={styles.fullBackgroundImage}
          src="/images/chapter_banner.png"
          alt="Chapter background"
        />
      </div>
      <div className={styles.characterProfileContainer}>
        <div className={styles.analysisPanel}>
          <div className={styles.panelHeader}>
            <input
              ref={searchInputRef}
              type="text"
              className={styles.panelHeaderSearch}
              placeholder="Search Chapters"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div className={styles.panelMedium} onClick={() => setIsDropdownOpen(!isDropdownOpen)}></div>
            <div 
              className={`${styles.toggleArrow} ${isDropdownOpen ? styles.arrowExpanded : styles.arrowCollapsed}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              ▼
            </div>
          </div>

          <div className={`${styles.panelContent} ${isDropdownOpen ? styles.expanded : ''}`}>
            <div className={styles.scrollableList}>
              {filteredChapters.map((chapter, index) => (
                <div key={index} className={styles.characterItem}>
                  <Link href={`/chapters/${encodeURIComponent(chapter.name)}`} style={{ textDecoration: 'none' }}>
                    <button className={styles.characterButton}>
                      {chapter.number}: {chapter.name} ({chapter.kanji})
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
