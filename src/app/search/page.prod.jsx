'use client'

import { useParams } from 'next/navigation';
import PoemSearch from "../../components/FilterSearch.prod"
import styles from "../../styles/pages/poemKeyWordSearchPageLayout.module.css";

export default function CharacterPage() {
    const params = useParams();
    return (
        <section className={styles.section_frame}>
            <div className={styles.section_container}>
                <PoemSearch/>
            </div>
        </section>
    );
}
