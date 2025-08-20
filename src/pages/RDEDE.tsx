import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Registro = {
  fecha: string;
  recibidos: string;
  aceptados: string;
  rechazados: string;
  realizo: string;
  observaciones: string;
};

export default function RDEDE() {
  const [registros, setRegistros] = useState<Registro[]>([
    { fecha: "", recibidos: "", aceptados: "", rechazados: "", realizo: "", observaciones: "" },
  ]);

  // Agregar un nuevo día (máx 12)
  const agregarDia = () => {
    if (registros.length < 12) {
      setRegistros([
        ...registros,
        { fecha: "", recibidos: "", aceptados: "", rechazados: "", realizo: "", observaciones: "" },
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
          "Registro de Evaluación de Envases",
          pageWidth / 2,
          40,
          { align: "center" }
        );

        // Tabla con todos los registros
        autoTable(doc, {
          startY: 50,
          head: [["Fecha", "Recibidos", "Aceptados", "Rechazados", "Realizó", "Observaciones"]],
          body: registros.map((r) => [
            r.fecha,
            r.recibidos,
            r.aceptados,
            r.rechazados,
            r.realizo,
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
        Registro de Evaluación de Envases
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
            placeholder="Recibidos"
            value={registro.recibidos}
            onChange={(e) => handleChange(index, "recibidos", e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              outline: "none",
            }}
          />
          <input
            type="number"
            placeholder="Aceptados"
            value={registro.aceptados}
            onChange={(e) => handleChange(index, "aceptados", e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              outline: "none",
            }}
          />
          <input
            type="number"
            placeholder="Rechazados"
            value={registro.rechazados}
            onChange={(e) => handleChange(index, "rechazados", e.target.value)}
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
            value={registro.realizo}
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
