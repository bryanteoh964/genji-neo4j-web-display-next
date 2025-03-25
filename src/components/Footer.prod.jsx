'use client';

import styles from '../styles/footer.module.css';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLeft}>
          <span>DESIGN BY HONEST STRUGGLE</span>
        </div>
        
        <div className={styles.footerCenter}>
          <Link href="/">
            <span className={styles.footerLink}>www.Genjipoems.org</span>
          </Link>
        </div>
        
        <div className={styles.footerRight}>
          <span>copyright {currentYear}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;