import { useState, useEffect } from 'react';
import Display from '../../components/MicroSearchDisplay.dev'
import Search from '../../components/MicroSearchSearch.dev'
import styles from "../../styles/pages/microsearch.module.css";

const page = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [data, setData] = useState([]);

    useEffect(() =>{
    	const _ = async()=>{
			const getData = await fetch(`/api/micro_search`);
			const response = await getData.json()
			setData(response)
		}
		_()
    }, []);

    return (
		<div className={styles.frame}>
			<div className={styles.window}>
				<div className={styles.left_frame}>
					<div className={styles.left_pane}>
						<Search data={data} />
						<input 
							className={styles.search}
							list="words"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)} 
							placeholder="Search..." 
						/>
						<datalist id="words">
							{Object.keys(data).map(word => (
								<option key={word} value={word} />
							))}
						</datalist>
					</div>
				</div>
				<div className={styles.right_frame}>
					<div className={styles.right_pane}>
						<Display searchTerm={searchTerm} data={data} />
					</div>
				</div>
			</div>
		</div>
	); 
};