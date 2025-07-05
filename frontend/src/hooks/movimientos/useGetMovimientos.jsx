import { useState, useEffect } from "react";
import { getMovimientos } from "@services/movimientos.service";

export default function useGetMovimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [saldo,        setSaldo]       = useState(0);
  const [loading,      setLoading]     = useState(true);
  const [error,        setError]       = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await getMovimientos();
      // data: { movimientos: [...], saldo: number }
      setMovimientos(data.movimientos);
      setSaldo(data.saldo);
    } catch (err) {
      console.error("Error cargando movimientos:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { movimientos, saldo, loading, error, refetch: fetch };
}
