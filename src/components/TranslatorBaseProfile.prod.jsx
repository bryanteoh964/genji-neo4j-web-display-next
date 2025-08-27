'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import FormatContent from './FormatText.prod';
import styles from '../styles/pages/blogTemplate.module.css';

export default function TranslatorsListPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState('');
  const [authorInfo, setAuthorInfo] = useState({name: '', homepage: '', email: ''});
  const [sources, setSources] = useState([]);

  const translators = [
    { name: 'Arthur Waley' },
    { name: 'Edward Seidensticker' },
    { name: 'Royall Tyler' },
    { name: 'Dennis Washburn' },
    { name: 'Edwin Cranston' },
  ];

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      // reset author info
      setAuthorInfo({name: '', homepage: '', email: ''});

      try {
        // get translators content from blog
        const translatorRes = await fetch(`/api/blog/getSingle?title=Translators`);
        const translatorData = await translatorRes.json();
        setContent(translatorData.content);

        // get author info
        if (translatorData.isUser === 'true' && translatorData.authorEmail) {
          const apiUrl = `/api/user/getByEmail?email=${encodeURIComponent(translatorData.authorEmail)}`;
          const authorRes = await fetch(apiUrl);
          const authorData = await authorRes.json();
          setAuthorInfo({
            name: authorData.name,
            homepage: `/userhomepage/${authorData._id}`,
            email: translatorData.authorEmail
          });
        }

        // get sources
        const sourcesRes = await fetch(`/api/source/getSingleSource?title=Translators`);
        const sourcesData = await sourcesRes.json();
        setSources(sourcesData.sources);
      } catch (error) {
        console.error('Error fetching translators content:', error);
      }
      setIsLoading(false);
    };

    fetchContent();
  }, []);

  return (
    <div className={styles.translatorPage}>
        <div className={styles.heroSection}>
            <img
                className={styles.fullBackgroundImage}
                src={`/images/translator_banner.jpg`} // Translations_banner.png has a "Translator" text included
                alt="translators banner"
            />
            <div className={styles.translatorTitleOverlay}>
                <span className={styles.translatorTitle}>Translators</span>
            </div>
        </div>

        <div className={styles.mainSection} style={{ gap: '2rem' }}>
        <div className={styles.analysisContainer}>
                      {/* Left Side  */}
                      <div className={styles.analysisLeft}>
                          
                          {translators.map((translator, index) => ( 
                            <div key={index} className={styles.translatorPanel}>
                                <Link href={`/translators/${encodeURIComponent(translator.name)}`} style={{ textDecoration: 'none' }}>
                                    <div 
                                        className={styles.translatorPanel}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <span className={styles.panelHeader}>
                                            <h2>{translator.name}</h2>
                                        </span>
                                    </div>
                                </Link>
                            </div>
                          ))}

                      </div>
                  </div>

          <div className={styles.description}>
              <div className={styles.descriptionContent} style={{ paddingTop: '0' }}>
                  {isLoading ? (
                      <div className={styles.loading} style={{ marginTop: '1rem' }}>Loading...</div>
                  ) : (
                      <>  
                          <FormatContent 
                              content={content} 
                              className={styles.descriptionText} 
                          />
                          <a href={authorInfo.homepage} className={styles.author}>{authorInfo.name}</a>
                          <br/>
                          <br/>
                          {sources && sources.length > 0 &&<h2 className={styles.translationsHeader}>FURTHER READINGS</h2>}
                          <div className={styles.sourcesScrollContainer}>
                            {sources && sources.length > 0 && (
                                sources.map((source, index) => (
                                    <div key={index} className={styles.translationCard}>
                                        <div className={styles.translationContent}>
                                            <FormatContent content={source.title}/>
                                        </div>
                                        <span className={styles.translatorName} style={{backgroundColor: 'rgba(154, 152, 152, 0.66)'}}>{source.author}</span>
                                    </div>
                                ))
                            )} 
                          </div>
                      </>
                  )}
              </div>
          </div>
      </div>
  </div>
  );
}
