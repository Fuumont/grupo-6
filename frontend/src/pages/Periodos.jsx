// src/pages/Periodos.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import PeriodosTable        from "@components/PeriodosTable";
import PeriodoForm          from "@components/PeriodoForm";

import useGetPeriodos       from "@hooks/periodos/useGetPeriodos";
import useCreatePeriodo     from "@hooks/periodos/useCreatePeriodo";
import useUpdatePeriodo     from "@hooks/periodos/useUpdatePeriodo";
import useDeletePeriodo     from "@hooks/periodos/useDeletePeriodo";
import useExportMovimientos from "@hooks/periodos/useExportMovimientos";

import "@styles/PeriodosTable.css";

export default function Periodos() {
  const navigate                       = useNavigate();
  const { periodos, loading, error, fetchPeriodos } = useGetPeriodos();
  const { doCreate }                   = useCreatePeriodo(fetchPeriodos);
  const { doUpdate }                   = useUpdatePeriodo(fetchPeriodos);
  const { doDelete }                   = useDeletePeriodo(fetchPeriodos);
  const { doExport, loading: exporting } = useExportMovimientos();

  const [filterYear,   setFilterYear]   = useState("");
  const [filterActivo, setFilterActivo] = useState("all");
  const [showForm,     setShowForm]     = useState(false);
  const [editData,     setEditData]     = useState({});

  const filtered = useMemo(() => {
    return periodos
      .filter(p => !filterYear || String(p.anio).includes(filterYear))
      .filter(p => {
        if (filterActivo === "all") return true;
        return filterActivo === "yes" ? p.activo : !p.activo;
      });
  }, [periodos, filterYear, filterActivo]);

  const openCreate = () => {
    setEditData({});
    setShowForm(true);
  };
  const openEdit = p => {
    // prefill: las fechas vienen en ISO o con T
    const inicio = p.fecha_inicio.split("T")[0];
    const fin    = p.fecha_fin.split("T")[0];
    setEditData({
      id:           p.id,
      anio:         String(p.anio),
      fecha_inicio: inicio,
      fecha_fin:    fin,
      activo:       p.activo,
    });
    setShowForm(true);
  };
  const closeForm = () => setShowForm(false);

  const handleSubmit = async data => {
    if (data.id) await doUpdate(data);
    else         await doCreate(data);
    setShowForm(false);
  };

  if (loading) return <p className="pt-loading">Cargando…</p>;
  if (error)   return <p className="pt-error">Error al cargar períodos.</p>;

  return (
    <div className="pt-container">
      <h1 className="pt-title">Períodos Académicos</h1>

      <div className="filter-bar">
        <input
          className="filter-input"
          placeholder="Filtrar por año"
          value={filterYear}
          onChange={e => setFilterYear(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterActivo}
          onChange={e => setFilterActivo(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="yes">Activo</option>
          <option value="no">Inactivo</option>
        </select>
        <button className="btn-primary" onClick={openCreate}>
          + Crear Período
        </button>
      </div>

      <PeriodosTable
        data={filtered}
        onEdit={openEdit}
        onDelete={doDelete}
        onVerMovimientos={p => navigate(`/movimientos/${p.id}`)}
        onExportMovimientos={doExport}
        exporting={exporting}
      />

      {showForm && (
        <PeriodoForm
          initialData={editData}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}
    </div>
  );
}
