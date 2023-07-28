'use client'

import React, { useContext, useEffect, useMemo, useState, useReducer, useRef } from 'react'

import { Col, BackTop, Button, Divider, Form, Input, Row, Select, Space, Table, Tag, Tooltip } from 'antd';
import 'antd/dist/antd.min.css';
import TextArea from 'antd/lib/input/TextArea';
import { Link } from 'react-router-dom';

export default function AllusionTable() {
    const [pnum, setPnum] = useState([{ value: '', label: '' }])
    const [rerender, setRerender] = useState(0)
    // data is the state variable that fills the table
    const [data, setData] = useState([])
    const [selectedPnum, setSelectedPnum] = useState('')
    const [query, setQuery] = useState([])
    const [poet, setPoet] = useState([])
    const [translators, setTranslators] = useState([{value: 'Tyler', label: 'Tyler'},{value: 'Vincent', label: 'Vincent'},{value: 'Washburn', label: 'Washburn'}])
    const [source, setSource] = useState([])
    const [auth, setAuth] = useState(false)
    const [usr, setUsr] = useState('')
    const [pwd, setPwd] = useState('')
    const [allusion, setAllusion] = useState({})
    const [maxID, setMaxID] = useState(0)
    const [newHonka, setNewHonka] = useState('')
    const [newRomaji, setNewRomaji] = useState('')
    const [newTranslator, setNewTranslator] = useState('')
    const [newTranslation, setNewTranslation] = useState('')
    const [newPoet, setNewPoet] = useState('')
    const [newSource, setNewSource] = useState('')
    const [newOrder, setNewOrder] = useState('N/A')
    const [selectedTranslation, setSelectedTranslation] = useState('Vincent')
    const [editSource, setEditSource] = useState({})
    const [editOrder, setEditOrder] = useState({})
    const [editPoet, setEditPoet] = useState('')
    const [sourceQuery, setSourceQuery] = useState('')

    const getChpList = async () => {
      const rresponse = await fetch(`/api/neo4j_driver/getChpList`);
      const data = await rresponse.json();
      return data;
    }

    // Editable cell code from antd doc
    const EditableContext = React.createContext(null);
    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };
    const EditableCell = ({
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
    }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
            if (editing) {
                inputRef.current.focus();
            }
        }, [editing]);
        const toggleEdit = () => {
            setEditing(!editing);
            if (dataIndex !== 'name') {
                form.setFieldsValue({
                    [dataIndex]: record[dataIndex],
                });
            } else {
                form.setFieldsValue({
                    [dataIndex]: record['translations'] === undefined || record['translations'][selectedTranslation] === undefined ? " " : record['translations'][selectedTranslation]
                })
            }
        };
        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                let [updated, key, honka, romaji, translation, notes, newTrans] = handleSave({
                    ...record,
                    ...values,
                });
                if (notes === undefined) {
                    notes = ' '
                }
                if (updated) {
                   /* initDriver(process.env.REACT_APP_NEO4J_URI,
                        process.env.REACT_APP_NEO4J_USERNAME,
                        process.env.REACT_APP_NEO4J_PASSWORD)
                    const driver = getDriver()
                    const session = driver.session()
                    if (newTrans) {
                        let write = await session.writeTransaction(tx => tx.run('MATCH (h:Honka {id: $key}), (p:People {name:$selectedTranslation}) CREATE (t:Translation {translation: $translation}) MERGE (h)<-[:TRANSLATION_OF]-(t)<-[:TRANSLATOR_OF]-(p) return "OK"', {key: key, selectedTranslation: selectedTranslation, translation: translation}))
                    } else {
                        let write = await session.writeTransaction(tx => tx.run('MATCH (h:Honka {id: $key})<-[:TRANSLATION_OF]-(t:Translation)<-[:TRANSLATOR_OF]-(p:People {name:$selectedTranslation}) SET h.Honka = $honka, h.Romaji = $romaji, h.notes = $notes, t.translation = $translation return "OK"', {key: key, selectedTranslation: selectedTranslation, honka: honka, romaji: romaji, notes: notes, translation: translation}))
                    }
                    session.close()
                    closeDriver()
                    */
                    if(newTrans){
                        const response = await fetch(`/api/allusions/newTrans?key=${key}&&selectedTranslation=${selectedTranslation}&&translation=${translation}`)
                    }else{
                        const response2 = await fetch(`/api/allusions/newOthers?key=${key}&&selectedTranslation=${selectedTranslation}&&honka=${honka}&&romaji=${romaji}&&notes=${notes}&&translation=${translation}`)
                    }
                } else {
                    console.log('nothing changed')
                }
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };
        let childNode = children;
        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={dataIndex}
                >
                    <TextArea ref={inputRef} onBlur={save} />
                </Form.Item>
            ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children[1] === undefined ? [children[0], " "] : children}
                </div>
            );
        }
        return <td {...restProps}>{childNode}</td>;
    };
    // end of antd code

    const forceUpdate = useReducer(x => x + 1, 0)[1]

    const handleSave = (newRow) => {
        let d = data
        let i = Object.keys(d).find(e => d[e].key === newRow.key)
        let updated = false 
        let newTrans = false
        // if a translation is edited
        if (newRow.name !== undefined) {
            if (newRow.translations === undefined) {
                newRow['translations'] = {}
                newRow['translations'][selectedTranslation] = newRow['name']
                d['name'] = newRow['name']
                newTrans = true
            } else {
                newRow['translations'][selectedTranslation] = newRow['name']
            }
            updated = true
        }
        if (d[i].Honka !== newRow.Honka || d[i].Romaji !== newRow.Romaji || d[i].notes !== newRow.notes) {
            // have to do this plus the forceupdate to get the table to rerender for some reason
            d[i].Honka = newRow.Honka
            d[i].Romaji = newRow.Romaji
            d[i].notes = newRow.notes
            updated = true
        }
        if (updated) {
            setData(d)
            forceUpdate()
        }
        return [updated, newRow.key, newRow.Honka, newRow.Romaji, newRow.translations[selectedTranslation], newRow.notes, newTrans]
    }
  
    const chapters = getChpList()
    const vincent = [process.env.REACT_APP_USERNAME, process.env.REACT_APP_PASSWORD]
    const defaultColumns = [
        {
            title: 'ID',
            dataIndex: 'key',
            key: 'ID',
            sorter: (a, b) => parseInt(a.key.slice(1)) - parseInt(b.key.slice(1)),
            defaultSortOrder: 'ascend',
            // editable: true,
        },
        {
            title: 'Honka',
            dataIndex: 'Honka',
            key: 'Honka',
            width: 280,
            textWrap: 'word-break',
            editable: true,
            render: (value, record) => (
                <p>{value === '' ? ' ' : value}</p>
            )
        },
        {
            title: 'Romaji',
            dataIndex: 'Romaji',
            key: 'Romaji',
            editable: true,
            render: (value, record) => (
                <p>{value === '' ? ' ' : value}</p>
            )
        },
        {
            title: 'Poet',
            dataIndex: 'Poet', 
            key: 'Poet',
            width: 280,
            sorter: (a, b) => {
                if (a.Poet === undefined) {
                    return 1
                } else if (b.Poet === undefined) {
                    return -1
                } else {
                    return a.Poet > b.Poet ? 1 : -1
                }
            },
            // defaultSortOrder: 'ascend',
            render: (text, record) => (
                <Row>
                    <Col span={24}>
                        {text}
                    </Col>
                    <Divider></Divider>
                    <Col span={24}>
                        {auth === true
                            ? <>
                                <Select
                                    showSearch
                                    options={poet}
                                    style={{
                                        width: '100%',
                                    }}
                                    onChange={(value) => setEditPoet(value)}
                                />
                                <Button
                                    onClick={() => createPoetEdge(record.key)}
                                >
                                    Link
                                </Button>
                            </>
                            : null}
                    </Col>
                </Row>
            ), 
        },
        {
            title: 'Source',
            dataIndex: 'Source',
            key: 'Source',
            editable: false,
            sorter: (a, b) => {
                if (a.Source === undefined) {
                    return 1
                } else if (b.Source === undefined) {
                    return -1
                } else {
                    if (a.Source[1] !== 'N/A' && b.Source[1] !== 'N/A' && a.Source[0] === b.Source[0]) {
                        return a.Source[1] > b.Source[1] ? 1 : -1
                    } else if (a.Source[1] !== 'N/A' && b.Source[1] === 'N/A' && a.Source[0] === b.Source[0]) { 
                        return -1
                    } else if (a.Source[1] === 'N/A' && b.Source[1] !== 'N/A' && a.Source[0] === b.Source[0]) { 
                        return 1
                    } else if (a.Source[1] === 'N/A' && b.Source[1] === 'N/A' && a.Source[0] === b.Source[0]) {
                        return -1
                    } else if (a.Source[0] !== b.Source[0]) {
                        return a.Source[0] > b.Source[0] ? 1 : -1
                    }
                }
            },
            render: (text, record) => (
                <Row>
                    <Col span={24}>
                        {text !== undefined ? text.map(e => 
                            <Tag
                                visible={e[2]}
                                onClick={(event) => deleteHonkaSourceLink(record.key, e[0], e[1])}
                            >
                                {e[1] !== 'N/A' ? e[0]+' '+e[1] : e[0]}
                            </Tag>) 
                        : null}
                    </Col>
                    <Divider></Divider>
                    <Col span={24}>
                        {auth === true
                            ? <>
                                <label>Source</label>
                                <Select
                                    showSearch
                                    options={source}
                                    style={{
                                        width: '100%',
                                    }}
                                    value={editSource[record.key]}
                                    onChange={(value) => {
                                        let temp = editSource
                                        temp[record.key] = value
                                        setEditSource(temp)
                                        forceUpdate()
                                    }}
                                />
                                <label>Order (press enter down here to link)</label>
                                <Input 
                                    allowClear
                                    defaultValue={'N/A'}
                                    onPressEnter={(event) => {
                                            let temp = editOrder
                                            temp[record.key] = event.target.value
                                            setEditOrder(temp)
                                            createSourceEdge(record.key)
                                    }}
                                />
                            </>
                            : null}
                    </Col>
                </Row>
            )
        },
        {
            title: (
                <Select 
                    value={selectedTranslation} 
                    onChange={(value) => setSelectedTranslation(value)}  
                    options={translators}
                />
            ),
            dataIndex: 'name',
            key: 'name',
            editable: true,
            width: 'auto',
            render: (value, record) => {
                if (record['translations'] !== undefined) {
                    return record['translations'][selectedTranslation]
                }
            },
        },
        {
            title: 'Notes',
            dataIndex: 'notes',
            key: 'notes',
            editable: true,
            render: (value, record) => (
                <p>{value === '' ? ' ' : value}</p>
            )
        },
        {
            title: 'Alluded to by',
            key: 'link',
            render: (_, record) => (
                <Row>
                    <Col span={24}>
                        {allusion[record.key] !== undefined 
                            ? allusion[record.key].map(e => 
                                <>
                                    <Link 
                                        to={`/poems/${parseInt(e[0].substring(0, 2))}/${parseInt(e[0].substring(4, 6))}`}
                                        target="_blank"
                                        onClick={(event) => auth ? event.preventDefault() : event}
                                    >
                                        <Tooltip title={e[2] === null ? null : e[2]}>
                                            <Tag
                                                visible={e[1]}
                                                onClick={auth ? deleteLink(e[0], record.key) : null}
                                            >
                                                {e[0]}
                                            </Tag>
                                        </Tooltip>
                                    </Link>
                                    <TextArea
                                        style={{display: auth ? 'flex' : 'none'}}
                                        defaultValue={e[2]}
                                        allowClear
                                        onPressEnter={(event) => updateAllusionEdgeNotes( e[0], record.key, event.target.value)}
                                    />
                                </>
                                ) 
                            : null}
                    </Col>
                    <Divider></Divider>
                    <Col span={24}>
                        {allusion[record.key] !== undefined 
                        ? Array.from(new Set(allusion[record.key].map(e => chapters[parseInt(e[0].substring(0, 2)) - 1]))).map(e =>
                            <Tag>
                                {e}
                            </Tag>) 
                        : null}
                    </Col>
                    <Col span={24}>
                        {auth === true
                            ? <>
                                <Divider></Divider>
                                <Select
                                    showSearch
                                    options={pnum}
                                    style={{
                                        width: '100%',
                                    }}
                                    onChange={(value) => setSelectedPnum(value)}
                                ></Select>
                                <Button
                                    onClick={() => createLink(record.key)}
                                >
                                    Link
                                </Button>
                            </>
                            : null}
                    </Col>
                </Row>
            )
        }
    ]

    const components = {
        body: {
            row: EditableRow, 
            cell: EditableCell,
        },
    }

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        } else {
            return {
                ...col, 
                onCell: (record) => ({
                    record, 
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave,
                })
            }
        }
    })

    const updateAllusionEdgeNotes = (pnum, id, value) => {
        let bool = window.confirm('About to update the notes for the allusion edge between '+pnum+' and '+id)
        if (bool) {
            setQuery(['MATCH (:Genji_Poem {pnum: "'+pnum+'"})-[r:ALLUDES_TO]-(:Honka {id: "'+id+'"}) set r.notes="'+value+'" return r.notes', 'allusionEdgeNotes'])
            let a = allusion
            a[id][a[id].findIndex(e => e[0] === pnum)][2] = value
            setAllusion(a)
        } else {
            alert('Notes update canceled! ')
        }
    }

    const createSourceEdge = (id) => {
        if (editSource === '') {
            alert('Need to select a source title!')
        } else {
            let bool = window.confirm('About to link ' + editSource[id] + ' to ' + id + ' as a source with order ' + editOrder[id])
            if (bool) {
                setSourceQuery('Match (s:Source {title:"' + editSource[id] + '"}), (h:Honka {id:"' + id + '"}) merge p=(s)<-[:ANTHOLOGIZED_IN {order: "' + editOrder[id] + '"}]-(h) return p')
                let temp = data
                for (let i = 0; i < data.length; i++) {
                    if (temp[i].key === id) {
                        if (temp[i].Source === undefined) {
                            temp[i].Source = [[editSource[id], editOrder[id], true]]
                        } else {
                            temp[i].Source.push([editSource[id], editOrder[id], true])
                        }
                    }
                }
                setData(temp)
                // forceUpdate()
            } else {
                alert('Link canceled!')
            }
        }
    }

    const createPoetEdge = (id) => {
        if (editPoet === '') {
            alert('Need to select a poet!')
        } else {
            let bool = window.confirm('About to link ' + editPoet + ' to ' + id + ' as a poet!')
            if (bool) {
                setSourceQuery('Match (p:People {name:"' + editPoet + '"}), (h:Honka {id:"' + id + '"})<-[r:AUTHOR_OF]-() delete r merge path=(p)-[:AUTHOR_OF]->(h) return path')
                let temp = data
                for (let i = 0; i < data.length; i++) {
                    if (temp[i].key === id) {
                            temp[i].Poet = editPoet
                    }
                }
                setData(temp)
            } else {
                alert('Link canceled!')
            }
        }
    }

    useMemo(() => {
        const _ = async () => {
            /*initDriver(process.env.REACT_APP_NEO4J_URI,
                process.env.REACT_APP_NEO4J_USERNAME,
                process.env.REACT_APP_NEO4J_PASSWORD)
            const driver = getDriver()
            const session = driver.session()
            let write = await session.writeTransaction(tx => tx.run(sourceQuery))
            session.close()
            closeDriver()*/

            const response = await fetch(`/api/allusions/sourceQuery?sourceQuery=${sourceQuery}`)
        }
        if (sourceQuery !== '') {
            _().catch(console.error)
            setSourceQuery('')
            alert('Link created!')
        }
    }, [sourceQuery])

    const createLink = (key) => {
        if (selectedPnum === '') {
            alert('Need to select a pnum!')
        } else {
            let bool = window.confirm('About to link between ' + key + ' and ' + selectedPnum + '. ')
            if (bool) {
                setQuery(["MATCH (g:Genji_Poem {pnum:'" + selectedPnum + "'}), (h:Honka {id:'" + key + "'}) MERGE (g)-[:ALLUDES_TO]->(h) MERGE (h)-[:ALLUDED_TO_IN]->(g) return (h)", 'link'])
                let al = allusion
                if (key in al) {
                    al[key].push([selectedPnum, true])
                } else {
                    al[key] = [[selectedPnum, true]]
                }
                setAllusion(al)
            } else {
                alert('Canceled. If you still want to link between ' + key + ' and ' + selectedPnum + ', choose another poem and switch back.')
            }
        }
        setSelectedPnum('')
    }

    const deleteLink = (pnum, id) => () => {
        if (auth) {
            let bool = window.confirm('About to delete a honka link.')
            if (bool) {
                let index = allusion[id].findIndex(e => e[0] === pnum)
                let a = allusion
                a[id][index][1] = false
                setAllusion(a)
                setQuery(["MATCH (g:Genji_Poem {pnum:'" + pnum + "'})-[r:ALLUDES_TO]->(h:Honka {id:'" + id + "'}), (h)-[s:ALLUDED_TO_IN]->(g) delete r delete s return (g)", 'delete'])
            }
        }
    }

    const deleteHonkaSourceLink = (id, title, order) => {
        if (auth) {
            let bool = window.confirm(`About to delete a link between ${id} and ${title} ${order}.`)
            if (bool) {
                let d = data
                let hIndex = data.findIndex(e => e.key === id)
                let eIndex = d[hIndex]['Source'].findIndex(element => element[0] === title && element[1] === order);
                d[hIndex]['Source'][eIndex][2] = false
                setData(d)
                // forceUpdate()
                setQuery([`MATCH (h:Honka {id:"${id}"})-[r:ANTHOLOGIZED_IN {order:"${order}"}]->(s:Source {title:"${title}"}) delete r return (h)`, 'delete'])
            }
        }
    }

    const newEntry = () => {
        let id = 'H' + (maxID + 1)
        if (newPoet === '') {
            alert("Need a poet!")
        } else if (newTranslator === '') {
            alert("Need a translator!")
        } else if (newSource === '') {
            alert("Need a source!")
        } else {
            setQuery(['match (p:People {name:"' + newPoet + '"}), (t:People {name: "'+newTranslator+'"}), (s:Source {title:"' + newSource + '"}) create entry=(p)-[:AUTHOR_OF]->(h:Honka {id: "' + id + '"})-[:ANTHOLOGIZED_IN {order: "' + newOrder + '"}]->(s), (h)<-[:TRANSLATION_OF]-(:Translation {translation: "'+newTranslation+'"})<-[:TRANSLATOR_OF]-(t) set h.Honka="' + newHonka + '", h.Romaji="' + newRomaji + '" return entry as res', 'entry'])
            setNewHonka('')
            setNewRomaji('')
            setNewPoet('')
            setNewTranslator('')
            setNewTranslation('')
            setNewSource('')
            setNewOrder('N/A')
            forceUpdate()
        }
    }

    useMemo(() => {
        const _ = async () => {
            /*initDriver(process.env.REACT_APP_NEO4J_URI,
                process.env.REACT_APP_NEO4J_USERNAME,
                process.env.REACT_APP_NEO4J_PASSWORD)
            const driver = getDriver()
            const session = driver.session()
            let write = await session.writeTransaction(tx => tx.run(query[0]))
            // console.log(write)
            session.close()
            closeDriver() */
            const response = await fetch(`/api/allusions/query?query=${query[0]}`)

        }
        if (query.length > 0) {
            if (query[1] === 'entry') {
                let bool = window.confirm('About to create a new Honka!')
                if (bool) {
                    _().catch(console.error)
                    setMaxID(maxID + 1)
                }
                alert('Honka created! Please refresh the honka table to see it.')
            } else if (query[1] === 'link') {
                _().catch(console.error)
                alert('Linked created!')
            } else if (query[1] === 'delete') {
                _().catch(console.error)
                alert('Linked deleted!')
            } else if (query[1] === 'allusionEdgeNotes') {
                _().catch(console.error)
                alert('Allusion edge notes updated!')
            }
        }
    }, [query])

    // table content
    useEffect(() => {
        let getHonka = 'match (a:Honka) return (a) as honka'
        let getPnum = 'match (g:Genji_Poem) return g.pnum as pnum'
        let getPoemHonka = 'MATCH (n:Honka)-[r:ALLUDES_TO]-(p:Genji_Poem) RETURN n.id as id, p.pnum as pnum, r.notes as notes'
        let getPoet = 'match (p:People) return p.name as poet'
        let getHonkaPoet = 'match (h:Honka)<-[:AUTHOR_OF]-(p:People) return h.id as id, p.name as name'
        let getSource = 'match (s:Source) return s.title as source'
        let getHonkaSource = 'match (h:Honka)-[r:ANTHOLOGIZED_IN]-(s:Source) return h.id as id, r.order as order, s.title as title'
        let getTrans = 'match (h:Honka)<-[:TRANSLATION_OF]-(t:Translation)<-[:TRANSLATOR_OF]-(p:People) return h.id as id, t.translation as trans, p.name as name'
        const _ = async () => {
            initDriver(process.env.REACT_APP_NEO4J_URI,
                process.env.REACT_APP_NEO4J_USERNAME,
                process.env.REACT_APP_NEO4J_PASSWORD)
            const driver = getDriver()
            const session = driver.session()
            const resHonka = await session.readTransaction(tx => tx.run(getHonka))
            const resPnum = await session.readTransaction(tx => tx.run(getPnum))
            const resPoemHonka = await session.readTransaction(tx => tx.run(getPoemHonka))
            const resPoet = await session.readTransaction(tx => tx.run(getPoet))
            const resPoetEdge = await session.readTransaction(tx => tx.run(getHonkaPoet))
            const resSrc = await session.readTransaction(tx => tx.run(getSource))
            const resSourceEdge = await session.readTransaction(tx => tx.run(getHonkaSource))
            const resTrans = await session.readTransaction(tx => tx.run(getTrans))
            let ans = []
            let max = 0
            let key = 0
            let translators = new Set()
            let transLs = resTrans.records.map(e => [concatObj(toNativeTypes(e.get('id'))), concatObj(toNativeTypes(e.get('trans'))), concatObj(toNativeTypes(e.get('name')))])
            let transObj = {}
            transLs.forEach(e => {
                translators.add(e[2])
                if (transObj[e[0]] === undefined) {
                    transObj[e[0]] = {}
                    transObj[e[0]][e[2]] = e[1]
                } else {
                    transObj[e[0]][e[2]] = e[1]
                }
            })
            translators = Array.from(translators).map(e => ({value: e, label: e}))
            setTranslators(translators)
            resHonka.records.map(e => toNativeTypes(e.get('honka'))).forEach(e => {
                delete Object.assign(e.properties, { ['key']: e.properties['id'] })['id']
                e.properties.translations = transObj[e.properties.key]
                ans.push(e.properties)
                key = parseInt(e.properties.key.slice(1))
                if (max < key) {
                    max = key
                }
            })
            let tempEdgeList = resSourceEdge.records.map(e => [concatObj(toNativeTypes(e.get('id'))), concatObj(toNativeTypes(e.get('title'))), concatObj(toNativeTypes(e.get('order')))])
            let tempEdgeObj = {}
            tempEdgeList.forEach(e => {
                if (tempEdgeObj[e[0]] === undefined) {
                    tempEdgeObj[e[0]] = [[e[1], e[2], true]]
                } else {
                    tempEdgeObj[e[0]].push([e[1], e[2], true])
                }
            })
            ans.forEach(e => {
                if (tempEdgeObj[e.key] !== undefined) {
                    e.Source = tempEdgeObj[e.key]
                } 
            })
            let poetEdge = resPoetEdge.records.map(e => [concatObj(toNativeTypes(e.get('id'))), concatObj(toNativeTypes(e.get('name')))])
            poetEdge.forEach(e => {
                let index = ans.findIndex(ele => ele.key === e[0])
                ans[index].Poet = e[1]
            })
            setData(ans)
            if (maxID !== max) {
                setMaxID(max)
            }
            let init_src = {}
            let init_order = {}
            for (let i = 0; i < max; i ++) {
                init_src['H'+JSON.stringify(i)] = ''
                init_order['H'+JSON.stringify(i)] = 'N/A'
            }
            setEditSource(init_src)
            setEditOrder(init_order)
            let temp = resPnum.records.map(e => e.get('pnum'))
            let ls = []
            temp.forEach(e => {
                if (e !== null) {
                    ls.push({ value: e, label: e })
                }
            })
            ls = sortPnumsFromObjList(ls)
            setPnum(ls)
            // ll is a temporary variable parsing a list of allusion properties out of the result
            let ll = Array.from(new Set(resPoemHonka.records.map(e => JSON.stringify([e.get('id'), e.get('pnum'), e.get('notes')])))).map(e => JSON.parse(e))
            let links = {}
            ll.forEach(e => {
                if (e[0] in links) {
                    links[e[0]].push([e[1], true, e[2]])
                } else {
                    links[e[0]] = [[e[1], true, e[2]]]
                }
            })
            setAllusion(links)
            temp = resPoet.records.map(e => e.get('poet'))
            let poets = []
            temp.forEach(e => {
                poets.push({ value: e, label: e })
            })
            setPoet(poets)
            temp = resSrc.records.map(e => e.get('source'))
            let sources = []
            temp.forEach(e => {
                sources.push({ value: e, label: e })
            })
            setSource(sources)
            session.close()
            closeDriver()
        }
        _().catch(console.error)
    }, [rerender])

    return (
        <div>
            <Row>
                <Row style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'center',
                    flexDirection: 'column',
                    margin: 'auto',
                    padding: '5vh'
                }}>
                    <Space direction='vertical' style={{
                        marginBottom: '2.5vh'
                    }}>
                        <Input
                            placeholder="input username"
                            onChange={(event) => setUsr(event.target.value)}
                        />
                        <Input.Password
                            placeholder="input password"
                            onChange={(event) => setPwd(event.target.value)}
                        />
                    </Space>
                    <Space>
                        <Button disabled={auth} onClick={() => (usr === vincent[0]) && (pwd === vincent[1]) ? setAuth(true) : null}>Login</Button>
                        <Button disabled={!auth} onClick={() => setAuth(false)}>Logout</Button>
                        <br />
                        <Button disabled={!auth} onClick={() => setRerender(rerender + 1)}>Refresh Table</Button>
                    </Space>
                    {auth === true
                        ? <>
                            <p>ID: H{maxID + 1}</p>
                            <label>Honka</label>
                            <TextArea
                                onChange={(event) => setNewHonka(event.target.value)}
                            />
                            <label>Romaji</label>
                            <TextArea
                                onChange={(event) => setNewRomaji(event.target.value)}
                            />
                            <label>Translator</label>
                            <Select
                                showSearch
                                style={{
                                    width: '100%'
                                }}
                                options={poet}
                                value={newTranslator}
                                onChange={(value) => setNewTranslator(value)}
                            />
                            <label>Translation</label>
                            <TextArea
                                onChange={(event) => setNewTranslation(event.target.value)}
                            />
                            <label>Poet</label>
                            <Select
                                showSearch
                                style={{
                                    width: '100%'
                                }}
                                options={poet}
                                value={newPoet}
                                onChange={(value) => setNewPoet(value)}
                            />
                            <label>Source</label>
                            <Select
                                showSearch
                                style={{
                                    width: '100%'
                                }}
                                options={source}
                                value={newSource}
                                onChange={(value) => setNewSource(value)}
                            />
                            <label>Order</label>
                            <Input 
                                defaultValue={"N/A"}
                                onChange={(value) => setNewOrder(value)}
                            />
                            <Button onClick={newEntry}>Create</Button>
                        </>
                        : null}
                    <BackTop>
                        <div>Back to top</div>
                    </BackTop>
                </Row>
                <Divider style={{width: '15vw'}}></Divider>
                <Row style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'center',
                    margin: 'auto',
                }}>
                    <Table 
                        columns={auth ? columns : defaultColumns} 
                        components={components} 
                        dataSource={data} 
                        rowClassName={() => 'editable-row'}
                    />
                </Row>
            </Row>
        </div>
    )
}