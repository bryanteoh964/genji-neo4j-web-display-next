import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { debounce } from 'lodash';
import Link from 'next/link';
import styles from '../styles/pages/filterSearch.module.css';
import { BackTop, Checkbox} from 'antd';

// funtion to remove leading zero of chapternum and poemnum, ensure the correctness of link
const removeLeadingZero = (num) => {
  return num.replace(/^0+/, '');
};

const getChapterName = (String) => {
  const chapterNames = {'1':'Kiritsubo 桐壺','2':'Hahakigi 帚木','3':'Utsusemi 空蝉','4':'Yūgao 夕顔','5':'Wakamurasaki 若紫','6':'Suetsumuhana 末摘花','7':'Momiji no Ga 紅葉賀','8':'Hana no En 花宴','9':'Aoi 葵','10':'Sakaki 榊','11':'Hana Chiru Sato 花散里','12':'Suma 須磨','13':'Akashi 明石','14':'Miotsukushi 澪標','15':'Yomogiu 蓬生','16':'Sekiya 関屋','17':'E Awase 絵合','18':'Matsukaze 松風','19':'Usugumo 薄雲','20':'Asagao 朝顔','21':'Otome 乙女','22':'Tamakazura 玉鬘','23':'Hatsune 初音','24':'Kochō 胡蝶','25':'Hotaru 螢','26':'Tokonatsu 常夏','27':'Kagaribi 篝火','28':'Nowaki 野分','29':'Miyuki 行幸','30':'Fujibakama 藤袴','31':'Makibashira 真木柱','32':'Umegae 梅枝','33':'Fuji no Uraba 藤裏葉','34':'Wakana: Jō 若菜上','35':'Wakana: Ge 若菜下','36':'Kashiwagi 柏木','37':'Yokobue 横笛','38':'Suzumushi 鈴虫','39':'Yūgiri 夕霧','40':'Minori 御法','41':'Maboroshi 幻','42':'Niou Miya 匂宮','43':'Kōbai 紅梅','44':'Takekawa 竹河','45':'Hashihime 橋姫','46':'Shii ga Moto 椎本','47':'Agemaki 総角','48':'Sawarabi 早蕨','49':'Yadorigi 宿木','50':'Azumaya 東屋','51':'Ukifune 浮舟','52':'Kagerō 蜻蛉','53':'Tenarai 手習','54':'Yume no Ukihashi 夢浮橋'};
  return chapterNames[String];
}

const getChapterName_noJP = (String) => {
  const chapterNames = {'1':'Kiritsubo','2':'Hahakigi','3':'Utsusemi','4':'Yūgao','5':'Wakamurasaki','6':'Suetsumuhana','7':'Momiji no Ga','8':'Hana no En','9':'Aoi','10':'Sakaki','11':'Hana Chiru Sato','12':'Suma','13':'Akashi','14':'Miotsukushi','15':'Yomogiu','16':'Sekiya','17':'E Awase','18':'Matsukaze','19':'Usugumo','20':'Asagao','21':'Otome','22':'Tamakazura','23':'Hatsune','24':'Kochō','25':'Hotaru','26':'Tokonatsu','27':'Kagaribi','28':'Nowaki','29':'Miyuki','30':'Fujibakama','31':'Makibashira','32':'Umegae','33':'Fuji no Uraba','34':'Wakana: Jō','35':'Wakana: Ge','36':'Kashiwagi','37':'Yokobue','38':'Suzumushi','39':'Yūgiri','40':'Minori','41':'Maboroshi','42':'Niou Miya','43':'Kōbai','44':'Takekawa','45':'Hashihime','46':'Shii ga Moto','47':'Agemaki','48':'Sawarabi','49':'Yadorigi','50':'Azumaya','51':'Ukifune','52':'Kagerō','53':'Tenarai','54':'Yume no Ukihashi'};
  return chapterNames[String];
}

