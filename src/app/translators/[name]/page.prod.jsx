'use client';

import { useParams } from 'next/navigation';
import TranslatorProfile from '../../../components/TranslatorProfile.prod';

// translator profile page
export default function TranslatorPage() {
    const params = useParams();
    const name = decodeURIComponent(params.name); // Decode the translator name

    return <TranslatorProfile name={name} />;
}
