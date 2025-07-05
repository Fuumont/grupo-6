import { generarPDFMovimientosPorPeriodo } from "../services/pdf.service.js";
import { handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export async function generarReportePDF(req, res) {
  const { id_periodo } = req.params;

  // Validación: número entero y positivo
  const periodoId = Number(id_periodo);
  if (!Number.isInteger(periodoId) || periodoId <= 0) {
    return handleErrorClient(res, 400, "El id del período debe ser un número entero positivo");
  }

  try {
    const pdfData = await generarPDFMovimientosPorPeriodo(periodoId);
    if (!pdfData) return handleErrorClient(res, 404, "No hay movimientos para este período");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="reporte_periodo_${periodoId}.pdf"`);

    return res.send(pdfData);
  } catch (error) {
    console.error("Error al generar PDF:", error);
    handleErrorServer(res, 500, "Error al generar el reporte");
  }
}
