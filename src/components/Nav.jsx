'use client';

import Link from 'next/link';
import styles from '../styles/nav.module.css'


const Nav =()=> {
    return (
        <div>
            <nav className={styles.nav_frame}>
                <Link href="/">Home</Link>
                {/* <Link href="/poems">Poems</Link>
                <Link href="/characters">Characters</Link>
                <Link href="/alt_characters">Alt Characters</Link>
                <Link href="/allusions">Allusions</Link>
                <Link href="/search">Search</Link>
                <Link href="/edit">Edit</Link> */}
                <Link href="/about">About</Link>
                <Link href="/acknowledgements">Acknowledgements</Link>
            </nav>
        </div>
    )
}

export default Nav