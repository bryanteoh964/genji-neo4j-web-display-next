'use client'

import PoemSearch from '@/components/PoemSearch';

import styles from "../../styles/pages/search.module.css"

const page = () => {
  return (
    <div className={styles.viewport_container}>
	    <PoemSearch />
    </div>
  )
}

export default page