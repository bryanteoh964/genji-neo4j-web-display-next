'use client';
import { useParams } from 'next/navigation';
import CharactersListPage from '../../components/CharacterBaseProfile.prod';
import styles from '../../styles/pages/characterBase.module.css';


export default function CharacterPage() {
	const { name } = useParams();

	// Passing the decoded name to the CharacterDetail component
	return (
		<section className={styles.section_frame}>
		  <div className={styles.section_container}>
		  	<CharactersListPage name={decodeURIComponent(name)} />
		  </div>
		</section>  
	  );
}
