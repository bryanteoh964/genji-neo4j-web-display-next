'use client'

import { usePathname,  useSearchParams} from 'next/navigation'
import {useRouter} from 'next/navigation'


import { useMemo, useState, useReducer, useEffect } from 'react'
import { Button, Col, Divider, Input, Row, Space, Select, Tag, } from 'antd';
// import 'antd/dist/antd.min.css';
import TextArea from 'antd/lib/input/TextArea';
import { Link } from 'react-router-dom';

const PoemPage = (params) => {
  //const router = usePathname();

  
  
  let chapter = params.params.chapter
  let poem = params.params.poem

  const [speaker, setSpeaker] = useState([])
  const [addressee, setAddressee] = useState([])
  // Japanese and Romaji
  const [JPRM, setJPRM] = useState([])
  const [trans, setTrans] = useState({
      Waley: 'N/A',
      Seidensticker: 'N/A',
      Tyler: 'N/A',
      Washburn: 'N/A',
      Cranston: 'N/A'
  })
  const [source, setSource] = useState([]) // currently linked honka
  const [rel, setRel] = useState([]) // currently linked related poems
  const [IA, setIA] = useState('') // internal allusion selection
  const [pnum, setPnum] = useState([])
  const [query, setQuery] = useState([])
  const [tag, setTag] = useState([]) // currently linked tags
  const [tagType, setTagType] = useState([''])
  const [select, setSelect] = useState('')
  const [notes, setNotes] = useState("")
  const [auth, setAuth] = useState(false)
  const [usr, setUsr] = useState('')
  const [pwd, setPwd] = useState('')

  return (
    <div>
      <h1>Chapter: {chapter}</h1>
      <h2>Poem: {poem}</h2>
    </div>
  )
}

export default PoemPage






/* 

*/