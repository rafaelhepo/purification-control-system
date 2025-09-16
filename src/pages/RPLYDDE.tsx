import { useState } from "react";
import { useLocation } from "react-router-dom";
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
  // 👇 Recuperamos el nombre desde Home
  const location = useLocation();
  const nombreUsuario = (location.state as { nombre?: string })?.nombre || "";

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
      reviso: nombreUsuario, // 👈 ya queda fijo con el usuario
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
          reviso: nombreUsuario, // 👈 también aquí
          observaciones: "",
        },
      ]);
    } else {
      alert("Solo se pueden registrar hasta 12 días. (2 semanas)");
    }
  };

  // Manejar cambios en inputs normales (solo observaciones)
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
        doc.text(
          "Registro para la Limpieza y Desinfección de Equipos",
          pageWidth / 2,
          40,
          { align: "center" }
        );

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
              "Lámpara U.V. 1",
              "Lámpara U.V. 2",
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
            nombreUsuario, // 👈 siempre el usuario en el PDF
            r.observaciones,
          ]),
          theme: "grid",
          headStyles: { fillColor: [52, 152, 219], textColor: 255 },
          bodyStyles: { fillColor: [245, 251, 255] },
          styles: { fontSize: 9 },
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

          {/* Checkboxes de equipos */}
          <div style={{ textAlign: "left" }}>
            {Object.entries(registro.equipos).map(([equipo, valor]) => (
              <label key={equipo}>
                <input
                  type="checkbox"
                  checked={valor}
                  onChange={(e) =>
                    handleCheckboxChange(
                      index,
                      equipo as keyof Registro["equipos"],
                      e.target.checked
                    )
                  }
                />{" "}
                {equipo.charAt(0).toUpperCase() + equipo.slice(1)}
                <br />
              </label>
            ))}
          </div>

          <input
            type="text"
            placeholder="Revisó"
            value={nombreUsuario} // 👈 siempre el usuario logueado
            readOnly
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              backgroundColor: "#2d3436",
              color: "#dfe6e9",
              fontWeight: "bold",
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
