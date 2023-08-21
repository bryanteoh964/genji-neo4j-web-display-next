// pages/index.js
'use client'
import { useState, useEffect } from 'react';
import TextBlock from '../../components/TextBlock.prod';

export default function Home() {
  const [currentTerm, setCurrentTerm] = useState('');
  const [lockedTerms, setLockedTerms] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const getData = await fetch(`/api/micro_search`);
      const dataFetched = await getData.json();
      setData(dataFetched);
    };
    fetchData();
  }, []);


const lockTerm = () => {
  if (lockedTerms.length < 5) {
      setLockedTerms([...lockedTerms, currentTerm]);
      setCurrentTerm('');
  } else {
      alert("Maximum of 5 terms can be locked.");
  }
};




  const deleteTerm = (index) => {
    const newLockedTerms = [...lockedTerms];
    newLockedTerms.splice(index, 1);
    setLockedTerms(newLockedTerms);
  };

  return (
    <div>
      <input 
        list="words" 
        value={currentTerm} 
        onChange={(e) => setCurrentTerm(e.target.value)} 
        placeholder="Search..." 
      />
      <button onClick={lockTerm}>Enter</button>
      <ul>
  {lockedTerms.map((term, index) => (
    <li key={index} style={{ display: 'flex' }}>
      <p style={{ margin: '0 16px 0 0' }}>
        {data[term] ? `${data[term].length} occurrences` : '0 occurrences'}
      </p>
      <span style={{ margin: '0 8px 0 0' }}>{term}</span>
      <button onClick={() => deleteTerm(index)}>Delete</button>
    </li>
  ))}
</ul>

      <datalist id="words">
        {Object.keys(data)
          .filter(word => isNaN(word[0]))
          .map(word => (
            <option key={word} value={word} />
          ))
        }
      </datalist>
      <TextBlock searchTerms={lockedTerms} data={data} />
    </div>
  );
}
