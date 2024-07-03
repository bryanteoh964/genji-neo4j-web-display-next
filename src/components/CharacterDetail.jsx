'use client'

import { useState, useEffect } from 'react';

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
                .then(data => {
                    console.log('Received character data:', data);
                    console.log('Related characters:', Object.keys(data.relatedCharacters).length);
                    console.log('characters:', data.relatedCharacters[0].name);
                    console.log('characters rel:', data.relatedCharacters);
                    setCharacterData(data);
                })
                .catch(error => setError(error.message));
        }
    }, [name]);

    if (error) return <div>Error: {error}</div>;
    if (!characterData) return <div>Loading...</div>;

    return (
        <div>
            <h1>{characterData.character.name}</h1>
            <h2>Properties</h2>
            <ul>
                {Object.entries(characterData.character).map(([key, value]) => (
                    <li key={key}>{key}: {value ? value.toString() : 'N/A'}</li>
                ))}
            </ul>
            
            <h2>Related Characters</h2>
            <ul>
            {Object.entries(characterData.relatedCharacters).map(([index, item]) => (
            <li key={index}>
                <span>{index}:</span>{' '}
                <ul>
                {Object.entries(item).map(([key, value]) => (
                    <li key={key}>
                    {key}: {value ? value.toString() : 'N/A'}
                    </li>
                ))}
                </ul>
            </li>
            ))}
            </ul>
        </div>
    );
}