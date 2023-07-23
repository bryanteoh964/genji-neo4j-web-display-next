import "../../styles/globals.css";

const page = () => {
  return (
    <section className="section_frame">
        <div className="section_container">
            <p>
                This website would never have been possible without the help of the many students in LJ 250 over the years who have painstakingly entered and tagged the poems.
            </p>
            <p>
                Special thanks to Rebekah Machemer, who designed and built the first iteration of the website, to Elijah Woo, who heroically entered all the Uji chapters and more all by himself, and finally to Marshal Dong, who has selflessly invested countless hours to bring the site to its current state.
            </p>
            <p>
                This website is powered by <a href='https://nextjs.org/'>Next.js</a>, and the database is powered by <a href='https://neo4j.com/'>Neo4j</a>.
            </p>
        </div>
    </section>
  )
}

export default page