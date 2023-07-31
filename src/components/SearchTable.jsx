'use client';

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link';
import Edit from '@/components/Edit';
import 'antd/dist/antd.min.css';

export default function PoemTable({ query }) {
    // Info passed from the Search component
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
    const getChar = 'match (c:Character) return c.name as char, c.gender as gender order by c.name'

    useEffect (() => {
        setChapter(1)
    }, [])


    useEffect(() => {
        // write an async function to set the values
        const setStateValues = async () => {
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

        // let allSpkrGen = ['male', 'female']
        // let allAddrGen = ['male', 'female', 'nonhuman', 'multiple']
        if (spkrGen && spkrGen.split(',').length === 2) {
            spkrGen = 'Any'
        }
        if (addrGen && addrGen.split(',').length === 4) {
            addrGen = 'Any'
        }
    }, [spkrGen, addrGen, auth, username, password])


    useMemo(() => {
        // make sure speaker, addressee, and chapter are defined
        let varsDefined = !(spkrGen === undefined) && !(addrGen === undefined) && !(speaker === undefined) && !(addressee === undefined) && !(chapter === undefined)

        const _ = async () => {
            // Information to send to the backend: getChar, get, { speaker, addressee, chapter }
            const fetchData1 = async ( params = {} ) => {
                const response = await fetch (`/api/search?requestType=${"get characters"}&&getChar=${getChar}`);
                const responseData = await response.json();
                return responseData;
            };

            const fetchData2 = async ( params = {} ) => {
                const response = await fetch (`/api/search?requestType=${"get interactions"}&&spkrGen=${spkrGen}&&addrGen=${addrGen}&&speaker=${speaker}&&addressee=${addressee}&&chapter=${chapter}`);
                const responseData = await response.json();
                return responseData;
            };

            const updateLocalStates = async () => {
                const res1 = await fetchData1({ getChar });
                const res2 = await fetchData2({ spkrGen, addrGen, speaker, addressee, chapter });
                setCharAndGen(res1)
                let plist = res2.plist
                let info = res2.info
                let propname = res2.propname
                setMetadata(plist)
                // [ [ "01KR05", "Genji's Grandmother", "Kiritsubo Emperor"] ]
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
            };
            updateLocalStates();
        }
        // _().catch(console.error)
        if(varsDefined){
            _();
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

    // input: String pnum, poem number
    // output: A html paragraph that contains the chapter name of a Genji poem with Romaji in front of Kanji
    function parseChp(pnum) {
        const chapterNames = {'01':'Kiritsubo 桐壺','02':'Hahakigi 帚木','03':'Utsusemi 空蝉','04':'Yūgao 夕顔','05':'Wakamurasaki 若紫','06':'Suetsumuhana 末摘花','07':'Momiji no Ga 紅葉賀','08':'Hana no En 花宴','09':'Aoi 葵','10':'Sakaki 榊','11':'Hana Chiru Sato 花散里','12':'Suma 須磨','13':'Akashi 明石','14':'Miotsukushi 澪標','15':'Yomogiu 蓬生','16':'Sekiya 関屋','17':'E Awase 絵合','18':'Matsukaze 松風','19':'Usugumo 薄雲','20':'Asagao 朝顔','21':'Otome 乙女','22':'Tamakazura 玉鬘','23':'Hatsune 初音','24':'Kochō 胡蝶','25':'Hotaru 螢','26':'Tokonatsu 常夏','27':'Kagaribi 篝火','28':'Nowaki 野分','29':'Miyuki 行幸','30':'Fujibakama 藤袴','31':'Makibashira 真木柱','32':'Umegae 梅枝','33':'Fuji no Uraba 藤裏葉','34':'Wakana: Jō 若菜上','35':'Wakana: Ge 若菜下','36':'Kashiwagi 柏木','37':'Yokobue 横笛','38':'Suzumushi 鈴虫','39':'Yūgiri 夕霧','40':'Minori 御法','41':'Maboroshi 幻','42':'Niou Miya 匂宮','43':'Kōbai 紅梅','44':'Takekawa 竹河','45':'Hashihime 橋姫','46':'Shii ga Moto 椎本','47':'Agemaki 総角','48':'Sawarabi 早蕨','49':'Yadorigi 宿木','50':'Azumaya 東屋','51':'Ukifune 浮舟','52':'Kagerō 蜻蛉','53':'Tenarai 手習','54':'Yume no Ukihashi 夢浮橋'};
    
        let [chp, _, smt] = pnum.match(/.{1,2}/g);
        let chp_name = chapterNames[chp];
        if (!chp_name) {
            chp_name = 'Unknown Chapter';
        }
    
        return (
            <p>{chp} {chp_name}</p>
        );
    }
    

    // input: String pnum, poem number
    // output: A html paragraph that contains the order of a poem in its chapter
    function parseOrder(pnum) {
        let [chp, _, order] = pnum.match(/.{1,2}/g)
        order = parseInt(order)
        return (
            <p>{order}</p>
        )
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
                                    href={`/poems/${parseInt(row[0].substring(0, 2))}/${parseInt(row[0].match(/.{1,2}/g)[2])}`}
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