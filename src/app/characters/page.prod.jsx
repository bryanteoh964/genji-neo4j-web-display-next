'use client';
import { useParams } from 'next/navigation';
import CharacterDetail from '../../components/CharacterBaseProfile.prod'; // Adjust if necessary

export default function CharacterPage() {
	const { name } = useParams();

	// Passing the decoded name to the CharacterDetail component
	return <CharacterDetail name={decodeURIComponent(name)} />;
}
