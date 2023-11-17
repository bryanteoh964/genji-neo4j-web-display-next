'use client';

import { useEffect, useState } from 'react';
import styles from "../../styles/pages/microsearch.module.css";

const MS_Reader = () => {
    return (
        <div>
                <div className={styles.readerView}>
                    Reader 1
                </div>
                <div className={styles.readerView}>
                    Reader 2
                </div>
        </div>
    )
}
export default MS_Reader