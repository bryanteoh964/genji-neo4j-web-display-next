// pages/index.js
'use client'

import "../../styles/globals.css";
import styles from "../../styles/pages/microsearch.module.css";
import MicroSearch from "../../components/microsearch/MicroSearch.dev.jsx";

const page = () => {
  return (
	<div>
		<section className={styles.viewport_container}>
        	<MicroSearch />
		</section>
	</div>
  )
}

export default page