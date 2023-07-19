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
  let number = params.params.poem

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



  const forceUpdate = useReducer(x => x + 1, 0)[1]
    
    const vincent = [process.env.REACT_APP_USERNAME, process.env.REACT_APP_PASSWORD]


    if (number.length === 1) {
        number = '0' + number.toString()
    } else {
        number = number.toString()
    }

    const handleSelect = (value) => {
        setSelect(value)
    }

    const createTag = () => {
        if (select === '') {
            alert('Need to select a tag!')
        } else if (tag.includes(select)) {
            alert('Poem is already tagged as ' + select)
        } else {
            let bool = window.confirm('About to tag this poem as ' + select + '. ')
            if (bool) {
                setQuery(['MATCH (g:Genji_Poem)-[:INCLUDED_IN]->(:Chapter {chapter_number: "' + chapter + '"}), (t:Tag {Type: "' + select + '"}) where g.pnum ends with "' + number + '" merge (g)-[:TAGGED_AS]->(t) return (g)', 'create tag'])
                let ls = tag
                ls.push([select, true])
                setTag(ls)
            }
        }
        setSelect('')
    }

    const deleteTag = (i) => (event) => {
        let type = event.target.textContent
        if (auth) {
            let bool = window.confirm('About to delete a tag.')
            if (bool) {
                let temp = tag
                temp[i][1] = false
                setTag(temp)
                forceUpdate()
                setQuery(['MATCH (g:Genji_Poem)-[:INCLUDED_IN]->(:Chapter {chapter_number: "' + chapter + '"}), (g)-[r:TAGGED_AS]->(t:Tag {Type: "' + type + '"}) where g.pnum ends with "' + number + '" delete r return (g)', 'delete tag'])
            }
        }
    }

    const createRel = () => {
        let selfCheck = false
        if ((parseInt(IA.substring(0, 2)) === parseInt(chapter)) && (parseInt(IA.substring(4, 6)) === parseInt(number))) {
            selfCheck = true
        }
        if (IA === '') {
            alert('Need to select a poem!')
        } else if (selfCheck) {
            alert('Cannot self-link!')
        } else if (rel.includes(IA)) {
            alert('Relation already exists')
        } else {
            let bool = window.confirm('About to relate this poem to ' + IA + '. ')
            if (bool) {
                setQuery(['MATCH (g:Genji_Poem)-[:INCLUDED_IN]->(:Chapter {chapter_number: "' + chapter + '"}), (s:Genji_Poem {pnum: "' + IA + '"}) where g.pnum ends with "' + number + '" merge (g)-[:INTERNAL_ALLUSION_TO]->(s) merge (s)-[:INTERNAL_ALLUSION_TO]->(g) return (g)', 'create rel'])
                let ls = rel
                ls.push([IA, true])
                setRel(ls)
            }
        }
        setIA('')
    }
    /*placeholder */ 
    /**
     * 
     * @param {Number} i index of an internal allusion inside the rel state variable
     */
    const deleteRel = (i) => (event) => {
        let p = event.target.textContent
        if (auth) {
            let bool = window.confirm('About to delete a internal allusion link.')
            if (bool) {
                let temp = rel
                temp[i][1] = false
                setRel(temp)
                forceUpdate()
                setQuery(['MATCH (g:Genji_Poem)-[:INCLUDED_IN]->(:Chapter {chapter_number: "' + chapter + '"}), (g)-[r:INTERNAL_ALLUSION_TO]->(s:Genji_Poem {pnum: "' + p + '"}), (s)-[t:INTERNAL_ALLUSION_TO]->(g) where g.pnum ends with "' + number + '" delete r delete t return (g)', 'delete rel'])
            }
        }
    }

    const updateNotes = () => {
        let bool = window.confirm('About to update the notes')
        if (bool) {
            let n = notes
            n = n.toString().replace(/"/g, '\\"');
            setQuery(['MATCH (g:Genji_Poem)-[:INCLUDED_IN]->(:Chapter {chapter_number: "' + chapter + '"}) where g.pnum ends with "' + number + '" SET g.notes = "' + n + '" return (g)', 'notes'])
        }
    }


    useEffect(() => {
      let get = 'match poem=(g:Genji_Poem)-[:INCLUDED_IN]->(:Chapter {chapter_number: "' + chapter + '"}), exchange=(s:Character)-[:SPEAKER_OF]->(g)<-[:ADDRESSEE_OF]-(a:Character), trans=(g)-[:TRANSLATION_OF]-(:Translation)-[:TRANSLATOR_OF]-(:People) where g.pnum ends with "' + number + '" return poem, exchange, trans'
      
      let getHonkaInfo = 'match (g:Genji_Poem)-[:INCLUDED_IN]->(:Chapter {chapter_number: "' + chapter + '"}), (g)-[n:ALLUDES_TO]->(h:Honka)-[r:ANTHOLOGIZED_IN]-(s:Source), (h)<-[:AUTHOR_OF]-(a:People), (h)<-[:TRANSLATION_OF]-(t:Translation)<-[:TRANSLATOR_OF]-(p:People) where g.pnum ends with "' + number + '" return h.Honka as honka, h.Romaji as romaji, s.title as title, a.name as poet, r.order as order, p.name as translator, t.translation as translation, n.notes as notes'
      let getRel = 'match (g:Genji_Poem)-[:INCLUDED_IN]->(:Chapter {chapter_number: "' + chapter + '"}), (g)-[:INTERNAL_ALLUSION_TO]->(s:Genji_Poem) where g.pnum ends with "' + number + '" return s.pnum as rel'
      let getPnum = 'match (g:Genji_Poem) return g.pnum as pnum'
      let getTag = 'match (g:Genji_Poem)-[:INCLUDED_IN]->(:Chapter {chapter_number: "' + chapter + '"}), (g)-[:TAGGED_AS]->(t:Tag) where g.pnum ends with "' + number + '" return t.Type as type'
      let getTagTypes = 'match (t:Tag) return t.Type as type'
      setTrans({
          Waley: 'N/A',
          Seidensticker: 'N/A',
          Tyler: 'N/A',
          Washburn: 'N/A',
          Cranston: 'N/A'
      })
      const _ = async () => {

          // Adding //
          const fetchData = async (params = {}) => {
              try {
                  
                  const response = await fetch (`/api/poems?chapter=${chapter}&&number=${number}`);

                  // Check if response was successful
                  if (response.status !== 200) {
                      throw new Error(`HTTP error! status: ${response.status}`);
                  }
          
                  return response.data;
              } catch (error) {
                  console.error(`There was an error! ${error}`);
                  throw error;
              }
          };
          console.log("chapter number", number)
          
          const _try = async () => {
  // Initialize with default values
              setTrans({ Waley: 'N/A', Seidensticker: 'N/A', Tyler: 'N/A', Washburn: 'N/A', Cranston: 'N/A' });
          
              try {
                  
                  const response = await fetchData({ chapter, number });
                  const exchange = response[0]
                  const transTemp =response[1]
                  const sources  = response[2]
                  const related= response[3]
                  const tags =response[4]
                  const ls  =response[5]
                  const pls =response[6]

          console.log('exchange',exchange)
          setSpeaker([exchange[0].start.properties.name])
          setAddressee(exchange.map(e => e.end.properties.name))
          setJPRM([exchange[0].segments[0].end.properties.Japanese, exchange[0].segments[0].end.properties.Romaji])
          setNotes(exchange[0].segments[0].end.properties.notes)
          //let transTemp = res.records.map(e => toNativeTypes(e.get('trans'))).map(e => [e.end.properties.name, e.segments[0].end.properties.translation, e.segments[1].start.properties.WaleyPageNum])
          transTemp.forEach(e =>
              setTrans(prev => ({
                  ...prev,
                  [e[0]]: e[0] !== 'Waley' ? e[1] : [e[1], e[2]]
              })))
          //let sources = resHonkaInfo.records.map(e => [Object.values(toNativeTypes(e.get('honka'))).join(''), Object.values(toNativeTypes(e.get('title'))).join(''), Object.values(toNativeTypes(e.get('romaji'))).join(''), Object.values(toNativeTypes(e.get('poet'))).join(''), Object.values(toNativeTypes(e.get('order'))).join(''), Object.values(toNativeTypes(e.get('translator'))).join(''), Object.values(toNativeTypes(e.get('translation'))).join(''), e.get('notes') !== null ? Object.values(toNativeTypes(e.get('notes'))).join('') : 'N/A'])
          let src_obj = []
          let index = 0
          let entered_honka = []
          sources.forEach(e => {
              if (entered_honka.includes(e[0])) {
                  src_obj[src_obj.findIndex(el => el.honka === e[0])].translation.push([e[5], e[6]])
              } else {
                  src_obj.push({id: index, honka: e[0], source: e[1], romaji: e[2], poet: e[3], order: e[4], translation:  [[e[5], e[6]]], notes: e[7]})
                  entered_honka.push(e[0])
              }
          })
          setSource(src_obj)
          //let related = new Set()
          //resRel.records.map(e => toNativeTypes(e.get('rel'))).forEach(e => related.add([Object.values(e).join('')]))
          //related = Array.from(related).flat()
          //related = related.map(e => [e, true])
          setRel(related)
          //let tags = new Set()
          //resTag.records.map(e => toNativeTypes(e.get('type'))).forEach(e => tags.add([Object.values(e).join('')]))
          //tags = Array.from(tags).flat()
          //tags = tags.map(e => [e, true])
          setTag(tags)
          //let types = resType.records.map(e => e.get('type'))
          //let ls = []
          //types.forEach(e => ls.push({value: e, label: e})) 
          setTagType(ls)
          /*let temp = resPnum.records.map(e => e.get('pnum'))
          let pls = []
          temp.forEach(e => {
              pls.push({value:e, label:e})
          })*/
          setPnum(pls)
          //session.close()
          //closeDriver()

              } catch (error) {
                  console.error(error);

              }
          };  
          
          _try().catch(console.error);

      }
      _().catch(console.error)
  }, [chapter, number])

  // async func for tag queries
  useMemo(() => {
      const _ = async () => {
 
          const write = await axios.get('http://localhost:8000/tagQueries',  query[0])
          if (query.length > 0) {
              if (query[1] === 'create tag') {
                  _().catch(console.error)
                  alert('tag created!')
              } else if (query[1] === 'delete tag') {
                  _().catch(console.error)
                  alert('tag deleted!')
              } else if (query[1] === 'create rel') {
                  _().catch(console.error)
                  alert('link created!')
              } else if (query[1] === 'delete rel') {
                  _().catch(console.error)
                  alert('link delete!')
              } else if (query[1] === 'notes' && query[0] !== '') {
                  _().catch(console.error)
                  alert('Notes updated!')
                  setQuery([])
              }
          } 
      }

  }, [query])
  return (
    <div>
      <h1>Chapter: {chapter}</h1>
      <h2>Poem: {number}</h2>
    </div>
  )
}

export default PoemPage






/* 

*/