'use client';

import { useState, useEffect } from 'react';
import PoemSearch from '../../components/Search.prod';
import SearchTable from '../../components/SearchTable.prod';

import styles from "../../styles/pages/search.module.css";

const Page = () => {
	const [query, setQuery] = useState()
	let [queryMade, setQueryMade] = useState(false)
	let [queryValid, setQueryValid] = useState(false)

	function updateQuery(info) {
		const data = info;
		const segments = data.split('/');
		const searchParams = {
			chapter: segments[2],
			spkrGender: segments[3],
			speaker: segments[4],
			addrGender: segments[5],
			addressee: segments[6],
			authorization: segments[7],
			username: segments[8],
			password: segments[9]
		};
		// make sure all values in searchParams are defined and is a string
		setQueryValid(Object.values(searchParams).every(param => typeof param === 'string' && param !== undefined));
		setQueryMade(true)
		setQuery(searchParams)
	}

	return (
		<div className={styles.viewport_container}>
			<div>
				<PoemSearch updateQuery={updateQuery}/>
			</div>
			{ queryMade ? (
				<div className={styles.table_section}>
					{ queryValid ? (
						<div>
							<h1>Query Status: ✅</h1>
							<SearchTable query={query}/>
						</div>
					) : (
						<h1>Query Status: ❌</h1>
					)
					}
				</div>
				) : (
					<div className={styles.table_section}>
						<h1>Query Status: 🔎</h1>
					</div>
				)
			}
		</div>
	)
}

export default Page