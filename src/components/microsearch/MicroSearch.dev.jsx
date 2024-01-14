'use client';

import React, { useState, useContext } from 'react';
import styles from "../../styles/pages/microsearch.module.css";

import Search from './MicroSearchSearch.dev.jsx';
import Display from './MicroSearchDisplay.dev.jsx';
import Reader from './MicroSearchReader.dev.jsx';
import { ThingsProvider } from './context.dev.js';

const MicroSearch = () => {
    const [oneViewer, setOneViewer] = useState(true)

    return (
        <ThingsProvider>
            <button onClick={() => setOneViewer(true)}>One</button>
            <button onClick={() => setOneViewer(false)}>Two</button>
            <h3>View: {oneViewer ? "Single" : "Double"}</h3>
            <div className={styles.background}>
                <div className={styles.screen}>
                    <div className={styles.search}>
                        <Search/>
                    </div>
                    {oneViewer ? (
                        <div className={styles.display}>
                            <Display/>
                        </div>
                    ) : (
                        <>
                            <div className={styles.display}>
                                <Display/>
                            </div>
                            <div className={styles.display}>
                                <Display/>
                            </div>
                        </>
                    )}
                    <div className={styles.reader} >
                        <Reader/>
                    </div>
                </div>
            </div>
        </ThingsProvider>
    )
}
export default MicroSearch