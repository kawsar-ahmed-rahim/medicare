import { Route, Routes } from "react-router-dom";
import Hero from "./pages/Hero";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Hero />}></Route>
    </Routes>
  );
};

export default App;
