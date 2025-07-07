import axios from "axios";

// trae todas las propuestas
export async function getPropuestasRequest() {
  try {
    const response = await axios.get("/propuesta");
    return response.data;
  } catch (error) {
    console.error("Error al obtener las propuestas:", error);
    return { error: "Error interno del servidor" };
  }
}

// trae una propuesta
export async function getPropuestaByIdRequest(id) {
  try {
    const response = await axios.get(`/propuesta/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener la propuesta", error);
    return { error: "Error interno del servidor" };
  }
}

// crea una propuesta
export async function createPropuestaRequest(propuestaData) {
  try {
    const response = await axios.post("/propuesta", propuestaData);
    return response.data;
  } catch (error) {
    console.error("Error al crear la propuesta:", error);
    return { error: "Error interno del servidor" };
  }
}

// actualiza una propuesta
export async function updatePropuestaRequest(id, propuestaData) {
  try {
    const response = await axios.patch(`/propuesta/${id}`, propuestaData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la propuesta:", error);
    return { error: "Error interno del servidor" };
  }
}

// borra una propuesta
export async function deletePropuestaRequest(id) {
  try {
    const response = await axios.delete(`/propuesta/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la propuesta:", error);
    return { error: "Error interno del servidor" };
  }
}
