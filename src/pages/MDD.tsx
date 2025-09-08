import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useLocation } from "react-router-dom";

type Metodo = {
  fecha: string;
  tinacos: string;
  desinfectante: string;
  cantidad: string;
  hora: {
    de: string;
    a: string;
  };
  realizo: string;
  observaciones: string;
};

export default function MDD() {
  const location = useLocation();
  const nombreUsuario = (location.state as { nombre?: string })?.nombre || "";

  const [metodos, setMetodos] = useState<Metodo[]>([
    {
      fecha: "",
      tinacos: "",
      desinfectante: "6%",
      cantidad: "55 ml",
      hora: { de: "", a: "" },
      realizo: nombreUsuario,
      observaciones: "",
    },
  ]);

  // Agregar un nuevo día (máx 12)
  const agregarDia = () => {
    if (metodos.length < 12) {
      setMetodos([
        ...metodos,
        {
          fecha: "",
          tinacos: "",
          desinfectante: "6%",
          cantidad: "55 ml",
          hora: { de: "", a: "" },
          realizo: nombreUsuario,
          observaciones: "",
        },
      ]);
    } else {
      alert("Solo se pueden registrar hasta 12 días. (2 semanas)");
    }
  };

  // Manejar cambios en campos simples
  const handleChange = (
    index: number,
    field: keyof Omit<Metodo, "hora">,
    value: string
  ) => {
    const nuevosMetodos = [...metodos];
    nuevosMetodos[index][field] = value;
    setMetodos(nuevosMetodos);
  };

  // Manejar cambios en campos de hora (de / a)
  const handleHoraChange = (
    index: number,
    tipo: "de" | "a",
    value: string
  ) => {
    const nuevosMetodos = [...metodos];
    nuevosMetodos[index].hora[tipo] = value;
    setMetodos(nuevosMetodos);
  };

  // Generar PDF
  const generarPDF = async () => {
    try {
      const doc = new jsPDF();

      const logo = await fetch("/lafuente.png");
      const logoBlob = await logo.blob();
      const reader = new FileReader();

      reader.onloadend = () => {
        const imgData = reader.result as string;

        const pageWidth = doc.internal.pageSize.getWidth();
        const logoWidth = 25;
        const logoHeight = 25;
        const xPos = (pageWidth - logoWidth) / 2;

        doc.addImage(imgData, "PNG", xPos, 10, logoWidth, logoHeight);

        doc.setFontSize(16);
        doc.text("Metodo De Desinfección", pageWidth / 2, 40, {
          align: "center",
        });

        autoTable(doc, {
          startY: 50,
          head: [
            [
              "Fecha",
              "Tinacos",
              "Desinfectante Hipoclorito",
              "Cantidad",
              "Hora (de - a)",
              "Realizó",
              "Observaciones",
            ],
          ],
          body: metodos.map((r) => [
            r.fecha,
            r.tinacos,
            r.desinfectante,
            r.cantidad,
            `${r.hora.de} - ${r.hora.a}`,
            r.realizo,
            r.observaciones,
          ]),
          theme: "grid",
          headStyles: { fillColor: [52, 152, 219], textColor: 255 },
          bodyStyles: { fillColor: [245, 251, 255] },
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
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <img
          src="/lafuente.png"
          alt="Logo Purificadora"
          className="mx-auto mb-6 max-w-[120px]"
        />

        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Método De Desinfección
        </h2>

        {metodos.map((registro, index) => (
          <div
            key={index}
            className="bg-indigo-600 p-5 rounded-xl shadow-md mb-6 space-y-4"
          >
            {/* Fecha */}
            <input
              type="date"
              value={registro.fecha}
              onChange={(e) => handleChange(index, "fecha", e.target.value)}
              className="w-full p-3 rounded-lg border border-blue-600 outline-none bg-white"
            />

            {/* Tinacos */}
            <input
              type="text"
              placeholder="Tinacos (1,2,3...)"
              value={registro.tinacos}
              onChange={(e) => handleChange(index, "tinacos", e.target.value)}
              className="w-full p-3 rounded-lg border border-blue-600 outline-none bg-white"
            />

            {/* Desinfectante */}
            <input
              type="text"
              placeholder="Desinfectante (ej. 6%)"
              value={registro.desinfectante}
              onChange={(e) =>
                handleChange(index, "desinfectante", e.target.value)
              }
              className="w-full p-3 rounded-lg border border-blue-600 outline-none bg-white"
            />

            {/* Cantidad */}
            <input
              type="text"
              placeholder="Cantidad (ej. 55 ml)"
              value={registro.cantidad}
              onChange={(e) => handleChange(index, "cantidad", e.target.value)}
              className="w-full p-3 rounded-lg border border-blue-600 outline-none bg-white"
            />

            {/* HORA: DESDE Y HASTA — ¡SIN DESBORDAMIENTO! */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <div className="flex-1 min-w-[120px]">
                <label className="block text-white font-bold text-xs mb-1">
                  Desde:
                </label>
                <input
                  type="time"
                  value={registro.hora.de}
                  onChange={(e) =>
                    handleHoraChange(index, "de", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded border border-blue-600 outline-none bg-white text-sm"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block text-white font-bold text-xs mb-1">
                  Hasta:
                </label>
                <input
                  type="time"
                  value={registro.hora.a}
                  onChange={(e) =>
                    handleHoraChange(index, "a", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded border border-blue-600 outline-none bg-white text-sm"
                />
              </div>
            </div>

            {/* Realizó */}
            <input
              type="text"
              placeholder="Realizó"
              value={registro.realizo}
              readOnly
              className="w-full p-3 rounded-lg border border-blue-600 outline-none bg-gray-100 text-gray-700 font-medium"
            />

            {/* Observaciones */}
            <input
              type="text"
              placeholder="Observaciones"
              value={registro.observaciones}
              onChange={(e) =>
                handleChange(index, "observaciones", e.target.value)
              }
              className="w-full p-3 rounded-lg border border-blue-600 outline-none bg-white"
            />
          </div>
        ))}

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <button
            onClick={agregarDia}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
          >
            Agregar Día
          </button>

          <button
            onClick={generarPDF}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
          >
            Generar PDF
          </button>
        </div>
      </div>
    </div>
  );
}