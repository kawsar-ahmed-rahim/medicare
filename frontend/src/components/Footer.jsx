import logo from "../assets/logo.png";
import { footerStyles as a } from "../assets/dummyStyles";
import {
  Activity,
  ArrowBigRight,
  Mail,
  MapPin,
  Phone,
  Stethoscope,
  Send,
} from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Doctors", href: "/doctors" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
    { name: "Appointments", href: "/appointments" },
  ];

  const services = [
    { name: "Blood Pressure Check", href: "/services" },
    { name: "Blood Sugar Test", href: "/services" },
    { name: "Full Blood Count", href: "/services" },
    { name: "X-Ray Scan", href: "/services" },
    { name: "ECG Test", href: "/services" },
  ];

  const socialLinks = [
    {
      Icon: FaFacebookF,
      color: a.facebookColor,
      name: "Facebook",
      href: "https://www.facebook.com/people/Hexagon-Digital-Services/61567156598660/",
    },
    {
      Icon: FaTwitter,
      color: a.twitterColor,
      name: "Twitter",
      href: "https://www.linkedin.com/company/hexagondigtial-services/",
    },
    {
      Icon: FaInstagram,
      color: a.instagramColor,
      name: "Instagram",
      href: "http://instagram.com/hexagondigitalservices?igsh=MWp2NG1oNTlibWVnZA%3D%3D",
    },
    {
      Icon: FaLinkedinIn,
      color: a.linkedinColor,
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/hexagondigtial-services/",
    },
    {
      Icon: FaYoutube,
      color: a.youtubeColor,
      name: "YouTube",
      href: "https://youtube.com/@hexagondigitalservices?si=lxEFYNCP42t6AoDJ",
    },
  ];

  return (
    <footer className={a.footerContainer}>
      <div className={a.floatingIcon1}>
        <Stethoscope className={a.stethoscopeIcon} />
      </div>
      <div className={a.floatingIcon2} style={{ animationDelay: "3s" }}>
        <Activity className={a.activityIcon} />
      </div>

      <div className={a.mainContent}>
        <div className={a.gridContainer}>
          <div className={a.companySection}>
            <div className={a.logoContainer}>
              <div className={a.logoWrapper}>
                <div className={a.logoImageContainer}>
                  <img src={logo} alt="logo" className={a.logoImage} />
                </div>
              </div>
              <div>
                <h2 className={a.companyName}>Medicare</h2>
                <p className={a.companyTagline}>Healthcare Solutions</p>
              </div>
            </div>
            <p className={a.companyDescription}>
              Your trusted partner in healthcare innovation. we are committed to
              providing exceptional medical care with cutting-edge technology
              and compassionate service.
            </p>
            <div className={a.contactContainer}>
              <div className={a.contactItem}>
                <div className={a.contactIconWrapper}>
                  <Phone className={a.contactIcon} />
                </div>
                <span className={a.contactText}>+12 3456789</span>
              </div>

              <div className={a.contactItem}>
                <div className={a.contactIconWrapper}>
                  <Mail className={a.contactIcon} />
                </div>
                <span className={a.contactText}>medicare12@example.com</span>
              </div>

              <div className={a.contactItem}>
                <div className={a.contactIconWrapper}>
                  <MapPin className={a.contactIcon} />
                </div>
                <span className={a.contactText}>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
          <div className={a.linksSection}>
            <h3 className={a.sectionTitle}>Quick Link</h3>
            <ul className={a.linksList}>
              {quickLinks.map((link, index) => (
                <li key={link.name} className={a.linkItem}>
                  <a
                    href={link.href}
                    className={a.quickLink}
                    style={{
                      animationDelay: `${index * 60}ms`,
                    }}
                  >
                    <div className={a.quickLinkIconWrapper}>
                      <ArrowBigRight className={a.quickLinkIcon} />
                    </div>
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className={a.linksSection}>
            <h3 className={a.sectionTitle}>Our Service</h3>
            <ul className={a.linkList}>
              {services.map((service, index) => (
                <li key={service.name}>
                  <a href={service.href} className={a.serviceLink}>
                    <div className={a.serviceIcon}></div>
                    <span>{service.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* Newsletter & Social */}
          <div className={a.newsletterSection}>
            <h3 className={a.newsletterTitle}>Stay Connected</h3>
            <p className={a.newsletterDescription}>
              Subscribe for health tips, medical updates, and wellness insights
              delivered to your inbox.
            </p>

            {/* Newsletter form */}
            <div className={a.newsletterForm}>
              <div className={a.mobileNewsletterContainer}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={a.emailInput}
                />
                <button className={a.mobileSubscribeButton}>
                  <Send className={a.mobileButtonIcon} />
                  Subscribe
                </button>
              </div>

              {/* Desktop newsletter */}
              <div className={a.desktopNewsletterContainer}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={a.desktopEmailInput}
                />
                <button className={a.desktopSubscribeButton}>
                  <Send className={a.desktopButtonIcon} />
                  <span className={a.desktopButtonText}>Subscribe</span>
                </button>
              </div>

              {/* Social icons */}
              <div className={a.socialContainer}>
                {socialLinks.map(({ Icon, color, name, href }, index) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={a.socialLink}
                    style={{ animationDelay: `${index * 120}ms` }}
                  >
                    <div className={a.socialIconBackground} />
                    <Icon className={`${a.socialIcon} ${color}`} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          ;
        </div>
        <div className=""></div>
      </div>
    </footer>
  );
};

export default Footer;
