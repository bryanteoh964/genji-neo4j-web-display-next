'use client'

import PoemQueryResults from '../../../../components/PoemQueryResults.prod'

import styles from "../../../../styles/pages/poems.module.css"

const PoemPage = (params) => {

    return (

            <PoemQueryResults
                poemData={{ 
                    chapterNum: params.params.chapter, 
                    poemNum: params.params.poem 
                }}
            />
    )
}

export default PoemPage