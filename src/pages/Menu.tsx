import { Link, useLocation } from "react-router-dom";

export default function Menu() {
  
  console.log('carga menu con exito');
  const location = useLocation();
  const nombre = (location.state as { nombre?: string })?.nombre || "";

  return (
    <div style={{ textAlign: "center", padding: "30px" }}>
      <h2>Formatos Salubridad</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "300px",
          margin: "0 auto",
        }}
      >
        <Link to="/registro-de-ordenes-de-produccion" state={{ nombre }}>
          <button
            style={{
              padding: "10px",
              fontSize: "1rem",
              backgroundColor: "#56ccf2",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            📄 Registro de Ordenes de Producción
          </button>
        </Link>

        <Link to="/registro-de-evaluacion-de-envases" state={{ nombre }}>
          <button
            style={{
              padding: "10px",
              fontSize: "1rem",
              backgroundColor: "#56ccf2",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            📄 Registro de Evaluación de Envases
          </button>
        </Link>

        <Link to="/registro-para-la-limpieza-y-desinfeccion-de-areas" state={{ nombre }}>
          <button
            style={{
              padding: "10px",
              fontSize: "1rem",
              backgroundColor: "#56ccf2",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            📄 Registro para Limpieza y Desinfección de Áreas
          </button>
        </Link>

        <Link to="/registro-para-la-limpieza-y-desinfeccion-de-equipos" state={{ nombre }}>
          <button
            style={{
              padding: "10px",
              fontSize: "1rem",
              backgroundColor: "#56ccf2",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            📄 Registro para Limpieza y Desinfección de Equipos
          </button>
        </Link>

        <Link to="/registro-de-analisis-periodico-del-agua" state={{ nombre }}>
          <button
            style={{
              padding: "10px",
              fontSize: "1rem",
              backgroundColor: "#56ccf2",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            📄 Registro de Análisis Periódico del Agua
          </button>
        </Link>

        <Link to="/registro-para-la-limpieza-y-desinfeccion-de-vehiculos" state={{ nombre }}>
          <button
            style={{
              padding: "10px",
              fontSize: "1rem",
              backgroundColor: "#56ccf2",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            📄 Registro para la Limpieza de Vehículos
          </button>
        </Link>

        <Link to="/registro-de-primeras-entradas-primeras-salidas" state={{ nombre }}>
          <button
            style={{
              padding: "10px",
              fontSize: "1rem",
              backgroundColor: "#56ccf2",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            📄 Registro de Primeras Entradas Primeras Salidas
          </button>
        </Link>

        <Link to="/registro-de-salidas-y-destino-por-lote" state={{ nombre }}>
          <button
            style={{
              padding: "10px",
              fontSize: "1rem",
              backgroundColor: "#56ccf2",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            📄 Registro de Salidas y Destino por Lote
          </button>
        </Link>

        <Link to="/registro-de-mantenimiento-de-equipo" state={{ nombre }}>
          <button
            style={{
              padding: "10px",
              fontSize: "1rem",
              backgroundColor: "#56ccf2",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            📄 Registro de Mantenimiento de Equipo
          </button>
        </Link>

        <Link to="/metodo-de-desinfeccion" state={{ nombre }}>
          <button
            style={{
              padding: "10px",
              fontSize: "1rem",
              backgroundColor: "#56ccf2",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            📄 Metodo De Desinfección
          </button>
        </Link>
      </div>
    </div>
  );
}
