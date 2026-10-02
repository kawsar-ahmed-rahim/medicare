import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  ClipboardList,
  Calendar,
  CheckCircle,
  XCircle,
  Search,
  BadgeIndianRupee,
} from "lucide-react";
import { serviceDashboardStyles } from "../assets/dummyStyles";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const CURRENCY = "₹"; // change to "৳" if needed
const INITIAL_COUNT = 8;

function normalizeService(doc, index = 0) {
  if (!doc) return null;
  // stable fallback id (a random id changes on every fetch and breaks React keys)
  const id = doc._id || doc.id || `service-${index}`;
  const name = doc.name || doc.title || doc.serviceName || "Untitled Service";
  const price =
    Number(doc.price ?? doc.fee ?? doc.fees ?? doc.cost ?? doc.amount) || 0;
  const image =
    doc.imageUrl || doc.image || doc.avatar || "/placeholder-service.png";

  const totalAppointments =
    doc.totalAppointments ??
    doc.appointments?.total ??
    doc.count ??
    doc.stats?.total ??
    doc.bookings ??
    0;
  const completed =
    doc.completed ??
    doc.appointments?.completed ??
    doc.stats?.completed ??
    doc.completedAppointments ??
    0;
  const canceled =
    doc.canceled ??
    doc.appointments?.canceled ??
    doc.stats?.canceled ??
    doc.canceledAppointments ??
    0;

  return {
    id,
    name,
    price,
    image,
    totalAppointments: Number(totalAppointments) || 0,
    completed: Number(completed) || 0,
    canceled: Number(canceled) || 0,
    raw: doc,
  };
}

function normalizeList(list) {
  return (list || []).map(normalizeService).filter(Boolean);
}

function formatCurrency(v) {
  return `${CURRENCY}${Number(v || 0).toLocaleString()}`;
}

