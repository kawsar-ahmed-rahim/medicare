import { serviceDashboardStyles } from "../assets/dummyStyles";
function normalizeService(doc) {
  if (!doc) return null;
  const id = doc._id || doc.id || String(Math.random()).slice(2);
  const name = doc.name || doc.title || doc.serviceName || "Untitled Service";
  const price =
    Number(doc.price ?? doc.fee ?? doc.fees ?? doc.cost ?? doc.amount) || 0;
  const image =
    doc.imageUrl ||
    doc.image ||
    doc.avatar ||
    `https://i.pravatar.cc/150?u=${id}`;
  // various possible stat shapes
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
const API_BASE = "http://localhost:4000";

const ServiceDashboard = () => {
     const [services, setServices] = useState(
    Array.isArray(servicesProp) ? servicesProp.map(normalizeService) : [],
  );
  const [loading, setLoading] = useState(!Array.isArray(servicesProp));
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const mountedRef = useRef(true);
  const fetchingRef = useRef(false);
  const pollHandleRef = useRef(null);

  function buildFetchOptions() {
    const opts = {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const token = localStorage.getItem("authToken");
    if (token) opts.headers["Authorization"] = `Bearer ${token}`;
    return opts;
  }

  async function fetchServices({ showLoading = true } = {}) {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      if (showLoading) {
        setLoading(true);
        setError(null);
      }
  return (
    <div className={serviceDashboardStyles.container}>
      <div className={serviceDashboardStyles.innerContainer}>

        <div className={serviceDashboardStyles.header.container}>
          <div>
            <h1 className={serviceDashboardStyles.header.title}>Service Dashboard</h1>
            <p className={serviceDashboardStyles.header.subtitle}>Overview of services, appointments and earnings</p>

          </div>
          <div className={serviceDashboardStyles.refresh.container}>
            <div className={serviceDashboardStyles.refresh.countText}>{
    loading ? "Loading..." : `${filteredServices.length} services${
    filteredServices.length !== 1 ? "s" : ""}`}</div>
    <button onClick={()=> {
      if(Array.isArray(servicesProp)) return;
      fetchServices({showLoading: true})}} className={serviceDashboardStyles.refresh.button(Array.isArray(servicesProp))} title={Array.isArray(servicesProp) ? "Services provided by parent component" : "Refresh"}>
        Refresh

    </button>
          </div>
        </div>


        <div className={serviceDashboardStyles.statGrid}>
          <statGrid icon={<ClipboardList size={18} />}
          label="Total Services" value={totals.totalServices} />

           <statGrid icon={<calendar size={18} />}
          label="Total Appointments" value={totals.totalServices} />
           <statGrid icon={<Dollar size={18} />}
          label="Total earnings" value={formatCurrency(totals.totalEarnings)} />
           <statGrid icon={<CheckCircle size={18} />}
          label="Completed" value={totals.totalCompleted} />
           <statGrid icon={<XCircle size={18} />}
          label="Canceled" value={totals.totalCanceled} />
          
          </div>

          {/* search bar */}
          <div className={serviceDashboardStyles.search.container}>
            <div className={serviceDashboardStyles.search.inputContainer}>
              <Search size={16} className="text-emerald-700" />
              <input type="text" placeholders="Search services..." value={searchQuery} onChange={(e)=> setSearchQuery(e.target.value)} className={serviceDashboardStyles.search.input} />
              { }
            </div>
          </div>
      </div>

    </div>
  )
}

export default ServiceDashboard;

function StatCard({icon, label, value}) {
  return (
    <div className={serviceDashboardStyles.statCard.container}>
      <div className={serviceDashboardStyles.statCard.iconContainer}>{icon}</div>

      <div>
        <div className={serviceDashboardStyles.statCard.label}>{label}</div>
        <div className={serviceDashboardStyles.statCard.value}>{value}</div>
      </div>
    </div>
  )
}