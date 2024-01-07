'use client';

import { useEffect, useState } from 'react';
import styles from "../../styles/pages/microsearch.module.css";
import Reader1 from "./MicroSearchReader1.dev"
const MS_Reader = ({sentenceIndex,setSentenceIndex}) => {
    return (
        <div>
                <div className={styles.readerView}>
                    Reader 1
                    <Reader1 sentenceIndex={sentenceIndex} setSentenceIndex={setSentenceIndex} />
                </div>
                <div className={styles.readerView}>
                    Reader 2
                </div>
        </div>
    )
}
export default MS_Reader