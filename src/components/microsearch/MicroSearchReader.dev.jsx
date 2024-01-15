'use client';

import { useEffect, useState } from 'react';
import styles from "../../styles/pages/microsearch.module.css";
import Reader1 from "./MicroSearchReader1.dev"
const MS_Reader = () => {
    return (
        <div className={styles.reader}>
            <div className={styles.readerPanel}>
                <div className={styles.readerView}>
                    Reader 1
                    <Reader1/>
                </div>
                <div className={styles.readerView}>
                    Reader 2
                </div>
            </div>
        </div>
    )
}
export default MS_Reader