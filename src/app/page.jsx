import "../styles/globals.css";

const page = () => {
  return (
    <section className="section_frame">
      <div className="section_container">
        <p>
          The Genji Poetry Database is a project created by Professor J. Keith
          Vincent and his students in LJ250 “Masterpieces of Japanese
          Literature" at Boston University. The database contains all 795 poems
          in Murasaki Shikibu's tenth century masterpiece,{" "}
          <i>The Tale of Genji</i>. The poems are searchable by chapter,
          speaker, and addressee and can be accessed in the original Japanese,
          in transliterated Roman letters (<i>romaji</i>), and in five different
          English translations by Arthur Waley, Edward Seidensticker, Royall
          Tyler, Dennis Washburn, and Edwin Cranston.
        </p>
        <p>
          This website follows in a long tradition in Japan of reading the poems
          in the <i>Tale of Genji</i> independently of their narrative context.
          Use it to read the poems on their own, or follow along as you read the{" "}
          <i>Tale</i>. When you finish a chapter, you may want to reread the
          poems here as a way of reviewing the emotional contours of the
          chapter. Use the database to see all the poems written or received by
          a given character, or follow the poetic dialogue between pairs of
          characters over the course of the novel. Compare the translations and
          see how vastly and wonderfully different they can be. Use the filters
          and keyword search to find patterns. And enjoy! We plan to add more
          functions to the website soon, so check back often.
        </p>
        <p>
          <i>The painting above is from the Tale of Genji Scrolls</i> (Genji
          monogatari emaki), Azumaya I, in the collection of the Tokugawa Art
          Museum.
        </p>
      </div>
    </section>
  );
};

export default page;
