import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import RDODP from "./pages/RDOP";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/registro-de-ordenes-de-produccion" element={<RDODP />} />
      </Routes>
    </Router>
  );
}