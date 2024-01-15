'use client';

import { useEffect, useState } from 'react';
import styles from "../../styles/pages/microsearch.module.css";
import Display from "./Display.dev"
const MS_Display = ({sentenceIndex,setSentenceIndex}) => {
    return (
        <div className={styles.displayView}>
            <Display sentenceIndex={sentenceIndex} setSentenceIndex={setSentenceIndex} />
        </div>
    )
}
export default MS_Display