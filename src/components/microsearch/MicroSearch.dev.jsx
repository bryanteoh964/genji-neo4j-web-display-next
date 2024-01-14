'use client';

import React, { useState, useContext } from 'react';
import styles from "../../styles/pages/microsearch.module.css";

import Search from './MicroSearchSearch.dev.jsx';
import Display from './MicroSearchDisplay.dev.jsx';
import Reader from './MicroSearchReader.dev.jsx';
import { ThingsProvider, ThingsContext } from './context.dev.js';

const MicroSearch = () => {
    const [sentenceIndex, setSentenceIndex] = useState([])

    return (
        <ThingsProvider>
            <div className={styles.background}>
                <div className={styles.screen}>
                    <div className={styles.search}>
                        <Search/>
                    </div>
                    <div className={styles.display}  >
                    <Display sentenceIndex={sentenceIndex} setSentenceIndex={setSentenceIndex} />
                    </div>
                    <div className={styles.reader} >
                        <Reader sentenceIndex={sentenceIndex} setSentenceIndex={setSentenceIndex}  />
                    </div>
                </div>
            </div>
        </ThingsProvider>
    )
}
export default MicroSearch