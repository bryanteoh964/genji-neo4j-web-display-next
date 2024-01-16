'use client';
import React, { useEffect, useState, useContext } from 'react';

import { ThingsContext } from './context.dev.js';

const MicroSearchReaderTwo = () => {
    const [sentences, setSentences] = useState([]);

    // Listen to sentence updates from useContext in MicroSearchReaderOne
    const { value3, setValue3 } = useContext(ThingsContext);
    useEffect(() => {
        setSentences([...sentences, value3])
    }, [value3]);

    return (
        <div>
            {sentences.map(sentence => (
                <p>{sentence}</p>
            ))}
        </div>
    )
}

export default MicroSearchReaderTwo