import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from '../styles/pages/characterProfile.module.css';
import { BackTop } from 'antd';
import ContributorView from './ContributorView.prod';
import FormatContent from './FormatText.prod';
import DiscussionArea from './DiscussionArea.prod';

// Format the database relationships into easy read text
function formatRelationship(relationship) {
    if (!relationship) return 'No related characters found';
    return relationship
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// Group characters with the same relationships into one group
function groupRelatedCharacters(relatedCharacters) {
    return Object.entries(relatedCharacters).reduce((acc, [, character]) => {
        const relationship = formatRelationship(character.relationship);
        if (!acc[relationship]) {
            acc[relationship] = [];
        }
        acc[relationship].push(character);
        return acc;
    }, {});
}

// Helper function to remove leading zeros from chapter or poem numbers
function removeLeadingZero(numStr) {
    return parseInt(numStr, 10).toString();
}

function getChapterNamKanji(chapterNum) {
    const chapterKanji = {
        '01': '桐壺', '02': '帚木', '03': '空蝉', '04': '夕顔', '05': '若紫', '06': '末摘花', '07': '紅葉賀', '08': '花宴', '09': '葵',
        '10': '榊', '11': '花散里', '12': '須磨', '13': '明石', '14': '澪標', '15': '蓬生', '16': '関屋', '17': '絵合', '18': '松風',
        '19': '薄雲', '20': '朝顔', '21': '乙女', '22': '玉鬘', '23': '初音', '24': '胡蝶', '25': '螢', '26': '常夏', '27': '篝火',
        '28': '野分', '29': '行幸', '30': '藤袴', '31': '真木柱', '32': '梅枝', '33': '藤裏葉', '34': '若菜上', '35': '若菜下',
        '36': '柏木', '37': '横笛', '38': '鈴虫', '39': '夕霧', '40': '御法', '41': '幻', '42': '匂宮', '43': '紅梅', '44': '竹河',
        '45': '橋姫', '46': '椎本', '47': '総角', '48': '早蕨', '49': '宿木', '50': '東屋', '51': '浮舟', '52': '蜻蛉', '53': '手習',
        '54': '夢浮橋'
    };
    return chapterKanji[chapterNum] || '';
}

export default function CharacterDetail({ name }) {
    const [characterData, setCharacterData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [characterExists, setCharacterExists] = useState(true);
    const [sections, setSections] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState(name || ''); // Track the selected character
    const mainContentRef = useRef(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const searchInputRef = useRef(null);

    // Handle mouse events for poem hover effects
    const handleMouseEnter = (index, event) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    useEffect(() => {
        if (characterData) {
            setSections([
                { id: 'about', title: 'About' },
                { id: 'related-characters', title: 'Related Characters' },
                { id: 'poems', title: 'Poems' }
            ]);
        }
    }, [characterData]);

    useEffect(() => {
        const handleHashChange = () => {
            const id = window.location.hash.slice(1);
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    useEffect(() => {
        if (selectedCharacter) {
            setLoading(true);
            fetch(`/api/character_profile?name=${encodeURIComponent(selectedCharacter)}`)
                .then(response => {
                    if (!response.ok) {
                        if (response.status === 404) {
                            setCharacterExists(false);
                        } else {
                            throw new Error('Failed to fetch character data');
                        }
                    } else {
                        setCharacterExists(true);
                        return response.json();
                    }
                })
                .then(data => {
                    setCharacterData(data);
                })
                .catch(error => setError(error.message))
                .finally(() => setLoading(false));
        }
    }, [selectedCharacter]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        // Open dropdown when typing in search
        if (!isDropdownOpen) {
            setIsDropdownOpen(true);
        }
    };

    // Handle search input focus
    const handleSearchFocus = () => {
        setIsDropdownOpen(true);
    };
    
    // Function to handle character selection from the dropdown
    const handleCharacterSelect = (characterName) => {
        setSelectedCharacter(characterName);
        setIsDropdownOpen(false);  // Close dropdown after selection
        setSearchTerm(''); // Clear search term
    };

    // Filter characters based on search term
    const filterCharacters = (characters) => {
        if (!characters) return [];
        if (!searchTerm.trim()) return Object.values(characters);
        
        return Object.values(characters).filter(name => 
            name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

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

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;
    if (!characterExists) return <div className={styles.error}>Character does not exist.</div>;
    if (!characterData || !characterData.character) return <div className={styles.error}>No character data available</div>;

    const { allCharacterNames, character, relatedCharacters, relatedPoems } = characterData;
    const groupedRelatedCharacters = groupRelatedCharacters(relatedCharacters);
    const filteredCharacters = filterCharacters(allCharacterNames);

    // Convert object-based relatedPoems to array
    const poemsArray = relatedPoems ? Object.values(relatedPoems) : [];

    const formattedPoems = poemsArray.map(poem => {
        const chapterNum = poem.pnum.substring(0, 2);
        const chapterAbr = poem.pnum.substring(2, 4);
        const poemNum = poem.pnum.substring(4);

        return {
            chapterNum: chapterNum,
            chapterAbr: chapterAbr,
            poemNum: poemNum,
            chapterKanji: getChapterNamKanji(chapterNum),
            japanese: poem.Japanese,
            romaji: poem.Romaji,
            speaker_name: poem.speaker_name || 'Unknown',
            speaker_gender: poem.speaker_gender || 'Unknown',
            addressee_name: poem.addressee_name || 'Unknown',
            addressee_gender: poem.addressee_gender || 'Unknown'
        };
    });

    return (
        <div className={styles.characterProfilePage}>
            <div className={styles.heroSection}>
                <img
                    className={styles.fullBackgroundImage}
                    src="/images/character_banner2.png"
                    alt="Character background"
                />
                <div className={styles.titleOverlay}>
                    <span className={styles.nameEnglish}>{character.name}</span>
                    <span className={styles.nameJapanese}>
                        {character.japanese_name?.split("（")[0] || ''}
                    </span>
                </div>
            </div>
            <div className={styles.characterProfileContainer}>
                {/* Search Dropdown Section */}
                <div className={styles.analysisPanel}>
                    <div className={styles.panelHeader} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <input
                            ref={searchInputRef}
                            type="text"
                            className={styles.panelHeaderSearch}
                            placeholder="Search Characters..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onFocus={handleSearchFocus}
                        />
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
                                filteredCharacters.map((name, index) => (
                                    <div key={index} className={styles.characterItem}>
                                        <button
                                            className={styles.characterButton}
                                            onClick={() => handleCharacterSelect(name)}
                                        >
                                            {name}
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.noResults}>No Characters Found</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.contentWrapper}>
                    <div className={styles.mainContent} ref={mainContentRef}>
                        <div className={styles.mainSection}>
                            <div id="about" className={styles.description}>
                                <div className={styles.descriptionContent}>
                                    <span
                                        style={{
                                            color: character.gender === 'male' ? '#436875' :
                                                character.gender === 'female' ? '#B03F2E' : 'inherit'
                                        }}
                                    >
                                        {character.japanese_name || 'N/A'}
                                    </span>
                                    <FormatContent content={character.Description} className={styles.descriptionText} />
                                </div>
                            </div>
                        </div>

                        {/* Poems Search Results View */}
                        <div className={styles.poemsSection}>
                            {formattedPoems.length > 0 ? (
                                <div className={styles.searchResults}>
                                    {formattedPoems.map((result, index) => (
                                        <div
                                            key={index}
                                            className={`${styles.resultItem} ${hoveredIndex === index ? styles.hovered : ''}`}
                                            onMouseEnter={(event) => handleMouseEnter(index, event)}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <Link href={`/poems/${removeLeadingZero(result.chapterNum)}/${removeLeadingZero(result.poemNum)}`}>
                                                <div className={styles.resultContent}>
                                                    <h3
                                                        className={styles.resultTitleSpeaker}
                                                        style={{
                                                            color:
                                                                result.speaker_gender === 'male'
                                                                    ? '#436875'
                                                                    : result.speaker_gender === 'female'
                                                                    ? '#B03F2E'
                                                                    : 'inherit'
                                                        }}
                                                    >
                                                        {result.speaker_name} &raquo;
                                                    </h3>

                                                    <div className={styles.resultWrapper}>
                                                        <div className={styles.resultWrapperChapter}>
                                                            <div className={styles.resultTitle}>
                                                                {result.chapterNum} {result.chapterAbr}
                                                            </div>
                                                            <div className={styles.resultTitle}>
                                                                {result.poemNum}
                                                            </div>
                                                        </div>
                                                        <div className={styles.resultPoemKanji}>
                                                            {result.chapterKanji}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className={styles.japaneseText}>
                                                            {result.japanese.split("\n")[0] || result.japanese}
                                                        </div>
                                                        <div className={styles.romajiText}>
                                                            {result.romaji.split("\n")[0] || result.romaji}
                                                        </div>
                                                    </div>
                                                    <h3 className={styles.resultTitleAddressee}
                                                        style={{
                                                            color:
                                                                result.addressee_gender === 'male'
                                                                    ? '#436875'
                                                                    : result.addressee_gender === 'female'
                                                                    ? '#B03F2E'
                                                                    : 'inherit'
                                                        }}
                                                    >
                                                        &raquo; {result.addressee_name}
                                                    </h3>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className={styles.noPoemsMessage}>No poems associated with this character.</p>
                            )}
                        </div>

                        <div className={styles.relatedCharacters}>
                            {Object.keys(groupedRelatedCharacters).length > 0 ? (
                                Object.entries(groupedRelatedCharacters).map(([relationship, characters]) => (
                                    <div key={relationship} className={styles.relationshipGroup}>
                                        <h3 className={styles.relationshipTitle}>{relationship}</h3>
                                        <div className={styles.characterList}>
                                            {characters.map((character, index) => (
                                                <div key={index} className={styles.characterItem}>
                                                    <a
                                                        href={`/characters/${encodeURIComponent(character.name)}`}
                                                        className={styles.characterLink}
                                                        style={{
                                                            color: character.gender === 'male' ? '#436875' :
                                                                character.gender === 'female' ? '#B03F2E' : 'inherit'
                                                        }}
                                                    >
                                                        {character.name}
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className={styles.noRelatedMessage}>No related characters found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}