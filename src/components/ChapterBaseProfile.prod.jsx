'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import FormatContent from './FormatText.prod';
import chapterStyles from '../styles/pages/chapterBaseProfile.module.css';
import blogStyles from '../styles/pages/blogTemplate.module.css';

export default function ChaptersListPage() {
  const [chapters, setChapters] = useState([]);
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
        // Fetch chapters
        const chaptersRes = await fetch('/api/chapter_names');
        if (!chaptersRes.ok) throw new Error('Failed to fetch chapters');
        const chaptersData = await chaptersRes.json();
        setChapters(chaptersData);

        // Fetch blog content for "Chapters"
        const blogRes = await fetch(`/api/blog/getSingle?title=Chapters`);
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
        !event.target.closest(`.${chapterStyles.analysisPanel}`) &&
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
    <div className={chapterStyles.characterProfilePage}>
      <div className={chapterStyles.heroSection}>
        <img
          className={chapterStyles.fullBackgroundImage}
          src="/images/chapter_banner.png"
          alt="Chapter background"
        />
      </div>

      <div className={blogStyles.mainSection} style={{ gap: '2rem' }}>
        <div className={blogStyles.analysisContainer}>
          {/* Left Side - Chapters List */}
          <div className={chapterStyles.analysisPanel}>
            <div className={chapterStyles.panelHeader}>
              <input
                ref={searchInputRef}
                type="text"
                className={chapterStyles.panelHeaderSearch}
                placeholder="Search Chapters"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <div className={chapterStyles.panelMedium} onClick={() => setIsDropdownOpen(!isDropdownOpen)}></div>
              <div 
                className={`${chapterStyles.toggleArrow} ${isDropdownOpen ? chapterStyles.arrowExpanded : chapterStyles.arrowCollapsed}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                ▼
              </div>
            </div>

            <div className={`${chapterStyles.panelContent} ${isDropdownOpen ? chapterStyles.expanded : ''}`}>
              <div className={chapterStyles.scrollableList}>
                {filteredChapters.map((chapter, index) => (
                  <div key={index} className={chapterStyles.characterItem}>
                    <Link href={`/chapters/${encodeURIComponent(chapter.name)}`} style={{ textDecoration: 'none' }}>
                      <button className={chapterStyles.characterButton}>
                        {chapter.number}: {chapter.name} ({chapter.kanji})
                      </button>
                    </Link>
                  </div>
                ))}
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
