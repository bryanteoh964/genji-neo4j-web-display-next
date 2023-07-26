'use client';

import React, { useEffect, useMemo, useState } from 'react'
// import { initDriver, getDriver, closeDriver } from '../neo4j'
// import { toNativeTypes, getPoemTableContent, parseChp, parseOrder } from './utils'
import { Link } from 'react-router-dom'

// import Edit from './edit' // this is a temporary Edit component for testing
import Edit from '@/components/Edit';

export default function PoemTable({ query }) {
    // Info passed from the Search component
    // let { chapter, spkrGen, speaker, addrGen, addressee, auth, username, password } = useParams()
    let [chapter, setChapter] = useState();
    let [spkrGen, setSpkrGen] = useState();
    let [speaker, setSpeaker] = useState();
    let [addrGen, setAddrGender] = useState();
    let [addressee, setAddressee] = useState();
    let [auth, setAuth] = useState();
    let [username, setUsername] = useState();
    let [password, setPassword] = useState();

    // The other variables
    const [metadata, setMetadata] = useState([])
    const [entries, setEntries] = useState([])
    const [editProp, setEditProp] = useState([])
    const [charAndGen, setCharAndGen] = useState([[], []])
    // const [characters, setCharacters] = useState([])
    // const [genders, setGenders] = useState([])
    // console.log( chapter, spkrGen, speaker, addrGen, addressee, auth, username, password )
    const getChar = 'match (c:Character) return c.name as char, c.gender as gender order by c.name'

    useEffect (() => {
        setChapter(1)
    }, [])


    useEffect(() => {
        // write an async function to set the values
        const setStateValues = async () => {
            console.log("THIS IS THE QUERY", query)
            setChapter(query.chapter);
            setSpkrGen(query.spkrGender);
            setSpeaker(query.speaker);
            setAddrGender(query.addrGender);
            setAddressee(query.addressee);
            setAuth(query.authorization);
            setUsername(query.username);
            setPassword(query.password);
        }

        setStateValues()
    }, [])

    useEffect(() => {
        // Below is legacy code
        if (auth === 'true') {
            if (!(username === process.env.REACT_APP_USERNAME && password === process.env.REACT_APP_PASSWORD)) {
                auth = false
            } else {
                auth = true
            }
        }

        let allSpkrGen = ['male', 'female']
        let allAddrGen = ['male', 'female', 'nonhuman', 'multiple']
        if (spkrGen && spkrGen.split(',').length === 2) {
            spkrGen = 'Any'
        }
        if (addrGen && addrGen.split(',').length === 4) {
            addrGen = 'Any'
        }
    }, [spkrGen, addrGen, auth, username, password])


    useMemo(() => {
        // make sure speaker, addressee, and chapter are defined
        let varsDefined = !(speaker === undefined) && !(addressee === undefined) && !(chapter === undefined)
        if (!(speaker === undefined)) { console.log("SPEAKER IS DEFINED") }
        if (!(addressee === undefined)) { console.log("ADDRESSEE IS DEFINED") }
        if (!(chapter === undefined)) { console.log("CHAPTER IS DEFINED") }

        let getSpeaker, getAddressee, getChapter, getJPKeyword, getENKeyword
        if (speaker === 'Any' && spkrGen === 'Any') {
            getSpeaker = '(:Character)'
        } else if (speaker === 'Any' && spkrGen !== 'Any') {
            getSpeaker = '(:Character {gender: "' + spkrGen + '"})'
        } else {
            getSpeaker = '(:Character {name: "' + speaker + '"})'
        }
        if (addressee === 'Any' && addrGen === 'Any') {
            getAddressee = '(:Character)'
        } else if (addressee === 'Any' && addrGen !== 'Any') {
            getAddressee = '(:Character {gender: "' + addrGen + '"})'
        } else {
            getAddressee = '(:Character {name: "' + addressee + '"})'
        }
        if (chapter === 'anychp') {
            getChapter = ', (g)-[:INCLUDED_IN]-(:Chapter), '
        } else {
            // as of Apirl 2022, the chapter numbers are in string
            getChapter = ', (g)-[:INCLUDED_IN]-(:Chapter {chapter_number: "' + chapter + '"}), '
        }
        let get = 'match exchange=' + getSpeaker + '-[:SPEAKER_OF]-(g:Genji_Poem)-'
            + '[:ADDRESSEE_OF]-' + getAddressee
            + getChapter
            + 'trans=(g)-[:TRANSLATION_OF]-(t:Translation) '
            + ' return exchange, trans'
        const _ = async () => {
            // Information to send to the backend: getChar, get, { speaker, addressee, chapter }
            
            console.log("This is the variable check", { speaker, addressee, chapter })
            console.log("THIS is the first query", getChar);
            console.log("THIS is the second query", get, { speaker, addressee, chapter });
            initDriver(process.env.REACT_APP_NEO4J_URI,
                process.env.REACT_APP_NEO4J_USERNAME,
                process.env.REACT_APP_NEO4J_PASSWORD)
            const driver = getDriver()
            const session = driver.session()
            alert(getChar)
            const res1 = await session.readTransaction(tx => tx.run(getChar))
            setCharAndGen([
                res1.records.map(row => {
                    return toNativeTypes(row.get('char'))
                }).map(e => Object.values(e).join('')),
                res1.records.map(row => {
                    return toNativeTypes(row.get('gender'))
                }).map(e => Object.values(e).join(''))])
            alert(get, {speaker, addressee, chapter})
            const res2 = await session.readTransaction(tx => tx.run(get, { speaker, addressee, chapter }))
            let poemRes = res2.records.map(row => { return toNativeTypes(row.get('exchange')) })
            let transTemp = res2.records.map(row => { return toNativeTypes(row.get('trans')) }).map(row => [Object.keys(row.end.properties), Object.values(row.end.properties)])
            let [plist, info, propname] = getPoemTableContent(poemRes, transTemp)
            setMetadata(plist)
            // [
            //     [
            //         "01KR05",
            //         "Genji's Grandmother",
            //         "Kiritsubo Emperor"
            //     ]
            // ]
            setEntries(info)
            // {
            //     "01KR05": {
            //         "Cranston": "The once sheltering shade\nThat kept rough winds away is now\nLifeless and bare,\nAnd my heart, too withered, had no rest\nFrom fret for the young bush clover.",
            //         "Washburn": "The tree that was once a buffer against \nThese harsh autumn winds has withered and left \nThe bush clover to its uncertain fate ",
            //         "Waley": "All this, together with a poem in which she compared her grandchild to a flower which has lost the tree that sheltered it from the great winds, was so wild and ill-writ as only to be suffered from the hand of one whose sorrow was as yet unhealed.",
            //         "WaleyPageNum": 11,
            //         "Tyler": "Ever since that tree whose boughs took the cruel winds withered and was lost \nmy heart is sorely troubled for the little hagi frond.",
            //         "Seidensticker": "The tree that gave them shelter has withered and died. \nOne fears for the plight of the hagi shoots beneath.",
            //         "Japanese": "荒き風\nふせぎし陰の\n枯しより\n小萩がうへぞ\n静心なき",
            //         "Romaji": "Araki kaze\nFusegishi kage no\nKareshi yori\nKohagi ga ue zo\nShizugokoro naki"
            //     }
            // }
            setEditProp(propname)
            // [
            //     [
            //         "Japanese",
            //         "Romaji",
            //         "empty",
            //         "empty"
            //     ]
            // ]
            session.close()
            closeDriver()
        }
        // _().catch(console.error)
        try{
            if(varsDefined){
                _();
            }
        } catch (err) {
            alert(err)
            console.error(err)
        }
    }, [chapter, spkrGen, speaker, addrGen, addressee])

    function getOptions(pnum) {
        let options = Object.keys(entries[pnum]).sort();
        let w = options.indexOf('WaleyPageNum')
        if (w > -1) {
            options.splice(w, 1)
        }
        // notice that one can improve this by taking care of the below two while preparing for info
        let j = options.indexOf('Japanese')
        if (j > -1) {
            options.splice(j, 1)
        }
        let r = options.indexOf('Romaji')
        if (r > -1) {
            options.splice(r, 1)
        }
        return (options)
    }

    function setColumnOptions(event) {
        let type = event.target.value
        if (type !== 'Select:') {
            let col = '.ptcol' + JSON.stringify(event.target.className).slice(-2, -1)
            let cells = document.querySelectorAll(col)
            cells.forEach(e => {
                e.querySelectorAll('select').forEach(e => {
                    e.value = type
                    let p = e.parentElement.querySelector('p')
                    let pnum = p.className
                    if (type === 'Waley') {
                        p.innerHTML = entries[pnum][type] + '\n' + entries[pnum]['WaleyPageNum']
                    } else {
                        p.innerHTML = entries[pnum][type]
                    }
                    if (type === 'Japanese') {
                        p.setAttribute('type', 'JP')
                    } else {
                        p.setAttribute('type', 'non-JP')
                    }
                })
            })
            let j = parseInt(JSON.stringify(event.target.className).slice(-2, -1))
            let prop = editProp
            prop.forEach(row => row[j - 1] = type)
            setEditProp(prop)
        }
    }

    function setCharColor(name) {
        let characters = charAndGen[0]
        let genders = charAndGen[1]
        let index = characters.indexOf(name)
        let gender = genders[index]
        if (gender === 'male') {
            return (
                <p className='male-char'>{name}</p>
            )
        } else if (gender === 'nonhuman') {
            return (
                <p className='nonhuman-char'>{name}</p>
            )
        } else {
            return (
                <p className='female-char'>{name}</p>
            )
        }
    }

    function updateSelection(event) {
        let target = event.target.parentElement.querySelector('p') // updates the p tag each time the selection is changed
        let pnum = target.className
        let type = event.target.value
        if (type === 'select:') {
            target.innerHTML = ''
        } else {
            if (type === 'Waley') {
                target.innerHTML = entries[pnum][type] + '\n' + entries[pnum]['WaleyPageNum']
            } else {
                target.innerHTML = entries[pnum][type]
            }
            if (type === 'Japanese') {
                target.setAttribute('type', 'JP')
            } else {
                target.setAttribute('type', 'non-JP')
            }
        }
        event.target.value = type
        let prop = editProp
        let i = parseInt(pnum.substring(4, 6))
        let j = parseInt(event.target.parentElement.className.substring(5, 6))
        prop[i - 1][j - 1] = type
        setEditProp(prop)
    }

    return (
        <div style={{ position: "relative" }}>
            <table>
                <thead>
                    <tr>
                        <th>Chapter</th>
                        <th>Poem Number</th>
                        <th className='spkrCol'>Speaker</th>
                        <th className='addrCol'>Addressee</th>
                        <th>
                            Japanese
                        </th>
                        <th>
                            Romaji
                        </th>
                        <th>
                            {auth === true
                                ? 'Cranston'
                                : <select className={'ptcol3'} onChange={setColumnOptions}>
                                    <option>Translation A</option>
                                    <option>Cranston</option>
                                    <option>Seidensticker</option>
                                    <option>Tyler</option>
                                    <option>Waley</option>
                                    <option>Washburn</option>
                                </select>}
                        </th>
                        <th>{auth === true
                            ? 'Seidensticker'
                            : <select className={'ptcol4'} onChange={setColumnOptions}>
                                <option>Translation B</option>
                                <option>Cranston</option>
                                <option>Seidensticker</option>
                                <option>Tyler</option>
                                <option>Waley</option>
                                <option>Washburn</option>
                            </select>}
                        </th>
                        {auth === true ? <th>Tyler</th> : null}
                        {auth === true ? <th>Waley</th> : null}
                        {auth === true ? <th>Washburn</th> : null}
                    </tr>
                </thead>
                <tbody>
                    {metadata.map((row) =>
                        <tr key={row[0]}>
                            <td>{parseChp(row[0])}</td>
                            <td className='pg'>{
                                <Link 
                                    to={`/poems/${parseInt(row[0].substring(0, 2))}/${parseInt(row[0].match(/.{1,2}/g)[2])}`}
                                    target="_blank"
                                >
                                    {parseOrder(row[0])}
                                </Link>
                            }</td>
                            <td className='spkrCol'>
                                {setCharColor(row[1])}
                                {auth === true
                                    && <Edit
                                        uri={process.env.REACT_APP_NEO4J_URI}
                                        user={process.env.REACT_APP_NEO4J_USERNAME}
                                        password={process.env.REACT_APP_NEO4J_PASSWORD}
                                        propertyName={'name'}
                                        name={row[1]}
                                    />}
                            </td>
                            <td className='addrCol'>
                                {setCharColor(row[2])}
                                {auth === true
                                    && <Edit
                                        uri={process.env.REACT_APP_NEO4J_URI}
                                        user={process.env.REACT_APP_NEO4J_USERNAME}
                                        password={process.env.REACT_APP_NEO4J_PASSWORD}
                                        propertyName={'name'}
                                        name={row[2]}
                                    />}
                            </td>
                            <td className='ptcol1'>
                                {auth === true
                                    ? <Edit
                                        uri={process.env.REACT_APP_NEO4J_URI}
                                        user={process.env.REACT_APP_NEO4J_USERNAME}
                                        password={process.env.REACT_APP_NEO4J_PASSWORD} propertyName={'Japanese'}
                                        currVal={entries[row[0]]['Japanese']}
                                        pnum={row[0]}
                                    />
                                    : <p type='JP' className={row[0]} style={{ padding: "10px" }}>{entries[row[0]]['Japanese']}</p>}
                            </td>
                            <td className='ptcol2'>
                                {auth === true
                                    ? <Edit
                                        uri={process.env.REACT_APP_NEO4J_URI}
                                        user={process.env.REACT_APP_NEO4J_USERNAME}
                                        password={process.env.REACT_APP_NEO4J_PASSWORD}
                                        propertyName={'Romaji'}
                                        currVal={entries[row[0]]['Romaji']}
                                        pnum={row[0]}
                                    />
                                    : <p className={row[0]} style={{ padding: "10px" }}>{entries[row[0]]['Romaji']}</p>}
                            </td>
                            {auth === true
                                ? <td className='ptcol3'>
                                    <Edit
                                        uri={process.env.REACT_APP_NEO4J_URI}
                                        user={process.env.REACT_APP_NEO4J_USERNAME}
                                        password={process.env.REACT_APP_NEO4J_PASSWORD}
                                        propertyName={'Cranston'}
                                        currVal={entries[row[0]]['Cranston']}
                                        pnum={row[0]}
                                    />
                                </td>
                                : <td className='ptcol3'>
                                    <select onChange={updateSelection}>
                                        <option>select:</option>
                                        {getOptions(row[0]).map((item) => <option key={entries[row[0]][item]}>{item}</option>)}
                                    </select>
                                    <br />
                                    <p className={row[0]}></p>
                                </td>}
                            {auth === true
                                ? <td className='ptcol4'>
                                    <Edit
                                        uri={process.env.REACT_APP_NEO4J_URI}
                                        user={process.env.REACT_APP_NEO4J_USERNAME}
                                        password={process.env.REACT_APP_NEO4J_PASSWORD}
                                        propertyName={'Seidensticker'}
                                        currVal={entries[row[0]]['Seidensticker']}
                                        pnum={row[0]}
                                    />
                                </td>
                                :
                                <td className='ptcol4'>
                                    <select onChange={updateSelection}>
                                        <option>select:</option>
                                        {getOptions(row[0]).map((item) => <option key={entries[row[0]][item]}>{item}</option>)}
                                    </select>
                                    <br />
                                    <p className={row[0]}></p>
                                </td>}
                            {auth === true
                                ? <td className='ptcol5'>
                                    <Edit
                                        uri={process.env.REACT_APP_NEO4J_URI}
                                        user={process.env.REACT_APP_NEO4J_USERNAME}
                                        password={process.env.REACT_APP_NEO4J_PASSWORD} propertyName={'Tyler'}
                                        currVal={entries[row[0]]['Tyler']}
                                        pnum={row[0]}
                                    />
                                </td>
                                : null}
                            {auth === true
                                ? <td className='ptcol6'>
                                    <Edit
                                        uri={process.env.REACT_APP_NEO4J_URI}
                                        user={process.env.REACT_APP_NEO4J_USERNAME}
                                        password={process.env.REACT_APP_NEO4J_PASSWORD}
                                        propertyName={'Waley'}
                                        currVal={entries[row[0]]['Waley']}
                                        pnum={row[0]}
                                    />
                                    <Edit
                                        uri={process.env.REACT_APP_NEO4J_URI}
                                        user={process.env.REACT_APP_NEO4J_USERNAME}
                                        password={process.env.REACT_APP_NEO4J_PASSWORD}
                                        propertyName={'page'}
                                        currVal={entries[row[0]]['WaleyPageNum']}
                                        pnum={row[0]}
                                    />
                                </td>
                                : null}
                            {auth === true
                                ? <td className='ptcol7'>
                                    <Edit
                                        uri={process.env.REACT_APP_NEO4J_URI}
                                        user={process.env.REACT_APP_NEO4J_USERNAME}
                                        password={process.env.REACT_APP_NEO4J_PASSWORD}
                                        propertyName={'Washburn'}
                                        currVal={entries[row[0]]['Washburn']}
                                        pnum={row[0]}
                                    />
                                </td>
                                : null}
                        </tr>)}
                </tbody>
            </table>
        </div>
    )
}