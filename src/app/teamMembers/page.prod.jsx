import "../../styles/globals.css";
import styles from "../../styles/pages/about.module.css";

const page = () => {
  return (
	<div className={styles.aboutPageContainer}>

		<div className={styles.imageSection}>
			<img 
				className={styles.fullBackgroundImage} 
				src="/images/team_members_banner.png" 
				alt="about background" 
			/>
			<div className={styles.titleOverlay}>
				<span className={styles.nameEnglish} style={{ fontSize: '90px' }}>TEAM MEMBERS</span>
			</div>
		</div>

		<div className={styles.mainSection}>
			<div className="section_container" style={{ marginTop: '0px' }}>
				<h1 className={styles.mainTitle}>Team Members</h1>
            
                <p>
                    Concept:<br/>
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#436875' }}>J. Keith Vincent</span>
                </p>
                <p>
                    Software Development:<br/>
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#436875' }}>Shen Liu</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#436875' }}>Wai-Lun Mak</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#436875' }}>Jason Huang</span>
                </p>
                <p>
                    Research and Writing:<br/>
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#436875' }}>J. Keith Vincent</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#436875' }}>Chris Ellars</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#436875' }}>Bergen Grant</span>
                </p>
                <p>
                    Site Layout and Graphics:<br/>
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#436875' }}>Anthony Lee (Honeststruggle.com)</span> 
                </p>
                <p>
                    Poem and Metadata Entry:<br/>
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#436875' }}>Marcus Lee</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#436875' }}>Elijah Woo</span>
                </p>
                <p>
                    Interns:<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#436875' }}>Alex Luby-Prikot</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#436875' }}>Jackson Pine</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#436875' }}>Qiyue Hu</span>
                </p>
                <p>
                    Past Team Members:<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#436875' }}>Rebekah Machemer</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#436875' }}>Marcus Dong</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#436875' }}>Brian Teoh</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#436875' }}>William Zeng</span>
                </p>
                <p>
                    In addition to the team members listed above, Genjipoems.org has been made possible by the efforts of many generations of students in J. Keith Vincent&apos;s classes at Boston University. Beginning in the fall semester of 2016, over 200 students have entered the poems and translations into the database and added metadata and commentary. 
                </p>
                <p>
                    Many thanks to all of these students for their efforts.
                </p>
                <p>
                    Thanks also for generous financial support from the <a href="https://www.bu.edu/urop/about/" target="_blank" style={{ color: '#FFFFFF' }}>Boston University Undergraduate Research Program</a> and Professor <span style={{ color: '#FFFFFF' }}>Dennis Washburn</span>.
                </p>
			</div>
		</div>
	</div>
  );
};

export default page;
