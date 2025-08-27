import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useLocation } from "react-router-dom";

type Registro = {
  fecha: string;
  aguaEntrada: string;
  filtro1: string;
  filtro2: string;
  aguaGrifo: string;
  realizo: string;
  observaciones: string;
};

export default function RDAPDA() {

  const location = useLocation();
  const nombreUsuario = (location.state as { nombre?: string }) ?.nombre || "";

  const [registros, setRegistros] = useState<Registro[]>([
    { fecha: "", aguaEntrada: "", filtro1: "0.3", filtro2: "", aguaGrifo: "", realizo: "", observaciones: "" },
  ]);

  // Agregar un nuevo día (máx 12)
  const agregarDia = () => {
    if (registros.length < 12) {
      setRegistros([
        ...registros,
        { fecha: "", aguaEntrada: "", filtro1: "", filtro2: "", aguaGrifo: "", realizo: nombreUsuario, observaciones: "" },
      ]);
    } else {
      alert("Solo se pueden registrar hasta 12 días. (2 semanas)");
    }
  };

  // Manejar cambios en los inputs
  const handleChange = (index: number, field: keyof Registro, value: string) => {
    const nuevosRegistros = [...registros];
    nuevosRegistros[index][field] = value;
    setRegistros(nuevosRegistros);
  };

  // Generar PDF
  const generarPDF = async () => {
    try {
      const doc = new jsPDF();

      // Usar la ruta correcta (sin /public)
      const logo = await fetch("/lafuente.png");
      const logoBlob = await logo.blob();
      const reader = new FileReader();

      reader.onloadend = () => {
        const imgData = reader.result as string;

        // Dimensiones de página y logo
        const pageWidth = doc.internal.pageSize.getWidth();
        const logoWidth = 25;
        const logoHeight = 25;
        const xPos = (pageWidth - logoWidth) / 2;

        // Logo
        doc.addImage(imgData, "PNG", xPos, 10, logoWidth, logoHeight);

        // Título
        doc.setFontSize(16);
        doc.text(
          "Registro de Analisis Periodico del Agua (determinación de cloro residual)",
          pageWidth / 2,
          40,
          { align: "center" }
        );

        // Tabla con todos los registros
        autoTable(doc, {
          startY: 50,
          head: [["Fecha", "Agua de entrada (lectura ppm) Red", "Filtro 1 (lectura ppm) Lecho profundo", "Filtro 2 (lectura ppm) Carbon activado", "Agua de Grifo", "Realizó", "Observaciones"]],
          body: registros.map((r) => [
            r.fecha,
            r.aguaEntrada,
            r.filtro1,
            r.filtro2,
            r.aguaGrifo,
            nombreUsuario,
            r.observaciones,
          ]),
          theme: "grid",
          headStyles: { fillColor: [52, 152, 219], textColor: 255 }, // Azul agua
          bodyStyles: { fillColor: [245, 251, 255] }, // Azul muy claro
        });

        doc.save("reporte.pdf");
      };

      reader.readAsDataURL(logoBlob);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Ocurrió un error al generar el PDF.");
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#eef2f6",
        minHeight: "100vh",
      }}
    >
       <img
    src="/lafuente.png" 
    alt="Logo Purificadora"
    style={{
      maxWidth: "120px", // tamaño máximo
      height: "auto",    // mantiene proporción
      marginBottom: "15px",
    }}
  />

      <h2 style={{ color: "#1c3853", marginBottom: "20px" }}>
        Registro de Analisis Periodico del Agua
      </h2>

      {registros.map((registro, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "15px",
            marginBottom: "20px",
            backgroundColor: "#656fdd",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            maxWidth: "400px",
            margin: "0 auto",
          }}
        >
          <input
            type="date"
            value={registro.fecha}
            onChange={(e) => handleChange(index, "fecha", e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              outline: "none",
            }}
          />

          <input
            type="number"
            placeholder="Agua de entrada de la red"
            value={registro.aguaEntrada}
            onChange={(e) => handleChange(index, "aguaEntrada", e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              outline: "none",
            }}
          />

          <input
            type="number"
            placeholder=""
            value={registro.filtro1}
            onChange={(e) => handleChange(index, "filtro1", e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              outline: "none",
            }}
          />

          <input
            type="number"
            placeholder="Filtro No. 2 Lecho - Carbon Activado"
            value={registro.filtro2}
            onChange={(e) => handleChange(index, "filtro2", e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              outline: "none",
            }}
          />

          <input
            type="number"
            placeholder="Agua de grifo"
            value={registro.aguaGrifo}
            onChange={(e) => handleChange(index, "aguaGrifo", e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              outline: "none",
            }}
          />

          <input
            type="text"
            placeholder="Realizó"
            value={nombreUsuario}
            onChange={(e) => handleChange(index, "realizo", e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              outline: "none",
            }}
          />

          <input
            type="text"
            placeholder="Observaciones"
            value={registro.observaciones}
            onChange={(e) =>
              handleChange(index, "observaciones", e.target.value)
            }
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              outline: "none",
            }}
          />

        </div>
      ))}

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={agregarDia}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "8px",
            marginRight: "10px",
            cursor: "pointer",
          }}
        >
          Agregar Día
        </button>

        <button
          onClick={generarPDF}
          style={{
            padding: "10px 20px",
            backgroundColor: "#27ae60",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Generar PDF
        </button>
      </div>
    </div>
  );
}
