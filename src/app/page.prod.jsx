"use client";
import React from 'react';
import { useEffect } from 'react';
import styles from '../styles/genjiHomePage.module.css';

const GenjiHomePage = () => {
	// useEffect(() => {
	// 	const descriptionSection = document.querySelector(`.${styles.descriptionSection}`);
		// const initialOffset = descriptionSection ? descriptionSection.offsetTop : 0;
		
	// 	const handleScroll = () => {
	// 		const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			
	// 		// Title parallax effect
	// 		const titleOverlay = document.querySelector(`.${styles.titleOverlay}`);

	// 		if (titleOverlay) {
	// 			titleOverlay.style.cssText += 'transform: translateY(calc(-50% + ' + (scrollTop * 0.2) + 'px)) !important;';
	// 		}
			
	// 		// Description text parallax effect
	// 		const descriptionText = document.querySelector(`.${styles.descriptionText}`);
    
	// 		if (descriptionText && scrollTop > initialOffset - window.innerHeight) {
	// 		const relativeScroll = Math.max(0, scrollTop - (initialOffset - window.innerHeight/2));
		
	// 		const startPosition = -200; 
	// 		const maxScrollPosition = 800;
			
	// 		const scrollPercentage = Math.min(1, relativeScroll / maxScrollPosition);
			
	// 		const offset = startPosition + (scrollPercentage * 200);

	// 		const finalOffset = Math.min(100, offset);
			
	// 		descriptionText.querySelector('p').style.transform = `translateY(${finalOffset}px)`;
	// 		}
	// 	};
		
	// 	setTimeout(handleScroll, 100);
		
	// 	window.addEventListener('scroll', handleScroll);
	// 	return () => window.removeEventListener('scroll', handleScroll);
	//   }, []);

	  return (
		<div className={styles.pageContainer}>
		  <section className={styles.heroImageSection}>
			<img 
			  className={styles.fullBackgroundImage} 
			  src="/images/genji_background_compressed.jpg" 
			  alt="Genji background" 
			/>
		  </section>
	
		  <section className={styles.descriptionSection}>
			<div className={styles.contentWrapper}>
			  <div className={styles.descriptionText}>
				<img 
				  src="/images/homepage_text.svg" 
				  alt="The Tale of Genji Description" 
				  style={{ width: '600px', height: '1106px' }}
				/>
			  </div>
			  
			  <div className={styles.statsContainer}>
				<img 
				  src="/images/genji_stats.png" 
				  alt="The Tale of Genji Statistics" 
				  className={styles.statsImage} 
				/>
			  </div>
			</div>
		  </section>
		</div>
	  );
	};
	
	export default GenjiHomePage;