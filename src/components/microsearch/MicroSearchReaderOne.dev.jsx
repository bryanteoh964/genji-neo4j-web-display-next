import { useEffect, useState, useContext } from 'react';

import { ThingsContext } from './context.dev.js';

const Reader1 = () => {
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [data, setData] = useState ([])
  const [sentence, setSentence] = useState ("")

  // Listen to sentence index updates from useContext in Display
  const { value2, setValue2 } = useContext(ThingsContext);
  useEffect(() => {
    setSentenceIndex(value2)
  }, [value2]);
  // Send sentence updates to useContext to access from MicroSearchReaderOne
  const { value3, updateValue3 } = useContext(ThingsContext);
  useEffect(() => {
    updateValue3(sentence)
  }, [sentence]);

  useEffect(() => {
    fetchData();
  }, []);
  //use a usestate to store it for effcience for sure ***
  const fetchData = async () => {
    const response = await fetch(`/api/micro_search/sentences`);
     const senIndices = await response.json();
     setData(senIndices)
     // Log the word indices to check the API response
     console.log('sentence Indices:', senIndices);
  };

    return (
        <div>
          <h3>Sentence Index: {sentenceIndex}</h3>
          <button onClick={() => setSentence(data[sentenceIndex+2])}>Save Sentence</button>
          <p>{data[sentenceIndex+2]}</p>
        </div>
    )
}
export default Reader1