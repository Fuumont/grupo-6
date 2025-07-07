import axios from "axios";

// trae todas las aprobaciones
export async function getAprobacionesRequest() {
  try {
    const response = await axios.get("/aprobacion");
    return response.data;
  } catch (error) {
    console.error("Error al obtener las aprobaciones:", error);
    return { error: "Error interno del servidor" };
  }
}

// trae las aprobaciones asociadas a una propuesta
export async function getAprobacionesByPropuestaIdRequest(id) {
  try {
    const response = await axios.get(`/aprobacion/propuesta/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener las aprobaciones por ID de propuesta:",
      error
    );
    return { error: "Error interno del servidor" };
  }
}

// crea una aprobacion/genera voto
export async function createAprobacionRequest(aprobacionData) {
  try {
    const response = await axios.post("/aprobacion", aprobacionData);
    return response.data;
  } catch (error) {
    console.error("Error al crear la aprobación:", error);
    return { error: "Error interno del servidor" };
  }
}

// actualiza una aprobacion
export async function updateAprobacionRequest(id, aprobacionData) {
  try {
    const response = await axios.patch(`/aprobacion/${id}`, aprobacionData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la aprobación:", error);
    return { error: "Error interno del servidor" };
  }
}

// borra una aprobacion
export async function deleteAprobacionRequest(id) {
  try {
    const response = await axios.delete(`/aprobacion/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la aprobación:", error);
    return { error: "Error interno del servidor" };
  }
}
