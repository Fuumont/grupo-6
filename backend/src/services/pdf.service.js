// services/pdf.service.js
import PDFDocument from "pdfkit-table";          // ← import directo de la clase extendida
import { AppDataSource } from "../config/configDb.js";
import MovimientoSchema from "../entity/movimiento.entity.js";

const movimientoRepo = AppDataSource.getRepository(MovimientoSchema);

export async function generarPDFMovimientosPorPeriodo(periodoId) {
  // Solo traer movimientos activos de ese periodo
  const movimientos = await movimientoRepo.find({
    where: { periodo: { id: periodoId }, activo: true },
    relations: ["usuario", "propuesta", "periodo"],
    order: { fecha: "ASC" },
  });

  if (movimientos.length === 0) return null;

  // Usamos directamente PDFDocument de 'pdfkit-table'
  const doc = new PDFDocument({ margin: 30, size: "A4" });
  const buffers = [];
  doc.on("data", buffers.push.bind(buffers));

  doc.fontSize(16).text("Reporte de Movimientos", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Periodo académico: ${movimientos[0].periodo.anio}`);
  doc.moveDown();

  // Filas con fecha en DD-MM-YYYY
  const rows = movimientos.map(m => {
    const d = new Date(m.fecha);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return [
      `${dd}-${mm}-${yyyy}`,
      m.tipo,
      `$${m.monto.toLocaleString("es-CL")}`,
      m.descripcion,
      m.usuario?.nombreCompleto || "Usuario eliminado",
    ];
  });

  await doc.table(
    {
      headers: ["Fecha", "Tipo", "Monto", "Descripción", "Responsable"],
      rows,
    },
    { width: 500 }
  );

  doc.end();

  return new Promise(resolve =>
    doc.on("end", () => resolve(Buffer.concat(buffers)))
  );
}
