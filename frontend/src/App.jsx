import Doctors from "./pages/Doctors";
import Home from "./pages/Home"
import {Route, Routes} from "react-router-dom";
const App = () => {
  return (
    <div>
     <Routes>
      <Route path="/" element={<Home />} />
       <Route path="/doctors" element={<Doctors />} />
      </Routes>
      </div>
  )
}

export default App;