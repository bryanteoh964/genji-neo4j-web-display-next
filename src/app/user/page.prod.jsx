'use client'
import UserInfo from '../../components/auth/UserInfo.prod';
import FavList from "../../components/UserFavPoemList.prod";
import Note from "../../components/UserNote.prod";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../../styles/pages/userPage.module.css';

const Page = () => {
  const [activeTab, setActiveTab] = useState('info');
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  if (!session) {
    return null;
  }

  return (
    <div>
      
      <section className={styles.frame}>
        <div className={styles.Container}>
          <h1 className={styles.title}>User Page</h1>
        </div>
      </section>
    
      <div className={styles.pageContainer}>
        <div className={styles.sidebar}>
          <div className={styles.userBrief}>
            <h2>{session.user.name || session.user.email}</h2>
          </div>
          
          <nav className={styles.navigation}>
            <button 
              className={`${styles.navButton} ${activeTab === 'info' ? styles.active : ''}`}
              onClick={() => setActiveTab('info')}
            >
              <span className={styles.icon}>🎈</span>
              Profile Information
            </button>

            <button 
              className={`${styles.navButton} ${activeTab === 'favorites' ? styles.active : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              <span className={styles.icon}>⭐</span>
              Favorite Poems
            </button>

            <button 
              className={`${styles.navButton} ${activeTab === 'notes' ? styles.active : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              <span className={styles.icon}>🖊</span>
              Notes
            </button>
          </nav>
        </div>

        <main className={styles.mainContent}>
          <div className={styles.contentCard}>
            {activeTab === 'info' && <UserInfo />}
            {activeTab === 'favorites' && <FavList />}
            {activeTab === 'notes' && <Note />}
          </div>
        </main>
      </div>
    </div>
    
  );
};

export default Page;