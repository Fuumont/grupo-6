import { useState } from "react";
import { restoreMovimiento } from "@services/movimientos.service";

export default function useRestoreMovimiento(onSuccess) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const doRestore = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await restoreMovimiento(id);
      onSuccess?.();
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { doRestore, loading, error };
}
