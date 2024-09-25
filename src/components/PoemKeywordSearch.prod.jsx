import React, { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import Link from 'next/link';
import styles from '../styles/pages/poemKeywordSearch.module.css';
import {BackTop} from 'antd';

// funtion to remove leading zero of chapternum and poemnum, ensure the correctness of link
const removeLeadingZero = (num) => {
  return num.replace(/^0+/, '');
};

const PoemSearch = () => {
  const [query, setQuery] = useState('');
  const [groupedResults, setGroupedResults] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState('all');
  const searchInputRef = useRef(null);

  // highlight matching keywords
  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, index) => 
      regex.test(part) ? <mark key={index} className={styles.highlight}>{part}</mark> : part
    );
  };

  const groupResultsByChapter = (results) => {
    return results.reduce((acc, result) => {
      const chapter = result.chapterNum;
      if (!acc[chapter]) {
        acc[chapter] = [];
      }
      acc[chapter].push(result);
      return acc;
    }, {});
  };

  const handleSearch = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim()) {
        setGroupedResults({});
        setShowResults(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/poems/poem_search?q=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) {
          throw new Error('Not found.');
        }
        const data = await response.json();

        console.log("searchresult:", data.searchResults)

        if (Array.isArray(data.searchResults)) {
          const processedResults = data.searchResults.map(result => ({
            chapterNum: removeLeadingZero(Object.values(result.chapterNum).join('')),
            poemNum: removeLeadingZero(Object.values(result.poemNum).join('')),
            japanese: Object.values(result.japanese).join(''),
            romaji: Object.values(result.romaji).join(''),
            waley_translation: Object.values(result.waley_translation).join(''),
            seidensticker_translation:Object.values(result.seidensticker_translation).join(''),
            tyler_translation: Object.values(result.tyler_translation).join(''),
            washburn_translation: Object.values(result.washburn_translation).join(''),
            cranston_translation: Object.values(result.cranston_translation).join('')
          }));

          console.log(processedResults)

          const grouped = groupResultsByChapter(processedResults);
          setGroupedResults(grouped);
          setShowResults(true);
          setSelectedChapter('all');
        } else {
          throw new Error('Received unexpected data structure from server');
        }
      } catch (error) {
        console.error('Search error:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

// when query or handleSearch changed, trigger handleSearch()
  useEffect(() => {
    handleSearch(query);
  }, [query, handleSearch]);

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    // handle when seaching bar goes back to empty status
    if (!newQuery.trim()) {
      setShowResults(false);
    }
  };

  // create arrays based on chapter
  const ChapterSelector = () => {
    const chapters = ['all', ...Object.keys(groupedResults).sort((a, b) => Number(a) - Number(b))];
    return (
      <div className={styles.chapterSelector}>
        {chapters.map((chapter) => (
          <button
            key={chapter}
            onClick={() => setSelectedChapter(chapter)}
            className={`${styles.chapterButton} ${selectedChapter === chapter ? styles.active : ''}`}
          >
            {chapter === 'all' ? 'All Chapters' : `Chapter ${chapter}`}
          </button>
        ))}
      </div>
    );
  };

  const renderResults = () => {
    let resultsToRender = [];
    if (selectedChapter === 'all') {
      resultsToRender = Object.values(groupedResults).flat();
    } else {
      resultsToRender = groupedResults[selectedChapter] || [];
    }

    return (
      <ul className={styles.searchResults}>
        {resultsToRender.map((result, index) => (
          <li key={`${result.chapterNum}-${result.poemNum}-${index}`} className={styles.searchResultItem}>
            <Link href={`/poems/${result.chapterNum}/${result.poemNum}`}>
              <p className={styles.chapterPoemInfo}>Chapter {result.chapterNum} - Poem {result.poemNum}</p>
              <p className={styles.japaneseText}>{highlightMatch(result.japanese, query)}</p>
              <p className={styles.romajiText}>{highlightMatch(result.romaji, query)}</p>
              <p className={styles.romajiText}>Waley: {highlightMatch(result.waley_translation, query)}</p>
              <p className={styles.romajiText}>Seidensticker: {highlightMatch(result.seidensticker_translation, query)}</p>
              <p className={styles.romajiText}>Tyler: {highlightMatch(result.tyler_translation, query)}</p>
              <p className={styles.romajiText}>Washburn: {highlightMatch(result.washburn_translation, query)}</p>
              <p className={styles.romajiText}>Cranston: {highlightMatch(result.cranston_translation, query)}</p>
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={styles.poemSearch}>
      <input
        ref={searchInputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setShowResults(true)}
        placeholder="Enter keyword..."
        className={styles.searchInput}
      />
      {isLoading && <div className={styles.loadingMessage}>Searching...</div>}
      {error && <div className={styles.errorMessage}>{error}</div>}
      {showResults && Object.keys(groupedResults).length > 0 && (
        <>
          <ChapterSelector />
          {renderResults()}
        </>
      )}
      {query && Object.keys(groupedResults).length === 0 && !isLoading && !error && (
        <div className={styles.noResultsMessage}>Not Found.</div>
      )}
      <BackTop className={styles.backTop}>
        <div>Back to top</div>
      </BackTop>
      </div>
  );
};

export default PoemSearch;