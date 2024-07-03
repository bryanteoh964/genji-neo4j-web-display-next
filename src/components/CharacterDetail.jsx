'use client'

import { useState, useEffect } from 'react';
import styles from '../styles/pages/CharacterDetail.module.css';

function formatRelationship(relationship) {
    return relationship
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

export default function CharacterDetail({ name }) {
    const [characterData, setCharacterData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (name) {
            fetch(`/api/character?name=${encodeURIComponent(name)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch character data');
                    }
                    return response.json();
                })
                .then(setCharacterData)
                .catch(setError);
        }
    }, [name]);

    if (error) return <div className={styles.error}>Error: {error.message}</div>;
    if (!characterData) return <div className={styles.loading}>Loading...</div>;

    const { character, relatedCharacters } = characterData;

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
            </div>
        </div>
    );
}