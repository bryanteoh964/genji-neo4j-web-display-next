'use client'
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import FormatContent from '../../components/FormatText.prod';
import styles from '../../styles/pages/blogTemplate.module.css';

const BlogPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTranslator, setSelectedTranslator] = useState('Arthur Waley');
  const [content, setContent] = useState('');
  const translators = [
    { name: 'Arthur Waley' },
    { name: 'Dennis Washburn' },
    { name: 'Edward Seidensticker' },
    { name: 'Edwin Cranston' },
    { name: 'Royall Tyler' },
  ];
  

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      if (selectedTranslator) {
        try {
          // get translator content
          const translatorRes = await fetch(`/api/translators?name=${selectedTranslator.split(' ')[1]}`);
          const translatorData = await translatorRes.json();
          setContent(translatorData.bio);
        } catch (error) {
          console.error('Error fetching translator content:', error);
        }
      }
      setIsLoading(false);
    };

    fetchContent();
  }, [selectedTranslator]);


  return (
    <div className={styles.translatorPage}>
        <div className={styles.heroSection}>
            <img
                className={styles.fullBackgroundImage}
                src={`/images/translators_banner.png`}
                alt="translators banner"
            />
            <div className={styles.translatorTitleOverlay}>
                <span className={styles.translatorTitle}>{selectedTranslator.split(' ')[1]}</span>
            </div>
        </div>

        <div className={styles.mainSection}>
        <div className={styles.analysisContainer}>
                      {/* Left Side  */}
                      <div className={styles.analysisLeft}>
                          
                          {translators.map((translator, index) => ( 
                            <div className={styles.translatorPanel}>
                                <div 
                                    key={index} 
                                    className={`${styles.translatorPanel} ${selectedTranslator === translator.name ? styles.selected : ''}`}
                                    onClick={() => setSelectedTranslator(prev => prev = translator.name)}
                                    style={{ cursor: 'pointer' }}s
                                >
                                    <span className={styles.panelHeader}>
                                        <h2>{translator.name}</h2>
                                    </span>
                                </div>
                            </div>
                          ))}

                      </div>
                  </div>

          <div className={styles.description}>
              <div className={styles.descriptionContent}>
                  {isLoading ? (
                      <div className={styles.loading}>Loading...</div>
                  ) : (
                      <>  
                          <div className={styles.heading}>{'About ' + selectedTranslator}</div>
                          <FormatContent 
                              content={content} 
                              className={styles.descriptionText} 
                          />
                      </>
                  )}
              </div>
          </div>
      </div>
  </div>
)
}

export default BlogPage;
