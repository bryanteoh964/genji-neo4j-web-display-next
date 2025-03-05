'use client';

import "../../styles/globals.css";
import PoemQuery from "../../components/PoemQuery.prod";
import styles from "../../styles/pages/poems.module.css"; 

const page = () => {
  return (
    <div className={styles.poemPageContainer}>
        <PoemQuery />
        <section className={styles.section_frame}>
            <div className={styles.section_container}>
                <h1>Welcome to the Poem Page</h1>
            </div>
        </section>
    </div>
  )
}

export default page