import axios from "./root.service.js";

// trae todos los espacios
export async function getEspaciosRequest() {
  try {
    const data = await axios.get("/espacio");
    return data.data;
  } catch (error) {
    console.error("Error al obtener los espacios:", error);
    return { error: "Error interno del servidor" };
  }
}

// trae un espacio
export async function getEspacioByIdRequest(id) {
  try {
    const data = await axios.get(`/espacio/${id}`);
    return data.data;
  } catch (error) {
    console.error("Error al obtener el espacio por ID:", error);
    return { error: "Error interno del servidor" };
  }
}

// crea un espacio
export async function createEspacioRequest(espacioData) {
  try {
    const data = await axios.post("/espacio", espacioData);
    return data.data;
  } catch (error) {
    console.error("Error al crear el espacio:", error);
    return { error: "Error interno del servidor" };
  }
}

// actualiza un espacio
export async function updateEspacioRequest(id, espacioData) {
  try {
    const data = await axios.patch(`/espacio/${id}`, espacioData);
    return data.data;
  } catch (error) {
    console.error("Error al actualizar el espacio:", error);
    return { error: "Error interno del servidor" };
  }
}

// borra un espacio
export async function deleteEspacioRequest(id) {
  try {
    const data = await axios.delete(`/espacio/${id}`);
    return data.data;
  } catch (error) {
    console.error("Error al eliminar el espacio:", error);
    return { error: "Error interno del servidor" };
  }
}
