import { navbarStyles as ns } from "../assets/dummyStyles.js";
import logoImg from "../assets/logo.png";

const Navbar = () => {
  return (
    <header className={ns.header}>
      <nav className={ns.navContainer}>
        <div className={ns.flexContainer}>
          <div className={ns.logoContainer}>
            <img src={logoImg} alt="img" srcset="" className={ns.logoImage} />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
