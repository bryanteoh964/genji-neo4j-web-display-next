'use client'

import { useParams } from 'next/navigation';
import PoemSearch from "../../components/PoemKeywordSearch.prod"

export default function CharacterPage() {
    const params = useParams();

    return (
        <div>
            <h1>Peom Search</h1>
            <PoemSearch />
        </div>
    );
}