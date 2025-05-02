'use client';
import { useParams } from 'next/navigation';
import ChaptersListPage from '../../components/ChapterBaseProfile.prod';
import styles from '../../styles/pages/chapters.module.css';

export default function ChapterPage() {
  const { name } = useParams();

  return (
    <section className={styles.section_frame}>
      <div className={styles.section_container}>
        <ChaptersListPage name={decodeURIComponent(name)} />
      </div>
    </section>  
  );
}
