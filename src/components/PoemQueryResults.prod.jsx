'use client'

import { useMemo, useState, useReducer, useEffect } from 'react'
import { Button, Col, Divider, Input, Row, Space, Select, Tag, } from 'antd';
import 'antd/dist/antd.min.css';
import TextArea from 'antd/lib/input/TextArea';
import Link from 'next/link';
import styles from '../styles/pages/poemDisplay.module.css';


const PoemDisplay = ({ poemData }) => {
    /*
    Purpose:
        - Get chapter and poem numbers from url
        - Validate chapter and poem numbers, otherwise redirect
    */
    let chapter = poemData.chapterNum
    let number = poemData.poemNum
    useEffect(()=>{
        const validateParams = (chapterInfo) => {
            const chapterNum = parseInt(chapter)
            const poem = parseInt(number)
            if (Number.isInteger(chapterNum) === false || Number.isInteger(poem) === false) {
                return [false, "Chapter or poem is not an integer"]
            }
            if (chapterNum < 1 || chapterNum > 54) {
                return [false, "Chapter is out of range"]
            }
            const validPoemCount = chapterInfo[chapterNum - 1].count;
            if (validPoemCount === undefined || validPoemCount < 1 || !Number.isInteger(validPoemCount)) {
                return [false, "Chapter does not have a valid poem count"]
            }
            if (poem < 1 || poem > validPoemCount) {
                return [false, "Poem is out of range"]
            }
            return true
        }
        const checkParams = async () => {
            const response = await fetch(`/api/poems/poem_query`);
            const chapterInfo = await response.json();
            const valid = validateParams(chapterInfo);
            if (valid[0] === false) {
                alert("Invalid URL: " + valid[1])
            }
        }
        checkParams();
    }, [])


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
   


	const forceUpdate = useReducer(x => x + 1, 0)[1]
    


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
    /**  @param {Number} i index of an internal allusion inside the rel state variable **/
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

// pulls the content of a poem page based on chapter and number
    useEffect(() => {
        setTrans({
                Waley: 'N/A',
                Seidensticker: 'N/A',
                Tyler: 'N/A',
                Washburn: 'N/A',
                Cranston: 'N/A'
        })
        const _ = async () => {
			const fetchData = async (params = {}) => {
                    const response = await fetch (`/api/poems?chapter=${chapter}&&number=${number}`);
                    const responseData = await response.json()
                    // Check if response was successful
                    if (response.status !== 200) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return responseData;
				
			};
			
			const _try = async () => {
                // Initialize with default values
                setTrans({ Waley: 'N/A', Seidensticker: 'N/A', Tyler: 'N/A', Washburn: 'N/A', Cranston: 'N/A' });
                
                    const response = await fetchData({ chapter, number });
                    const exchange = response[0]
                    console.log("exchange:", exchange)
                    const transTemp = response[1]
                    const sources  = response[2]
                    const related= response[3]
                    const tags = response[4]
                    const ls  = response[5]
                    const pls = response[6]
                    setSpeaker([exchange[0].start.properties.name])
                    setAddressee(exchange.map(e => e.end.properties.name))
                    setJPRM([exchange[0].segments[0].end.properties.Japanese, exchange[0].segments[0].end.properties.Romaji])
                    setNotes(exchange[0].segments[0].end.properties.notes)
                    transTemp.forEach(e =>
                        setTrans(prev => ({
                            ...prev,
                            [e[0]]: e[0] !== 'Waley' ? e[1] : [e[1], e[2]]
                            })
                        )
                    )
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
                    setRel(related)
                    setTag(tags)
                    setTagType(ls)
                    setPnum(pls)
			};  
			_try();
        }
        _()
    }, [chapter, number])


   // async func for tag queries
    useMemo(() => {
        const _ = async () => {
            const _ = await fetch (`/api/poems/tag_query?query=${query[0]}`);
            if (query.length > 0) {
                if (query[1] === 'create tag') {
                    _()
                    alert('tag created!')
                } else if (query[1] === 'delete tag') {
                    _()
                    alert('tag deleted!')
                } else if (query[1] === 'create rel') {
                    _()
                    alert('link created!')
                } else if (query[1] === 'delete rel') {
                    _()
                    alert('link delete!')
                } else if (query[1] === 'notes' && query[0] !== '') {
                    _()
                    alert('Notes updated!')
                    setQuery([])
                }
            } 
        }
    }, [query])

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                <span className={styles.chapterTitle}>Chapter {poemData.chapterNum}</span>
                <span className={styles.poemTitle}>Poem {poemData.poemNum}</span>
                
                <div className={styles.prominentPoemText}>
                    <p className={styles.japanese}>{JPRM[0]}</p>
                </div>

            </h1>
            <div className={styles.contentWrapper}>
                <nav className={styles.tableOfContents}>
                    <h2>Contents</h2>
                    <ul>
                        <li><a href="#poem-info">Poem Information</a></li>
                        <li><a href="#translations">Translations</a></li>
                        <li><a href="#allusions">Allusions</a></li>
                        <li><a href="#related-poems">Related Poems</a></li>
                        <li><a href="#tags">Tags</a></li>
                        <li><a href="#notes">Notes</a></li>
                    </ul>
                </nav>
                <div className={styles.mainContent}>
                    <section id="poem-info" className={styles.section}>
                        <h2 className={styles.sectionTitle}>Poem Information</h2>
                        <div className={styles.poemInfo}>
                            <div className={styles.infoCard}>
                                <h3>Speaker</h3>
                                {speaker.length !== 0 && speaker.map(e =>
                                    <p key={e}>{e}</p>
                                )}
                                <h3>Proxy</h3>  {/* Art by: notice proxy */}
                                <p>N/A</p>
                            </div>
                            <div className={styles.poemText}>
                                <h3>Japanese</h3>
                                <p className={styles.japanese}>{JPRM[0]}</p>
                                <h3>Romaji</h3>
                                <p>{JPRM[1]}</p>
                            </div>
                            <div className={styles.infoCard}>
                                <h3>Addressee</h3>
                                {addressee.length !== 0 && addressee.map(e =>
                                    <p key={e}>{e}</p>
                                )}
                            </div>
                        </div>
                    </section>

                    <section id="translations" className={styles.section}>
                        <h2 className={styles.sectionTitle}>Translations</h2>
                        <div className={styles.translations}>
                            {Object.entries(trans).map(([translator, translation]) => (
                                <div key={translator} className={styles.translation}>
                                    <h3 className={styles.translatorName}>{translator}</h3>
                                    <p>{Array.isArray(translation) ? translation[0] : translation}</p>
                                    {translator === 'Waley' && translation[1] !== '-1' && (
                                        <p className={styles.pageNumber}>Page: {translation[1]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section id="allusions" className={styles.section}>
                        <h2 className={styles.sectionTitle}>Allusions</h2>
                        {source.length !== 0 && source.map(e => (
                            <div key={e.id} className={styles.allusion}>
                                <div className={styles.allusionInfo}>
                                    <p><strong>Poet:</strong> {e.poet}</p>
                                    <p><strong>Source:</strong> {e.order !== undefined ? `${e.source} ${e.order}` : e.source}</p>
                                    <p><strong>Honka:</strong> <span className={styles.japanese}>{e.honka}</span></p>
                                    <p><strong>Romaji:</strong> {e.romaji}</p>
                                </div>
                                <p><strong>Notes:</strong> {e.notes}</p>
                                <div className={styles.allusionTranslations}>
                                    {e.translation.map((el, index) => (
                                        <div key={index} className={styles.allusionTranslation}>
                                            <h4>{el[0]}</h4>
                                            <p>{el[1]}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>

                    <section id="related-poems" className={styles.section}>
                        <h2 className={styles.sectionTitle}>Related Poems</h2>
                        <div className={styles.relatedPoems}>
                            {rel.map(e =>
                                <Link 
                                    key={e[0]}
                                    href={`/poems/${e[0].substring(0, 2)}/${e[0].substring(4, 6)}`}
                                    target="_blank"
                                    onClick={(event) => auth ? event.preventDefault() : null}
                                >
                                    <Tag
                                        visible={e[1]}
                                        onClick={deleteRel(rel.indexOf(e))}
                                        className={styles.relatedPoemTag}
                                    >
                                        {e[0]}
                                    </Tag>
                                </Link>
                            )}
                        </div>
                        {auth && (
                            <div className={styles.addRelatedPoem}>
                                <Select
                                    showSearch
                                    options={pnum}
                                    value={IA}
                                    style={{ width: '200px' }}
                                    onChange={(value) => setIA(value)}
                                />
                                <Button onClick={() => createRel()}>Link</Button>
                            </div>
                        )}
                    </section>

                    <section id="tags" className={styles.section}>
                        <h2 className={styles.sectionTitle}>Tags</h2>
                        <div className={styles.tags}>
                            {tag.map(e =>
                                <Tag 
                                    key={e[0]}
                                    visible={e[1]}
                                    onClick={deleteTag(tag.indexOf(e))}
                                    className={styles.poemTag}
                                >
                                    {e[0]}
                                </Tag>
                            )}
                        </div>
                        {auth && (
                            <div className={styles.addTag}>
                                <Select
                                    showSearch
                                    options={tagType}
                                    value={select}
                                    style={{ width: '200px' }}
                                    onChange={handleSelect}
                                />
                                <Button onClick={() => createTag()}>Link</Button>
                            </div>
                        )}
                    </section>

                    <section id="notes" className={styles.section}>
                        <h2 className={styles.sectionTitle}>Notes</h2>
                        <p>{notes}</p>
                        {auth && (
                            <div className={styles.updateNotes}>
                                <TextArea 
                                    defaultValue={notes} 
                                    onChange={(event) => setNotes(event.target.value)}
                                />
                                <Button onClick={() => updateNotes()}>Update</Button>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    )
  
}

export default PoemDisplay