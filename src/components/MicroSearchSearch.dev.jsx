'use client';

import { useEffect, useState } from 'react';
import styles from "../styles/pages/microsearch.module.css";

const MS_Search = () => {
    return (
        <div>
            <div className={styles.toggle}>
                Toggle
            </div>
            <div className={styles.wordSearch}>
                Word Search
            </div>
        </div>
    )
}
export default MS_Search