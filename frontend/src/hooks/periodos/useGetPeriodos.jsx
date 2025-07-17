import { useState, useEffect } from "react";
import * as service from "@services/periodos.service";
import { formatPeriodoDateDisplay } from "@helpers/periodos.helper";

export default function useGetPeriodos() {
  const [periodos, setPeriodos] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetchPeriodos = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await service.getPeriodos();
      const mapped = res.message.map(p => ({
        id:       p.id,
        anio:     p.anio,
        fecha_inicio: p.fecha_inicio.split("T")[0],
        fecha_fin:    p.fecha_fin.split("T")[0],
        display_inicio: formatPeriodoDateDisplay(p.fecha_inicio),
        display_fin:    formatPeriodoDateDisplay(p.fecha_fin),
        activo:   p.activo,
      }));

      setPeriodos(mapped);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriodos();
  }, []);

  return { periodos, loading, error, fetchPeriodos };
}
