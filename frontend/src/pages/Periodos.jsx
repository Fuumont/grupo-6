// src/pages/Periodos.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import PeriodosTable        from "@components/PeriodosTable";
import PeriodoForm          from "@components/PeriodoForm";

import useGetPeriodos       from "@hooks/periodos/useGetPeriodos";
import useCreatePeriodo     from "@hooks/periodos/useCreatePeriodo";
import useUpdatePeriodo     from "@hooks/periodos/useUpdatePeriodo";
import useDeletePeriodo     from "@hooks/periodos/useDeletePeriodo";
import useExportMovimientos from "@hooks/periodos/useExportMovimientos";

import "@styles/PeriodosTable.css";
import "@styles/periodos.css";

export default function Periodos() {
  const navigate                              = useNavigate();
  const { periodos, loading, error, fetchPeriodos } = useGetPeriodos();
  const { doCreate }                          = useCreatePeriodo(fetchPeriodos);
  const { doUpdate }                          = useUpdatePeriodo(fetchPeriodos);
  const { doDelete }                          = useDeletePeriodo(fetchPeriodos);
  const { doExport, loading: exporting }      = useExportMovimientos();

  const [filterYear,   setFilterYear]         = useState("");
  const [filterActivo, setFilterActivo]       = useState("all");
  const [showForm,     setShowForm]           = useState(false);
  const [editData,     setEditData]           = useState({});

  // ——— SweetAlert before deletion ———
  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "¿Estás seguro?",
      text:  "¿Deseas eliminar este período?",
      icon:  "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText:  "Cancelar",
      reverseButtons:    true,
    });
    if (!isConfirmed) return;

    try {
      await doDelete(id);
      await Swal.fire("Eliminado", "Período eliminado correctamente.", "success");
    } catch (err) {
      await Swal.fire("Error", err.response?.data || "No se pudo eliminar el período.", "error");
    } finally {
      fetchPeriodos();
    }
  };

  // ——— SweetAlert wrap create/update ———
  const handleSubmit = async (data) => {
    try {
      if (data.id) {
        await doUpdate(data);
        await Swal.fire("¡Actualizado!", "Período actualizado correctamente.", "success");
      } else {
        await doCreate(data);
        await Swal.fire("¡Creado!", "Período creado correctamente.", "success");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || err.message || "Ocurrió un problema.";
      await Swal.fire("Error", msg, "error");
    } finally {
      setShowForm(false);
      fetchPeriodos();
    }
  };

  // ——— SweetAlert wrap PDF export ———
  const handleExport = async (arg) => {
    // extraer id y año
    let periodoId = typeof arg === "object" ? arg.id : arg;
    let year = typeof arg === "object" ? arg.anio : periodos.find(p => p.id === periodoId)?.anio;

    const { isConfirmed } = await Swal.fire({
      title: "Descargar PDF",
      text:  year
        ? `¿Deseas descargar el reporte de movimientos del período ${year}?`
        : "¿Deseas descargar el reporte de movimientos?",
      icon:  "question",
      showCancelButton: true,
      confirmButtonText: "Sí, descargar",
      cancelButtonText:  "Cancelar",
      reverseButtons:    true,
    });
    if (!isConfirmed) return;

    try {
      await doExport(periodoId);
      await Swal.fire("Listo", "PDF descargado correctamente.", "success");
    } catch (err) {
      if (err.response?.status === 404) {
        await Swal.fire("Info", "No hay movimientos asociados a este período.", "info");
      } else {
        await Swal.fire("Error", "No se pudo descargar el PDF.", "error");
      }
    }
  };

  // filtrar lista
  const filtered = useMemo(() => {
    return periodos
      .filter(p => !filterYear   || String(p.anio).includes(filterYear))
      .filter(p => filterActivo === "all"
        ? true
        : filterActivo === "yes"
          ? p.activo
          : !p.activo
      );
  }, [periodos, filterYear, filterActivo]);

  const openCreate = () => {
    setEditData({});
    setShowForm(true);
  };

  const openEdit = p => {
    const inicio = p.fecha_inicio.split("T")[0];
    const fin    = p.fecha_fin   .split("T")[0];
    setEditData({
      id:           p.id,
      anio:         String(p.anio),
      fecha_inicio: inicio,
      fecha_fin:    fin,
      activo:       p.activo,
    });
    setShowForm(true);
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
        onDelete={handleDelete}
        onVerMovimientos={p => navigate(`/movimientos/${p.id}`)}
        onExportMovimientos={handleExport}
        exporting={exporting}
      />

      {showForm && (
        <PeriodoForm
          initialData={editData}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
