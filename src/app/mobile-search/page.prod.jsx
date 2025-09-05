'use client'

import MobileFilterSearch from "../../components/MobileFilterSearch.prod";
import styles from "../../styles/pages/mobileFilterSearch.module.css";

export default function MobileSearchPage() {
    return (
        <section className={styles.section_frame}>
            <div className={styles.section_container}>
                <MobileFilterSearch/>
            </div>
        </section>
    );
}
