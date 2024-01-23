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
    fetchData();
    
  }, [value2]);
  // Send sentence updates to useContext to access from MicroSearchReaderOne
  const { value3, updateValue3 } = useContext(ThingsContext);
  useEffect(() => {
    updateValue3({translator: "waley", sentenceIndex: sentenceIndex, sentence: sentence})
 
  }, [sentence]);

  useEffect(() => {
    console.log("sentence", sentence)
  }, []);
  //use a usestate to store it for effcience for sure ***
  const fetchData = async () => {
    const response = await fetch(`/api/micro_search/sentences?index=${sentenceIndex}`);
    
     const senIndices = await response.json();
     setData(senIndices)
     
     // Log the word indices to check the API response
     
  };

    return (
        <div>
          <h3>Sentence Index: {sentenceIndex}</h3>
          <button onClick={() => setSentence(data)}>Save Sentence</button>
          <p>{data}</p>
        </div>
    )
}
export default Reader1