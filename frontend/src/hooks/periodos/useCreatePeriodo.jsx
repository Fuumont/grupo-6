import { useState } from "react";
import { createPeriodo } from "@services/periodos.service";

export default function useCreatePeriodo(onSuccess) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const doCreate = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createPeriodo(payload);
      onSuccess();
      return res;
    } catch (err) {
      console.error("createPeriodo error:", err.response?.data || err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { doCreate, loading, error };
}
