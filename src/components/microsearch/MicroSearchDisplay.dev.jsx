'use client';

import { useEffect, useState } from 'react';
import styles from "../../styles/pages/microsearch.module.css";
import Display from "./Display.dev"
const MS_Display = () => {
    return (
        <div className={styles.displayView}>
            <Display/>
        </div>
    )
}
export default MS_Display