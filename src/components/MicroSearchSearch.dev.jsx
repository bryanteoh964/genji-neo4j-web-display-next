'use client'

import { useState, useEffect } from 'react'
import { AutoComplete, Input, Tag } from 'antd'
import 'antd/dist/antd.min.css';

import Test from '@/components/Test.dev.jsx'

const getRandomInt = (max, min = 0) => Math.floor(Math.random() * (max - min + 1)) + min;

const searchResult = (query, searchValues) => {
	const temp_data = [0, 1, 2, 3, 4, 5]
	return temp_data.map((item) => {
		return {
			value: item,
			label: (
				<div style={{ 
				display: 'flex', 
				justifyContent: 'space-between',
			}}>
				<span>
					{item}
				</span>
				<span>{getRandomInt(200, 100)} results</span>
				</div>
			),
		};
	});
  };

const MicroSearchSearch = () => {
	const [options, setOptions]	= useState([]);
	const [searchTerms, setSearchTerms] = useState([]);
	const [searchValues, setSearchValues] = useState([]); // [ { term: 'term', value: 'value' }

	// Handle Data: turning data to just words and count
	useEffect(() => {
    	const getData = async () => {
			const response = await fetch(`/api/micro_search`);
			const data = await response.json()
			console.log("data", data)
			const transformedData = Object.entries(data).reduce((acc, [key, value]) => {
				acc[key] = value.length;
				return acc;
			}, {});
			setSearchValues(transformedData);
			// console.log("transformedData", transformedData)
		}
		getData()
	}, [])
	
	const handleSearch = (value) => {
		setOptions(value ? searchResult(value, searchValues) : []);
	  };
	
	// Updating search terms
	const onSelect = (value) => {
		setSearchTerms([...searchTerms, value]);
	};

	return (
		<div>
			<div>
				{searchTerms.map((term, index) => (
					<Tag key={index} color="blue">
						{term}
					</Tag>	
				))}
			</div>
			<div>MicroSearchSearch</div>
			{/* <input></input> */}
			<datalist></datalist>
			<AutoComplete
				dropdownMatchSelectWidth={252}
				style={{ width: 300 }}
				options={options}
				onSelect={onSelect}
				onSearch={handleSearch}
			>
				<Input.Search 
					size="large"
					placeholder="Search..."
					enterButton
				/>
			</AutoComplete>
			<h1>-----</h1>
		</div>
	)
}

export default MicroSearchSearch