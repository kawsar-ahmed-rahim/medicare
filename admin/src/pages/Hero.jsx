import logoImg from "../assets/logo.png"
import Navbar from '../components/Navbar';
import {heroStyles} from "../assets/dummyStyles"
const Hero = ({role = "admin", userName = "Doctor"}) => {
  const isDoctor = role === "doctor";
  return (
    <div className={heroStyles.container}>
      <Navbar />
      <main classname={heroStyles.mainContainer}>
        <section className={heroStyles.section}>
          <div className={heroStyles.decorativeBg.container}>
            <div className={heroStyles.decorativeBg.blurBackground}>
    
              <div className={heroStyles.decorativeBg.blurShape}></div>
            </div>
            <div className={heroStyles.contentBox}>
              <div className={heroStyles.logoContainer}>
                <img src={logoImg} alt="logo" srcset="" className={heroStyles.logo} />
              </div>
              <h1 className={heroStyles.heading}>
                {isDoctor ? `Welcome , Dr. ${userName}` : "WELCOME TO MEDICARE ADMIN PANEL"}
              </h1>
              <p>
                
              </p>
            </div>
          </div>

        </section>
      </main>
    </div>
  )
}

export default Hero