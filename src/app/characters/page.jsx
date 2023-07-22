'use client';
import { useState, useEffect } from 'react'
import { ReactFlowProvider } from 'reactflow';
import GeneologyMap from './GeneologyMap';

const page = () => {

  const [graph, setGraph] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() =>{
    const _ = async()=>{
      const data = await fetch(`/api/characters_graph`);
      const graphData = await data.json();
      console.log('graph: ', graphData[0])
      setGraph([graphData[0],graphData[1]]);

      setIsLoading(false);
      
    }
    _().catch(console.error)

  },[]);
  

  useEffect(() =>{
    console.log(isLoading, 'checkcheck')

  },[isLoading]);

  
  return (
    <>{isLoading 
        ? <div>Loading</div>
        :<ReactFlowProvider>
            <GeneologyMap l={graph}/>
        </ReactFlowProvider>}
    </>
);
}

export default page