'use client'

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import styles from '../../styles/pages/signin.module.css';

// custom sign in page
export default function SignIn() {
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!agreed) {
      setError('Please accept the Terms of Service and Privacy Policy to continue');
      return;
    }
    
    try {
      await signIn('google', { 
        callbackUrl: '/user',
      })
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An error occurred during sign in');
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Welcome to </h1> 
        <h1>The Tale of Genji Poem Database</h1>
        
        <div className={styles.notice}>
          <p>By signing in, you will be able to:</p>
          <ul>
            <li>Create and manage your profile</li>
            <li>Save your favorite poems</li>
            <li>Get credited as a contributor to our database</li>
            <li>Engage in literary discussions</li>
          </ul>
        </div>

        <div className={styles.termsSection}>
          <label className={styles.checkboxContainer}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>
              I agree to the{' '}
              <Link href="/terms" target="_blank">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" target="_blank">
                Privacy Policy
              </Link>
            </span>
          </label>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button
          onClick={handleSignIn}
          className={`${styles.signInButton} ${!agreed ? styles.disabled : ''}`}
          disabled={!agreed}
        >
          <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#FFF" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#FFF" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FFF" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#FFF" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  )
}