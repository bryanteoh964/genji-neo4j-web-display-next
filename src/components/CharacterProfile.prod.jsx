'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from '../styles/pages/characterProfile.module.css';
import FormatContent from './FormatText.prod';
import ZoomableGanttChart from './ZoomableGanttChart.jsx';

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
    const [timeline, setTimeline] = useState([]);
    
    // Mak: This Character's Timeline 
    const gantt = useRef([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTimeline = async() => {
            try {
                const data = await fetch(`/api/single_character_timeline?name=${name}`);
                const timelineData = await data.json();
                setTimeline(timelineData); 
            } catch (error) {
                // No timeline info found for this character! 
            }
        };
        fetchTimeline();
    }, [name]);

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
                            console.error('Character not found: ', selectedCharacter);
                            console.error('Response status: ', response.status);
                            console.error('Response status text: ', response.statusText);
                        } else {
                            throw new Error('Failed to fetch character data');
                        }
                    } else {
                        return response.json();
                    }
                })
                .then(data => {
                    console.log(selectedCharacter);
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

    if (isLoading) { 
        if (timeline.length > 0) {
            
        }
        try {
            var ordered_info = timeline
            ordered_info = ordered_info.sort((a,b) => {
            function see(a) {
                if (a.spring) {
                    return a.age_of_genji * 10000 + 3 * 100 + 1
                } else if (a.summer) {
                    return a.age_of_genji * 10000 + 6 * 100 + 1
                } else if (a.fall || a.autumn) {
                    return a.age_of_genji * 10000 + 9 * 100 + 1
                } else if (a.winter) {
                    return a.age_of_genji * 10000 + 12 * 100 + 1
                } else { 
                    return a.age_of_genji * 10000 + a.month * 100 + a.day
                }
            }
            var a_value = see(a)
            var b_value = see(b)
            
            return a_value - b_value
        })

        document.getElementById("timeline_elements").innerHTML = "";

        var ganttTimeline = []
        for (const oi of ordered_info) { 
            var descrip_div = document.createElement("div")
            descrip_div.id = oi.id 
            descrip_div.className = "descripDiv"
            descrip_div.style.display = "inline-block"
            descrip_div.style.minWidth = "320px"
            descrip_div.style.textAlign = "left"
            descrip_div.style.minHeight = "270px"
            descrip_div.style.backgroundColor = "#fff"
            var color = "gray"
            if (character.color) {
                color = character.color
            }
            descrip_div.style.border = "solid 7px " + color
            descrip_div.style.marginLeft = "40px"
            descrip_div.style.marginRight = "40px"
            descrip_div.style.marginTop = "60px"
            descrip_div.style.marginBottom = "auto"
            descrip_div.style.borderRadius = "40px"
            descrip_div.style.padding = "27px"
            descrip_div.style.boxShadow = " 5px 5px 10px rgba(0, 0, 0, 0.25),  inset -5px 5px 10px rgba(0, 0, 0, 0.25),  inset 5px -5px 10px rgba(0, 0, 0, 0.25),  inset -5px -5px 10px rgba(0, 0, 0, 0.25)"

            var first_div = document.createElement("div")
            first_div.style.display = "flex"
            first_div.style.width = "100%"

            var age_div = document.createElement("h1")
            age_div.style.fontFamily = "Georgia, serif"
            age_div.innerHTML = oi.age_of_genji.toString() + " 𖤓 " 
            if (oi.month != null) {
                var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                age_div.innerHTML += months[oi.month-1] 
                if (oi.day != null) {
                    age_div.innerHTML += " " + oi.day.toString() 
                }
            }
            first_div.appendChild(age_div)

            var season_div = document.createElement("div")
            season_div.style.display = "inline"
            season_div.style.marginLeft = "auto"

            var JP_season = document.createElement("h5")
            JP_season.style.marginTop = "15px"
            JP_season.style.marginBottom = "10px"
            JP_season.style.fontSize = "50px"
            if (oi.winter) {JP_season.innerHTML = "冬"}
            if (oi.spring) {JP_season.innerHTML = "春"}
            if (oi.summer) {JP_season.innerHTML = "夏"}
            if (oi.fall) {JP_season.innerHTML = "秋"}
            if (oi.autumn) {JP_season.innerHTML = "秋"} 
            season_div.appendChild(JP_season)
 
            var EN_season = document.createElement("h5")
            if (oi.winter) {EN_season.innerHTML = "winter"}
            if (oi.spring) {EN_season.innerHTML = "spring"}
            if (oi.summer) {EN_season.innerHTML = "summer"}
            if (oi.fall) {EN_season.innerHTML = "autumn"}
            if (oi.autumn) {EN_season.innerHTML = "autumn"}
            EN_season.style.marginTop = "10px"
            EN_season.style.marginBottom = "0"
            EN_season.style.marginLeft = "auto"
            EN_season.style.marginRight = "auto"
            season_div.appendChild(EN_season)

            first_div.appendChild(season_div)

            descrip_div.appendChild(first_div)

            var chap_div = document.createElement("h3")
            chap_div.innerHTML = "Chapter: " + oi.chapter 
            chap_div.style.fontFamily = "Georgia, serif"
            chap_div.style.marginTop = "0"
            descrip_div.appendChild(chap_div)

            var paragraph = document.createElement("p")
            paragraph.style.backgroundColor = "#e6e6e6"
            paragraph.style.border = "solid 2px black"
            paragraph.style.color = "black" 
            paragraph.style.fontFamily = "Monospace"
            paragraph.style.padding = "5px"
            paragraph.style.height = "150px"
            paragraph.style.overflowY = "scroll"
            paragraph.innerHTML = ""
            paragraph.className = "paragraph"
            paragraph.innerHTML += oi.japanese + "<br>"
            paragraph.style.marginTop = "3px" 
            paragraph.style.fontSize = " 18px"
            paragraph.innerHTML += oi.english + "<br>" + "<br>"
            descrip_div.appendChild(paragraph)

            document.getElementById("timeline_elements").appendChild(descrip_div)  

            //Add to Timeline Gantt Chart 
            var genji_age = oi.age_of_genji.toString()
            if (genji_age.length == 1) {
                genji_age = "000" + genji_age
            } else {
                genji_age = "00" + genji_age
            }
            var genji_age_next = (oi.age_of_genji+1).toString()
            if (genji_age_next.length == 1) {
                genji_age_next = "000" + genji_age_next
            } else {
                genji_age_next = "00" + genji_age_next
            } 

            var date_info = character.name + "<br>" + oi.age_of_genji + " 𖤓 "
            if (oi.month) { 
                date_info += " " + months[oi.month-1]  + " "
            } 
            if (oi.day) {
                date_info += " " + oi.day + " "
            }

            if (oi.spring) {
                ganttTimeline.push({task: "Seasonal Event", startDate: new Date(genji_age+"-03-01"), endDate: new Date(genji_age+"-05-31"), id: oi.id, value: "<strong>" + date_info + " Spring </strong> <br><br>" + oi.english + "<br><br>"})
            } else if (oi.summer) {
                ganttTimeline.push({task: "Seasonal Event", startDate: new Date(genji_age+"-06-01"), endDate: new Date(genji_age+"-08-31"), id: oi.id, value: "<strong>" + date_info + " Summer </strong> <br><br>" + oi.english + "<br><br>"})
            } else if (oi.fall || oi.autumn) {
                ganttTimeline.push({task: "Seasonal Event", startDate: new Date(genji_age+"-09-01"), endDate: new Date(genji_age+"-11-30"), id: oi.id, value: "<strong>" + date_info + " Autumn </strong> <br><br>" + oi.english + "<br><br>"})
            } else if (oi.winter) { 
                ganttTimeline.push({task: "Seasonal Event", startDate: new Date(genji_age+"-12-01"), endDate: new Date(genji_age_next+"-02-28"), id: oi.id, value: "<strong>" + date_info + " Winter </strong> <br><br>" + oi.english + "<br><br>"})
            } else if (oi.day != null) {
                var dd = oi.day.toString()
                if (dd.length == 1) {
                    dd = "0" + dd
                }
                var mm = oi.month.toString()
                if (mm.length == 1) {
                    mm = "0" + mm
                }
                var mm_next = (oi.month + 1).toString()
                if (mm_next.length  == 1) {
                    mm_next = "0" + mm_next
                } 
                if (oi.month == 12) {
                    ganttTimeline.push({task: "Day Event", startDate: new Date(genji_age+"-12-" + dd), endDate: new Date(genji_age_next+"-01-" +dd), id: oi.id, value: "<strong>" + date_info + "</strong> <br><br>" + oi.english + "<br><br>"})
                } else {
                    ganttTimeline.push({task: "Day Event", startDate: new Date(genji_age+"-"+mm+ "-" + dd), endDate: new Date(genji_age+"-"+mm_next+ "-" +dd), id: oi.id, value: "<strong>" + date_info + "</strong> <br><br>" + oi.english + "<br><br>"})
                }
            } else if (oi.month != null) { 
                var mm = oi.month.toString() 
                if (mm.length == 1) {
                    mm = "0" + mm
                }
                var mm_next = (oi.month + 1).toString()
                if (mm_next.length  == 1) {
                    mm_next = "0" + mm_next
                } 
                if (oi.month == 12) {
                    ganttTimeline.push({task: "Month Event", startDate: new Date(genji_age+"-12-01"), endDate: new Date(genji_age_next+"-01-01"), id: oi.id, value: "<strong>" + date_info + "</strong> <br><br>" + oi.english + "<br><br>"})
                } else { 
                    ganttTimeline.push({task: "Month Event", startDate: new Date(genji_age+"-"+mm+ "-01"), endDate: new Date(genji_age+"-"+mm_next+ "-01"), id: oi.id, value: "<strong>" + date_info + "</strong> <br><br>" + oi.english + "<br><br>"})
                }
            } else {
                ganttTimeline.push({task: "Year Event", startDate: new Date(genji_age+"-01-01"), endDate: new Date(genji_age+"-06-01"), id: oi.id, value: "<strong>" + date_info + "</strong> <br><br>" + oi.english + "<br><br>"})  
            }

        } 
        
        gantt.current = ganttTimeline
        } catch (error) {
            setTimeout(() => {
                if (timeline.length == 0) {
                    document.getElementById("timeline_window").style.display = "none" 
                    document.getElementById("timeline_gantt").style.display = "none" 
                } 
            }, 2000) 
        } 
    } else {

    } 

    return (
        <div className={styles.characterProfilePage}>
            <div className={styles.heroSection}>
                <img
                    className={styles.fullBackgroundImage}
                    src="/images/character_banner3.png"
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

                        <div id="timeline_window" style={{width: "fit-content", height: "fit-content",marginLeft: "auto", marginRight: "auto"}}>
                            <div style={{marginLeft: "auto", marginRight: "auto", maxWidth: "1000px", height: "500px", borderRadius: "10px", backgroundColor: "#5451a3", overflow: "hidden", padding: 0}}>
                                <div style={{width: "100%", overflowX:"scroll", height: "100%", overflowY: "hidden", boxShadow: "inset 5px 5px 10px rgba(0, 0, 0, 0.25),  inset -5px 5px 10px rgba(0, 0, 0, 0.25),  inset 5px -5px 10px rgba(0, 0, 0, 0.25),  inset -5px -5px 10px rgba(0, 0, 0, 0.25)"}}> 
                                    <div id="timeline_elements" style={{zIndex: 0, paddingLeft: "50px", paddingRight: "50px", color: "#000", display: "flex"}}></div>
                                </div> 
                            </div> 
                            <h3 style={{color: "black"}}>(𖤓 = Genji`s Age)</h3>
                        </div> 

                        <div id="timeline_gantt" >
                            <ZoomableGanttChart  data={gantt.current} /> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}