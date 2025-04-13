'use client';
import { useParams } from 'next/navigation';
import ChaptersListPage from '../../components/ChapterBaseProfile.prod'; // You'll need to create this

export default function ChapterPage() {
  const { name } = useParams();

  return <ChaptersListPage name={decodeURIComponent(name)} />;
}
