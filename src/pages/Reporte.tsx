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

      // Agregar logo desde la carpeta public y centrarlo
      const logo = await fetch('/lafuente.png');
      const logoBlob = await logo.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const imgData = reader.result as string;
        const pageWidth = doc.internal.pageSize.getWidth();
        const imgProps: any = (doc as any).getImageProperties(imgData);
        const logoWidth = 40;
        const logoHeight = (imgProps.height * logoWidth) / imgProps.width;
        const xPos = (pageWidth - logoWidth) / 2; // Centrar horizontalmente
        doc.addImage(imgData, 'PNG', xPos, 10, logoWidth, logoHeight);

        // Continuar con título e información
        doc.setFontSize(18);
        doc.text("Reporte de Purificadora La Fuente", pageWidth / 2, 30 + logoHeight, { align: 'center' });

        doc.setFontSize(12);
        doc.text(`Cliente: ${cliente}`, 10, 40 + logoHeight);
        doc.text(`Fecha: ${fecha}`, 10, 47 + logoHeight);

        // Tabla con detalles
        autoTable(doc, {
          startY: 55 + logoHeight,
          head: [['Producto', 'Cantidad (litros)']],
          body: [['Agua Purificada', cantidad || '0']],
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          bodyStyles: { fillColor: [240, 240, 240] }
        });

        // Guardar PDF
        doc.save("reporte.pdf");
      };
      reader.readAsDataURL(logoBlob);

    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Ocurrió un error al generar el PDF. Revisa la consola para más detalles.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "30px" }}>
      <h2>Generar Reporte</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px", margin: "0 auto" }}>
        <input type="text" placeholder="Cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
        <input type="number" placeholder="Cantidad (litros)" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        <button onClick={generarPDF} style={{ padding: "10px", backgroundColor: "#27ae60", color: "white", border: "none", borderRadius: "5px" }}>
          Generar PDF
        </button>
      </div>
    </div>
  );
}