'use client';

import { useState, useEffect } from 'react';
import PoemSearch from '@/components/Search';
import SearchTable from '@/components/SearchTable';

import styles from "../../styles/pages/search.module.css";

const page = () => {
	const [query, setQuery] = useState()

	function updateQuery(info) {
		setQuery(info)
	}

	return (
		<div className={styles.viewport_container}>
			<div>
				<PoemSearch updateQuery={updateQuery}/>
			</div>
			<div className={styles.table_section}>
				<SearchTable query={query}/>
			</div>
		</div>
	)
}

export default page