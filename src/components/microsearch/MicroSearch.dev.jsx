'use client';

import React, { useState, useContext } from 'react';
import styles from "../../styles/pages/microsearch.module.css";

import Search from "./Search.dev"
import Display from './MicroSearchDisplay.dev.jsx';
import Reader from './MicroSearchReader.dev.jsx';
import { ThingsProvider } from './context.dev.js';

const MicroSearch = () => {
    const [oneViewer, setOneViewer] = useState(true)

    return (
        <ThingsProvider>
            <div className={styles.background}>
                <div className={styles.search}>      
                    <div className={styles.searchPanel}>
                        <div className={styles.toggle}>
                            <h3>Toggle</h3>
                            <button onClick={() => setOneViewer(true)}>Single</button>
                            <button onClick={() => setOneViewer(false)}>Double</button>
                        </div>
                        <div className={styles.wordSearch}> 
                            <h3>Word Search</h3>
                            <Search/>
                        </div>
                    </div>
                </div>
                <div className={styles.displayPanel}>
                    {oneViewer ? (
                        <div className={styles.display}>
                            <Display/>
                        </div>
                    ) : (
                        <>
                            <div className={styles.display2}>
                                <Display/>
                            </div>
                            <div className={styles.display2}>
                                <Display/>
                            </div>
                        </>
                    )}
                    <Reader/>
                </div>
            </div>
        </ThingsProvider>
    )
}
export default MicroSearch