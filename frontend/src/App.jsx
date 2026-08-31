import DoctorDetail from "./pages/DoctorDetail";
import Doctors from "./pages/Doctors";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Service from "./pages/Service";
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorDetail />} />
        <Route path="/services" element={<Service />} />

      </Routes>
    </div>
  );
};

export default App;
