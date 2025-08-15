import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>💧 Purificadora de agua La Fuente 💧</h1>
      <p>Sistema de reportes y control</p>
      <Link to="/menu">
        <button style={{ padding: "10px 20px", fontSize: "1rem", backgroundColor: "#2d9cdb", color: "white", border: "none", borderRadius: "5px" }}>
          Puede usted entrar mi amo Rafael
        </button>
      </Link>
    </div>
  );
}