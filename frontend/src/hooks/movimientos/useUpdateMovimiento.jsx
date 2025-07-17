import { useState } from "react";
import { updateMovimiento } from "@services/movimientos.service";

export default function useUpdateMovimiento(onSuccess) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const doUpdate = async (payload) => {
    const { id, ...body } = payload;
    setLoading(true);
    setError(null);
    try {
      await updateMovimiento(id, body);
      onSuccess?.();
    } catch (err) {
      console.error("❌ updateMovimiento error:", err.response?.data || err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { doUpdate, loading, error };
}
