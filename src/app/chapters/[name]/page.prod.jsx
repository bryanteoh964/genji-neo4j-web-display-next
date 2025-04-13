'use client';

import { useParams } from 'next/navigation';
import ChapterDetail from '../../../components/ChapterProfile.prod';

// character profile page
export default function CharacterPage() {
    const params = useParams();
    const name = decodeURIComponent(params.name); // Decode the character name

    return <ChapterDetail name={name} />;
}
