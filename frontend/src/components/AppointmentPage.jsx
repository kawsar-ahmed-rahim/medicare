import { useState, useCallback, useMemo, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import {
  appointmentPageStyles,
  badgeStyles,
  iconSize,
  cardStyles,
} from "../assets/dummyStyles";
import {
  CreditCard,
  Wallet,
  CheckCircle,
  Bell,
  Clock,
  XCircle,
  CalendarDays,
} from "lucide-react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const API = axios.create({ baseURL: API_BASE });
const CURRENCY = "₹"; // change to "৳" if needed

// ---------- helpers ----------
function pad(n) {
  return String(n ?? 0).padStart(2, "0");
}

// Returns a valid Date or null (never "now" on failure)
function parseDateTime(dateStr, timeStr) {
  if (!dateStr) return null;

  const fast = new Date(`${dateStr} ${timeStr || ""}`.trim());
  if (!isNaN(fast)) return fast;

  const parts = dateStr.split(" ");
  if (parts.length === 3) {
    const [d, m, y] = parts;
    const months = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    const month = months[m];
    if (month !== undefined) {
      const [t, ampm] = (timeStr || "").split(" ");
      const [hhRaw, mmRaw] = (t || "0:00").split(":");
      let hh = Number(hhRaw || 0);
      const mm = Number(mmRaw || 0);

      if (ampm === "PM" && hh !== 12) hh += 12;
      if (ampm === "AM" && hh === 12) hh = 0;

      const manual = new Date(Number(y), month, Number(d), hh, mm);
      if (!isNaN(manual)) return manual;
    }
  }

  const iso = new Date(dateStr);
  if (!isNaN(iso)) return iso;

  return null;
}

function isPast(dateStr, timeStr) {
  const dt = parseDateTime(dateStr, timeStr);
  return dt ? new Date() >= dt : false;
}

function computeStatus(item) {
  if (!item) return "Pending";

  if (item.status === "Canceled") return "Canceled";

  if (item.status === "Rescheduled") {
    if (item.rescheduledTo?.date && item.rescheduledTo?.time) {
      if (isPast(item.rescheduledTo.date, item.rescheduledTo.time)) {
        return "Completed";
      }
    }
    return "Rescheduled";
  }

  if (item.status === "Completed") return "Completed";

  if (item.status === "Confirmed") {
    return isPast(item.date, item.time) ? "Completed" : "Confirmed";
  }

  // Pending stays Pending (it was never confirmed, so it isn't "Completed")
  if (item.status === "Pending") return "Pending";

  if (isPast(item.date, item.time)) return "Completed";
  return item.confirmed ? "Confirmed" : "Pending";
}

function normalizeRescheduled(rt) {
  if (!rt) return null;
  if (rt.date && rt.time) return { date: rt.date, time: rt.time };
  if (!rt.date && !rt.dateString) return null;

  if (
    rt.date &&
    (rt.hour !== undefined || rt.minute !== undefined || rt.ampm)
  ) {
    const hour = rt.hour ?? 0;
    const minute = rt.minute ?? 0;
    const ampm = rt.ampm ?? "";
    return { date: rt.date, time: `${hour}:${pad(minute)} ${ampm}`.trim() };
  }

  return {
    date: rt.date || rt.dateString || "",
    time:
      rt.time ||
      (rt.hour
        ? `${rt.hour}:${pad(rt.minute || 0)} ${rt.ampm || ""}`.trim()
        : rt.timeString || ""),
  };
}

function buildTime(a) {
  if (a.time) return a.time;
  if (a.hour !== undefined && a.minute !== undefined && a.ampm) {
    return `${a.hour}:${pad(a.minute)} ${a.ampm}`;
  }
  if (a.hour !== undefined && a.ampm) return `${a.hour}:00 ${a.ampm}`;
  return "";
}

function extractList(data) {
  const fetched = data?.appointments ?? data?.data ?? data ?? [];
  return Array.isArray(fetched) ? fetched : [];
}

// ---------- badges ----------
const PaymentBadge = ({ payment }) => {
  return payment === "Online" ? (
    <span className={badgeStyles.paymentBadge.online}>
      <CreditCard className={iconSize.small} /> Online
    </span>
  ) : (
    <span className={badgeStyles.paymentBadge.cash}>
      <Wallet className={iconSize.small} /> Cash
    </span>
  );
};

const StatusBadge = ({ itemStatus }) => {
  if (itemStatus === "Completed")
    return (
      <span className={badgeStyles.statusBadge.completed}>
        <CheckCircle className={iconSize.small} /> Completed
      </span>
    );

  if (itemStatus === "Confirmed")
    return (
      <span className={badgeStyles.statusBadge.confirmed}>
        <Bell className={iconSize.small} /> Confirmed
      </span>
    );

  if (itemStatus === "Pending")
    return (
      <span className={badgeStyles.statusBadge.pending}>
        <Clock className={iconSize.small} /> Pending
      </span>
    );

  if (itemStatus === "Canceled")
    return (
      <span className={badgeStyles.statusBadge.canceled}>
        <XCircle className={iconSize.small} /> Canceled
      </span>
    );

  return (
    <span className={badgeStyles.statusBadge.default}>
      <CalendarDays className={iconSize.small} /> Rescheduled
    </span>
  );
};

// ---------- page ----------
const AppointmentPage = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [doctorAppts, setDoctorAppts] = useState([]);
  const [serviceAppts, setServiceAppts] = useState([]);
  const [error, setError] = useState(null);

  const addError = (msg) =>
    setError((prev) => (prev ? `${prev} | ${msg}` : msg));

  const loadDoctorAppointments = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;
    setLoadingDoctors(true);

    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const resp = await API.get("/api/appointments/me", { headers });
      const arr = extractList(resp?.data);

      const doctors = arr.filter(
        (a) =>
          (a.doctorId !== undefined && a.doctorId !== null) ||
          !!a.doctorName ||
          !a.serviceId,
      );
      setDoctorAppts(doctors);
    } catch (err) {
      console.error(
        "Error calling /api/appointments/me:",
        err?.response?.data || err.message || err,
      );
      addError("Failed to load doctor appointments.");
      setDoctorAppts([]);
    } finally {
      setLoadingDoctors(false);
    }
  }, [isLoaded, isSignedIn, getToken]);

  const loadServiceAppointments = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;
    setLoadingServices(true);

    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const resp = await API.get("/api/service-appointments/me", { headers });
      setServiceAppts(extractList(resp?.data));
    } catch (err) {
      console.error(
        "Error calling /api/service-appointments/me:",
        err?.response?.data || err.message || err,
      );
      addError("Failed to load service appointments.");
      setServiceAppts([]);
    } finally {
      setLoadingServices(false);
    }
  }, [isLoaded, isSignedIn, getToken]);

  useEffect(() => {
    setError(null); // clear once, so one loader can't wipe the other's error
    loadDoctorAppointments();
    loadServiceAppointments();
  }, [loadDoctorAppointments, loadServiceAppointments]);

  const appointmentData = useMemo(() => {
    return doctorAppts
      .map((a) => {
        const id = a._id || a.id || "";
        const doctorObj =
          typeof a.doctorId === "object" && a.doctorId ? a.doctorId : {};
        const image =
          doctorObj.imageUrl ||
          doctorObj.image ||
          doctorObj.avatar ||
          a.doctorImage?.url ||
          a.doctorImage ||
          "";
        const doctorName =
          (doctorObj.name && String(doctorObj.name).trim()) ||
          (a.doctorName && String(a.doctorName).trim()) ||
          (a.doctor && String(a.doctor).trim()) ||
          "Doctor";

        const patientName = a.patientName || a.patient || "Patient";
        const specialization =
          doctorObj.specialization || a.specialization || a.speciality || "";
        const experience = doctorObj.experience || a.experience || "";
        const date = a.date || "";
        const time = buildTime(a);

        const payment = (a.payment && a.payment.method) || "Cash";
        const status =
          a.status ||
          (a.payment && a.payment.status === "Paid" ? "Confirmed" : "Pending");
        const rescheduledTo = normalizeRescheduled(
          a.rescheduledTo || {
            date: a.rescheduledDate,
            time: a.rescheduledTime,
          },
        );

        return {
          id,
          image,
          doctor: doctorName,
          patientName,
          specialization,
          experience,
          date,
          time,
          payment,
          status,
          rescheduledTo,
        };
      })
      .map((x) => ({ ...x, status: computeStatus(x) }));
  }, [doctorAppts]);

  const serviceData = useMemo(() => {
    return serviceAppts
      .map((s) => {
        const id = s._id || s.id || "";
        const svc =
          typeof s.serviceId === "object" && s.serviceId ? s.serviceId : {};
        const image =
          svc.imageUrl ||
          svc.image ||
          svc.imageSmall ||
          s.serviceImage?.url ||
          s.serviceImage ||
          "";
        const name = s.serviceName || svc.name || svc.title || "Service";
        const patientName = s.patientName || s.patient || "Patient";
        const price = s.fees ?? s.amount ?? s.price ?? 0;
        const date = s.date || "";
        const time = buildTime(s);

        const payment = (s.payment && s.payment.method) || "Cash";
        const status =
          s.status ||
          (s.payment && s.payment.status === "Paid" ? "Confirmed" : "Pending");
        const rescheduledTo = normalizeRescheduled(s.rescheduledTo || null);

        return {
          id,
          image,
          name,
          patientName,
          price,
          date,
          time,
          payment,
          status,
          rescheduledTo,
        };
      })
      .map((x) => ({ ...x, status: computeStatus(x) }));
  }, [serviceAppts]);

  return (
    <div className={appointmentPageStyles.pageContainer}>
      <Toaster position="top-right" />
      <div className={appointmentPageStyles.maxWidthContainer}>
        {error && (
          <div className={appointmentPageStyles.emptyStateText}>{error}</div>
        )}

        <h1 className={appointmentPageStyles.doctorTitle}>
          Your Doctor Appointments
        </h1>

        {loadingDoctors && (
          <div className={appointmentPageStyles.loadingText}>
            Loading Doctors....
          </div>
        )}

        {!loadingDoctors && appointmentData.length === 0 && (
          <div className={appointmentPageStyles.emptyStateText}>
            No doctor appointment found.
          </div>
        )}

        <div className={appointmentPageStyles.doctorGrid}>
          {appointmentData.map((item) => (
            <div className={cardStyles.doctorCard} key={item.id}>
              <div className={cardStyles.doctorImageContainer}>
                <img
                  src={item.image || "/placeholder-doctor.png"}
                  alt={item.doctor}
                  className={cardStyles.image}
                  loading="lazy"
                />
              </div>
              <h2 className={cardStyles.doctorName}>{item.doctor}</h2>
              <div className={cardStyles.specialization}>
                {item.specialization}
                {item.experience ? ` • ${item.experience}` : ""}
              </div>
              <p className={cardStyles.dateContainer}>
                <CalendarDays className={iconSize.medium} />
                {item.date}
              </p>
              <p className={cardStyles.dateContainer}>
                <Clock className={iconSize.medium} />
                {item.time}
              </p>
              <div className={cardStyles.badgesContainer}>
                <PaymentBadge payment={item.payment} />
                <StatusBadge itemStatus={item.status} />
              </div>
              {item.status === "Rescheduled" && item.rescheduledTo ? (
                <div className={cardStyles.rescheduledText}>
                  Rescheduled to{" "}
                  <span className={cardStyles.rescheduledSpan}>
                    {item.rescheduledTo.date} : {item.rescheduledTo.time}
                  </span>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <h1 className={appointmentPageStyles.serviceTitle}>
          Your Booked Services
        </h1>

        {loadingServices && (
          <div className={appointmentPageStyles.serviceLoadingText}>
            Loading service Bookings....
          </div>
        )}

        {!loadingServices && serviceData.length === 0 && (
          <div className={appointmentPageStyles.serviceEmptyStateText}>
            No service bookings found.
          </div>
        )}

        <div className={appointmentPageStyles.serviceGrid}>
          {serviceData.map((srv) => (
            <div key={srv.id} className={cardStyles.serviceCard}>
              <div className={cardStyles.serviceImageContainer}>
                <img
                  src={srv.image || "/placeholder-service.png"}
                  alt={srv.name}
                  className={cardStyles.image}
                  loading="lazy"
                />
              </div>

              <h3 className={cardStyles.serviceName}>{srv.name}</h3>

              <p className={cardStyles.price}>
                {CURRENCY}
                {srv.price}
              </p>

              <p className={cardStyles.serviceDateContainer}>
                <CalendarDays className={iconSize.medium} /> {srv.date}
              </p>

              <p className={cardStyles.serviceTimeContainer}>
                <Clock className={iconSize.medium} /> {srv.time}
              </p>

              <div className={cardStyles.badgesContainer}>
                <PaymentBadge payment={srv.payment} />
                <StatusBadge itemStatus={srv.status} />
              </div>

              {srv.status === "Rescheduled" && srv.rescheduledTo ? (
                <div className={cardStyles.serviceRescheduledText}>
                  Rescheduled to{" "}
                  <span className={cardStyles.rescheduledSpan}>
                    {srv.rescheduledTo.date} : {srv.rescheduledTo.time}
                  </span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;