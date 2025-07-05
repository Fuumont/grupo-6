import { useState } from "react";
import { updatePeriodo } from "@services/periodos.service";

export default function useUpdatePeriodo(onSuccess) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const doUpdate = async (payload) => {
    console.log("▶️ Updating periodo con payload:", payload);
    setLoading(true);
    setError(null);
    try {
      const res = await updatePeriodo(payload);
      onSuccess?.();
      return res;
    } catch (err) {
      console.error("❌ updatePeriodo error:", err.response?.data || err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { doUpdate, loading, error };
}