const PoemSearch = () => {
const [query, setQuery] = useState('');
const [error, setError] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [showResults, setShowResults] = useState(false);
const [results, setResults] = useState([]);
const searchInputRef = useRef(null);

const [filters, setFilters] = useState(
    {
        chapterNum: {
            label: 'Chapters',
            options: {}  
        },
        addressee_name: {
            label: 'Addressee Name', 
            options: {}
        },
        addressee_gender: {
            label: 'Addressee Gender',
            options: {
                'male': { checked: true },
                'female': { checked: true }
            }
        },
        speaker_name: {
            label: 'Speaker Name',
            options: {}
        },
        speaker_gender: {
            label: 'Speaker Gender', 
            options: {
                'male': { checked: true },
                'female': { checked: true }
            }
        },
        season: {
            label: 'Season',
            options: {
                'Spring': { checked: false },
                'Summer': { checked: false },
                'Autumn': { checked: false },
                'Winter': { checked: false }
            }
        },
        poetic_tech: {
            label: 'Poetic Technique',
            options: {
                'Kakekotoba': { checked: false },
                'Engo': { checked: false },
                'Makurakotoba': { checked: false },
                'Utamamakura': { checked: false }
            }
        }
    }
);

// highlight matching keywords
const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, index) => 
      regex.test(part) ? <mark key={index} className={styles.highlight}>{part}</mark> : part
    );
};

useEffect(() => {
    if (!results.length) return;

    const chapters = new Set();
    const addressees = new Set();
    const speakers = new Set();

    results.forEach(result => {
        if (result.chapterNum) chapters.add(result.chapterNum);
        if (result.addressee_name) addressees.add(result.addressee_name);
        if (result.speaker_name) speakers.add(result.speaker_name);
    });

    setFilters(prev => ({
        ...prev,
        chapterNum: {
          ...prev.chapterNum,
          options: Array.from(chapters).reduce((acc, chapter) => ({
            ...acc,
            [chapter]: { checked: false }
          }), {})
        },
        addressee_name: {
          ...prev.addressee_name,
          options: Array.from(addressees).reduce((acc, name) => ({
            ...acc,
            [name]: { checked: false }
          }), {})
        },
        speaker_name: {
          ...prev.speaker_name,
          options: Array.from(speakers).reduce((acc, name) => ({
            ...acc,
            [name]: { checked: false }
          }), {})
        }
    }));
}, [results]);

// keyword search
const handleSearch = useCallback(
  debounce(async (searchQuery) => {
    setIsLoading(true);
    setError(null);

    // Check if query is empty and set default search to fetch all poems
    const queryToUse = searchQuery.trim() ? searchQuery : "all";

    try {
      console.log("Fetching from API with query:", queryToUse);
      const response = await fetch(`/api/poems/poem_search?q=${encodeURIComponent(queryToUse)}`);

      if (!response.ok) {
        throw new Error('Not found.');
      }

      const data = await response.json();

      if (Array.isArray(data.searchResults)) {
        const processedResults = data.searchResults.map(result => ({
          chapterNum: removeLeadingZero(Object.values(result.chapterNum).join('')),
          poemNum: removeLeadingZero(Object.values(result.poemNum).join('')),
          japanese: Object.values(result.japanese).join(''),
          romaji: Object.values(result.romaji).join(''),
          addressee_name: Object.values(result.addressee_name).join(''),
          addressee_gender: Object.values(result.addressee_gender).join(''),
          speaker_name: Object.values(result.speaker_name).join(''),
          speaker_gender: Object.values(result.speaker_gender).join(''),
          season: Object.values(result.season).join(''),
          peotic_tech: Object.values(result.peotic_tech).join(''),
          waley_translation: Object.values(result.waley_translation).join(''),
          seidensticker_translation: Object.values(result.seidensticker_translation).join(''),
          tyler_translation: Object.values(result.tyler_translation).join(''),
          washburn_translation: Object.values(result.washburn_translation).join(''),
          cranston_translation: Object.values(result.cranston_translation).join('')
        }));

        console.log("Setting results:", processedResults);
        setResults(processedResults);
        setShowResults(true);
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
  [setResults, setShowResults]
);


useEffect(() => {
  if (!query) {
    handleSearch(''); // Fetch all poems when no query is provided
  } else {
    handleSearch(query);
  }
}, [query, handleSearch]);


// filter gets checked
const handleFilterChange = (category, optionKey) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        options: {
          ...prev[category].options,
          [optionKey]: {
            ...prev[category].options[optionKey],
            checked: !prev[category].options[optionKey].checked
          }
        }
      }
    }));
};

