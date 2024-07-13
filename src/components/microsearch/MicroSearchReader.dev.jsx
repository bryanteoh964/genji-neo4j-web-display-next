'use client';

import styles from "../../styles/pages/microsearch.module.css";
import ReaderOne from "./MicroSearchReaderOne.dev"
import ReaderTwo from "./MicroSearchReaderTwo.dev"
const MS_Reader = () => {
    return (
        <div className={styles.reader}>
            <div className={styles.readerPanel}>
                <div className={styles.readerView}>
                    <ReaderOne/>
                </div>
                <div className={styles.readerView}>
                    <h2>Saved Sentences</h2>
                    <ReaderTwo/>
                </div>
            </div>
        </div>
    )
}
export default MS_Reader