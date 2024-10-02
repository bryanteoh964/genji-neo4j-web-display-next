import "../../styles/globals.css";
import { SignIn } from '../../components/auth/sign-in-form.prod';


const page = () => {
  return (
    <div>
      <section className="section_frame">
          <div className="section_container">
              <h1 className="main-title">Login</h1>
          </div>


      </section>

      <SignIn />

    </div>
  )
}

export default page