'use client'

import PoemSearch from '@/components/Search';

import styles from "../../styles/pages/search.module.css"

const page = () => {
  return (
    <div className={styles.viewport_container}>
	    <PoemSearch />
    </div>
  )
}

export default page