import "../../styles/globals.css";

const page = () => {
  return (
    <section className="section_frame">
        <div className="section_container">
            <p>
                The Genji Poetry Database has been made possible by the efforts of several generations of students in my classes at Boston University
            </p>
            <p>
                Beginning in the fall of 2016, students reading the Tale of Genji entered and tagged the poems. Special thanks to  <span style={{ color: 'green' }}>Elijah Woo</span>, who heroically finished the job by entering all of the poems in the Uji chapters in the spring of 2022.
            </p>
            <p>
                <span style={{ color: 'green' }}>Rebekah Machemer</span> designed and built the first iteration of the website&apos;s front-end.
            </p>
            <p>
                <span style={{ color: 'green' }}>Marshal Dong</span> migrated the data into the graph database Neo4j and designed and implemented the search table, poem pages, and back-end editing functionality.
            </p>
            <p>
                <span style={{ color: 'green' }}>Bryan Teoh</span> and <span style={{ color: 'green' }}>William Zheng</span> made the website more secure by adapting it to the Next.js framework. Bryan and William also created datasets and lookup tables of every word in the text of each of four translations of The Tale of Genji for use in the soon-to-be-launched “microsearch” function. 
            </p>
            <p>
                <span style={{ color: 'green' }}>Wai Lun Mak</span> and <span style={{ color: 'green' }}>Shen Liu</span> are currently working on a redesign of the genealogical chart, as well as the character and poem pages. 
            </p>
            <p>
                Many thanks to the <a href="https://www.bu.edu/urop/about/" target="_blank">Boston University Undergraduate Research Opportunities Program</a> for funding several stages of this ongoing project and to <span style={{ color: 'green' }}>Jonathan Williams</span> and <span style={{ color: 'green' }}>Ben Fenster</span> at BU Information Services and Technology for their help getting the site onto a BU server.
            </p>
            <p>
                To all of the students listed above who worked on a volunteer basis, I am deeply grateful for the many long hours and careful thought they have put into this project.
            </p>
        </div>
    </section>
  )
}

export default page