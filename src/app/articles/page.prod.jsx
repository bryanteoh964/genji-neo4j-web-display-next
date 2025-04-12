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

export default function TranslatorsPage() {
  const [articleNames, setArticleNames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getArticleNames() {
    const response = await fetch('/api/articles/getArticleList');
    const data = await response.json();
    return data.titles;
  }

  useEffect(() => {
    getArticleNames().then(names => {
      setArticleNames(names);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className={styles.translatorPage}>
      <div className={styles.heroSection}>
        <img
          className={styles.fullBackgroundImage}
          src="/images/articles_banner.jpg"
          alt="articles background"
        />
        <div className={styles.titleOverlay}>
          <span className={styles.nameEnglish}>ARTICLES</span>
        </div>
      </div>

      <div className={styles.mainSection}>
        <div id="about" className={styles.description}>
          <div className={styles.descriptionContent}>
            <div className={styles.translatorList}>
              {isLoading ? (
                <div className={styles.loading}>Loading...</div>
              ) : (
                translators.map((translator) => (
                  <div key={translator.name} className={styles.articleItem}>
                    <Link 
                      href={`/articles/translators/${translator.name.split(' ')[2]}`}
                    className={styles.nameInDescription}
                  >
                    <span className={styles.nameInDescription}>{translator.name}</span>
                  </Link>
                </div>
              )))}

              {isLoading ? (
                <div className={styles.loading}></div>
              ) : (
                articleNames.map((articleTitle) => (
                  <div key={articleTitle} className={styles.articleItem}>
                    <Link href={`/articles/${articleTitle}`} className={styles.nameInDescription}>
                    <span className={styles.nameInDescription}>{articleTitle}</span>
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