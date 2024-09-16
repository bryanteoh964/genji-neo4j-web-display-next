'use client';

import Link from 'next/link';
import styles from '../styles/Navigation.module.css'


const Nav =()=> {
    return (
        <div className={styles.nav_frame}>
            <nav className={styles.nav_container}>
                <Link href="/" alt="Home Page">About</Link>
                <Link href="/poems" alt="Genji Poem in multiple translations">Poems</Link>
                <Link href="/characters" alt="Genji characters display">Characters</Link>
                <Link href="/search" alt="Search character poem interactions">Search</Link>
                {/* <Link href="/allusions">Allusions</Link> */}
                {/* <Link href="/characters">Characters</Link>
                
                <Link href="/alt_characters">Alt Characters</Link>
                <Link href="/allusions">Allusions</Link>
                <Link href="/edit">Edit</Link> */}
                <Link href="/acknowledgements" alt="Acknowledgements page">Acknowledgements</Link>
                <Link href="/sources" alt="Sources & Resources" className="long-text">Sources & Resources</Link>
                <Link href="/bug" alt="Report page">Report A Bug</Link>
            </nav>
        </div>
    )
}

export default Nav