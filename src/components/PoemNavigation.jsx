'use client';

import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../styles/pages/poemDisplay.module.css';

const PoemNavigation = () => {
    const { chapter, poem } = useParams();
    const [chapters, setChapters] = useState([]);
    const [prevNext, setPrevNext] = useState([["", 0], ["", 0]]);
    const [buttonLock, setButtonLock] = useState(true);

    // load chapters
    useEffect(() => {
        const loadChapters = async () => {
            const response = await fetch(`/api/poems/poem_query`);
            const responseData = await response.json();
            setChapters(responseData);
            if (chapter !== undefined && poem !== undefined && responseData.length > 0) {
                updatePrevNext(responseData);
            }
        };
        loadChapters();
    }, []);

    // update prev and next
    useEffect(() => {
        if (chapters.length && chapter !== undefined && poem !== undefined) {
            updatePrevNext(chapters);
        }
    }, [chapters, chapter, poem]);

    function updatePrevNext(chps) {
        let prev, next;
        if (chapter === '1' && poem === '1') {
            prev = ['1', 1];
            next = ['1', 2];
        } else if (chapter === '54') {
            prev = ['53', 28];
            next = ['54', 1];
        } else if (chapter === '42') {
            prev = ['41', 26];
            next = ['43', 1];
        } else if (poem === '1') {
            prev = [(parseInt(chapter) - 1).toString(), chps[parseInt(chapter) - 2].count];
            next = [chapter, 2];
        } else if (parseInt(poem) === chps[parseInt(chapter) - 1].count) {
            prev = [chapter, parseInt(poem) - 1];
            next = [(parseInt(chapter) + 1).toString(), 1];
        } else {
            prev = [chapter, parseInt(poem) - 1];
            next = [chapter, parseInt(poem) + 1];
        }
        setPrevNext([prev, next]);
        setButtonLock(false);
    }

    return (
        <div className={styles.navigationContainer}>
            <Link
                href={`/poems/${prevNext[0][0]}/${prevNext[0][1]}`}
            >
                <Button
                    className={styles.navigationButton}
                    disabled={buttonLock}
                >
                    ◀ Previous
                </Button>
            </Link>
            <Link
                href={`/poems/${prevNext[1][0]}/${prevNext[1][1]}`}
            >
                <Button
                    className={styles.navigationButton}
                    disabled={buttonLock}
                >
                    Next ▶
                </Button>
            </Link>
        </div>
    );
};

export default PoemNavigation; 