import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import RDODP from "./pages/RDOP";
import RDEDE from "./pages/RDEDE";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/registro-de-ordenes-de-produccion" element={<RDODP />} />
        <Route path="/registro-de-evaluacion-de-envases" element={<RDEDE />} />
      </Routes>
    </Router>
  );
}