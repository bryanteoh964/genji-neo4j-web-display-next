'use client';

import { useEffect, useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import Link from 'next/link';
import styles from '../styles/Navigation.module.css';
import CharactersDropDown from './CharactersDropDown.prod';
import MoreDropDown from './MoreDropDown.prod';
import { SignIn } from './auth/signin-button.prod';
import NotificationIcon from './NotificationIcon.prod';
import { useSession } from 'next-auth/react';
import LogoSVG from '../../public/images/genji_logo.svg';


const Navigation = () => {
    const [graph, setGraph] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchCharacterData = async () => {
            try {
                const response = await fetch('/api/character_names');
                const graphData = await response.json();
                setGraph(graphData);
            } catch (error) {
                console.error('Error fetching character data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCharacterData();
    }, []);

    return (
        <div className={styles.navFrame}>
            <div className={styles.navContainer}>
                {/* Logo and Title */}
                <div className={styles.logoContainer}>
                    <Link href="/" className={styles.logoLink}>
                        <div className={styles.logo}>
                            {/* <img 
                                src="/images/genji_logo.png" 
                                alt="Genji Poems Logo" 
                                className={styles.logoImage}
                            /> */}

                        <LogoSVG width={30} height={59} />

                        </div>
                        <h1 className={styles.siteTitle}>
                            Genji
                            <span className={styles.titleSecondary}>poems</span>
                        </h1>
                    </Link>
                </div>
                
                {/* Navigation Links */}
                <div className={styles.navLinksWrapper}>
                    <nav className={styles.navLinks}>
                        {/* Poem Search */}
                        <Link href="/search/search-by-keyword">poem search</Link>
                        
                        {/* Characters Dropdown */}
                        {isLoading ? (
                            <div className={styles.dropdownWrapper}>
                                <span className={styles.loadingLink}>characters</span>
                            </div>
                        ) : (
                            <CharactersDropDown l={graph} />
                        )}
                        
                        <Link href="/chapters">chapters</Link>

                        {/* More Dropdown */}
                        <MoreDropDown />
                        
                        <Link href="/about">about</Link>
                    </nav>

                    <div className={styles.userControls}>
                        {session && <NotificationIcon />}
                        <SignIn />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navigation;