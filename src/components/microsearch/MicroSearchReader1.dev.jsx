import { useEffect, useState } from 'react';
const Reader1 = ({sentenceIndex,setSentenceIndex}) => {

useEffect(() => {
  console.log("display",sentenceIndex);
}, [sentenceIndex]);


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
        <h2>Block Index: </h2>
        <p>Block Indices: </p>
      </div>
  )
}
export default Reader1