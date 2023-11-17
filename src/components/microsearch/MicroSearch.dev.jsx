'use client';

import { useEffect, useState } from 'react';
import styles from "../../styles/pages/microsearch.module.css";

import Search from './MicroSearchSearch.dev.jsx';
import Display from './MicroSearchDisplay.dev.jsx';
import Reader from './MicroSearchReader.dev.jsx';

const MicroSearch = () => {
    return (
        <div className={styles.background}>
            <div className={styles.screen}>
                <div className={styles.search}>
                    <Search />
                </div>
                <div className={styles.display}>
                    <Display />
                </div>
                <div className={styles.reader}>
                    <Reader />
                </div>
            </div>
        </div>
    )
}
export default MicroSearch