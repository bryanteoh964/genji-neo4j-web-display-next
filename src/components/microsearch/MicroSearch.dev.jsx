'use client';

import { useEffect, useState } from 'react';
import styles from "../../styles/pages/microsearch.module.css";

import Search from './MicroSearchSearch.dev.jsx';
import Display from './MicroSearchDisplay.dev.jsx';
import Reader from './MicroSearchReader.dev.jsx';

const MicroSearch = () => {
    const[sentenceIndex, setSentenceIndex] = useState(0)
 
    useEffect(() => {
        console.log("s Index",sentenceIndex)
      }, [sentenceIndex]);
    return (
        <div className={styles.background}>
            <div className={styles.screen}>
                <div className={styles.search}>
                    <Search />
                </div>
                <div >
                <Display sentenceIndex={sentenceIndex} setSentenceIndex={setSentenceIndex} />
                </div>
                <div  >
                    <Reader sentenceIndex={sentenceIndex} setSentenceIndex={setSentenceIndex} />
                </div>
            </div>
        </div>
    )
}
export default MicroSearch