// filter logic
const filteredResults = useMemo(() => {
    const activeFilters = Object.entries(filters).reduce((acc, [category, { options }]) => {
      const activeOptions = Object.entries(options)
        .filter(([_, { checked }]) => checked)
        .map(([key]) => key);
      if (activeOptions.length) acc[category] = activeOptions;
      return acc;
    }, {});
 
    if (Object.keys(activeFilters).length === 0) return results;
 
    return results.filter(result => {
      return Object.entries(activeFilters).every(([category, activeOptions]) => {
        switch (category) {
          case 'chapterNum':
            return activeOptions.includes(result.chapterNum);
          case 'addressee_name':
            return activeOptions.includes(result.addressee_name);
          case 'addressee_gender':
            return activeOptions.includes(result.addressee_gender);
          case 'speaker_name':
            return activeOptions.includes(result.speaker_name);
          case 'speaker_gender':
            return activeOptions.includes(result.speaker_gender);
          case 'season':
            return activeOptions.includes(result.season);
          case 'poetic_tech':
            return activeOptions.includes(result.poetic_tech);
          default:
            return true;
        }
      });
    });
  }, [filters, results]);
 
  useEffect(() => {
    handleSearch(query);
  }, [query, handleSearch]);
 

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (!e.target.value.trim()) setShowResults(false);
  };
 

  // toggle control
  const [openSections, setOpenSections] = useState(new Set(['chapterNum'])); 

  const toggleSection = (category) => {
    setOpenSections(prev => {
        const newSet = new Set(prev);
        if (newSet.has(category)) {
          newSet.delete(category);
        } else {
          newSet.add(category);
        }
          return newSet;
      });
    };


    const renderFilters = () => (
        <div className={styles.filterContainer}>
          <div className={styles.filterHeader}>
            <h2>Filters</h2>
          </div>
          <div className={styles.filterScroll}>
            {Object.entries(filters).map(([category, { label, options }]) => (
              <div key={category} className={styles.filterSection}>
                <div 
                  className={styles.filterSectionHeader}
                  onClick={() => toggleSection(category)}
                >
                  <span className={styles.filterLabel}>{label}</span>
                  <span className={`${styles.arrow} ${openSections.has(category) ? styles.arrowDown : ''}`}>
                    ▸
                  </span>
                </div>
                <div className={`${styles.filterContent} ${openSections.has(category) ? styles.expanded : ''}`}>
                {category === 'chapterNum' ? (
                    <div className={styles.chapterGrid}>
                        {Object.entries(options).map(([key, { checked }]) => (
                        <Checkbox
                            key={key}
                            checked={checked}
                            onChange={() => handleFilterChange(category, key)}
                            className={styles.chapterOption}
                        >
                            <div className={styles.chapterText}>
                            <span>{key}</span>
                            <span>{getChapterName(key)}</span>
                            </div>
                        </Checkbox>
                        ))}
                    </div>
                  ) : (
                    <div className={styles.filterOptions}>
                      {Object.entries(options).map(([key, { checked }]) => (
                        <Checkbox
                          key={key}
                          checked={checked}
                          onChange={() => handleFilterChange(category, key)}
                          className={`${styles.filterCheckbox} ${styles.alignLeft}`}
                        >
                          {key}
                        </Checkbox>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
       );

       const renderTranslation = (translation, translator) => {
        if (!translation) return <p>No translation available</p>;
        
        return translation.split('\n').map((line, index) => (
          <p key={`${translator}-line-${index}`}>
            {highlightMatch(line, query)}
          </p>
        ));
      };

  const [hoveredItem, setHoveredItem] = useState(null);
  const handleMouseEnter = (index) => {
    setHoveredItem(index); // Just store the hovered index
  };
  
  const handleMouseLeave = () => {
    setHoveredItem(null);
  };
  
  const renderResults = () => (
    <div className={styles.searchResults}>
      {filteredResults.map((result, index) => (
        <div
          key={index}
          className={styles.resultItem}
          onMouseEnter={(event) => handleMouseEnter(index, event)}
          onMouseLeave={handleMouseLeave}
        >
          <Link href={`/poems/${result.chapterNum}/${result.poemNum}`}>
            <div className={styles.resultContent}>
              <h3 className={styles.resultTitle}>
                Chapter {result.chapterNum}.{result.poemNum}
              </h3>
              <h3 className={styles.resultTitle}>
                {getChapterName(result.chapterNum)}
              </h3>
              <div className={styles.japaneseText}>
                {highlightMatch(result.japanese.split('\n')[0], query)}
              </div>
              <div className={styles.romajiText}>
                {highlightMatch(result.romaji.split('\n')[0], query)}
              </div>
            </div>
          </Link>
        </div>
      ))}
  
      {/* Hover Popup */}
      {hoveredItem !== null && (
        <div className={styles.hoverPopup}>
          <div className={styles.resultContent}>
            <h3 className={styles.resultTitle}>
              Chapter {filteredResults[hoveredItem].chapterNum} -{' '}
              {getChapterName(filteredResults[hoveredItem].chapterNum)} - 
              Poem {filteredResults[hoveredItem].poemNum}
            </h3>
            <div className={styles.japaneseText}>
              {highlightMatch(filteredResults[hoveredItem].japanese, query)}
            </div>
            <div className={styles.romajiText}>
              {highlightMatch(filteredResults[hoveredItem].romaji, query)}
            </div>
            <div className={styles.translation}>
              <h3 className={styles.translatorName}>Waley</h3>
              {renderTranslation(filteredResults[hoveredItem].waley_translation, 'Waley')}
            </div>
            <div className={styles.translation}>
              <h3 className={styles.translatorName}>Seidensticker</h3>
              {renderTranslation(filteredResults[hoveredItem].seidensticker_translation, 'Seidensticker')}
            </div>
            <div className={styles.translation}>
              <h3 className={styles.translatorName}>Tyler</h3>
              {renderTranslation(filteredResults[hoveredItem].tyler_translation, 'Tyler')}
            </div>
            <div className={styles.translation}>
              <h3 className={styles.translatorName}>Washburn</h3>
              {renderTranslation(filteredResults[hoveredItem].washburn_translation, 'Washburn')}
            </div>
            <div className={styles.translation}>
              <h3 className={styles.translatorName}>Cranston</h3>
              {renderTranslation(filteredResults[hoveredItem].cranston_translation, 'Cranston')}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.poemSearch}>
      <div className={styles.searchArea}>
      <input
        ref={searchInputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setShowResults(true)}
        placeholder="Enter keyword..."
        className={styles.searchInput}
      />
      </div>

      <div className={styles.mainContent}>
        <aside className={styles.filterSidebar}>
          {renderFilters()}
        </aside>

        <main className={styles.resultsArea}>
          {isLoading && <div className={styles.loading}>Searching...</div>}
          {error && <div className={styles.error}>{error}</div>}
          
          {showResults && results.length > 0 && (
            <>
              <div className={styles.resultCount}>
                Found {filteredResults.length} poems
                {Object.values(filters).some(({options}) => 
                  Object.values(options).some(({checked}) => checked)
                ) && ' (filtered)'}
              </div>
              {renderResults()}
            </>
          )}
          
          {query && results.length === 0 && !isLoading && !error && (
            <div className={styles.noResults}>No results found</div>
          )}
        </main>
      </div>

      <BackTop className={styles.backTop}>
        <div>Back to top</div>
      </BackTop>
    </div>
  );
};

export default React.memo(PoemSearch);