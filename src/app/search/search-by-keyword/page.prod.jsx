'use client'

import { useParams } from 'next/navigation';
import PoemSearch from "../../../components/PoemKeywordSearch.prod"
import styles from "../../../styles/pages/poemKeyWordSearchPageLayout.module.css";

export default function CharacterPage() {
    const params = useParams();
    return (
        <section className={styles.section_frame}>
            <div className={styles.section_container}>
                <h1 className={styles.title}>Poem Search By Keyword</h1>
                <br/>
                <PoemSearch/>
            </div>
        </section>
    );
}