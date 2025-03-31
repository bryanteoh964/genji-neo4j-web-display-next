'use client'

import PoemQueryResults from '../../../../components/PoemQueryResults.prod'
import styles from "../../../../styles/pages/poems.module.css"

const PoemPage = (params) => {
    return (
        <div className={styles.search_display_container}>
            <PoemQueryResults
                poemData={{ 
                    chapterNum: params.params.chapter, 
                    poemNum: params.params.poem 
                }}
            />
        </div>
    )
}

export default PoemPage