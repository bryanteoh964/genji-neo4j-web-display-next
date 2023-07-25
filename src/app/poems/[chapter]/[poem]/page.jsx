'use client'

import PoemQueryResults from '@/components/PoemQueryResults'

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