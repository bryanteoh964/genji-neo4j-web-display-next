import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/pages/characterProfile.module.css';
import {BackTop} from 'antd';
import ContributorView from './ContributorView.prod'
import FormatContent from './FormatText.prod';
import DiscussionArea from './DiscussionArea.prod'

// format the database relationships into easy read text
function formatRelationship(relationship) {
    if (!relationship) return 'No related characters found';
    return relationship
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// group charaters with same relatioships into one group
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

const CollapsibleChapter = ({ chapterNum, chapterName, poems }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.chapterContainer}>
            <button 
                className={styles.chapterToggle} 
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                Chapter {chapterNum}: {chapterName}
            </button>
            {isOpen && (
                <ul className={styles.poemList}>
                    {poems.map((poem, index) => (
                        <li key={index} className={styles.poemItem}>
                            <a href={poem.url} className={styles.poemLink}>
                                <div className={styles.poemRelationship}>{formatRelationship(poem.relationship)}</div>
                                <div className={styles.poemNumber}>Poem {poem.poemNum}</div>
                                <div className={styles.poemJapanese}>{poem.poem.Japanese}</div>
                                <div className={styles.poemRomaji}>{poem.poem.Romaji}</div>
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// navigation table
const TableOfContents = ({ sections }) => {
    return (
        <nav className={styles.tableOfContents}>
            <h2>Contents</h2>
            <ul>
                {sections.map((section, index) => (
                    <li key={index}>
                        <a href={`#${section.id}`}>{section.title}</a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default function CharacterDetail({ name }) {
    const [characterData, setCharacterData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [characterExists, setCharacterExists] = useState(true);
    const [sections, setSections] = useState([]);
    const mainContentRef = useRef(null);

    const [timeline, setTimeline] = useState([]) 

    // Mak: This Character's Timeline 
	useEffect(() =>{
        const _ = async() =>{
            try {
                const data = await fetch(`/api/single_character_timeline?name=${name}`);
                const timelineData = await data.json();
                setTimeline(timelineData); 
            } catch (error) {
                // No timeline info found for this character! 
            }
        }
        _()
    },[]); 

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
        if (name) {
            setLoading(true);
            fetch(`/api/character_profile?name=${encodeURIComponent(name)}`)
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
    }, [name]);

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;
    if (!characterExists) return <div className={styles.error}>Character does not exist.</div>;
    if (!characterData || !characterData.character) return <div className={styles.error}>No character data available</div>;

    const { character, relatedCharacters, relatedPoems } = characterData;
    console.log(characterData);
    const hasRelatedCharacters = relatedCharacters && Object.keys(relatedCharacters).length > 0;
    const groupedRelatedCharacters = groupRelatedCharacters(relatedCharacters);

    const poemsByChapter = relatedPoems.reduce((acc, poem) => {
        const chapterKey = `${poem.chapterNum}: ${poem.chapter.chapter_name}`;
        if (!acc[chapterKey]) {
            acc[chapterKey] = [];
        }
        acc[chapterKey].push(poem);
        return acc;
    }, {});

    const getImageSrc = () => {
        if (character.name) {
          return `/images/${character.name}.png`;
        } else if (character.image_url) {
          return character.image_url;
        } else {
          return '/images/placeholder-image.jpg';
        }
    };

    // Mak: Image credit
    var artist = ""
    if (["Genji", "Murasaki no Ue", "The Akashi Lady"].includes(character.name)) {
        artist = "Wai Lun Mak"
    } else if (["Kiritsubo Emperor", "Kiritsubo Consort"].includes(character.name)) {
        artist = "Emilija Strydom"
    }

    //Mak: timeline
    if (timeline.length > 0) {
        try {
            var ordered_info = timeline
            ordered_info = ordered_info.sort((a,b) => {
            function see(a) {
                var month_days = [31,28,31,30,31,30,31,31,30,31,30,31]
                var n_value = 0
                if (a.day != null) {
                    n_value += a.day
                }
                if (a.month != null) {
                    for (const i = 0; i < a.month; a++) {
                        n_value += month_days[i]
                    }
                }
                if (n_value == 0) {
                    if (a.winter) {n_value = 335}
                    if (a.spring) {n_value = 60}
                    if (a.summer) {n_value = 152}
                    if (a.fall) {n_value = 244} 
                }
                
                n_value += 365*(a.age_of_genji-1)

                return n_value
            }
            var a_value = see(a)
            var b_value = see(b)
            
            return a_value - b_value
        })

        document.getElementById("timeline_elements").innerHTML = "";
        for (const oi of ordered_info) { 
            var descrip_div = document.createElement("div")
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
            season_div.appendChild(JP_season)
 
            var EN_season = document.createElement("h5")
            if (oi.winter) {EN_season.innerHTML = "winter"}
            if (oi.spring) {EN_season.innerHTML = "spring"}
            if (oi.summer) {EN_season.innerHTML = "summer"}
            if (oi.fall) {EN_season.innerHTML = "autumn"}
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
        } 
        } catch (error) {

        }
    }

    return (
        
        <div className={styles.container} style={{ '--character-color': character.color || '#000000' }}>
            <ContributorView
                pageType="character"
                identifier={character.name}
            />
            
            <h1 className={styles.title}>
                <span className={styles.nameEnglish}>{character.name}</span>
                <span className={styles.nameJapanese}>{character.japanese_name}</span>
            </h1>
            <div className={styles.contentWrapper}>
                <TableOfContents sections={sections} />
                <div className={styles.mainContent} ref={mainContentRef}>
                    <div className={styles.mainSection}>
                        <div className={styles.infoCard}>

                            <div className={styles.characterImage}>
                            <img 
                                src={getImageSrc()} 
                                alt={character.name || 'Character'} 
                                onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/placeholder-image.jpg';
                                }}
                            />
                            <figcaption className={styles.imageCredit}>
                                Art by: {artist}
                            </figcaption> 
                            </div>

                            <div className={styles.characterInfo}>
                                <p><strong>Alternative Names:</strong> {character['Alternative names'] || 'N/A'}</p>
                                <p><strong>Gender:</strong> {character.gender || 'N/A'}</p>
                                <p><strong>Japanese Name:</strong> {character.japanese_name || 'N/A'}</p>
                            </div>
                        </div>
                        <div id="about" className={styles.description}>
                            <h2 className={styles.aboutTitle}>About</h2>
                            <div className={styles.descriptionContent}>
                                <FormatContent content={character.Description} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.divider}></div>

                    <div id="related-characters" className={styles.section}>
                        <h2 className={styles.sectionTitle}>Related Characters</h2>
                    {Object.keys(groupedRelatedCharacters).length > 0 ? (
                        Object.entries(groupedRelatedCharacters).map(([relationship, characters]) => (
                            <div key={relationship} className={styles.relationshipGroup}>
                                <h3 className={styles.relationshipTitle}>{relationship}</h3>
                                <ul className={styles.relatedList}>
                                    {characters.map((character, index) => (
                                        <li key={index} className={styles.relatedItem}>
                                            <a href={`/characters/${encodeURIComponent(character.name)}`} className={styles.relatedLink}>
                                                <span className={styles.relatedName}>{character.name}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <p className={styles.noRelatedMessage}>No related characters found.</p>
                    )}
                </div>

                    <div className={styles.divider}></div>

                    <div id="poems" className={styles.section}>
                        <h2 className={styles.sectionTitle}>Poems</h2>
                        {Object.keys(poemsByChapter).length > 0 ? (
                            Object.entries(poemsByChapter).map(([chapterKey, poems]) => {
                                const [chapterNum, chapterName] = chapterKey.split(': ');
                                return (
                                    <CollapsibleChapter 
                                        key={chapterKey}
                                        chapterNum={chapterNum}
                                        chapterName={chapterName}
                                        poems={poems}
                                    />
                                );
                            })
                        ) : (
                            <p>No related poems found.</p>
                        )}
                    </div> 

                    {
                        function() {
                            if (timeline.length > 0) {
                                return (
                                    <div style={{width: "fit-content", height: "fit-content",marginLeft: "auto", marginRight: "auto"}}>
                                        <div style={{marginLeft: "auto", marginRight: "auto", width: "900px", height: "500px", borderRadius: "10px", backgroundColor: "#5451a3", overflow: "hidden", padding: 0}}>
                                            <div style={{width: "100%", overflowX:"scroll", height: "100%", overflowY: "hidden", boxShadow: "inset 5px 5px 10px rgba(0, 0, 0, 0.25),  inset -5px 5px 10px rgba(0, 0, 0, 0.25),  inset 5px -5px 10px rgba(0, 0, 0, 0.25),  inset -5px -5px 10px rgba(0, 0, 0, 0.25)"}}> 
                                                <div id="timeline_elements" style={{zIndex: 0, paddingLeft: "50px", paddingRight: "50px", color: "#000", display: "flex"}}></div>
                                            </div>
                                        </div> 
                                        <h3 style={{float:"right", color: "black"}}>(𖤓 = Genji's Age)</h3>
                                    </div>
                                )
                            }
                        }()
                    }
                </div>
            </div>

            <DiscussionArea 
                pageType="character"
                identifier={`${character.name}`}
            />

            <BackTop className={styles.backTop}>
                <div>Back to top</div>
            </BackTop>
        </div>
    );
}