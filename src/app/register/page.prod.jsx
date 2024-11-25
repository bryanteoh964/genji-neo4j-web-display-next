import "../../styles/globals.css";
import RegisterForm from '../../components/auth/RegisterForm.prod';

// manually register page
// may be deleted 
const page = () => {
  return (
    <div>
      <section className="section_frame">
          <div className="section_container">
              <h1 className="main-title">Create an Account</h1>
          </div>


      </section>

      <RegisterForm />

    </div>
  )
}

export default page