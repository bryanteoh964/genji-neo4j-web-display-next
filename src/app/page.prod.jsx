"use client";
import React from 'react';
import { useEffect } from 'react';
import styles from '../styles/genjiHomePage.module.css';

const GenjiHomePage = () => {
	useEffect(() => {
		const descriptionSection = document.querySelector(`.${styles.descriptionSection}`);
		const initialOffset = descriptionSection ? descriptionSection.offsetTop : 0;
		
		const handleScroll = () => {
			const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			
			// Title parallax effect
			const titleOverlay = document.querySelector(`.${styles.titleOverlay}`);

			if (titleOverlay) {
				titleOverlay.style.cssText += 'transform: translateY(calc(-50% + ' + (scrollTop * 0.2) + 'px)) !important;';
			}
			
			// Description text parallax effect
			const descriptionText = document.querySelector(`.${styles.descriptionText}`);
    
			if (descriptionText && scrollTop > initialOffset - window.innerHeight) {
			const relativeScroll = Math.max(0, scrollTop - (initialOffset - window.innerHeight/2));
		
			const startPosition = -200; 
			const maxScrollPosition = 500;
			
			const scrollPercentage = Math.min(1, relativeScroll / maxScrollPosition);
			
			const offset = startPosition + (scrollPercentage * 200);

			const finalOffset = Math.min(100, offset);
			
			descriptionText.querySelector('p').style.transform = `translateY(${finalOffset}px)`;
			}
		};
		
		setTimeout(handleScroll, 100);
		
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	  }, []);

	  return (
		<div className={styles.pageContainer}>
		  <section className={styles.heroImageSection}>
			<img 
			  className={styles.fullBackgroundImage} 
			  src="/images/genji_background.jpg" 
			  alt="Genji background" 
			/>
			<div className={styles.titleOverlay}>
			  <h1 className={styles.mainTitle}>
				<span className={styles.discover}>
				  <span className={styles.highlightD}>D</span>iscover
				</span>
				<br />
				<span className={styles.exquisitePoems}>the 795 exquisite poems that</span>
				<br />
				<span className={styles.emotionalHeart}>form the emotional heart of</span>
				<br />
				<span className={styles.worldsFirst}>the world&apos;s first novel, the</span>
				<br />
				<span className={styles.century}>
				  <span className={styles.number}>11</span>
				  <sup className={styles.sup}>th</sup> century masterpiece
				</span>
				<br />
				<span className={styles.taleOfGenji}>The Tale of Genji</span>
				<span className={styles.period}>.</span>
			  </h1>
			</div>
			
			{/* Scroll down indicator */}
			<div className={styles.scrollDownIndicator}>
			  <div className={styles.arrow}></div>
			</div>
		  </section>
	
		  <section className={styles.descriptionSection}>
			<div className={styles.contentWrapper}>
			  <div className={styles.descriptionText}>
				<p>
					The characters in the <br />
					<span className={styles.italicText}>The Tale of Genji</span>, write poetry to
					communicate with each other and to <br />
					commune with themselves and the <br />
					non-human world. These poems<br />
					being poems, they also do much more<br />
					than relay unambiguous messages. If<br />
					the characters converse through<br />
					poems, the poems also speak to each<br />
					other beyond any given exchange.<br />
					They open out into an additional<br />
					dimension, a poetic universe shared by<br />
					readers that arches across and<br />
					through the narrative fabric of<br />
					<span className={styles.italicText}>the Tale</span>. In this way, these 795 poems<br />
					constitute the emotional and symbolic<br />
					heart of the <span className={styles.italicText}>Genji</span>, the jewels on the<br />
					thread out of which Murasaki Shikibu<br />
					wove her text.
				</p>
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