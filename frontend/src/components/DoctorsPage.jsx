import { useState, useEffect, useMemo } from "react";
import { doctorsPageStyles as a } from "../assets/dummyStyles";
import {
  ChevronRight,
  CircleChevronDown,
  CircleChevronUp,
  Medal,
  MousePointer2Off,
  Search,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
const DoctorsPage = () => {
  const API_BASE = "http://localhost:4000";
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/doctors`);
        const json = await res.json().catch(() => null);

        if (!res.ok) {
          const msg =
            (json && json.message) || `Failed to load doctors (${res.status})`;
          if (mounted) {
            setError(msg);
            setAllDoctors([]);
            setLoading(false);
          }
          return;
        }

        const items = (json && (json.data || json)) || [];
        const normalized = (Array.isArray(items) ? items : []).map((d) => {
          const id = d._id || d.id;
          const image =
            d.imageUrl || d.image || d.imageSmall || d.imageSrc || "";
          let available = true;
          if (typeof d.availability === "string") {
            available = d.availability.toLowerCase() === "available";
          } else if (typeof d.available === "boolean") {
            available = d.available;
          } else if (typeof d.availability === "boolean") {
            available = d.availability;
          } else {
            available = d.availability === "Available" || d.available === true;
          }
          return {
            id,
            name: d.name || "Unknown",
            specialization: d.specialization || "",
            image,
            experience:
              (d.experience ?? d.experience === 0) ? String(d.experience) : "—",
            fee: d.fee ?? d.price ?? 0,
            available,
            raw: d,
          };
        });

        if (mounted) {
          setAllDoctors(normalized);
          setError("");
        }
      } catch (err) {
        console.error("load doctors error:", err);
        if (mounted) {
          setError("Network error while loading doctors.");
          setAllDoctors([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [API_BASE]);

  const filteredDoctors = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return allDoctors;
    return allDoctors.filter(
      (doctor) =>
        (doctor.name || "").toLowerCase().includes(q) ||
        (doctor.specialization || "").toLowerCase().includes(q),
    );
  }, [allDoctors, searchTerm]);

  const displayedDoctors = showAll
    ? filteredDoctors
    : filteredDoctors.slice(0, 8);

  const retry = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/doctors`);
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setError((json && json.message) || `Failed to load (${res.status})`);
        setAllDoctors([]);
        return;
      }
      const items = (json && (json.data || json)) || [];
      const normalized = (Array.isArray(items) ? items : []).map((d) => {
        const id = d._id || d.id;
        const image = d.imageUrl || d.image || "";
        let available = true;
        if (typeof d.availability === "string") {
          available = d.availability.toLowerCase() === "available";
        } else if (typeof d.available === "boolean") {
          available = d.available;
        } else {
          available = d.availability === "Available" || d.available === true;
        }
        return {
          id,
          name: d.name || "Unknown",
          specialization: d.specialization || "",
          image,
          experience: d.experience ?? "—",
          fee: d.fee ?? d.price ?? 0,
          available,
          raw: d,
        };
      });
      setAllDoctors(normalized);
      setError("");
    } catch (e) {
      console.error(e);
      setError("Network error while loading doctors.");
      setAllDoctors([]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={a.mainContainer}>
      <div className={a.backgroundShape1}></div>
      <div className={a.backgroundShape2}></div>
      <div className={a.wrapper}>
        <div className={a.headerContainer}>
          <h1 className={a.headerTitle}>Our Medical Experts</h1>
          <p className={a.headerSubtitle}>
            Find your ideal doctor by name or specialization
          </p>
        </div>

        <div className={a.searchContainer}>
          <div className={a.searchWrapper}>
            <input
              type="text"
              placeholder="search doctors by name or specializations.."
              value={searchTerm}
              className={a.searchInput}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className={a.searchIcon} />
            {searchTerm.length > 0 && (
              <button
                onClick={() => setSearchTerm("")}
                className={a.clearButton}
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
        {error && (
          <div className={a.errorContainer}>
            <div className={a.errorText}>{error}</div>
            <div className="flex items-center justify-center gap-3">
              <button onClick={retry} className={a.retryButton}>
                Retry
              </button>
            </div>
          </div>
        )}
        {/*loading */}
        {loading ? (
          <div className={a.skeletonGrid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div className={a.skeletonCard} key={i}>
                <div className={a.skeletonImage}></div>
                <div className={a.skeletonName}></div>
                <div className={a.skeletonSpecialization}></div>
                <div className={a.skeletonButton}></div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`${a.doctorsGrid}${filteredDoctors.length === 0 ? "opacity-70" : "opacity-100"}`}
          >
            {displayedDoctors.length > 0 ? (
              displayedDoctors.map((doctor, index) => (
                <div
                  key={doctor.id || `${doctor.name}-${index}`}
                  className={`${a.doctorCard} ${!doctor.available ? a.doctorCardUnavailable : ""}`}
                  style={{ animationDelay: `${index * 90}ms` }}
                  role="article"
                >
                  {doctor.available ? (
                    <Link
                      to={`/doctors/${doctor.id}`}
                      state={{ doctor: doctor.raw || doctor }}
                      className={a.focusRing}
                    >
                      <div className={a.imageContainer}>
                        <img
                          src={doctor.image || "/placeholder-doctor.jpg"}
                          alt={doctor.name}
                          loading="lazy"
                          className={a.doctorImage}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/placeholder-doctor.jpg";
                          }}
                        />
                      </div>
                    </Link>
                  ) : (
                    <div
                      className={`${a.imageContainer} ${a.imageContainerUnavailable}`}
                    >
                      <img
                        src={doctor.image || "/placeholder-doctor.jpg"}
                        alt={doctor.name}
                        loading="lazy"
                        className={a.doctorImageUnavailable}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/placeholder-doctor.jpg";
                        }}
                      />
                    </div>
                  )}
                  <h3 className={a.doctorName}>{doctor.name}</h3>
                  <p className={a.doctorSpecialization}>
                    {doctor.specialization}
                  </p>
                  <div className={a.experienceBadge}>
                    <Medal className={a.experienceIcon} />
                    <span>{doctor.experience} years experience</span>
                  </div>
                  {doctor.available ? (
                    <Link
                      to={`/doctors/${doctor.id}`}
                      state={{ doctor: doctor.raw || doctor }}
                      className={a.bookButton}
                    >
                      <ChevronRight className={a.bookButtonIcon} />
                      Book Now
                    </Link>
                  ) : (
                    <button disabled className={a.notAvailableButton}>
                      <MousePointer2Off className={a.notAvailableIcon} />
                      Not Available
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className={a.noResults}>
                No doctors found matching your search criteria.
              </div>
            )}
          </div>
        )}

        {filteredDoctors.length > 8 && (
          <div className={a.showMoreContainer}>
            <button
              onClick={() => setShowAll(!showAll)}
              className={a.showMoreButton}
            >
              {showAll ? (
                <>
                  <CircleChevronUp className={a.showMoreIcon} />
                  Hide
                </>
              ) : (
                <>
                  <CircleChevronDown className={a.showMoreIcon} />
                  Show More
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;
