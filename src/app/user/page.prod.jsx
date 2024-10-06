import "../../styles/globals.css";
import UserInfo from '../../components/UserInfo.prod';


const page = () => {
  return (
    <div>
      <section className="section_frame">
          <div className="section_container">
              <h1 className="main-title">User Page</h1>
          </div>


      </section>

      <UserInfo />

    </div>
  )
}

export default page