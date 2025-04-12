import "../../styles/globals.css";
import styles from "../../styles/pages/about.module.css";

const page = () => {
  return (
	<div className={styles.aboutPageContainer}>

		<section className={styles.imageSection}>
                <img 
                    className={styles.fullBackgroundImage} 
                    src="/images/about_background.png" 
                    alt="about background" 
                />
		</section>

      <div className="section_container">
	 	<h1 className="main-title">THE TALE OF GENJI POETRY DATABASE</h1>

		<p>
			The Tale of Genji Poetry Database is an ongoing project created by Professor J. Keith Vincent 
			and his students in LJ250 &quot;Masterpieces of Japanese Literature&quot; at Boston University. 
			The database contains all 795 poems in Murasaki Shikibu&apos;s tenth-century masterpiece, <i>The Tale of Genji</i>. 
			The poems ares listed in the original Japanese, in transliterated Roman letters (romaji), 
			and in five different English translations by Arthur Waley, Edward Seidensticker, Royall Tyler, Dennis Washburn, and Edwin Cranston.
        </p>

        <p>
			This website follows in a long tradition in Japan of reading the poems in the <i>The Tale of Genji</i> independently of their narrative context. 
			Use it to read the poems on their own, or follow along as you read the <i>Tale</i>. Compare the translations and see how vastly and wonderfully different they can be. 
        </p>

        <ul>
			<li>Use the “Poems” tab to navigate to individual pages for each poem in the Tale where you can find all five translations and a range of metadata and commentary.</li>
			<li>The “Characters” tab shows a chart of relations among characters in the Tale. Pin specific characters in the search bar at the top to see just their relations, or hit &quot;read info&quot; to go to a page with information about that character. </li>
			<li>Use the “Search” tab to get a list of all the poems in a given chapter, or to search by speaker and addressee. </li>
		</ul>

		<p>And enjoy! We add new functions regularly, so check back often.</p>
		
		<br />

		<h1 className="main-title">A NOTE ON POETRY IN THE TALE OF GENJI</h1>
		
		<p>In the <i>The Tale of Genji</i>, the characters write poetry to communicate with each other and to commune with themselves and the non-human world. 
		   These poems being <i>poems</i>, they also do much more than relay unambiguous messages. If the characters converse through poems, the poems also speak to each other beyond any given exchange. 
		   They open out into an additional dimension, a poetic universe shared by readers that arches across and through the narrative fabric of the <i>Tale</i>. 
		   In this way, these 795 poems constitute the emotional and symbolic circulatory system of the <i>Genji</i>, the jewels on the thread out of which Murasaki Shikibu wove her text.
		</p>

		<p>
		Studding her prose with poetry, Murasaki magnified the expressive power of her writing. In the process, she raised the social status of narrative fiction in Japanese, a genre that until her time was derided as the mere scribbling of women. 
		She was so successful in doing so that her novel became the central text of the Japanese canon and a model for the writing of poetry, the most prestigious genre of all. 
		As the great courtier-poet Fujiwara Shunzei would exclaim scarcely two centuries after her <i>Tale</i> was completed, &quot;Any poet who tries to write poetry without knowing <i>the Tale of Genji</i> should be ashamed of themselves!&quot; (源氏見ざる歌詠みは遺恨なり)
		</p>
      </div>
    </div>
  );
};

export default page;
