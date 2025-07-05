import { useState } from "react";
import { deletePeriodo } from "@services/periodos.service";

export default function useDeletePeriodo(onSuccess) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const doDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deletePeriodo(id);
      onSuccess();
    } catch (err) {
      console.error("deletePeriodo error:", err.response?.data || err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { doDelete, loading, error };
}
