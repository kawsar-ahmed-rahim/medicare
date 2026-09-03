import { useState } from "react";
import { contactPageStyles as a } from "../assets/dummyStyles";
import { Mail, MapPin, MessageSquare, Phone, SendHorizonal, Stethoscope, User } from 'lucide-react';
const ContactPage = () => {
  const initial = {
    name: "",
    email: "",
    phone: "",
    department: "",
    service: "",
    message: "",
  };

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const departments = [
    "General Physician",
    "Cardiology",
    "Orthopedics",
    "Dermatology",
    "Pediatrics",
    "Gynecology",
  ];

  const servicesMapping = {
    "General Physician": [
      "General Consultation",
      "Adult Checkup",
      "Vaccination",
      "Health Screening",
    ],
    Cardiology: [
      "ECG",
      "Echocardiography",
      "Stress Test",
      "Heart Consultation",
    ],
    Orthopedics: ["Fracture Care", "Joint Pain Consultation", "Physiotherapy"],
    Dermatology: ["Skin Consultation", "Allergy Test", "Acne Treatment"],
    Pediatrics: ["Child Checkup", "Vaccination (Child)", "Growth Monitoring"],
    Gynecology: ["Antenatal Care", "Pap Smear", "Ultrasound"],
  };

  const genericServices = [
    "General Consultation",
    "ECG",
    "Blood Test",
    "X-Ray",
    "Ultrasound",
    "Physiotherapy",
    "Vaccination",
  ];

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(form.phone))
      e.phone = "Phone number must be exactly 10 digits";

    if (!form.department && !form.service) {
      e.department = "Please choose a department or service";
      e.service = "Please choose a department or service";
    }

    if (!form.message.trim()) e.message = "Please write a short message";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "department") {
      setForm((prev) => ({ ...prev, department: value, service: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: undefined }));

    if (name === "department" || name === "service") {
      setErrors((prev) => {
        const copy = { ...prev };
        if (
          (name === "department" && value) ||
          (name === "service" && value) ||
          form.department ||
          form.service
        ) {
          delete copy.department;
          delete copy.service;
        }
        return copy;
      });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const text = `*Contact Request*\nName: ${form.name}\nEmail: ${
      form.email
    }\nPhone: ${form.phone}\nDepartment: ${
      form.department || "N/A"
    }\nService: ${form.service || "N/A"}\nMessage: ${form.message}`;

    const url = `https://wa.me/8299431275?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");

    setForm(initial);
    setErrors({});
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  }

  const availableServices = form.department
    ? servicesMapping[form.department] || []
    : genericServices;
  return (
    <div className={a.pageContainer}>
      <div className={a.bgAccent1}></div>
      <div className={a.bgAccent2}></div>

      <div className={a.gridContainer}>
        <div className={a.formContainer}>
          <div className={a.formTitle}>Contact Our Clinic</div>
          <p className={a.formSubtitle}>Fill the form - we will open whatsApp so you can connect with us.</p>
          <form onSubmit={handleSubmit} className={a.formSpace}>
            <div className={a.formGrid}>
              <div>
                <label  className={a.label}>
                <User size={16} />Full Name</label>
                <input className={a.input} name="name" value={form.name} onChange={handleChange} placeholder="Full Name"  />
                {errors.name && (
                  <p className={a.error}>{errors.name}</p>
                )}
                </div>

                <div>
                <label className={a.label}>
                <Mail size={16} />Email</label>
                <input className={a.input} name="email" value={form.email} onChange={handleChange} placeholder="Email"  />
                {errors.email && (
                  <p className={a.error}>{errors.email}</p>
                )}
                </div>
            </div>

            
           
            <div className={a.formGrid}>
              <div>
                <label className={a.label}>
                  <Phone size={16} /> Phone
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="1234567890"
                  className={a.input}
                  maxLength="10"
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <p className={a.error}>{errors.phone}</p>
                )}
              </div>

              <div>
                <label className={a.label}>
                  <MapPin size={16} /> Department
                </label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className={a.input}
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className={a.error}>
                    {errors.department}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className={a.label}>
                <Stethoscope size={16}  />Service</label>
                <select name="service" value={form.service} onChange={handleChange} className={a.input}>
                  
                  <option value="">
                    Select service (or choose Department above)
                  </option>
                  {availableServices.map((s)=>(
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.service && (
                  <p className={a.error}>
                    {errors.service}
                  </p>)}
                </div>
                <div>
                  <label className={a.label}>
                    <MessageSquare size={16} />Message
                  </label>
                  <textarea name="message" value={form.message} onChange={handleChange} placeholder="Describe your concern briefly,,," rows={4} className={a.textarea} />
                  {errors.message && (
                  <p className={a.error}>
                    {errors.message}
                  </p>)}
                </div>

                <div className={a.buttonContainer}>
                  <button type="submit" className={a.button}>
                    <SendHorizonal size={18} />
                    <span>Send via WhatsApp</span>

                  </button>
                  {sent && (
                    <p className={a.sentMessage}>Opening WhatsApp and clearing form...</p>
                  )}

                </div>
          </form>
        </div>
        {/* right side */}
        <div className={a.infoContainer}>
          <div className={a.infoCard}>
            <h3 className={a.infoTitle}>Visit Our Clinic</h3>
            <p className={a.infoText}>Dhanmondi, Dhaka, Bangladesh</p>
            <p className={a.infoItem}>
              <Phone size={16} />123456789
            </p>
            <p className={a.infoItem}>
              <Mail size={16} />info@example.com
            </p>
          </div>
           <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.460792853461!2d80.98709187529213!3d26.870382662861033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be2ae3cea2421%3A0x6c0de12e8a77818f!2sGomti%20Nagar%2C%20Lucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1731769000000!5m2!1sen!2sin"
            className={a.map}
            title="Dhanmondi Map"
            loading="lazy"
            allowFullScreen
          ></iframe>
          <div className={a.hoursContainer}>
            <h4 className={a.hoursTitle}>Clinic Hours</h4>
            <p className={a.hoursText}>
              Mon - sat: 9:00 AM - 6:00 PM
            </p>
          </div>
        </div>
      </div>
      <style>{a.animationKeyframes}</style>
    </div>
  );
};

export default ContactPage;
