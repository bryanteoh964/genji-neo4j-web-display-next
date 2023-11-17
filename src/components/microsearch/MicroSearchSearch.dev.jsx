'use client';

import { useEffect, useState } from 'react';
import styles from "../../styles/pages/microsearch.module.css";
import Search from "./Search.dev"
const MS_Search = () => {
    return (
        <div>
            <div className={styles.toggle}>
                Toggle
            </div>
            <div className={styles.wordSearch}>
                Word Search
                <Search/>
            </div>
            
        </div>
    )
}
export default MS_Search