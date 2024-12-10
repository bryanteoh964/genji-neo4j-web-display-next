'use client'

import { useState, useEffect } from 'react'
import CharacterMap from '../../../components/CharacterMap.prod';

export default function MapDisplay() {
    const [graph, setGraph] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() =>{
		const _ = async()=>{
			const data = await fetch(`/api/characters_map`);
			const graphData = await data.json();
			setGraph(graphData);
			setIsLoading(false);
		}
		_()
		},[]);


	useEffect(() =>{
	},[isLoading]);

  	return (
		<div>
			<>
			{isLoading ? 
					<div>Loading Map...</div>
				:
                <CharacterMap l={graph}/>
			}
			</>
		</div>
	);
}