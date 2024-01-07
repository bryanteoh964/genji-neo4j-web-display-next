import { useEffect, useState } from 'react';
const Reader1 = ({sentenceIndex,setSentenceIndex}) => {

useEffect(() => {
  console.log("display",sentenceIndex);
}, [sentenceIndex]);
const fetchData = async () => {
  const wordToTrack = 'winter'; // Word to track in the dataset

  // Fetching logic
  const response = await fetch(`/api/micro_search`);
  const wordIndices = await response.json();
  console.log('Word Indices:', wordIndices); // Log the word indices to check the API response

  if (wordToTrack.toLowerCase() in wordIndices) {
    console.log(`${wordToTrack} exists in the data.`); // Log if the word to track exists
    processWordIndices(wordIndices[wordToTrack.toLowerCase()]);
  } else {
    console.error(`${wordToTrack} not found in the data.`);
  }
};
  return (
      <div >
      <h2>Block Index: </h2>
      <p>Block Indices: </p>
      </div>
  )
}
export default Reader1