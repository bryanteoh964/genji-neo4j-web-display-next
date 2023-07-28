'use client';

import { useEffect, useState } from 'react';
import { Select, Col, Row, Button } from 'antd';
import '../../node_modules/antd/dist/antd.min.css';
const { Option } = Select;
import { useParams } from 'next/navigation';
import Link from 'next/link';

import styles from "../styles/pages/poems.module.css";

const PoemQuery = () => {
    /*
        State Variables:
            chapters: [{num: '1', count: 9, name: 'Kiritsubo 桐壺'},...]
            chpSelect: values of the selects, e.g., [true, "1", "1"]
            count: number of poems in a chapter
            prevNext: [["prevChp", "nextChp"], ["prevNum", "nextNum"]]
            buttonLock: Disabling previous and next buttons
            loc keeps track of the url
    */
    const [chapters, setChapters] = useState([])
    const [chpSelect, setChpSelect] = useState([false, '', ''])
    const [count, setCount] = useState([])
    const [prevNext, setPrevNext] = useState([["",0],["",0]])
    const [buttonLock, setButtonLock] = useState(true)
    const [loc, setLoc] = useState({pathname: '/poems', search: '', hash: '', state: null, key: 'default'})
    
    let { chapter, poem } = useParams()

    // Temporary keep track of the state variables
    useEffect(() => {
        console.log("Link 1 check: ", `/poems/${chpSelect[1]}/${chpSelect[2]}`)
        console.log("Link 2 check: ", `/poems/${prevNext[0][0]}/${prevNext[0][1]}`)
        console.log("Link 3 check: ", `/poems/${prevNext[1][0]}/${prevNext[1][1]}`)
        // check if any of the individual variabls above are undefined
        console.log("chpSelect[1]:", chpSelect[1] === undefined)
        console.log("chpSelect[2]:", chpSelect[2] === undefined)
        console.log("prevNext[0][0]:", prevNext[0][0] === undefined)
        console.log("prevNext[0][1]:", prevNext[0][1] === undefined)
        console.log("prevNext[1][0]:", prevNext[1][0] === undefined)
        console.log("prevNext[1][1]:", prevNext[1][1] === undefined)
        console.log("chapter:", chapter === undefined)
        console.log("poem:", poem === undefined)
    }, [chapters, chpSelect, count, prevNext, buttonLock, loc])
    /*
        Handles dropdown logic
    */
    useEffect(() => {
        /*
            Purpose: Calls backend API to load dropdown menu
            API Returns:
            - chp object - example: {chapter number: '1', number of chapters: 9, chapter name: 'Kiritsubo 桐壺'}
        */
        const loadDropdown = async () => {
            const response = await fetch(`/api/poems/poem_query`);
            const responseData = await response.json();
            setChapters(responseData)
            const chapter_count = Object.values(responseData).map(item => item.count)[chapter - 1]
            // make the elements in the array strings
            // const chapter_array = Array.from(Array(chapter_count).keys()).map(item => item + 1)
            const chapter_array = Array.from(Array(chapter_count).keys()).map(item => (item + 1).toString())
            setCount(chapter_array);
        };
        loadDropdown();
        if (chapter !== undefined && poem !== undefined && chapters.length > 0) {
            setChpSelect([true, chapter, poem])
            setButtonLock(false)
            updatePrevNext(chapters)
        }
    }, [])

    /*
        Purpose: Logic for updating the previous and next chapter and poem number buttons
    */
    function updatePrevNext(chps) {
        let prev, next
        if (chapter === '1' && poem === '1') {
            prev = ['1', 1]
            next = ['1', 2]
        } else if (chapter === '54') {
            prev = ['53', 28]
            next = ['54', 1]
        } else if (chapter === '42') {
            prev = ['41', 26]
            next = ['43', 1]
        } else if (poem === '1') {
            prev = [(parseInt(chapter) - 1).toString(), chps[parseInt(chapter) - 2].count]
            next = [chapter, 2]
        } else if (parseInt(poem) === chps[parseInt(chapter) - 1].count) {
            prev = [chapter, parseInt(poem) - 1]
            next = [(parseInt(chapter) + 1).toString(), 1]
        } else {
            prev = [chapter, parseInt(poem) - 1]
            next = [chapter, parseInt(poem) + 1]
        }
        setPrevNext([prev, next])
        setChpSelect([true, chapter.toString(), poem.toString()])
        setButtonLock(false)
    }

    // 
    useEffect(() => {
        if (chapters.length && chapter !== undefined && poem !== undefined) {
            updatePrevNext(chapters)
        }
    }, [loc, chapters])

    return (
        <Row>
            <Col span={24} className={styles.search_bar}>
                {/* Chapter Select */}
                <Select 
                    showSearch
                    placeholder="Select a chapter"
                    style={{ width:460 }}
                    value={chpSelect[1]}
                    onSelect={(value) => {
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
                {/* Chapter Poem Select */}
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
                </Select>{/* Query Button */}
                <Link
                    href={`/poems/${chpSelect[1].toString() === undefined ? '' : chpSelect[1].toString()}/${chpSelect[2].toString() === undefined ? '' : chpSelect[2].toString()}`}
                >
                    <div>
                        <Button 
                            disabled={chpSelect[0] === false}
                            onClick={
                                () => {
                                    setButtonLock(false)
                                }
                            }
                        >
                            Query
                        </Button>
                    </div>
                </Link>
                {/* Previous Poem Button */}
                <Link
                    href={`/poems/${prevNext[0][0].toString() === undefined ? '' : prevNext[0][0].toString()}/${prevNext[0][1].toString() === undefined ? '' : prevNext[0][1].toString()}`}    
                >
                    <div>   
                        <Button
                            disabled={buttonLock}
                            onClick={() => setCount(Array.from({length: chapters[parseInt(prevNext[0]) - 1].count}, (_, i) => i + 1))}
                        >
                            Previous
                        </Button>
                    </div>
                </Link>
                {/* Next Poem Button */}
                <Link
                    href={`/poems/${prevNext[1][0].toString() === undefined ? '' : prevNext[1][0].toString()}/${prevNext[1][1].toString() === undefined ? '' : prevNext[1][1].toString()}`}    
                >
                    <div>
                        <Button
                            disabled={buttonLock}
                            onClick={() => setCount(Array.from({length: chapters[parseInt(prevNext[1]) - 1].count}, (_, i) => i + 1))}
                        >
                            Next
                        </Button>
                    </div>
                </Link>
            </Col>
        </Row>
    )
}

export default PoemQuery;