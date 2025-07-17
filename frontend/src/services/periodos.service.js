
import api from "./root.service";

const BASE = "/periodos";

export async function getPeriodos() {
  // GET /api/periodos → devuelve { status, message: [ … ] }
  const response = await api.get(BASE);
  return response.data;
}

export async function getPeriodo(id) {
  // GET /api/periodos/buscar?id={id} → { status, message: { … } }
  const response = await api.get(`${BASE}/buscar?id=${id}`);
  return response.data;
}

export async function createPeriodo(payload) {
  // POST /api/periodos
  const response = await api.post(BASE, payload);
  return response.data;
}

export async function updatePeriodo(periodo) {
  const rawId = periodo.id;
  const id =
    typeof rawId === "object" && rawId != null && rawId.id != null
      ? rawId.id
      : rawId;

  const { anio, fecha_inicio, fecha_fin, activo } = periodo;

  // PUT /api/periodos?id={id}
  const response = await api.put(
    `${BASE}?id=${id}`,
    { anio, fecha_inicio, fecha_fin, activo }
  );
  return response.data;
}

export async function deletePeriodo(id) {
  // DELETE /api/periodos?id={id}
  const response = await api.delete(`${BASE}?id=${id}`);
  return response.data;
}

export async function exportMovimientos(periodoId) {
  // GET /api/periodos/{id}/movimientos/pdf → blob
  const response = await api.get(`${BASE}/${periodoId}/movimientos/pdf`, {
    responseType: "blob",
  });
  return response.data;
}
