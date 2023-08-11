// pages/index.js
'use client'
import { useState,useEffect } from 'react';
import TextBlock from '../../components/TextBlock'




export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  useEffect(() =>{
    const _ = async()=>{
      const getdata = await fetch(`/api/micro_search`);
      const dataS = await getdata.json()
      console.log('sucess')
      setData(dataS)
      
    }
    _()
    },[]);
  return (
    <div>
      <input list="words" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." />
      <datalist id="words">
        {Object.keys(data).map(word => (
          <option key={word} value={word} />
        ))}
      </datalist>

      <TextBlock searchTerm={searchTerm} data={data} />
    </div>
  );
}
