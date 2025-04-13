'use client';
import { useParams } from 'next/navigation';
import CharactersListPage from '../../components/CharacterBaseProfile.prod'; // Adjust if necessary

export default function CharacterPage() {
	const { name } = useParams();

	// Passing the decoded name to the CharacterDetail component
	return <CharactersListPage name={decodeURIComponent(name)} />;
}
