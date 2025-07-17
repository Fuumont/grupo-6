
import { useState } from "react";
import { exportMovimientosPDF } from "@services/movimiento.service";

export default function useExportMovimientos() {
  const [loading, setLoading] = useState(false);

  const doExport = async (periodoId) => {
    setLoading(true);
    try {
      const response = await exportMovimientosPDF(periodoId);

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url  = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href     = url;
      link.download = `movimientos_periodo_${periodoId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      // si el backend devuelve 404 o lanza error,
      // ese error escapará directamente al caller
    } finally {
      setLoading(false);
    }
  };

  return { doExport, loading };
}
