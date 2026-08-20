import { User, XCircle } from "lucide-react";
import { doctorDetailStyles as s } from "../assets/dummyStyles";
import { useState, useRef, useEffect } from "react";
// helper functions
function timeStringToMinutes(t) {
  if (!t) return 0;
  const [hhmm, ampm] = t.split(" ");
  let [h, m] = hhmm.split(":").map(Number);
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

function formatDateISO(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = String(Number(d));
  const month = monthNames[dateObj.getMonth()] || "";
  return `${day} ${month} ${y}`;
}

const AddPage = () => {
  const [doctorList, setDoctorList] = useState([]);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    specialization: "",
    imageFile: null,
    imagePreview: "",
    experience: "",
    qualifications: "",
    location: "",
    about: "",
    fee: "",
    success: "",
    patients: "",
    rating: "",
    schedule: {},
    availability: "Available",
    email: "",
    password: "",
  });

  const [slotDate, setSlotDate] = useState("");
  const [slotHour, setSlotHour] = useState("");
  const [slotMinute, setSlotMinute] = useState("00");
  const [slotAmpm, setSlotAmpm] = useState("AM");

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [today] = useState(() => {
    const d = new Date();
    const tzOffset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - tzOffset * 60000);
    return local.toISOString().split("T")[0];
  });

  useEffect(() => {
    if (!toast.show) return;
    const t = setTimeout(() => setToast((s) => ({ ...s, show: false })), 3000);
    return () => clearTimeout(t);
  }, [toast.show]);

  const showToast = (type, message) => setToast({ show: true, type, message });

  function handleImage(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (form.imagePreview && form.imageFile) {
      try {
        URL.revokeObjectURL(form.imagePreview);
      } catch (err) {
        console.log(err);
      }
    }
    setForm((p) => ({
      ...p,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  }

  function removeImage() {
    if (form.imagePreview && form.imageFile) {
      try {
        URL.revokeObjectURL(form.imagePreview);
      } catch (err) {}
    }
    setForm((p) => ({ ...p, imageFile: null, imagePreview: "" }));
    if (fileInputRef.current) {
      try {
        fileInputRef.current.value = "";
      } catch (err) {}
    }
  }

  function addSlotToForm() {
    if (!slotDate || !slotHour) {
      showToast("error", "Select date + time");
      return;
    }
    if (slotDate < today) {
      showToast("error", "Cannot add a slot in the past");
      return;
    }
    const time = `${slotHour}:${slotMinute} ${slotAmpm}`;

    if (slotDate === today) {
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      const slotMinutes = timeStringToMinutes(time);
      if (slotMinutes <= nowMinutes) {
        showToast("error", "Cannot add a time that has already passed today");
        return;
      }
    }

    setForm((f) => {
      const sched = { ...f.schedule };
      if (!sched[slotDate]) sched[slotDate] = [];
      if (!sched[slotDate].includes(time)) sched[slotDate].push(time);

      sched[slotDate] = sched[slotDate].sort(
        (a, b) => timeStringToMinutes(a) - timeStringToMinutes(b),
      );
      return { ...f, schedule: sched };
    });

    setSlotHour("");
    setSlotMinute("00");
  }

  function removeSlot(date, time) {
    setForm((f) => {
      const sched = { ...f.schedule };
      sched[date] = sched[date].filter((t) => t !== time);
      if (!sched[date].length) delete sched[date];
      return { ...f, schedule: sched };
    });
  }

  function getFlatSlots(s) {
    const arr = [];
    Object.keys(s)
      .sort()
      .forEach((d) => {
        s[d].forEach((t) => arr.push({ date: d, time: t }));
      });
    return arr;
  }

  function validate(f) {
    const req = [
      "name",
      "specialization",
      "experience",
      "qualifications",
      "location",
      "about",
      "fee",
      "success",
      "patients",
      "rating",
      "email",
      "password",
    ];

    for (let k of req) if (!f[k]) return false;
    if (!f.imageFile) return false;
    if (!Object.keys(f.schedule).length) return false;
    return true;
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!validate(form)) {
      showToast("error", "Fill all fields + upload image + add slot");
      return;
    }
    const r = Number(form.rating);
    if (Number.isNaN(r) || r < 1 || r > 5) {
      showToast("error", "Rating must be a number between 1 and 5");
      return;
    }
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("specialization", form.specialization || "");
      fd.append("experience", form.experience || "");
      fd.append("qualifications", form.qualifications || "");
      fd.append("location", form.location || "");
      fd.append("about", form.about || "");
      fd.append("fee", form.fee === "" ? "0" : String(form.fee));
      fd.append("success", form.success || "");
      fd.append("patients", form.patients || "");
      fd.append("rating", form.rating === "" ? "0" : String(form.rating));
      fd.append("availability", form.availability || "Available");
      fd.append("email", form.email);
      fd.append("password", form.password);
      fd.append("schedule", JSON.stringify(form.schedule || {}));

      if (form.imageFile) fd.append("image", form.imageFile);

      const API_BASE = "http://localhost:4000/api";

      const res = await fetch(`${API_BASE}/doctors`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = data?.message || `Server error (${res.status})`;
        showToast("error", msg);
        setLoading(false);
        return;
      }

      showToast("success", "Doctor Added Successfully!");

      if (data?.token) {
        try {
          localStorage.setItem("token", data.token);
        } catch (err) {
          console.log(err);
        }
      }

      const doctorFromServer = data?.data
        ? data.data
        : { id: Date.now(), ...form, imageUrl: form.imagePreview };

      setDoctorList((old) => [doctorFromServer, ...old]);

      // cleanup: revoke object URL if used
      if (form.imagePreview && form.imageFile) {
        try {
          URL.revokeObjectURL(form.imagePreview);
        } catch (err) {
          console.log(err);
        }
      }

      setForm({
        name: "",
        specialization: "",
        imageFile: null,
        imagePreview: "",
        experience: "",
        qualifications: "",
        location: "",
        about: "",
        fee: "",
        success: "",
        patients: "",
        rating: "",
        schedule: {},
        availability: "Available",
        email: "",
        password: "",
      });

      if (fileInputRef.current) {
        try {
          fileInputRef.current.value = "";
        } catch (err) {
          console.log(err);
        }
      }

      setSlotDate("");
      setSlotHour("");
      setSlotMinute("00");
      setShowPassword(false);
    } catch (err) {
      console.error("submit error:", err);
      showToast("error", "Network or server error");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={s.pageContainer}>
      <div className={s.maxWidthContainerLg + " " + s.headerContainer}>
        <div className={s.headerFlexContainer}>
          <div className={s.headerIconContainer}>
            <User className="text-white" size={32} />
          </div>
          <h1 className={s.headerTitle}>Add New Doctor</h1>
        </div>
      </div>
      {/* form */}
      <div className={s.maxWidthContainer + " " + s.formContainer}>
        <form onSubmit={handleAdd} className={s.formGrid}>
          <div className="md:col-span-2">
            <label className={s.label}>Upload Profile Image</label>
            <div className="flex flex-wrap items-center gap-4">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImage}
                className={s.fileInput}
              />

              {form.imagePreview && (
                <div className="relative group">
                  <img
                    src={form.imagePreview}
                    alt="preview"
                    className={s.imagePreview}
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className={s.removeImageButton + " " + s.cursorPointer}
                  >
                    <XCircle size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <input
            placeholder="Full Name"
            className={s.inputBase}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Specialization"
            className={s.inputBase}
            value={form.specialization}
            onChange={(e) => setForm({ ...form, specialization: e.target.value })}
          />
          <input
            placeholder="Location"
            className={s.inputBase}
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <input
            placeholder="Experience"
            className={s.inputBase}
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
          />
          <input
            placeholder="Qualification"
            className={s.inputBase}
            value={form.qualification}
            onChange={(e) => setForm({ ...form, qualification: e.target.value })}
          />
          <input
            placeholder="Consultation fee"
            className={s.inputBase}
            value={form.fee}
            onChange={(e) => setForm({ ...form, fee: e.target.value })}
          />
           <input
            className={s.inputBase}
            placeholder="Rating (1.0 - 5.0)"
            type="number"
            min={1}
            max={5}
            step={0.1}
            value={form.rating}
            onChange={(e) => {
              const v = e.target.value;

              // allow clearing
              if (v === "") {
                setForm((p) => ({ ...p, rating: "" }));
                return;
              }

              const n = Number(v);
              if (Number.isNaN(n)) return;

              // clamp between 1 and 5
              const clamped = Math.max(1, Math.min(5, n));

              // keep only 1 decimal place
              const fixed = Math.round(clamped * 10) / 10;

              setForm((p) => ({ ...p, rating: fixed.toString() }));
            }}
            onBlur={() => {
              // force 1 decimal place on blur
              setForm((p) => {
                if (!p.rating) return p;
                const n = Number(p.rating);
                if (Number.isNaN(n)) return { ...p, rating: "" };

                const clamped = Math.max(1, Math.min(5, n));
                return { ...p, rating: clamped.toFixed(1) };
              });
            }}
          />
          <input
            placeholder="patients"
            className={s.inputBase}
            value={form.patients}
            onChange={(e) => setForm({ ...form, patients: e.target.value })}
          />
          <input
            placeholder="Success Rate"
            className={s.inputBase}
            value={form.success}
            onChange={(e) => setForm({ ...form, success: e.target.value })}
          />
          <input
            placeholder="Doctor Email"
            className={s.inputBase}
            value={form.email}
            type="email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <div className="relative">
            <input type={showPassword ? "text" : "password"} className={s.inputBase + " " + s.inputWithIcon} placeholder="doctor password" value={form.password} onChange={(e)=> setForm({
                ...form,password: e.target.value
            })} />
            <button type="button" onClick={()=> setShowPassword((s)=> !s)} className={s.passwordToggleButton + " " + s.cursorPointer}>{showPassword ? <Eye size={18}/> : <EyeClosed size={18} /></button></div>
        </form>
      </div>
    </div>
  );
};

export default AddPage;
