import { useEffect, useState, useContext } from 'react';

import { ThingsContext } from './context.dev.js';

const Reader1 = () => {
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const { value2, setValue2 } = useContext(ThingsContext);
  useEffect(() => {
    setSentenceIndex(value2)
  }, [value2]);

  useEffect(() => {
    fetchData();
  }, []);
  //use a usestate to store it for effcience for sure ***
  const fetchData = async () => {
  
    // const response = await fetch(`/api/micro_search/sentences`);
    // const senIndices = await response.json();
    // console.log('sentence Indices:', senIndices); // Log the word indices to check the API response

  };

    return (
        <div >
          <h3>Sentence Index: {sentenceIndex}</h3>
        </div>
    )
}
export default Reader1