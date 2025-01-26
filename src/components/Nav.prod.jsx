'use client';

import {useEffect, useState} from 'react';
import { ReactFlowProvider } from 'reactflow';
import Link from 'next/link';
import styles from '../styles/Navigation.module.css'
import SearchOptions from './SearchDropDown.prod'
import CharactersOptions from './CharactersDropDown.prod'

const Nav =()=> {
    const [graph, setGraph] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() =>{
    const _ = async()=>{
        const data = await fetch(`/api/character_names`);
        const graphData = await data.json();
        setGraph(graphData);
        setIsLoading(false);
    }
    _()
    },[]);

    return (
        <div className={styles.nav_frame}>
            <nav className={styles.nav_container}>
                <Link href="/" alt="Home Page">About</Link>
                <Link href="/poems" alt="Genji Poem in multiple translations">Poems</Link>
                <div>
                    <>
                    {isLoading ? 
                            <div style={{fontSize: "15px", fontWeight: "bold", color: "gray", marginLeft: "10px" , marginRight: "10px"}}>Loading...</div>
                        :
                            <ReactFlowProvider>
                                <CharactersOptions l={graph}/>
                            </ReactFlowProvider>
                    }
                    </>
                </div>
                <SearchOptions />
                {/*<Link href="/search" alt="Search character poem interactions">Search</Link> */}
                {/* <Link href="/allusions">Allusions</Link> */}
                {/* <Link href="/characters">Characters</Link>
                
                <Link href="/alt_characters">Alt Characters</Link>
                <Link href="/allusions">Allusions</Link>
                <Link href="/edit">Edit</Link> */}
                <Link href="/acknowledgements" alt="Acknowledgements page">Acknowledgements</Link>
                <Link href="/Sources" alt="Sources & Resources" className="long-text">Sources & Resources</Link>
                <Link href="/bug" alt="Report page">Report A Bug</Link>
            </nav>
        </div>
    )
}

export default Nav