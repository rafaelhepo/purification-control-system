import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Registro = {
  fecha: string;
  areas: {
    lavado: boolean;
    llenado: boolean;
    equipos: boolean;
    almacen: boolean;
    patio: boolean;
    tanques: boolean;
    oficina: boolean;
    sanitarios: boolean;
  };
  reviso: string;
  observaciones: string;
};

export default function RDLYDDA() {
  const [registros, setRegistros] = useState<Registro[]>([
    {
      fecha: "",
      areas: {
        lavado: false,
        llenado: false,
        equipos: false,
        almacen: false,
        patio: false,
        tanques: false,
        oficina: false,
        sanitarios: false,
      },
      reviso: "",
      observaciones: "",
    },
  ]);

  // Agregar un nuevo día (máx 12)
  const agregarDia = () => {
    if (registros.length < 12) {
      setRegistros([
        ...registros,
        {
          fecha: "",
          areas: {
            lavado: false,
            llenado: false,
            equipos: false,
            almacen: false,
            patio: false,
            tanques: false,
            oficina: false,
            sanitarios: false,
          },
          reviso: "",
          observaciones: "",
        },
      ]);
    } else {
      alert("Solo se pueden registrar hasta 12 días. (2 semanas)");
    }
  };

  // Manejar cambios en inputs normales
  const handleChange = (index: number, field: keyof Registro, value: string) => {
    const nuevosRegistros = [...registros];
    (nuevosRegistros[index][field] as string) = value;
    setRegistros(nuevosRegistros);
  };

  // Manejar cambios en checkboxes
  const handleCheckboxChange = (
    index: number,
    area: keyof Registro["areas"],
    checked: boolean
  ) => {
    const nuevosRegistros = [...registros];
    nuevosRegistros[index].areas[area] = checked;
    setRegistros(nuevosRegistros);
  };

  // Generar PDF en formato horizontal
  const generarPDF = async () => {
    try {
      // 👇 aquí está el cambio (landscape)
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Logo
      const logo = await fetch("/lafuente.png");
      const logoBlob = await logo.blob();
      const reader = new FileReader();

      reader.onloadend = () => {
        const imgData = reader.result as string;

        // Dimensiones
        const pageWidth = doc.internal.pageSize.getWidth();
        const logoWidth = 25;
        const logoHeight = 25;
        const xPos = (pageWidth - logoWidth) / 2;

        // Logo
        doc.addImage(imgData, "PNG", xPos, 10, logoWidth, logoHeight);

        // Título
        doc.setFontSize(16);
        doc.text("Registro para la Limpieza y Desinfección de Áreas", pageWidth / 2, 40, {
          align: "center",
        });

        // Crear tabla
        autoTable(doc, {
          startY: 50,
          head: [
            [
              "Fecha",
              "Lavado",
              "Llenado",
              "Equipos",
              "Almacén",
              "Patio",
              "Tanques",
              "Oficina",
              "Sanitarios",
              "Revisó",
              "Observaciones",
            ],
          ],
          body: registros.map((r) => [
            r.fecha,
            r.areas.lavado ? "SÍ" : "",
      r.areas.llenado ? "SÍ" : "",
      r.areas.equipos ? "SÍ" : "",
      r.areas.almacen ? "SÍ" : "",
      r.areas.patio ? "SÍ" : "",
      r.areas.tanques ? "SÍ" : "",
      r.areas.oficina ? "SÍ" : "",
      r.areas.sanitarios ? "SÍ" : "",
            r.reviso,
            r.observaciones,
          ]),
          theme: "grid",
          headStyles: { fillColor: [52, 152, 219], textColor: 255 }, // Azul agua
          bodyStyles: { fillColor: [245, 251, 255] }, // Azul muy claro
          styles: { fontSize: 9 }, // 👈 Ajusto el tamaño de letra para que quepa mejor
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
          maxWidth: "120px",
          height: "auto",
          marginBottom: "15px",
        }}
      />

      <h2 style={{ color: "#1c3853", marginBottom: "20px" }}>
        Registro de Evaluación de Áreas
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
            backgroundColor: "#73b2e9",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            maxWidth: "500px",
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

          {/* Checkboxes de áreas */}
          <div style={{ textAlign: "left" }}>
            <label>
              <input
                type="checkbox"
                checked={registro.areas.lavado}
                onChange={(e) =>
                  handleCheckboxChange(index, "lavado", e.target.checked)
                }
              />{" "}
              Lavado
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={registro.areas.llenado}
                onChange={(e) =>
                  handleCheckboxChange(index, "llenado", e.target.checked)
                }
              />{" "}
              Llenado
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={registro.areas.equipos}
                onChange={(e) =>
                  handleCheckboxChange(index, "equipos", e.target.checked)
                }
              />{" "}
              Equipos
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={registro.areas.almacen}
                onChange={(e) =>
                  handleCheckboxChange(index, "almacen", e.target.checked)
                }
              />{" "}
              Almacén
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={registro.areas.patio}
                onChange={(e) =>
                  handleCheckboxChange(index, "patio", e.target.checked)
                }
              />{" "}
              Patio
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={registro.areas.tanques}
                onChange={(e) =>
                  handleCheckboxChange(index, "tanques", e.target.checked)
                }
              />{" "}
              Tanques
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={registro.areas.oficina}
                onChange={(e) =>
                  handleCheckboxChange(index, "oficina", e.target.checked)
                }
              />{" "}
              Oficina
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={registro.areas.sanitarios}
                onChange={(e) =>
                  handleCheckboxChange(index, "sanitarios", e.target.checked)
                }
              />{" "}
              Sanitarios
            </label>
          </div>

          <input
            type="text"
            placeholder="Revisó"
            value={registro.reviso}
            onChange={(e) => handleChange(index, "reviso", e.target.value)}
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
