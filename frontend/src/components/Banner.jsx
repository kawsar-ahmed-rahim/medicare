import { bannerStyles as a } from "./../assets/dummyStyles";
import { useNavigate } from "react-router-dom";
import banner from "../assets/BannerImg.png";
import {
  Calendar,
  Clock,
  Phone,
  Ribbon,
  ShieldUser,
  Star,
  Stethoscope,
  User,
} from "lucide-react";
const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className={a.bannerContainer}>
      <div className={a.mainContainer}>
        <div className={a.borderOutline}>
          <div className={a.outerAnimatedBand}></div>
          <div className={a.innerWhiteBorder}></div>
        </div>
        <div className={a.contentContainer}>
          <div className={a.flexContainer}>
            <div className={a.leftContent}>
              <div className={a.headerBadgeContainer}>
                <div className={a.stethoscopeContainer}>
                  <div className={a.stethoscopeInner}>
                    <Stethoscope className={a.stethoscopeIcon} />
                  </div>
                </div>
                <div className={a.titleContainer}>
                  <h1 className={a.title}>
                    Medi<span className={a.titleGradient}>care+</span>
                  </h1>

                  {/* stars */}
                  <div className={a.starsContainer}>
                    <div className={a.starsInner}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star className={a.starIcon} key={star} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* tagline */}
              <p className={a.tagline}>
                Premium Healthcare
                <span className={`block ${a.taglineHighlight}`}>
                  At Your Fingertips
                </span>
              </p>
              <div className={a.featuresGrid}>
                <div className={`${a.featureItem} ${a.featureBorderGreen}`}>
                  <Ribbon className={a.featureIcon} />
                  <span className={a.featureText}>Certified Specialists</span>
                </div>
                <div className={`${a.featureItem} ${a.featureBorderBlue}`}>
                  <Clock className={a.featureIcon} />
                  <span className={a.featureText}>24/7 Available</span>
                </div>
                <div className={`${a.featureItem} ${a.featureBorderEmerald}`}>
                  <ShieldUser className={a.featureIcon} />
                  <span className={a.featureText}>safe &amp; Secure</span>
                </div>
                <div className={`${a.featureItem} ${a.featureBorderPurple}`}>
                  <User className={a.featureIcon} />
                  <span className={a.featureText}>500+ Doctors</span>
                </div>
              </div>
              <div className={a.ctaButtonsContainer}>
                <button
                  onClick={() => navigate("/doctors")}
                  className={a.bookButton}
                >
                  <div className={a.bookButtonOverlay}></div>
                  <div className={a.bookButtonContent}>
                    <Calendar className={a.bookButtonIcon} />
                    <span>Book Appointment Now</span>
                  </div>
                </button>
                <button
                  className={a.emergencyButton}
                  onClick={() => (window.location.href = "tel:123456789")}
                >
                  <div className={a.emergencyButtonContent}>
                    <Phone className={a.emergencyButtonIcon} />
                    <span>Emergency Call</span>
                  </div>
                </button>
              </div>
            </div>
            <div className={a.rightImageSection}>
              <div className={a.imageContainer}>
                <div className={a.imageFrame}>
                  <img src={banner} alt="banner" className={a.image} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
