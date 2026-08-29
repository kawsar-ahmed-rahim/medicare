import { useStat, useEffect } from "react";
import { homeDoctorsStyles as h, iconSize } from "../assets/dummyStyles"
const HomeDoctors = ({previewCount = 8}) => {
    const API_BASE = "http://localhost:4000";
const [doctors, setDoctors] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

// to fetch doctors from the server side
  return (
    <section className={h.section}>
        <div className={h.container}>
            <div className={h.header}>
                <h1 className={h.title}>Our{" "}<span className={h.titleSpan}>Medical Team</span></h1>
                <p className={h.subtitle}>Book appointments quickly with our verified specialists</p>
            </div>
            {/* error */}



            {loading ? (
                <div className={h.skeletonGrid}>
                    {Array.from({length: previewCount}).map((_, id)=> (
                        <div className={h.skeletonCard}>
                            <div className={h.skeletonImage}></div>
                            <div className={h.skeletonText1}></div>
                            <div className={h.skeletonText2}></div>
                            <div className="flex gap-2 mt-auto">
                                <div className={h.skeletonButton}></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={h.doctorsGrid}>
                   {preview.map((doctor)=>(
                    <article key={doctor.id || doctor.name} className={h.article}>
                        {doctor.available ? (
                            <Link to={`/doctors/${doctor.id}`} state={{doctor: doctor.raw || doctor}}>
                                <div className={h.imageContainerAvailable}>
                                    {/* img1 */}
                                </div>
                            </Link>
                        ) : (
                            <div className={h.imageContainerUnavailable}>
                                {/* img2 */}


                                <div className={h.unavailableBadge}>Not available</div>
                            </div>
                        )}
                    </article>
                   ))}

                </div>
            )}
        </div>
    </section>
  )
}

export default HomeDoctors