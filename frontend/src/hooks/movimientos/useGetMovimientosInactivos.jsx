
import { useState, useEffect } from "react";
import { getMovimientosInactivos } from "@services/movimientos.service";

export default function useGetMovimientosInactivos() {
  const [inactivos, setInactivos] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const fetchInactivos = async () => {
    setLoading(true);
    try {
      const resp = await getMovimientosInactivos();
      // resp.data debería ser un array; si no viene, forzamos empty
      setInactivos(Array.isArray(resp?.data) ? resp.data : []);
      setError(null);
    } catch (err) {
      // Si el backend devolvió 404, lo tratamos como “no hay inactivos”
      if (err.response?.status === 404) {
        setInactivos([]);
        setError(null);
      } else {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInactivos();
  }, []);

  return {
    inactivos,
    loading,
    error,
    refetchInactivos: fetchInactivos,
  };
}
