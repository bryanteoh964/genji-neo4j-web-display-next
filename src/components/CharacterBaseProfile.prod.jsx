'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import FormatContent from './FormatText.prod';
import characterStyles from '../styles/pages/characterBaseProfile.module.css';
import blogStyles from '../styles/pages/blogTemplate.module.css';

export default function CharactersListPage() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);

  // Blog-related state
  const [isLoadingBlog, setIsLoadingBlog] = useState(true);
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setIsLoadingBlog(true);
      
      try {
        // Fetch characters
        const charactersRes = await fetch('/api/character_names');
        if (!charactersRes.ok) throw new Error('Failed to fetch characters');
        const charactersData = await charactersRes.json();
        setCharacters(charactersData);

        // Fetch blog content for "Characters"
        const blogRes = await fetch(`/api/blog/getSingle?title=Characters`);
        const blogData = await blogRes.json();
        setContent(blogData.content);

      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
        setIsLoadingBlog(false);
      }
    };
    
    fetchData();
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
        !event.target.closest(`.${characterStyles.analysisPanel}`) &&
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
    <div className={characterStyles.characterProfilePage}>
      <div className={characterStyles.heroSection}>
        <img
          className={characterStyles.fullBackgroundImage}
          src="/images/character_banner.png"
          alt="Character background"
        />
      </div>

      <div className={blogStyles.mainSection} style={{ gap: '2rem' }}>
        <div className={blogStyles.analysisContainer}>
          {/* Left Side - Characters List */}
          <div className={characterStyles.analysisPanel}>
            <div className={characterStyles.panelHeader}>
              <input
                ref={searchInputRef}
                type="text"
                className={characterStyles.panelHeaderSearch}
                placeholder="Search Characters"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <div className={characterStyles.panelMedium} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              </div>
              <div 
                className={`${characterStyles.toggleArrow} ${isDropdownOpen ? characterStyles.arrowExpanded : characterStyles.arrowCollapsed}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                ▼
              </div>
            </div>

            <div className={`${characterStyles.panelContent} ${isDropdownOpen ? characterStyles.expanded : ''}`}>
              <div className={characterStyles.scrollableList}>
                {filteredCharacters.length > 0 ? (
                  filteredCharacters.map((character, index) => {
                    const characterName = character.name || character;
                    return (
                      <div key={index} className={characterStyles.characterItem}>
                        <Link 
                          href={`/characters/${encodeURIComponent(characterName)}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <button className={characterStyles.characterButton}>
                            {characterName}
                          </button>
                        </Link>
                      </div>
                    );
                  })
                ) : (
                  <div className={characterStyles.noResults}>No Characters Found</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Blog Content */}
        <div className={blogStyles.description}>
          <div className={blogStyles.descriptionContent} style={{ paddingTop: '0' }}>
            {isLoadingBlog ? (
              <div className={blogStyles.loading} style={{ marginTop: '1rem' }}>Loading...</div>
            ) : (
              <>  
                <FormatContent 
                  content={content} 
                  className={blogStyles.descriptionText} 
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}