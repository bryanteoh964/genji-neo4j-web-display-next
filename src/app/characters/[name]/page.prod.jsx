'use client';

import { useParams } from 'next/navigation';
import CharacterDetail from '../../../components/CharacterProfile.prod';

// character profile page
export default function CharacterPage() {
    const params = useParams();
    const name = decodeURIComponent(params.name); // Decode the character name

    return <CharacterDetail name={name} />;
}
