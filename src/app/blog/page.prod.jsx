'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../../styles/pages/translatorProfile.module.css';

const translators = [
  { name: 'About Arthur Waley' },
  { name: 'About Dennis Washburn' },
  { name: 'About Edward Seidensticker' },
  { name: 'About Edwin Cranston' },
  { name: 'About Royall Tyler' },
];

export default function BlogsPage() {
  const [blogNames, setBlogNames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getBlogNames() {
    const response = await fetch('/api/blog/getBlogList');
    const data = await response.json();
    return data.titles;
  }

  useEffect(() => {
    getBlogNames().then(names => {
      setBlogNames(names);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className={styles.translatorPage}>
      <div className={styles.heroSection}>
        <img
          className={styles.fullBackgroundImage}
          src="/images/blog_banner.jpg"
          alt="blog background"
        />
        <div className={styles.titleOverlay}>
          <span className={styles.nameEnglish}>BLOG</span>
        </div>
      </div>

      <div className={styles.mainSection}>
        <div id="about" className={styles.description}>
          <div className={styles.descriptionContent}>
            <div className={styles.translatorList}>
              {/* {isLoading ? (
                <div className={styles.loading}>Loading...</div>
              ) : (
                translators.map((translator) => (
                  <div key={translator.name} className={styles.blogItem}>
                    <Link 
                      href={`/blogs/${translator.name.split(' ')[2]}`}
                    className={styles.nameInDescription}
                  >
                    <span className={styles.nameInDescription}>{translator.name}</span>
                  </Link>
                </div>
              )))} */}

              {isLoading ? (
                <div className={styles.loading}></div>
              ) : (
                blogNames.map((blogTitle) => (
                  <div key={blogTitle} className={styles.blogItem}>
                    <Link href={`/blog/${blogTitle}`} className={styles.nameInDescription}>
                    <span className={styles.nameInDescription}>{blogTitle}</span>
                  </Link>
                </div>
              )))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}