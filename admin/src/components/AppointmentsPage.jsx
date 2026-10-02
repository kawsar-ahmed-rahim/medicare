import { useState, useEffect, useMemo } from "react";
import { Search, Calendar, BadgeIndianRupee } from "lucide-react";
import { useAuth } from "@clerk/react";
import {
  pageStyles,
  statusClasses,
  keyframesStyles,
} from "./../assets/dummyStyles";

const API_BASE = "http://localhost:4000";

// ---------- helpers ----------
function formatDateISO(iso) {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function dateTimeFromSlot(slot) {
  try {
    const [y, m, d] = (slot.date || "").split("-");
    const base = new Date(Number(y), Number(m) - 1, Number(d), 0, 0, 0, 0);

    const [time, ampm] = (slot.time || "").split(" ");
    let [hh, mm] = time.split(":").map(Number);
    if (ampm === "PM" && hh !== 12) hh += 12;
    if (ampm === "AM" && hh === 12) hh = 0;
    base.setHours(hh, mm, 0, 0);
    return base; // may be Invalid Date; callers handle NaN
  } catch (e) {
    return new Date(NaN);
  }
}

// single place that normalizes an appointment from the API
function normalizeAppointment(a) {
  return {
    id: a._id || a.id,
    patientName: a.patientName || "",
    age: a.age || "",
    gender: a.gender || "",
    mobile: a.mobile || "",
    doctorName: (a.doctorId && a.doctorId.name) || a.doctorName || "",
    speciality:
      (a.doctorId && a.doctorId.specialization) ||
      a.speciality ||
      a.specialization ||
      "General",
    fee: typeof a.fees === "number" ? a.fees : a.fee || 0,
    slot: {
      date: a.date || (a.slot && a.slot.date) || "",
      time: a.time || (a.slot && a.slot.time) || "00:00 AM",
    },
    status: a.status || (a.payment && a.payment.status) || "Pending",
    raw: a, // keep original in case we need it
  };
}

const AppointmentsPage = () => {
  const { getToken } = useAuth();
  const isAdmin = true; // TODO: derive from real auth; backend must also enforce this
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true); // true so "No appointments" doesn't flash
  const [error, setError] = useState(null); // load errors (replace the grid)
  const [actionError, setActionError] = useState(null); // cancel errors (shown above grid)

  const [query, setQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterSpeciality, setFilterSpeciality] = useState("all");
  const [showAll, setShowAll] = useState(false);

  // fetch list from server (search/filtering is done client-side below)
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/appointments?limit=200`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.message || `Failed to fetch (${res.status})`);
        }
        const data = await res.json();
        setAppointments((data?.appointments || []).map(normalizeAppointment));
      } catch (err) {
        console.error("Load appointments error:", err);
        setError(err.message || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const specialities = useMemo(() => {
    const set = new Set(appointments.map((a) => a.speciality || "General"));
    return ["all", ...Array.from(set)];
  }, [appointments]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return appointments.filter((a) => {
      if (
        filterSpeciality !== "all" &&
        (a.speciality || "").toLowerCase() !== filterSpeciality.toLowerCase()
      )
        return false;
      if (filterDate && a.slot?.date !== filterDate) return false;
      if (!q) return true;
      return (
        (a.doctorName || "").toLowerCase().includes(q) ||
        (a.speciality || "").toLowerCase().includes(q) ||
        (a.patientName || "").toLowerCase().includes(q) ||
        (a.mobile || "").toLowerCase().includes(q)
      );
    });
  }, [appointments, query, filterDate, filterSpeciality]);

  const sortedFiltered = useMemo(() => {
    return filtered.slice().sort((a, b) => {
      const da = dateTimeFromSlot(a.slot).getTime() || 0;
      const db = dateTimeFromSlot(b.slot).getTime() || 0;
      return db - da;
    });
  }, [filtered]);

  const displayed = useMemo(
    () => (showAll ? sortedFiltered : sortedFiltered.slice(0, 8)),
    [sortedFiltered, showAll],
  );

  // admin cancel
  async function adminCancelAppointment(id) {
    const appt = appointments.find((x) => x.id === id);
    if (!appt) return;

    const statusLower = (appt.status || "").toLowerCase();
    const isCancelled =
      statusLower === "canceled" || statusLower === "cancelled";
    const isCompleted = statusLower === "completed";

    if (isCancelled || isCompleted) return;

    const ok = window.confirm(
      `As admin, mark appointment for ${appt.patientName} with ${
        appt.doctorName
      } on ${formatDateISO(appt.slot.date)} at ${appt.slot.time} as CANCELLED?`,
    );
    if (!ok) return;

    setActionError(null);

    try {
      // optimistic update
      setAppointments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "Canceled" } : p)),
      );

      const token = await getToken();

      const res = await fetch(`${API_BASE}/api/appointments/${id}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || `Cancel failed (${res.status})`);
      }
      const data = await res.json();
      const updated = data?.appointment || data?.appointments || null;
      if (updated) {
        setAppointments((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: updated.status || "Canceled",
                  slot: {
                    date: updated.date || p.slot.date,
                    time: updated.time || p.slot.time,
                  },
                  raw: updated,
                }
              : p,
          ),
        );
      }
    } catch (err) {
      console.error("Cancel error:", err);
      setActionError(err.message || "Failed to cancel appointment");
      // roll back by reloading from server
      try {
        const reload = await fetch(`${API_BASE}/api/appointments?limit=200`);
        if (reload.ok) {
          const body = await reload.json();
          setAppointments((body?.appointments || []).map(normalizeAppointment));
        }
      } catch (e) {
        // ignore reload failure
      }
    }
  }

  return (
    <div className={pageStyles.container}>
      <style>{keyframesStyles}</style>
      <div className={pageStyles.maxWidthContainer}>
        <header className={pageStyles.headerContainer}>
          <div className={pageStyles.headerTitleSection}>
            <h1 className={pageStyles.headerTitle}>Appointments</h1>
            <p className={pageStyles.headerSubtitle}>
              Manage and search upcoming patient appointments
            </p>
          </div>

          <div className={pageStyles.headerControlsSection}>
            <div className="flex flex-col md:flex-col sm:flex-row items-center gap-3">
              <div className={pageStyles.searchContainer}>
                <Search size={16} className={pageStyles.searchIcon} />
                <input
                  className={pageStyles.searchInput}
                  placeholder="Search doctor, patient, speciality or mobile"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className={pageStyles.filterContainer}>
                <div className={pageStyles.dateFilter}>
                  <Calendar size={14} className={pageStyles.dateFilterIcon} />
                  <input
                    type="date"
                    className={pageStyles.dateInput}
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </div>

                <select
                  className={pageStyles.selectFilter}
                  value={filterSpeciality}
                  onChange={(e) => setFilterSpeciality(e.target.value)}
                >
                  {specialities.map((s) => (
                    <option value={s} key={s}>
                      {s === "all" ? "All Specialities" : s}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setQuery("");
                    setFilterDate("");
                    setFilterSpeciality("all");
                    setShowAll(false);
                    setError(null);
                    setActionError(null);
                  }}
                  className={pageStyles.clearButton}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </header>

        {actionError && (
          <div className={pageStyles.errorContainer}>{actionError}</div>
        )}

        {loading ? (
          <div className={pageStyles.loadingErrorContainer}>Loading...</div>
        ) : error ? (
          <div className={pageStyles.errorContainer}>{error}</div>
        ) : sortedFiltered.length === 0 ? (
          <div className={pageStyles.noResultsContainer}>
            No appointments found
          </div>
        ) : (
          <main className={pageStyles.gridContainer}>
            {displayed.map((a, idx) => {
              const statusLower = (a.status || "").toLowerCase();
              const isCancelled =
                statusLower === "canceled" || statusLower === "cancelled";
              const isCompleted = statusLower === "completed";
              const isDisabled = isCancelled || isCompleted;
              return (
                <div
                  key={a.id}
                  style={{
                    animation: `fadeUp 420ms cubic-bezier(.2,.9,.2,1) forwards`,
                    animationDelay: `${Math.min(idx, 10) * 70}ms`,
                    opacity: 0,
                  }}
                  className={pageStyles.card}
                >
                  <div className={pageStyles.cardHeader}>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={pageStyles.cardTitle}>
                          {a.patientName}
                        </h3>

                        <div className={pageStyles.patientInfo}>
                          <span>{a.age ? `${a.age} yrs` : ""}</span>
                          <span> {a.age ? ":" : ""} </span>
                          <span>{a.gender}</span>
                          <span className="hidden md:inline"> : </span>
                          <span className="max-w-[120px]">{a.mobile}</span>
                        </div>
                      </div>

                      <div className={pageStyles.doctorInfo}>
                        {a.doctorName} :{" "}
                        <span className={pageStyles.doctorSpeciality}>
                          {a.speciality}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={pageStyles.feeLabel}>Fees</div>
                      <div className={pageStyles.feeAmount}>
                        <BadgeIndianRupee size={16} />
                        <span>{a.fee}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className={pageStyles.slotContainer}>
                      <Calendar size={14} className={pageStyles.slotIcon} />
                      <span>
                        {formatDateISO(a.slot.date)} — {a.slot.time}
                      </span>
                    </div>

                    <div
                      className={`${pageStyles.statusBadge} ${statusClasses(a.status)}`}
                    >
                      {a.status ? a.status.toUpperCase() : "PENDING"}
                    </div>

                    <div className="flex items-center gap-2">
                      {isAdmin && (
                        <button
                          onClick={() => adminCancelAppointment(a.id)}
                          title={
                            isDisabled
                              ? isCompleted
                                ? "Cannot cancel a completed appointment"
                                : "Already cancelled"
                              : "Admin Cancel (mark as cancelled)"
                          }
                          disabled={isDisabled}
                          aria-disabled={isDisabled}
                          className={pageStyles.cancelButton(
                            isDisabled,
                            isCompleted,
                          )}
                        >
                          {isDisabled
                            ? isCompleted
                              ? "Completed"
                              : "Admin Cancelled"
                            : "Admin Cancel"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </main>
        )}
        {sortedFiltered.length > 8 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowAll((s) => !s)}
              className={pageStyles.showMoreButton}
            >
              {showAll
                ? "Show Less"
                : `show more (${sortedFiltered.length - 8})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;