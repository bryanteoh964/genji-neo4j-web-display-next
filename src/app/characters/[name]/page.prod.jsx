'use client'

import { useParams } from 'next/navigation';
import CharacterDetail from '../../../components/CharacterProfile.prod';

export default function CharacterPage() {
    const params = useParams();
    const name = params.name;

    return <CharacterDetail name={decodeURIComponent(name)} />;
}