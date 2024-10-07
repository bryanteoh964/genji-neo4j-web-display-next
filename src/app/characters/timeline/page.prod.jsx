'use client'

import { useState, useEffect } from 'react'
import CharacterTimeline from '../../../components/CharacterTimeline.prod';

export default function TimelineDisplay() {
    const [graph, setGraph] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() =>{
	const _ = async()=>{
		const data = await fetch(`/api/characters_timeline`);
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
					<div>Loading...</div>
				:
                <CharacterTimeline l={graph}/>
			}
			</>
		</div>
	);
}