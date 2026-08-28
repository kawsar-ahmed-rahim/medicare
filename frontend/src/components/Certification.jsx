import { certificationStyles as c } from "../assets/dummyStyles";
import C3 from "../assets/C3.png"
import C1 from "../assets/C1.png"
import C2 from "../assets/C2.png"
import C4 from "../assets/C4.svg"
import C5 from "../assets/C5.png"
import C6 from "../assets/C6.png"
import C7 from "../assets/C7.svg"
const Certification = () => {
    const certifications = [
    { id: 1, name: "Medical Commission", image: C1, type: "international" },
    { id: 2, name: "Government Approved", image: C2, type: "government" },
    { id: 3, name: "NABH Accredited", image: C3, alt: "NABH Accreditation", type: "healthcare" },
    { id: 4, name: "Medical Council", image: C4, type: "government" },
    { id: 5, name: "Quality Healthcare", image: C5, alt: "Quality Healthcare", type: "healthcare" },
    { id: 6, name: "Paramedical Council", image: C6, alt: "Patient Safety", type: "healthcare" },
    { id: 7, name: "Ministry of Health", image: C7, alt: "Ministry of Health", type: "government" }
  ];

  const duplicatedCertifications = [...certifications, ...certifications, ...certifications];

  return (
    <div className={c.container}>
        <div className={c.backgroundGrid}>
            <div className={c.topLine}></div>
            <div className={c.gridContainer}>
                <div className={c.grid}>
                    {Array.from({length:144}).map((_, i)=> (
                        <div className={c.gridCell} key={i} ></div>
                    ))}
                </div>
            </div>
        </div>
        <div className={c.contentWrapper}>
            <div className={c.headingContainer}>
                <div className={c.headingInner}>
                    <div className={c.leftLine}></div>
                    <div className={c.rightLine}></div>
                    <h2 className={c.title}>
                        <span className={c.titleText}>
                            CERTIFIED & EXCELLENCE
                        </span>
                    </h2>
                </div>
                <p className={c.subtitle}>Government recognized and internationally accredited healthcare standards</p>
                <div className={c.badgeContainer}>
                    <div className={c.badgeDot}></div>
                    <span className={c.badgeText}>OFFICIALLY CERTIFIED</span>
                </div>
            </div>
            <div className={c.logosContainer}>
                <div className={c.logosInner}>
                    <div className={c.logosFlexContainer}>
                        <div className={c.logosMarquee}>
                            {duplicatedCertifications.map((cert,index)=>(
                                <div className={c.logoItem} key={`cert-$(cert.id)-${index}`} >
                                    <div className="relative">
                                        <img src={cert.image} alt={cert.alt} className={c.logoItem}/>
                                    </div>
                                    <span></span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Certification