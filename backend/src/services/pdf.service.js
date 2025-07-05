import PDFDocument from "pdfkit-table";
import { AppDataSource } from "../config/configDb.js";
import MovimientoSchema from "../entity/movimiento.entity.js";

const movimientoRepo = AppDataSource.getRepository(MovimientoSchema);

export async function generarPDFMovimientosPorPeriodo(periodoId) {
  const movimientos = await movimientoRepo.find({
    where: { periodo: { id: periodoId } },
    relations: ["usuario", "propuesta", "periodo"],
    order: { fecha: "ASC" },
  });

  if (movimientos.length === 0) return null;

  const doc = new PDFDocument({ margin: 30, size: "A4" });

  const buffers = [];
  doc.on("data", buffers.push.bind(buffers));

  doc.fontSize(16).text("Reporte de Movimientos", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Periodo académico: ${movimientos[0].periodo.anio}`);
  doc.moveDown();

  const rows = movimientos.map((m) => [
    new Date(m.fecha).toISOString().split("T")[0],
    m.tipo,
    `$${m.monto.toLocaleString("es-CL")}`,
    m.descripcion,
    m.usuario?.nombreCompleto || "Usuario eliminado",
  ]);

  await doc.table(
    {
      headers: ["Fecha", "Tipo", "Monto", "Descripción", "Responsable"],
      rows,
    },
    { width: 500 }
  );

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
  });
}
