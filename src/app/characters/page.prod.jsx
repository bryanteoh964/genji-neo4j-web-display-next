'use client';

import { useState, useEffect } from 'react'
import { ReactFlowProvider } from 'reactflow';
import GeneologyMap from '../../components/GeneologyMap.prod';

const Page = () => {
	const [graph, setGraph] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() =>{
	const _ = async()=>{
		const data = await fetch(`/api/characters_graph`);
		const graphData = await data.json();
		setGraph([graphData[0],graphData[1]]);

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
					<div>Loading</div>
				:
					<ReactFlowProvider>
						<GeneologyMap l={graph}/>
					</ReactFlowProvider>
			}
			</>
		</div>
	);
}

export default Page