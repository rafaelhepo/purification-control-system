import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Registro = {
  fecha: string;
  equipos: {
    tinaco1: boolean;
    tinaco2: boolean;
    tinaco3: boolean;
    tinaco4: boolean;
    tinaco5: boolean;
    filtro1: boolean;
    filtro2: boolean;
    filtroPulidor: boolean;
    lamparaUV1: boolean;
    lamparaUV2: boolean;
    boquillasGrifo: boolean;
  };
  reviso: string;
  observaciones: string;
};

export default function RPLYDDE() {
  const [registros, setRegistros] = useState<Registro[]>([
    {
      fecha: "",
      equipos: {
        tinaco1: false,
        tinaco2: false,
        tinaco3: false,
        tinaco4: false,
        tinaco5: false,
        filtro1: false,
        filtro2: false,
        filtroPulidor: false,
        lamparaUV1: false,
        lamparaUV2: false,
        boquillasGrifo: false,
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
          equipos: {
            tinaco1: false,
            tinaco2: false,
            tinaco3: false,
            tinaco4: false,
            tinaco5: false,
            filtro1: false,
            filtro2: false,
            filtroPulidor: false,
            lamparaUV1: false,
            lamparaUV2: false,
            boquillasGrifo: false,
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
    equipo: keyof Registro["equipos"],
    checked: boolean
  ) => {
    const nuevosRegistros = [...registros];
    nuevosRegistros[index].equipos[equipo] = checked;
    setRegistros(nuevosRegistros);
  };

  // Generar PDF en formato horizontal
  const generarPDF = async () => {
    try {
      
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      
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
        doc.text("Registro para la Limpieza y Desinfección de Equipos", pageWidth / 2, 40, {
          align: "center",
        });

        // Tabla
        autoTable(doc, {
          startY: 50,
          head: [
            [
              "Fecha",
              "Tinaco 1",
              "Tinaco 2",
              "Tinaco 3",
              "Tinaco 4",
              "Tinaco 5",
              "Filtro No.1",
              "Filtro No.2",
              "Filtro Pulidor",
              "Lampara U.V. 1",
              "Lampara U.V. 2",
              "Boquillas grifos",
              "Revisó",
              "Observaciones",
            ],
          ],
          body: registros.map((r) => [
            r.fecha,
            r.equipos.tinaco1 ? "SÍ" : "",
            r.equipos.tinaco2 ? "SÍ" : "",
            r.equipos.tinaco3 ? "SÍ" : "",
            r.equipos.tinaco4 ? "SÍ" : "",
            r.equipos.tinaco5 ? "SÍ" : "",
            r.equipos.filtro1 ? "SÍ" : "",
            r.equipos.filtro2 ? "SÍ" : "",
            r.equipos.filtroPulidor ? "SÍ" : "",
            r.equipos.lamparaUV1 ? "SÍ" : "",
            r.equipos.lamparaUV2 ? "SÍ" : "",
            r.equipos.boquillasGrifo ? "SÍ" : "",
            r.reviso,
            r.observaciones,
          ]),
          theme: "grid",
          headStyles: { fillColor: [52, 152, 219], textColor: 255 }, // Azul agua
          bodyStyles: { fillColor: [245, 251, 255] }, // Azul muy claro
          styles: { fontSize: 9 }, // 👈 Ajusto el tamaño de letra para que quepa mejor
        });

        doc.save("reporte.pdf"); //NOmbre del archivo del pdf
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
        Registro para la Limpieza y Desinfección de Equipos
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
                checked={registro.equipos.tinaco1}
                onChange={(e) =>
                  handleCheckboxChange(index, "tinaco1", e.target.checked)
                }
              />{" "}
              Tinaco 1
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={registro.equipos.tinaco2}
                onChange={(e) =>
                  handleCheckboxChange(index, "tinaco2", e.target.checked)
                }
              />{" "}
              Tinaco 2
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={registro.equipos.tinaco3}
                onChange={(e) =>
                  handleCheckboxChange(index, "tinaco3", e.target.checked)
                }
              />{" "}
              Tinaco 3
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={registro.equipos.tinaco4}
                onChange={(e) =>
                  handleCheckboxChange(index, "tinaco4", e.target.checked)
                }
              />{" "}
              Tinaco 4
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={registro.equipos.tinaco5}
                onChange={(e) =>
                  handleCheckboxChange(index, "tinaco5", e.target.checked)
                }
              />{" "}
              Tinaco 5
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={registro.equipos.filtro1}
                onChange={(e) =>
                  handleCheckboxChange(index, "filtro1", e.target.checked)
                }
              />{" "}
              Filtro No. 1
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={registro.equipos.filtro2}
                onChange={(e) =>
                  handleCheckboxChange(index, "filtro2", e.target.checked)
                }
              />{" "}
              Filtro No. 2
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={registro.equipos.filtroPulidor}
                onChange={(e) =>
                  handleCheckboxChange(index, "filtroPulidor", e.target.checked)
                }
              />{" "}
              Filtro Pulidor
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={registro.equipos.lamparaUV1}
                onChange={(e) =>
                  handleCheckboxChange(index, "lamparaUV1", e.target.checked)
                }
              />{" "}
              Lampara U.V. 1
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={registro.equipos.lamparaUV2}
                onChange={(e) =>
                  handleCheckboxChange(index, "lamparaUV2", e.target.checked)
                }
              />{" "}
              Lampara U.V. 2
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={registro.equipos.boquillasGrifo}
                onChange={(e) =>
                  handleCheckboxChange(index, "boquillasGrifo", e.target.checked)
                }
              />{" "}
              Boquillas Grifo
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
