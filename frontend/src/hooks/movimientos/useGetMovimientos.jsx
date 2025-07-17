import { useState, useEffect } from "react";
import { getMovimientos } from "@services/movimientos.service";

export default function useGetMovimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [saldo,        setSaldo]       = useState(0);
  const [loading,      setLoading]     = useState(true);
  const [error,        setError]       = useState(null);


  const fetchMovimientos = async () => {
    setLoading(true);
    try {
      const { data } = await getMovimientos();
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
    fetchMovimientos();
  }, []);

  return {
    movimientos,
    saldo,
    loading,
    error,
    fetchMovimientos,
    refetch: fetchMovimientos,
  };
}
