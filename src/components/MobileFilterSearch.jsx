import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { debounce } from 'lodash';
import Link from 'next/link';
import styles from '../styles/pages/mobileFilterSearch.module.css';

// Helper functions from the original component
const removeLeadingZero = (num) => {
  return num.replace(/^0+/, '');
};

const getChapterName = (String) => {
  const chapterNames = {
    '01': 'Kiritsubo 桐壺', '02': 'Hahakigi 帚木', '03': 'Utsusemi 空蝉', '04': 'Yūgao 夕顔', '05': 'Wakamurasaki 若紫', '06': 'Suetsumuhana 末摘花', '07': 'Momiji no Ga 紅葉賀', '08': 'Hana no En 花宴', '09': 'Aoi 葵', 
    '10': 'Sakaki 榊', '11': 'Hana Chiru Sato 花散里', '12': 'Suma 須磨', '13': 'Akashi 明石', '14': 'Miotsukushi 澪標', '15': 'Yomogiu 蓬生', '16': 'Sekiya 関屋', '17': 'E Awase 絵合', '18': 'Matsukaze 松風', 
    '19': 'Usugumo 薄雲', '20': 'Asagao 朝顔', '21': 'Otome 乙女', '22': 'Tamakazura 玉鬘', '23': 'Hatsune 初音', '24': 'Kochō 胡蝶', '25': 'Hotaru 螢', '26': 'Tokonatsu 常夏', '27': 'Kagaribi 篝火', 
    '28': 'Nowaki 野分', '29': 'Miyuki 行幸', '30': 'Fujibakama 藤袴', '31': 'Makibashira 真木柱', '32': 'Umegae 梅枝', '33': 'Fuji no Uraba 藤裏葉', '34': 'Wakana: Jō 若菜上', '35': 'Wakana: Ge 若菜下', 
    '36': 'Kashiwagi 柏木', '37': 'Yokobue 横笛', '38': 'Suzumushi 鈴虫', '39': 'Yūgiri 夕霧', '40': 'Minori 御法', '41': 'Maboroshi 幻', '42': 'Niou Miya 匂宮', '43': 'Kōbai 紅梅', '44': 'Takekawa 竹河', 
    '45': 'Hashihime 橋姫', '46': 'Shii ga Moto 椎本', '47': 'Agemaki 総角', '48': 'Sawarabi 早蕨', '49': 'Yadorigi 宿木', '50': 'Azumaya 東屋', '51': 'Ukifune 浮舟', '52': 'Kagerō 蜻蛉', '53': 'Tenarai 手習', 
    '54': 'Yume no Ukihashi 夢浮橋'
  };
  const formattedKey = String.toString().padStart(2, '0');
  return chapterNames[formattedKey] || "Unknown Chapter";
};

