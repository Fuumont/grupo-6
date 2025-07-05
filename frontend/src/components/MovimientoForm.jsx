import React, { useState, useEffect } from "react";
import useGetPeriodos from "@hooks/periodos/useGetPeriodos";
import "@styles/MovimientoForm.css";

export default function MovimientoForm({ initialData = {}, onSubmit, onCancel }) {
  const { periodos, loading: loadingP } = useGetPeriodos();

  const [descripcion, setDescripcion] = useState("");
  const [fecha,       setFecha]       = useState("");
  const [monto,       setMonto]       = useState("");
  const [tipo,        setTipo]        = useState("ingreso");
  const [id_periodo,  setIdPeriodo]   = useState("");
  const [id_propuesta, setIdPropuesta] = useState("");

  // Rellenar campos texto/número/fecha/tipo/propuesta
  useEffect(() => {
    setDescripcion(initialData.descripcion ?? "");
    setFecha(initialData.fecha ?? "");
    setMonto(initialData.monto?.toString() ?? "");
    setTipo(initialData.tipo ?? "ingreso");
    setIdPropuesta(initialData.propuesta?.id?.toString() ?? "");
  }, [initialData]);

  // Rellenar id_periodo una vez que carguen los periodos
  useEffect(() => {
    if (loadingP || periodos.length === 0) return;
    if (initialData.id != null && initialData.periodo?.anio != null) {
      // buscamos el periodo activo cuyo año coincida
      const match = periodos.find(p => p.anio === initialData.periodo.anio && p.activo);
      setIdPeriodo(match ? match.id.toString() : "");
    } else {
      // nuevo: primer periodo activo
      const activo = periodos.find(p => p.activo);
      setIdPeriodo(activo ? activo.id.toString() : "");
    }
  }, [initialData, periodos, loadingP]);

  const handle = e => {
    e.preventDefault();
    const payload = {
      descripcion,
      fecha,
      monto: Number(monto),
      tipo,
      id_periodo: Number(id_periodo),
      ...(tipo === "egreso" && { id_propuesta: Number(id_propuesta) })
    };
    onSubmit(payload);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content mf-content">
        <h2 className="mf-title">
          {initialData.id ? "Editar Movimiento" : "Crear Movimiento"}
        </h2>
        <form onSubmit={handle} className="mf-form">
          <label className="mf-label">
            Descripción
            <input
              type="text"
              className="mf-input"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              required
            />
          </label>
          <label className="mf-label">
            Fecha
            <input
              type="date"
              className="mf-input"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              required
            />
          </label>
          <label className="mf-label">
            Monto
            <input
              type="number"
              className="mf-input"
              min="0"
              step="0.01"
              value={monto}
              onChange={e => setMonto(e.target.value)}
              required
            />
          </label>
          <label className="mf-label">
            Tipo
            <select
              className="mf-input"
              value={tipo}
              onChange={e => setTipo(e.target.value)}
            >
              <option value="ingreso">Ingreso</option>
              <option value="egreso">Egreso</option>
            </select>
          </label>
          <label className="mf-label">
            Período
            <select
              className="mf-input"
              value={id_periodo}
              onChange={e => setIdPeriodo(e.target.value)}
              required
            >
              {periodos
                .filter(p => p.activo)
                .map(p => (
                  <option key={p.id} value={p.id}>
                    {p.anio}
                  </option>
                ))}
            </select>
          </label>
          {tipo === "egreso" && (
            <label className="mf-label">
              Propuesta
              <input
                type="number"
                className="mf-input"
                min="1"
                value={id_propuesta}
                onChange={e => setIdPropuesta(e.target.value)}
                required
              />
            </label>
          )}
          <div className="mf-actions">
            <button type="submit" className="btn-primary mf-btn">
              {initialData.id ? "Guardar" : "Crear"}
            </button>
            <button type="button" className="mf-btn" onClick={onCancel}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
