import { useState } from "react";
import { deleteMovimiento } from "@services/movimientos.service";

export default function useDeleteMovimiento(onSuccess) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const doDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await deleteMovimiento(id);
      onSuccess?.();
      return res;
    } catch (err) {
      console.error("Error al eliminar movimiento:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { doDelete, loading, error };
}
