import DoctorDetail from "./pages/DoctorDetail";
import Doctors from "./pages/Doctors";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Service from "./pages/Service";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import DHome from "./pages/DHome";
import List from "./doctor/List";
import EditProfile from "./doctor/EditProfile";
import Appointment from "./pages/Appointment";
import { useEffect } from "react";
import VerifyPaymentPage from "../VerifyPaymentPage";

const ScrollToTop = () => {
  const {pathname} = useLocation();

  useEffect(()=>{
     window.scrollTo(0,0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  },[pathname]);
  return null;
};
// scroll button
const App = () => {
  //use

  return (
   <>
   <ScrollToTop />
    <div className="overflow-x-hidden bg-white text-gray-900">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorDetail />} />
        <Route path="/services" element={<Service />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/contact" element={<Contact />} />

        {/* doctor */}
        <Route path="/doctor-admin/login" element={<Login />} />
        <Route path="/doctor-admin/:id" element={<DHome />} />
        <Route path="/doctor-admin/:id/appointments" element={<List />} />
        <Route
          path="/doctor-admin/:id/profile/edit"
          element={<EditProfile />}
        />

        {/* for the payment verifications */}
         <Route
          path="/appointment/success"
          element={<VerifyPaymentPage />}
        />
        <Route
          path="/appointment/cancel"
          element={<VerifyPaymentPage />}
        />
      </Routes>
    </div>
    <ScrollButton />
   </>
  );
};

export default App;
