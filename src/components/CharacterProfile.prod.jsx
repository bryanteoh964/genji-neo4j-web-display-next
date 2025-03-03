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

    //Image credit
    var artist = ""
    if (["Genji", "Murasaki no Ue"].includes(character.name)) {
        artist = "Wai Lun Mak"
    } else if (["Kiritsubo Emperor", "Kiritsubo Consort"].includes(character.name)) {
        artist = "Emilija Strydom"
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