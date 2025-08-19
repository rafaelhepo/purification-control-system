import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <div style={{ textAlign: "center", padding: "30px" }}>
      <h2>Menú Principal</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px", margin: "0 auto" }}>
        
        <Link to="/registro-de-ordenes-de-produccion">
          <button style={{ padding: "10px", fontSize: "1rem", backgroundColor: "#56ccf2", color: "white", border: "none", borderRadius: "5px" }}>📄 Formatos Salubridad</button>
        </Link>




        {/* <button style={{ padding: "10px", fontSize: "1rem", backgroundColor: "#56ccf2", color: "white", border: "none", borderRadius: "5px" }}>📚 Historial</button>
        <button style={{ padding: "10px", fontSize: "1rem", backgroundColor: "#56ccf2", color: "white", border: "none", borderRadius: "5px" }}>⚙️ Configuración</button> */}
      </div>
    </div>
  );
}