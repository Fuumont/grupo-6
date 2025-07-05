import { format as formatTempo } from "@formkit/tempo";

/**
 * formatea fecha para mostrar en la tabla: DD-MM-YYYY
 */
export function formatPeriodoDateDisplay(dateStr = "") {
  if (!dateStr) return "";
  if (dateStr.includes("T")) dateStr = dateStr.split("T")[0];
  const parts = dateStr.split("-");
  if (parts[0].length === 4) {
    return formatTempo(dateStr, "DD-MM-YYYY");
  }
  const [d, m, y] = parts;
  return `${d.padStart(2,"0")}-${m.padStart(2,"0")}-${y}`;
}

/**
 * Prepara el payload para POST/PUT:
 * - fechas en YYYY-MM-DD
 * - activo como booleano
 * - incluye id solo si raw.id existe
 */
export function preparePeriodoPayload(raw) {
  const toISO = (d = "") => {
    if (!d) return "";
    if (d.includes("T")) return d.split("T")[0];
    const parts = d.split("-");
    if (parts[0].length === 4) return d;
    const [dia, mes, anio] = parts;
    return `${anio}-${mes.padStart(2,"0")}-${dia.padStart(2,"0")}`;
  };

  return {
    ...(raw.id != null && { id: raw.id }),
    anio:         Number(raw.anio),
    fecha_inicio: toISO(raw.fecha_inicio),
    fecha_fin:    toISO(raw.fecha_fin),
    activo:       Boolean(raw.activo),
  };
}
