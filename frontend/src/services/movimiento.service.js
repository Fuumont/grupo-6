import api from "./root.service.js";

export function exportMovimientosPDF(periodoId) {
  return api.get(`/movimientos/reporte/${periodoId}`, {
    responseType: "blob",
  });
}