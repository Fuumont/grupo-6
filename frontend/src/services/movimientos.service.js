import api from "./root.service";

const BASE = "/movimientos";

/** GET /api/movimientos → { status, message, data: { movimientos, saldo } } */
export async function getMovimientos() {
  try {
    const resp = await api.get(BASE);
    return resp.data;
  } catch (err) {
    return err.response.data;
  }
}

/** POST /api/movimientos */
export async function createMovimiento(payload) {
  try {
    const resp = await api.post(BASE, payload);
    return resp.data;
  } catch (err) {
    return err.response.data;
  }
}

/** PUT /api/movimientos?id={id} */
export async function updateMovimiento(id, payload) {
  try {
    const resp = await api.put(`${BASE}?id=${id}`, payload);
    return resp.data;
  } catch (err) {
    return err.response.data;
  }
}

/** DELETE /api/movimientos?id={id} */
export async function deleteMovimiento(id) {
  try {
    const resp = await api.delete(`${BASE}?id=${id}`);
    return resp.data;
  } catch (err) {
    return err.response.data;
  }
}

