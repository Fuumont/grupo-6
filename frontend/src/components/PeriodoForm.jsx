import React, { useState, useEffect } from "react";
import { preparePeriodoPayload } from "@helpers/periodos.helper";
import "@styles/PeriodoForm.css";

export default function PeriodoForm({ initialData = {}, onCancel, onSubmit }) {
  const [anio,   setAnio]   = useState("");
  const [inicio, setInicio] = useState("");
  const [fin,    setFin]    = useState("");
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    if (initialData.id != null) {
      setAnio(initialData.anio?.toString() ?? "");
      setInicio(initialData.fecha_inicio || "");
      setFin(initialData.fecha_fin || "");
      setActivo(Boolean(initialData.activo));
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const raw = {
      id:            initialData.id,
      anio,
      fecha_inicio: inicio,
      fecha_fin:    fin,
      activo
    };
    onSubmit( preparePeriodoPayload(raw) );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="pt-title-form">
          {initialData.id != null ? "Editar Período" : "Crear Período"}
        </h2>

        <form onSubmit={handleSubmit} className="pt-form">
          <label className="pt-label">
            Año
            <input
              type="number"
              className="pt-input"
              value={anio}
              onChange={e => setAnio(e.target.value)}
              min="0"
              step="1"
              required
            />
          </label>

          <label className="pt-label">
            Fecha inicio
            <input
              type="date"
              className="pt-input"
              value={inicio}
              onChange={e => setInicio(e.target.value)}
              required
            />
          </label>

          <label className="pt-label">
            Fecha término
            <input
              type="date"
              className="pt-input"
              value={fin}
              onChange={e => setFin(e.target.value)}
              required
            />
          </label>

          <label className="pt-checkbox">
            <input
              type="checkbox"
              checked={activo}
              onChange={e => setActivo(e.target.checked)}
            />
            Activo
          </label>

          <div className="pt-form-actions">
            <button type="submit" className="btn-primary">
              {initialData.id != null ? "Guardar" : "Crear"}
            </button>
            <button type="button" onClick={onCancel}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
