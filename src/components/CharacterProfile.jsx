'use client'

import { useState, useEffect } from 'react';
import styles from '../styles/pages/characterProfile.module.css';

// Funct to format relationship names (delete '_' in relation)
function formatRelationship(relationship) {
    if (!relationship) return 'No related charaters found'; 
    return relationship
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

export default function CharacterDetail({ name }) {
    const [characterData, setCharacterData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [characterExists, setCharacterExists] = useState(true);

    // Fetch character data
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

    // Handle loading, error, and no data
    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;
    if (!characterExists) return <div className={styles.error}>Character does not exist.</div>;
    if (!characterData || !characterData.character) return <div className={styles.error}>No character data available</div>;

    const { character, relatedCharacters, relatedPoems } = characterData;
    const hasRelatedCharacters = relatedCharacters && Object.keys(relatedCharacters).length > 0;

    return (
        
        <div className={styles.container}>
            <h1 className={styles.title}>{character.name}</h1>

             {/* Character information section */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Information</h2>
                <ul className={styles.propertyList}>
                    {Object.entries(character).map(([key, value]) => (
                        <li key={key} className={styles.propertyItem}>
                            <span className={styles.propertyKey}>{key}:</span>
                            <span className={styles.propertyValue}>{value || 'N/A'}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            {/* Related characters section */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Related Characters</h2>
                {hasRelatedCharacters ? (
                    <ul className={styles.relatedList}>
                        {Object.entries(relatedCharacters).map(([index, { name, relationship }]) => (
                            <li key={index} className={styles.relatedItem}>
                            <a href={`/characters/${encodeURIComponent(name)}`} className={styles.relatedLink}>
                                <span className={styles.relatedRelationship}>
                                    {formatRelationship(relationship)}
                                </span>
                                <span className={styles.relatedName}>{name}</span>
                            </a>
                        </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.noRelatedMessage}>No related characters found.</p>
                )}
            </div>
            
            {/* Related poems section */}
            <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Related Poems</h2>
                {relatedPoems.length > 0 ? (
                    <ul className={styles.poemList}>
                        {relatedPoems.map((poem, index) => (
                            <li key={index} className={styles.poemItem}>
                                <a href={poem.url} className={styles.poemLink}>
                                    <div className={styles.poemRelationship}>{formatRelationship(poem.relationship)}</div>
                                    <div className={styles.poemChapter}>Chapter {poem.chapterNum}: {poem.chapter.chapter_name}</div>
                                    <div className={styles.poemNumber}>Poem {poem.poemNum}</div>
                                    <div className={styles.poemJapanese}>{poem.poem.Japanese}</div>
                                    <div className={styles.poemRomaji}>{poem.poem.Romaji}</div>
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No related poems found.</p>
                )}
        </div>
        </div>
    );
}