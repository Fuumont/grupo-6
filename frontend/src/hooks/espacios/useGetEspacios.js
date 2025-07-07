import { getEspaciosRequest } from "../../services/espacios.service.js";
import { useState, useEffect } from "react";

const useGetEspacios = () => {
  const [espacios, setEspacios] = useState([]);
  const fetchEspacios = async () => {
    try {
      const response = await getEspaciosRequest();
      const formattedData = response.map((espacio) => ({
        id: espacio.id,
        nombre: espacio.nombre,
        capacidad: espacio.capacidad,
        horario_disponible: espacio.horario_disponible,
        dias_disponibles: espacio.dias_disponibles
      }));
      setEspacios(formattedData);
    } catch (error) {
      console.error("Error al obtener los espacios:", error);
    }
  };

  useEffect(() => {
    fetchEspacios();
  }, []);

  return { espacios, fetchEspacios, setEspacios };
};

export default useGetEspacios;
