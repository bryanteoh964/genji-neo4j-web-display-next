'use client'
import React from 'react';

const Home = () => {
  return (
    <div className="homepageContainer">
      {/* background picture */}
      <section className="heroImageSection">
        <img src="/images/genji_background.jpg" alt="Genji background" className="fullBackgroundImage" />
        
        {/* main title */}
        <div className="titleOverlay">
          <h1 className="mainTitle">
            Discover the 795 exquisite<br />
            poems that form the emotional<br />
            heart of the world's first novel,<br />
            the 11th-century masterpiece<br />
            <span className="italicText">The Tale of Genji</span>.
          </h1>
        </div>
        
        {/* arrow down */}
        <div className="scrollDownIndicator">
          <div className="arrow"></div>
        </div>
      </section>

      <section className="descriptionSection">
        <div className="descriptionContent">
          <p>
            In the <span className="italicText">The Tale of Genji</span>, the characters write<br />
            poetry to communicate with each other and<br />
            to commune with themselves and the non-<br />
            human world. These poems being <span className="italicText">poems</span>,<br />
            they also do much more than relay<br />
            unambiguous messages. If the characters<br />
            converse through poems, the poems also<br />
            speak to each other beyond any given<br />
            exchange. They open out into an additional<br />
            dimension, a poetic universe shared by<br />
            readers that arches across and through the<br />
            narrative fabric of the <span className="italicText">Tale</span>. In this way, these<br />
            795 poems constitute the emotional and<br />
            symbolic circulatory system of the <span className="italicText">Genji</span>, the<br />
            jewels on the thread out of which Murasaki<br />
            Shikibu wove her text.
          </p>
        </div>

        {/*stat part */}
		<div className="statsGrid">

			{/* 795 POEMS */}
			<div className="card-poems">
				<h3>795</h3>
				<div className="statLabel">POEMS</div>
			</div>

			{/* 6 WIVES & 9 LOVERS */}
			<div className="card-wives-lovers">
				 <div>
					<h3>6</h3>
					<div className="statLabel">WIVES</div>
				</div>
				<div>
					<h3>9</h3>
					<div className="statLabel">LOVERS</div>
				</div>
			</div>

			{/* 54 CHAPTERS */}
			<div className="card-chapters">
				<h3>54</h3>
				<div className="statLabel">CHAPTERS</div>
			</div>

			{/* empty card 1 */}
			<div className="card-empty-1"></div>

			{/* 220,000+ SENTENCES */}
			<div className="card-sentences">
				<h3>220,000+</h3>
				<div className="statLabel">SENTENCES IN ORIGINAL JAPANESE</div>
			</div>

			{/* OVER 1017 YEARS OLD */}
			<div className="card-years">
				<div className="statLabel-1">OVER
					<h3>1017</h3>
				</div>
				<div className="statLabel-2">YEARS OLD</div>
			</div>

			{/* 5 ENGLISH TRANSLATIONS */}
			<div className="card-translations">
				<div className="statLabel">
					<span>ENGLISH</span>
					<span>TRANSLATIONS</span>
				</div>
				<h3>5</h3>
			</div>

			{/* empty card 2 */}
			<div className="card-empty-2"></div>

			{/* 430 PLUS CHARACTERS */}
			<div className="card-characters">
				<h3>430</h3>
				<div className="statLabel-1">PLUS</div>
				<div className="statLabel-2">CHARACTERS</div>
			</div>
		</div>
      </section>
    </div>
  );
};

export default Home;