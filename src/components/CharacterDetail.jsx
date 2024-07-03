'use client'

import { useState, useEffect } from 'react';
import styles from '../styles/pages/CharacterDetail.module.css';

function formatRelationship(relationship) {
    if (!relationship) return 'N/A'; 
    return relationship
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

export default function CharacterDetail({ name }) {
    const [characterData, setCharacterData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (name) {
            setLoading(true);
            fetch(`/api/character?name=${encodeURIComponent(name)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch character data');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Received character data:', data);
                    setCharacterData(data);
                })
                .catch(error => setError(error.message))
                .finally(() => setLoading(false));
        }
    }, [name]);

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;
    if (!characterData || !characterData.character) return <div className={styles.error}>No character data available</div>;

    const { character, relatedCharacters, relatedPoems } = characterData;
    const hasRelatedCharacters = relatedCharacters && Object.keys(relatedCharacters).length > 0;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{character.name}</h1>
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Properties</h2>
                <ul className={styles.propertyList}>
                    {Object.entries(character).map(([key, value]) => (
                        <li key={key} className={styles.propertyItem}>
                            <span className={styles.propertyKey}>{key}:</span>
                            <span className={styles.propertyValue}>{value || 'N/A'}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Related Characters</h2>
                {hasRelatedCharacters ? (
                    <ul className={styles.relatedList}>
                        {Object.entries(relatedCharacters).map(([index, { name, relationship }]) => (
                            <li key={index} className={styles.relatedItem}>
                                <span className={styles.relatedRelationship}>
                                    {formatRelationship(relationship)}
                                </span>
                                <span className={styles.relatedName}>{name}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.noRelatedMessage}>No related characters found.</p>
                )}
            </div>
            
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