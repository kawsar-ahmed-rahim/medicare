import { useState } from "react";
import { loginPageStyles as a, toastStyles as z } from "../assets/dummyStyles";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
const STORAGE_KEY = "doctorToken_v1";
const LoginPage = () => {
  const API_BASE = "http://localhost:4000";
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((s) => ({
      ...s,
      [e.target.name]: e.target.value,
    }));
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("All fields are required", {
        style: z.errorToast,
      });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/api/doctors/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(json?.message || "Login failed", { duration: 4000 });
        setBusy(false);
        return;
      }
      const token = json?.token || json?.data?.token;
      if (!token) {
        toast.error("Authentication token missing");
        setBusy(false);
        return;
      }

      const doctorId =
        json?.data?._id || json?.doctor?._id || json?.data?.doctor?._id;
      if (!doctorId) {
        toast.error("Doctor ID missing from server response");
        setBusy(false);
        return;
      }

      localStorage.setItem(STORAGE_KEY, token);
      window.dispatchEvent(
        new StorageEvent("storage", { key: STORAGE_KEY, newValue: token }),
      );
      toast.success("Login successful — redirecting...", {
        style: z.successToast,
      });
      setTimeout(() => {
        navigate(`/doctor-admin/${doctorId}`);
      }, 700);
    } catch (err) {
      console.error("login error", err);
      toast.error("Network error during login");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className={a.mainContainer}>
      <Toaster position="top-right" reverseOrder={false} />
      <button className={a.backButton} onClick={() => navigate("/")}>
        <ArrowLeft className={a.backButtonIcon} />
        Back to home
      </button>
      <div className={a.loginCard}>
        <div className={a.logoContainer}>
          <img src={logo} alt="logo" className={a.logo} />
        </div>

        <h2 className={a.title}>Doctor Admin</h2>
        <p className={a.subtitle}>
          Sign in to manage your profile and schedule
        </p>

        <form onSubmit={handleLogin} className={a.form}>
          <input
            type="email"
            name="email"
            placeholder="email address"
            value={formData.email}
            onChange={handleChange}
            className={a.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
            className={a.input}
            required
          />
          <button className={a.submitButton} type="submit" disabled={busy}>
            {busy ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
