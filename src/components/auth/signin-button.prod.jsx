"use client"
import { signIn, useSession } from "next-auth/react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../../styles/SignInButton.module.css';
// import NotificationIcon from '../NotificationIcon.prod';

// sign in button on main page
export function SignIn() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isActive = (path) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  // if(status === "loading") {
  //   return <div className={styles.button}>Loading...</div>
  // }

  if(session) {
    return (
      <div className={styles.userContainer}>

        {/* <NotificationIcon /> */}

        <Link 
          href="/user" 
          className={`${styles.userLink} ${isActive('/user') ? styles.active : ''}`}
        >
          {session.user.name || session.user.email}
        </Link>
      </div>
    );
  } 

  return (
    <div 
      onClick={() => signIn()} 
      className={`${styles.signInButton} ${isActive('/api/auth/signin') ? styles.active : ''}`}
    >
      Sign In
    </div>
  );
}