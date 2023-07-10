'use client';

import Link from 'next/link';


const Nav =()=> {
    return (
        <nav>
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
    )
}

export default Nav