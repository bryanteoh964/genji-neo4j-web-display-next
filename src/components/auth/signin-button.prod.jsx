"use client"
import { signIn, useSession } from "next-auth/react";
import Link from 'next/link';
import styles from '../../styles/SignInButton.module.css';
 
export function SignIn() {
  const { data: session, status } = useSession();

  if(status === "loading") {
    return <div className={styles.button}>Loading...</div>
  }

  if(session) {
    return (
      <div className={styles.userContainer}>
        <Link href="/user" className={styles.userLink}>
          {session.user.name || session.user.email}
        </Link>
      </div>
    )
  } 

  return (
    <button 
      onClick={() => signIn()} 
      className={styles.signInButton}
    >
      Sign In
    </button>
  )
}