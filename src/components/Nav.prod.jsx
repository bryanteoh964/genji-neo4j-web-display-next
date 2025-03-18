'use client';

import {useEffect, useState} from 'react';
import { ReactFlowProvider } from 'reactflow';
import Link from 'next/link';
import styles from '../styles/Navigation.module.css'
import CharactersOptions from './CharactersDropDown.prod'
import MoreDropDown from './MoreDropDown.prod';

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
            <div className={styles.nav_container}>
                {/* Logo and Title */}
                <div className={styles.logo_container}>
                    <Link href="/" className={styles.logo_link}>
                        <div className={styles.logo}>
                            <img 
                                src="/images/genji_logo.png" 
                                alt="Genji Poems Logo" 
                                className={styles.logo_image}
                            />
                        </div>
                        <h1 className={styles.site_title}>Genji Poems</h1>
                    </Link>
                </div>
                
                {/* Navigation Links */}
                <nav className={styles.nav_links}>
                    <Link href="/poems" alt="Genji Poem in multiple translations">POEMS</Link>
                    <Link href="/chapters" alt="chapters">CHAPTERS</Link>
                    
                    {/* Characters Dropdown */}
                    <div className={styles.dropdown_wrapper}>
                        {isLoading ? 
                            <div className={styles.loading_text}>Loading...</div>
                            :
                            <ReactFlowProvider>
                                <CharactersOptions l={graph}/>
                            </ReactFlowProvider>
                        }
                    </div>
                    
                    {/* More Dropdown */}
                    <MoreDropDown />
                    
                    <Link href="/about" alt="About Page">ABOUT</Link>
                </nav>
            </div>
        </div>
    )
}

export default Nav