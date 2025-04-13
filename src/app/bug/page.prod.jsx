import "../../styles/globals.css";

const page = () => {
  return (
    <section className="section_frame">
      <div style={{ display: "flex", justifyContent: "center", margin: "20px", backgroundColor: "white" }}>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSfBcfQXgnwtE9Ub-57XsRQwk5q3OISa-KMwph02eram1jiuYw/viewform?embedded=true"
          width="640"
          height="770"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          style={{ border: "1px solid #ccc" }}
        >
          Loading…
        </iframe>
      </div>
    </section>
  )
}

export default page