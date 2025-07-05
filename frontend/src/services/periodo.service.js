import api from "./root.service"; // tu instancia de Axios

const BASE = "/periodos";

export async function getPeriodos() {
  const response = await api.get(BASE);
  return response.data;
}

export async function createPeriodo(payload) {
  const response = await api.post(BASE, payload);
  return response.data;
}

export async function updatePeriodo(periodo) {
  const { id, anio, fecha_inicio, fecha_fin, activo } = periodo;
  const response = await api.put(
    `${BASE}?id=${id}`,
    { anio, fecha_inicio, fecha_fin, activo }
  );
  return response.data;
}

export async function deletePeriodo(id) {
  const response = await api.delete(`${BASE}?id=${id}`);
  return response.data;
}

export async function exportMovimientos(periodoId) {
  const response = await api.get(
    `${BASE}/${periodoId}/movimientos/pdf`,
    { responseType: "blob" }
  );
  return response.data;
}