const ServiceDashboard = ({ services: servicesProp }) => {
  const hasParentData = Array.isArray(servicesProp);

  const [services, setServices] = useState(
    hasParentData ? normalizeList(servicesProp) : [],
  );
  const [loading, setLoading] = useState(!hasParentData);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const mountedRef = useRef(true);
  const fetchingRef = useRef(false);

  const fetchServices = useCallback(
    async ({ showLoading = true } = {}) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;
      try {
        if (showLoading) {
          setLoading(true);
          setError(null);
        }

        const headers = { "Content-Type": "application/json" };
        const token = localStorage.getItem("authToken");
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(
          `${API_BASE}/api/service-appointments/stats/summary`,
          { method: "GET", headers },
        );
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            body?.message || `Failed to fetch services (${res.status})`,
          );
        }
        const body = await res.json();

        let list = [];
        if (Array.isArray(body)) list = body;
        else if (Array.isArray(body.services)) list = body.services;
        else if (Array.isArray(body.data)) list = body.data;
        else if (Array.isArray(body.items)) list = body.items;
        else {
          const maybeArray = Object.values(body).find((v) => Array.isArray(v));
          if (maybeArray) list = maybeArray;
        }

        if (mountedRef.current) {
          setServices(normalizeList(list));
          setError(null);
        }
      } catch (err) {
        console.error("Service fetch error:", err);
        // only replace the table with an error on a user-visible load;
        // a failed background poll keeps the last good data on screen
        if (mountedRef.current && showLoading) {
          setError(err.message || "Failed to load services");
        }
      } finally {
        if (mountedRef.current && showLoading) setLoading(false);
        fetchingRef.current = false;
      }
    },
    [],
  );

  // optional global refresh hook (kept from original)
  useEffect(() => {
    window.refreshServices = () => fetchServices({ showLoading: true });
    return () => {
      delete window.refreshServices;
    };
  }, [fetchServices]);

  useEffect(() => {
    mountedRef.current = true;

    if (hasParentData) {
      setServices(normalizeList(servicesProp));
      setLoading(false);
      return () => {
        mountedRef.current = false;
      };
    }

    fetchServices({ showLoading: true });

    const pollHandle = setInterval(() => {
      if (document.visibilityState === "visible")
        fetchServices({ showLoading: false });
    }, 10000);

    const refresh = () => fetchServices({ showLoading: false });
    const onStorage = (e) => {
      if (e?.key === "service_bookings_updated") refresh();
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") refresh();
    };

    window.addEventListener("focus", refresh);
    window.addEventListener("services:updated", refresh);
    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      mountedRef.current = false;
      clearInterval(pollHandle);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("services:updated", refresh);
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [servicesProp, hasParentData, fetchServices]);

  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return services;
    // match by name or price text (no more "price <= number" matching,
    // which returned unrelated services for any numeric search)
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.price.toString().includes(q),
    );
  }, [services, searchQuery]);

  const visibleServices = showAll
    ? filteredServices
    : filteredServices.slice(0, INITIAL_COUNT);

  const totals = useMemo(() => {
    return filteredServices.reduce(
      (acc, s) => {
        acc.totalServices += 1;
        acc.totalAppointments += s.totalAppointments;
        acc.totalCompleted += s.completed;
        acc.totalCanceled += s.canceled;
        acc.totalEarning += s.completed * s.price;
        return acc;
      },
      {
        totalServices: 0,
        totalAppointments: 0,
        totalCompleted: 0,
        totalCanceled: 0,
        totalEarning: 0,
      },
    );
  }, [filteredServices]);

  return (
    <div className={serviceDashboardStyles.container}>
      <div className={serviceDashboardStyles.innerContainer}>
        <div className={serviceDashboardStyles.header.container}>
          <div>
            <h1 className={serviceDashboardStyles.header.title}>
              Service Dashboard
            </h1>
            <p className={serviceDashboardStyles.header.subtitle}>
              Overview of services, appointments and earnings
            </p>
          </div>
          <div className={serviceDashboardStyles.refresh.container}>
            <div className={serviceDashboardStyles.refresh.countText}>
              {loading
                ? "Loading..."
                : `${filteredServices.length} service${
                    filteredServices.length !== 1 ? "s" : ""
                  }`}
            </div>
            <button
              onClick={() => {
                if (hasParentData) return;
                fetchServices({ showLoading: true });
              }}
              className={serviceDashboardStyles.refresh.button(hasParentData)}
              title={
                hasParentData ? "Services provided by parent component" : "Refresh"
              }
            >
              Refresh
            </button>
          </div>
        </div>

        <div className={serviceDashboardStyles.statGrid}>
          <StatCard
            icon={<ClipboardList size={18} />}
            label="Total Services"
            value={totals.totalServices}
          />
          <StatCard
            icon={<Calendar size={18} />}
            label="Total Appointments"
            value={totals.totalAppointments}
          />
          <StatCard
            icon={<BadgeIndianRupee size={18} />}
            label="Total earnings"
            value={formatCurrency(totals.totalEarning)}
          />
          <StatCard
            icon={<CheckCircle size={18} />}
            label="Completed"
            value={totals.totalCompleted}
          />
          <StatCard
            icon={<XCircle size={18} />}
            label="Canceled"
            value={totals.totalCanceled}
          />
        </div>

        {/* search bar */}
        <div className={serviceDashboardStyles.search.container}>
          <div className={serviceDashboardStyles.search.inputContainer}>
            <Search size={16} className="text-emerald-700" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={serviceDashboardStyles.search.input}
            />
            {searchQuery.length > 0 && (
              <XCircle
                size={16}
                className="text-red-500 cursor-pointer"
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>
        </div>

        {/* table list */}
        <div className={serviceDashboardStyles.table.container}>
          <div className={serviceDashboardStyles.table.headerMd}>
            <div className={serviceDashboardStyles.table.headerText}>
              Service
            </div>
            <div className={serviceDashboardStyles.table.headerText}>
              Appointments
            </div>
            <div className={serviceDashboardStyles.table.headerText}>
              Completed
            </div>
            <div className={serviceDashboardStyles.table.headerText}>
              Canceled
            </div>
            <div className={serviceDashboardStyles.table.headerText}>
              Earning
            </div>
          </div>
          <div className={serviceDashboardStyles.table.headerLg}>
            <div className="col-span-5">Service</div>
            <div className="col-span-2">Price</div>
            <div className={serviceDashboardStyles.table.headerTextLg(1)}>
              Appointments
            </div>
            <div className={serviceDashboardStyles.table.headerTextLg(1)}>
              Completed
            </div>
            <div className={serviceDashboardStyles.table.headerTextLg(1)}>
              Canceled
            </div>
            <div className="col-span-2 text-right">Earning</div>
          </div>
          <div className={serviceDashboardStyles.table.body}>
            {loading ? (
              <div className={serviceDashboardStyles.states.loading}>
                Loading services...
              </div>
            ) : error ? (
              <div className={serviceDashboardStyles.states.error}>
                Error : {error}
              </div>
            ) : visibleServices.length === 0 ? (
              <div className={serviceDashboardStyles.states.empty}>
                No services found.
              </div>
            ) : (
              visibleServices.map((s) => {
                const earning = s.completed * s.price;
                return (
                  <div key={s.id} className={serviceDashboardStyles.table.row}>
                    {/* tablet */}
                    <div className={serviceDashboardStyles.table.tabletView}>
                      <div className="flex items-center gap-3">
                        <div
                          className={serviceDashboardStyles.table.tabletImage}
                        >
                          <img
                            src={s.image}
                            alt={s.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div
                          className={
                            serviceDashboardStyles.table.tabletTextContainer
                          }
                        >
                          <div
                            className={
                              serviceDashboardStyles.table.tabletServiceName
                            }
                          >
                            {s.name}
                          </div>
                          <div
                            className={serviceDashboardStyles.table.tabletPrice}
                          >
                            {formatCurrency(s.price)}
                          </div>
                        </div>
                      </div>

                      <div className={serviceDashboardStyles.table.tabletCell}>
                        {s.totalAppointments}
                      </div>
                      <div
                        className={`${serviceDashboardStyles.table.tabletCell} text-emerald-700`}
                      >
                        {s.completed}
                      </div>
                      <div
                        className={`${serviceDashboardStyles.table.tabletCell} text-red-500`}
                      >
                        {s.canceled}
                      </div>
                      <div
                        className={`${serviceDashboardStyles.table.tabletCell} text-right`}
                      >
                        {formatCurrency(earning)}
                      </div>
                    </div>

                    {/* desktop */}
                    <div className={serviceDashboardStyles.table.desktopView}>
                      <div className="col-span-5 flex items-center gap-4">
                        <div
                          className={serviceDashboardStyles.table.desktopImage}
                        >
                          <img
                            src={s.image}
                            alt={s.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3
                          className={
                            serviceDashboardStyles.table.desktopServiceName
                          }
                        >
                          {s.name}
                        </h3>
                      </div>
                      <div
                        className={serviceDashboardStyles.table.desktopCell(2)}
                      >
                        {formatCurrency(s.price)}
                      </div>
                      <div
                        className={serviceDashboardStyles.table.desktopCenterCell(
                          1,
                        )}
                      >
                        {s.totalAppointments}
                      </div>
                      <div
                        className={serviceDashboardStyles.table.desktopCenterCell(
                          1,
                        )}
                      >
                        {s.completed}
                      </div>
                      <div
                        className={serviceDashboardStyles.table.desktopCenterCell(
                          1,
                        )}
                      >
                        {s.canceled}
                      </div>
                      <div
                        className={`${serviceDashboardStyles.table.desktopCell(2)} text-right`}
                      >
                        {formatCurrency(earning)}
                      </div>
                    </div>

                    {/* mobile */}
                    <div className={serviceDashboardStyles.table.mobileView}>
                      <div className="flex items-start gap-3">
                        <div
                          className={serviceDashboardStyles.table.mobileImage}
                        >
                          <img
                            src={s.image}
                            alt={s.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div
                            className={
                              serviceDashboardStyles.table.mobileServiceHeader
                            }
                          >
                            <h3
                              className={
                                serviceDashboardStyles.table.mobileServiceName
                              }
                            >
                              {s.name}
                            </h3>
                            <div className="text-sm font-medium">
                              {formatCurrency(s.price)}
                            </div>
                          </div>

                          <div
                            className={
                              serviceDashboardStyles.table.mobileStatsContainer
                            }
                          >
                            <div
                              className={serviceDashboardStyles.table.mobileStatItem(
                                "emerald",
                              )}
                            >
                              <Calendar size={14} />
                              <span className="leading-none">
                                {s.totalAppointments} Appointments
                              </span>
                            </div>

                            <div
                              className={serviceDashboardStyles.table.mobileStatItem(
                                "emerald",
                              )}
                            >
                              <CheckCircle size={14} />
                              <span className="leading-none text-emerald-700">
                                {s.completed} Completed
                              </span>
                            </div>

                            <div
                              className={serviceDashboardStyles.table.mobileStatItem(
                                "red",
                              )}
                            >
                              <XCircle size={14} />
                              <span className="leading-none text-red-500">
                                {s.canceled} Canceled
                              </span>
                            </div>

                            <div
                              className={serviceDashboardStyles.table.mobileStatItem(
                                "emerald",
                              )}
                            >
                              <BadgeIndianRupee size={14} />
                              <span className="leading-none">
                                Total Earning : {formatCurrency(earning)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {filteredServices.length > INITIAL_COUNT && (
          <div className={serviceDashboardStyles.showMore.container}>
            <button
              onClick={() => setShowAll((s) => !s)}
              className={serviceDashboardStyles.showMore.button}
            >
              {showAll
                ? "Show less"
                : `Show more (${filteredServices.length - INITIAL_COUNT})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDashboard;

function StatCard({ icon, label, value }) {
  return (
    <div className={serviceDashboardStyles.statCard.container}>
      <div className={serviceDashboardStyles.statCard.iconContainer}>
        {icon}
      </div>

      <div>
        <div className={serviceDashboardStyles.statCard.label}>{label}</div>
        <div className={serviceDashboardStyles.statCard.value}>{value}</div>
      </div>
    </div>
  );
}