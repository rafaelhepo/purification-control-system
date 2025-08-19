import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Registro = {
  fecha: string;
  cantidad: string;
  lote: string;
  realizo: string;
  observaciones: string;
};

export default function RDODP() {
  const [registros, setRegistros] = useState<Registro[]>([
    { fecha: "", cantidad: "", lote: "", realizo: "", observaciones: "" },
  ]);

  // Agregar un nuevo día (máx 20)
  const agregarDia = () => {
    if (registros.length < 20) {
      setRegistros([
        ...registros,
        { fecha: "", cantidad: "", lote: "", realizo: "", observaciones: "" },
      ]);
    } else {
      alert("Solo se pueden registrar hasta 20 días.");
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
          "Registro de Órdenes de Producción",
          pageWidth / 2,
          40,
          { align: "center" }
        );

        // Tabla con todos los registros
        autoTable(doc, {
          startY: 50,
          head: [["Fecha", "Cantidad", "Lote", "Realizó", "Observaciones"]],
          body: registros.map((r) => [
            r.fecha,
            r.cantidad,
            r.lote,
            r.realizo,
            r.observaciones,
          ]),
          theme: "grid",
          headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          bodyStyles: { fillColor: [240, 240, 240] },
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
    <div style={{ textAlign: "center", padding: "30px" }}>
      <h2>Registro de Órdenes de Producción</h2>
      {registros.map((registro, index) => (
        <div
          key={index}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 2fr",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <input
            type="date"
            value={registro.fecha}
            onChange={(e) => handleChange(index, "fecha", e.target.value)}
            style={{ height: "20px" }}
          />
          <input
            type="number"
            placeholder="Cantidad"
            value={registro.cantidad}
            onChange={(e) => handleChange(index, "cantidad", e.target.value)}
            style={{ height: "20px" }}
          />
          <input
            type="number"
            placeholder="Lote"
            value={registro.lote}
            onChange={(e) => handleChange(index, "lote", e.target.value)}
            style={{ height: "20px" }}
          />
          <input
            type="text"
            placeholder="Realizó"
            value={registro.realizo}
            onChange={(e) => handleChange(index, "realizo", e.target.value)}
            style={{ height: "20px" }}
          />
          <input
            type="text"
            placeholder="Observaciones"
            value={registro.observaciones}
            onChange={(e) =>
              handleChange(index, "observaciones", e.target.value)
            }
            style={{ height: "20px" }}
          />
        </div>
      ))}

      <button
        onClick={agregarDia}
        style={{
          padding: "10px",
          backgroundColor: "#2980b9",
          color: "white",
          border: "none",
          borderRadius: "5px",
          marginRight: "10px",
        }}
      >
        Agregar Día
      </button>

      <button
        onClick={generarPDF}
        style={{
          padding: "10px",
          backgroundColor: "#27ae60",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Generar PDF
      </button>
    </div>
  );
}
