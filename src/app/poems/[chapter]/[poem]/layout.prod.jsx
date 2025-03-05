'use client';

import "../../../../styles/globals.css";
import PoemQuery from "../../../../components/PoemQuery.prod";
import styles from "../../../../styles/pages/poems.module.css";

const layout = ({ children }) => {
    return (
        <div className={styles.layoutContainer}>
            <PoemQuery />
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    )
}

export default layout