const MobileFilterSearch = () => {
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedPoem, setSelectedPoem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Search filters (keep only chapter input alongside main keyword)
  const [searchChapter, setSearchChapter] = useState("");
  
  // Filter options (we won't render the available value pills; keep chapter selection minimal)
  const [availableChapters, setAvailableChapters] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState([]);

  // Highlight matching keywords
  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className={styles.highlight}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Search handler
  const handleSearch = useCallback(
    debounce(async (searchQuery) => {
      setIsLoading(true);
      setError(null);

      const queryToUse = searchQuery.trim() ? searchQuery : "=#=";

      try {
        const response = await fetch(`/api/poems/poem_search?q=${encodeURIComponent(queryToUse)}`);

        if (!response.ok) {
          throw new Error("Not found.");
        }

        const data = await response.json();

        if (Array.isArray(data.searchResults)) {
          const processedResults = data.searchResults.map((result) => ({
            chapterNum: Object.values(result.chapterNum).join(""),
            poemNum: Object.values(result.poemNum).join(""),
            chapterAbr: Object.values(result.chapterAbr).join(""),
            japanese: Object.values(result.japanese).join(""),
            romaji: Object.values(result.romaji).join(""),
            paraphrase: result.paraphrase ? Object.values(result.paraphrase).join("") : "",
            addressee_name: typeof result.addressee_name === "string" 
              ? result.addressee_name 
              : Object.values(result.addressee_name).join(""),
            addressee_gender: Object.values(result.addressee_gender).join(""),
            speaker_name: Object.values(result.speaker_name).join(""),
            speaker_gender: Object.values(result.speaker_gender).join(""),
            waley_translation: Object.values(result.waley_translation).join(""),
            seidensticker_translation: Object.values(result.seidensticker_translation).join(""),
            tyler_translation: Object.values(result.tyler_translation).join(""),
            washburn_translation: Object.values(result.washburn_translation).join(""),
            cranston_translation: Object.values(result.cranston_translation).join(""),
          }));

          setResults(processedResults);
          setShowResults(true);

          // Update available chapters only (we won't show chips for speakers/addressees)
          const chapters = [...new Set(processedResults.map(r => r.chapterNum))].sort();
          setAvailableChapters(chapters);
        } else {
          throw new Error("Received unexpected data structure from server");
        }
      } catch (error) {
        console.error("Search error:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    handleSearch(query);
  }, [query, handleSearch]);

  // Filter results based on selected chapter filters and the typed chapter search
  const filteredResults = useMemo(() => {
    const sc = (searchChapter || '').trim().toLowerCase();
    return results.filter(result => {
      const chapterMatchSelected = selectedChapters.length === 0 || selectedChapters.includes(result.chapterNum);

      // If user typed into the chapter search box, filter by chapter number or chapter name
      let chapterMatchSearch = true;
      if (sc !== '') {
        const formatted = result.chapterNum.toString().padStart(2, '0');
        const chapterName = getChapterName(formatted).toLowerCase();
        chapterMatchSearch = formatted.includes(sc) || chapterName.includes(sc);
      }

      return chapterMatchSelected && chapterMatchSearch;
    });
  }, [results, selectedChapters, searchChapter]);

  const handlePoemClick = (poem) => {
    setSelectedPoem(poem);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPoem(null);
  };

  // Close modal with Escape key for accessibility
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && showModal) closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showModal]);

  // Only chapter filter toggle is needed in mobile simplified UI
  const handleFilterToggle = (value) => {
    if (selectedChapters.includes(value)) {
      setSelectedChapters(selectedChapters.filter(item => item !== value));
    } else {
      setSelectedChapters([...selectedChapters, value]);
    }
  };

  const clearAllFilters = () => {
    setSelectedChapters([]);
    setSearchChapter("");
    setQuery("");
  };

  return (
    <div className={styles.mobileSearch}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Poem Search</h1>
      </div>

      {/* Search Inputs */}
      <div className={styles.searchSection}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search poem text..."
          className={styles.mainSearchInput}
        />

        <div className={styles.filterInputs}>
          <input
            type="text"
            value={searchChapter}
            onChange={(e) => setSearchChapter(e.target.value)}
            placeholder="Filter chapters..."
            className={styles.filterInput}
          />
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading && <div className={styles.loading}>Searching...</div>}
      {error && <div className={styles.error}>{error}</div>}

      {/* Results Header Row - only show when we have results */}
      {showResults && filteredResults.length > 0 && (
        <div className={styles.resultsHeader}>
          <div className={styles.resultsCount}>
            {filteredResults.length} poems found
          </div>
          <button className={styles.resultsClearButton} onClick={clearAllFilters}>
            Clear All
          </button>
        </div>
      )}

      {/* Results List */}
      {showResults && filteredResults.length > 0 && (
        <div className={styles.resultsList}>
          {filteredResults.map((result, index) => (
            <div
              key={index}
              className={styles.resultItem}
              onClick={() => handlePoemClick(result)}
            >
              <div className={styles.resultHeader}>
                <div className={styles.poemNumbers}>
                  <span className={styles.chapterNum}>{removeLeadingZero(result.chapterNum)}</span>
                  <span className={styles.poemNum}>{removeLeadingZero(result.poemNum)}</span>
                </div>
                <div className={styles.chapterKanji}>
                  {getChapterName(result.chapterNum)}
                </div>
              </div>
              
              <div className={styles.participants}>
                <span 
                  className={styles.speaker}
                  style={{
                    color: result.speaker_gender === 'male' ? '#436875' : 
                           result.speaker_gender === 'female' ? '#B03F2E' : 'inherit'
                  }}
                >
                  {result.speaker_name}
                </span>

                <div className={styles.poemText}>
                    <div className={styles.japanese}>
                    {highlightMatch(result.japanese.split("\n")[0], query)}
                    </div>
                </div>

                <span 
                  className={styles.addressee}
                  style={{
                    color: result.addressee_gender === 'male' ? '#436875' : 
                           result.addressee_gender === 'female' ? '#B03F2E' : 'inherit'
                  }}
                >
                  {result.addressee_name}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {query && results.length === 0 && !isLoading && !error && (
        <div className={styles.noResults}>No results found</div>
      )}

      {/* Modal for Poem Details */}
      {showModal && selectedPoem && (
        <div className={styles.modal} onClick={closeModal} role="dialog" aria-modal="true">
          <button className={styles.closeButton} onClick={closeModal} aria-label="Close">×</button>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            
            <div className={styles.modalHeader}>
                <div className={styles.modalHeaderLeft}>
                    <div className={styles.poemNumbers}>
                        <span className={styles.chapterNum}>{removeLeadingZero(selectedPoem.chapterNum)}</span>
                        <span className={styles.poemNum}>{removeLeadingZero(selectedPoem.poemNum)}</span>
                    </div>
                    <div className={styles.chapterNameHeader}>
                        {getChapterName(selectedPoem.chapterNum)}
                    </div>              
                </div>
            </div>

            <div className={styles.modalPoemText}>
              <div className={styles.modalJapanese}>
                {(() => {
                  const joined = (selectedPoem.japanese || '').split("\n").join('');
                  return <div className={styles.modalJapaneseInline}>{highlightMatch(joined, query)}</div>;
                })()}
              </div>
            </div>

            <div className={styles.translationsCompact}>
              {selectedPoem.waley_translation && (
                <div className={styles.translationTile}>
                  <div>
                    {(selectedPoem.waley_translation || '').split('\n').map((line, index) => (
                      <p key={`waley-${index}`}>{highlightMatch(line, query)}</p>
                    ))}
                  </div>
                  <div className={styles.translatorBadge}>Waley</div>
                </div>
              )}

              {selectedPoem.seidensticker_translation && (
                <div className={styles.translationTile}>
                  <div>
                    {(selectedPoem.seidensticker_translation || '').split('\n').map((line, index) => (
                      <p key={`seidensticker-${index}`}>{highlightMatch(line, query)}</p>
                    ))}
                  </div>
                  <div className={styles.translatorBadge}>Seidensticker</div>
                </div>
              )}

              {selectedPoem.tyler_translation && (
                <div className={styles.translationTile}>
                  <div>
                    {(selectedPoem.tyler_translation || '').split('\n').map((line, index) => (
                      <p key={`tyler-${index}`}>{highlightMatch(line, query)}</p>
                    ))}
                  </div>
                  <div className={styles.translatorBadge}>Tyler</div>
                </div>
              )}

              {selectedPoem.washburn_translation && (
                <div className={styles.translationTile}>
                  <div>
                    {(selectedPoem.washburn_translation || '').split('\n').map((line, index) => (
                      <p key={`washburn-${index}`}>{highlightMatch(line, query)}</p>
                    ))}
                  </div>
                  <div className={styles.translatorBadge}>Washburn</div>
                </div>
              )}

              {selectedPoem.cranston_translation && (
                <div className={styles.translationTile}>
                  <div>
                    {(selectedPoem.cranston_translation || '').split('\n').map((line, index) => (
                      <p key={`cranston-${index}`}>{highlightMatch(line, query)}</p>
                    ))}
                  </div>
                  <div className={styles.translatorBadge}>Cranston</div>
                </div>
              )}
            </div>

            {selectedPoem.paraphrase && (
              <div className={styles.modalParaphrase}>
                <h4>Paraphrase</h4>
                <p>{highlightMatch(selectedPoem.paraphrase, query)}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(MobileFilterSearch);