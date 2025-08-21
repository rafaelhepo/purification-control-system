import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import RDODP from "./pages/RDOP";
import RDEDE from "./pages/RDEDE";
import RDLYDDA from "./pages/RDLYDDA";
import RPLYDDE from "./pages/RPLYDDE";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/registro-de-ordenes-de-produccion" element={<RDODP />} />
        <Route path="/registro-de-evaluacion-de-envases" element={<RDEDE />} />
        <Route path="/registro-para-la-limpieza-y-desinfeccion-de-areas" element={<RDLYDDA />} />
        <Route path="/registro-para-la-limpieza-y-desinfeccion-de-equipos" element={<RPLYDDE />} />
      </Routes>
    </Router>
  );
}