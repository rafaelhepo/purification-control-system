import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reporte() {
  const [cliente, setCliente] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [fecha, setFecha] = useState("");

  const generarPDF = async () => {
    try {
      const doc = new jsPDF();

      // Usar la ruta correcta (sin /public)
      const logo = await fetch("/lafuente.png");
      const logoBlob = await logo.blob();
      const reader = new FileReader();

      reader.onloadend = () => {
        const imgData = reader.result as string;

        // Obtener dimensiones de página y logo
        const pageWidth = doc.internal.pageSize.getWidth();
        const logoWidth = 40;
        const logoHeight = 20; // Ajusta para que no se vea aplastado
        const xPos = (pageWidth - logoWidth) / 2;

        // Agregar logo
        doc.addImage(imgData, "PNG", xPos, 10, logoWidth, logoHeight);

        // Título
        doc.setFontSize(18);
        doc.text(
          "Reporte de Purificadora La Fuente",
          pageWidth / 2,
          40,
          { align: "center" }
        );

        // Datos
        doc.setFontSize(12);
        doc.text(`Cliente: ${cliente}`, 10, 50);
        doc.text(`Fecha: ${fecha}`, 10, 57);

        // Tabla
        autoTable(doc, {
          startY: 65,
          head: [["Producto", "Cantidad (litros)"]],
          body: [["Agua Purificada", cantidad || "0"]],
          theme: "grid",
          headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          bodyStyles: { fillColor: [240, 240, 240] },
        });

        // Guardar PDF
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
      <h2>Generar Reporte</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "300px",
          margin: "0 auto",
        }}
      >
        <input
          type="text"
          placeholder="Cliente"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
        />
        <input
          type="number"
          placeholder="Cantidad (litros)"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
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
    </div>
  );
}
