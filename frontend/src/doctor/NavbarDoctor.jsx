import { LogOut, Menu } from "lucide-react";
import { navbarStylesDr as a } from "../assets/dummyStyles";
import logo from "../assets/logo.png";
import { useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
const NavbarDoctor = () => {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const location = useLocation();
    const doctorId = useMemo(() => {
    if (params?.id) return params.id;
    const m = location.pathname.match(/\/doctor-admin\/([^/]+)/);
    if (m) return m[1];
    return null;
  }, [params, location.pathname]);

  const basePath = doctorId
    ? `/doctor-admin/${doctorId}`
    : "/doctor-admin/login";

  const navItems = [
    { name: "Dashboard", to: `${basePath}`, Icon: Home },
    { name: "Appointments", to: `${basePath}/appointments`, Icon: Calendar },
    { name: "Edit Profile", to: `${basePath}/profile/edit`, Icon: Edit },
  ]
  return (
   <>
    <nav className={a.navContainer}>
      <div className={a.leftBrand}>
        <div className={a.logoContainer}>
          <img src={logo} alt="logo" className={a.logoImage} />
        </div>

        <div className={a.brandTextContainer}>
          <div className={a.brandTitle}>MedTek</div>
          <div className={a.brandSubtitle}>HealthCare Solution</div>
        </div>
      </div>
      {/* desktop navigation */}

      <div className={a.desktopMenu}>
        <div className={a.desktopMenuItems}>
          {navItems.map(({ name, to, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === basePath}
              className={({ isActive }) =>
                `${a.baseLink} ${isActive ? a.activeLink : a.inactiveLink}`
              }
              onClick={() => setOpen(false)}
            >
              <span className={a.linkContent}>
                <Icon size={16} className={a.linkIcon} />
                <span className={a.linkText}>{name}</span>
              </span>
            </NavLink>
          ))}
        </div>
      </div>

      <div className={a.rightActions}>
        <button
          onClick={() => {
            window.location.href = "/doctor-admin/login";
          }}
          className={a.logoutButtonDesktop}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>

        {/* to toggle*/}
        <button
          onClick={() => setOpen((s) => !s)}
          className={a.hamburgerButtonMd}
        >
          {open ? <X size={20} /> : <Menu size={20} />}{" "}
        </button>

        <button
          onClick={() => setOpen((s) => !s)}
          className={a.hamburgerButtonLg}
        >
          {open ? <X size={20} /> : <Menu size={20} />}{" "}
        </button>
      </div>
    </nav>

    <div className={a.mobileMenuContainer(open)}>
        <div className={a.mobileLogoutContent}>
          {navItems.map(({ name, to, Icon }) => (
            <NavLink
              key={to} to={to} end={to === basePath}
              className={({ isActive }) =>
                `${a.mobileBaseLink} ${isActive ? a.mobileActiveLink : a.mobileInactiveLink}`} onClick={() => setOpen(false)}>
                  <Icon size={18} className="text-emerald-400" />

                </NavLink>))}
        </div>
    </div>
   </>
  );
};

export default NavbarDoctor;
