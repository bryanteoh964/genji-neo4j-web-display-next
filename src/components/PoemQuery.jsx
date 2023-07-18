'use client'

import { useEffect, useState } from 'react'
// import { initDriver, getDriver, closeDriver } from '../neo4j.js'
// import { toNativeTypes, getChpList } from './utils'
import { Select, Col, Row, Button } from 'antd';
import '../../node_modules/antd/dist/antd.min.css';
// import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
const { Option } = Select;
import { useParams } from 'next/navigation';
import Link from 'next/link';

const PoemQuery = () => {
    // chapters: [{num: '1', count: 9, name: 'Kiritsubo 桐壺'},...]
    // count: number of poems in a chapter
    const [chapters, setChapters] = useState([])
    // values of the selects, e.g., [true, "1", "1"]
    const [chpSelect, setChpSelect] = useState([false, "", undefined])
    // 
    const [count, setCount] = useState([])
    // prevNext: [["prevChp", "nextChp"], ["prevNum", "nextNum"]]
    const [prevNext, setPrevNext] = useState([["",-1],["",-1]])
    // use this state variable to disable the previous and next buttons (not query), becomes false once a poem page is loaded
    const [buttonLock, setButtonLock] = useState(true)
    // keeps track of the url
    // const loc = useLocation()
    // temp loc
    const loc = {pathname: '/poems', search: '', hash: '', state: null, key: 'default'}
    
    let { chapter, number } = useParams()

    // new loads the dropdowns
    const loadDropdown = async () => {
        /*
            API Returns:
            - chp object - example: {chapter number: '1', number of chapters: 9, chapter name: 'Kiritsubo 桐壺'}
        */
        const response = await fetch(`/api/poems/poem_query`);
        const responseData = await response.json();
        setChapters(responseData)
    };

    useEffect(() => {
        loadDropdown();
        if (chapter !== undefined && number !== undefined) {
            setChpSelect([true, chapter, number])
            setButtonLock(false)
            updatePrevNext(chapters)
        }
    }, [])

    // chps: the chapters state array
    function updatePrevNext(chps) {
        let prev, next
        if (chapter === '1' && number === '1') {
            prev = ['1', 1]
            next = ['1', 2]
        } else if (chapter === '54') {
            prev = ['53', 28]
            next = ['54', 1]
        } else if (chapter === '42') {
            prev = ['41', 26]
            next = ['43', 1]
        } else if (number === '1') {
            prev = [(parseInt(chapter) - 1).toString(), chps[parseInt(chapter) - 2].count]
            next = [chapter, 2]
        } else if (parseInt(number) === chps[parseInt(chapter) - 1].count) {
            prev = [chapter, parseInt(number) - 1]
            next = [(parseInt(chapter) + 1).toString(), 1]
        } else {
            prev = [chapter, parseInt(number) - 1]
            next = [chapter, parseInt(number) + 1]
        } 
        setPrevNext([prev, next])
        setChpSelect([true, chapter, number])
    }

    // 
    useEffect(() => {
        if (chapters.length && chapter !== undefined && number !== undefined) {
            updatePrevNext(chapters)
        }
    }, [loc, chapters])

    return (
        <Row>
            <Col span={5}>
                <Select 
                    showSearch
                    placeholder="Select a chapter"
                    style={{ width:220 }}
                    value={chpSelect[1]}
                    onSelect={(value) => {
                        console.log("Value ran!", value)
                        setChpSelect([true, value, chpSelect[2]])
                        setCount(Array.from({length: chapters[value-1].count}, (_, i) => i + 1))
                    }}
                >
                    {chapters.map(chp => 
                        <Option
                            key={chp.num}
                            value={chp.num}
                        >
                            {chp.num + ' ' + chp.name}
                        </Option>
                    )}
                </Select>
                <Select
                    showSearch
                    placeholder="#"
                    disabled={!chpSelect[0]}
                    value={chpSelect[2]}
                    onSelect={(value) => {
                        setChpSelect([chpSelect[0], chpSelect[1], value])
                        // updateNext(value, false)
                    }}
                >
                    {count.map(ct => 
                        <Option
                            key={ct}
                            value={ct}
                        >
                            {ct}
                        </Option>
                    )}
                </Select>
                <Link
                    href={`/poems/${chpSelect[1]}/${chpSelect[2]}`}
                >
                    <Button 
                        disabled={typeof chpSelect[2] === 'undefined'}
                        onClick={
                            () => {
                                setButtonLock(false)
                            }
                        }
                    >
                        Query
                    </Button>
                </Link>
                <br />
                <Link
                    href={`/poems/${prevNext[0][0]}/${prevNext[0][1]}`}    
                >
                    <Button
                        disabled={buttonLock}
                        onClick={() => setCount(Array.from({length: chapters[parseInt(prevNext[0]) - 1].count}, (_, i) => i + 1))}
                    >
                        Previous
                    </Button>
                </Link>
                <Link
                    href={`/poems/${prevNext[1][0]}/${prevNext[1][1]}`}    
                >
                    <Button
                        disabled={buttonLock}
                        onClick={() => setCount(Array.from({length: chapters[parseInt(prevNext[1]) - 1].count}, (_, i) => i + 1))}
                    >
                        Next
                    </Button>
                </Link>
            </Col>
            <Col span={19}>
                {/* <Outlet /> */}
            </Col>
        </Row>
    )
}

export default PoemQuery;