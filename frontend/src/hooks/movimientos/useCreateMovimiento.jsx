import { useState } from "react";
import { createMovimiento } from "@services/movimientos.service";

export default function useCreateMovimiento(onSuccess) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const doCreate = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createMovimiento(payload);
      if (res.status !== "Success") {
        throw new Error(res.message || "Error al crear movimiento");
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

  return { doCreate, loading, error };
}
