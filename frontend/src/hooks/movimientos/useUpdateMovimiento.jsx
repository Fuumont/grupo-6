import { useState } from "react";
import { updateMovimiento } from "@services/movimientos.service";

export default function useUpdateMovimiento(onSuccess) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const doUpdate = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateMovimiento(id, payload);
      if (res.status !== "Success") {
        throw new Error(res.message || "Error al actualizar movimiento");
      }
      onSuccess?.();
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { doUpdate, loading, error };
}
