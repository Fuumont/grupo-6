import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import MovimientosTable        from "@components/MovimientosTable";
import MovimientoForm          from "@components/MovimientoForm";

import useGetMovimientos       from "@hooks/movimientos/useGetMovimientos";
import useCreateMovimiento     from "@hooks/movimientos/useCreateMovimiento";
import useUpdateMovimiento     from "@hooks/movimientos/useUpdateMovimiento";
import useDeleteMovimiento     from "@hooks/movimientos/useDeleteMovimiento";

import "@styles/Movimientos.css";

export default function Movimientos() {
  const navigate                    = useNavigate();
  const { movimientos, saldo, fetchMovimientos, loading, error } = useGetMovimientos();
  const { doCreate }                = useCreateMovimiento(fetchMovimientos);
  const { doUpdate }                = useUpdateMovimiento(fetchMovimientos);
  const { doDelete }                = useDeleteMovimiento(fetchMovimientos);

  const [filterPeriodo, setFilterPeriodo] = useState("all");
  const [filterUser,    setFilterUser]    = useState("");
  const [filterTipo,    setFilterTipo]    = useState("all");
  const [filterFecha,   setFilterFecha]   = useState("");
  const [sortMontoAsc,  setSortMontoAsc]  = useState(true);

  const [showForm,     setShowForm] = useState(false);
  const [editData,     setEditData] = useState({});

  const filtered = useMemo(() => {
    let arr = movimientos;
    if (filterPeriodo !== "all")
      arr = arr.filter(m => m.periodo.anio.toString() === filterPeriodo);
    if (filterUser)
      arr = arr.filter(m => m.usuario.nombreCompleto.toLowerCase().includes(filterUser.toLowerCase()));
    if (filterTipo !== "all")
      arr = arr.filter(m => m.tipo === filterTipo);
    if (filterFecha)
      arr = arr.filter(m => m.fecha === filterFecha);
    return arr.sort((a,b) => sortMontoAsc
      ? Number(a.monto) - Number(b.monto)
      : Number(b.monto) - Number(a.monto)
    );
  }, [movimientos, filterPeriodo, filterUser, filterTipo, filterFecha, sortMontoAsc]);

  const openCreate = () => { setEditData({}); setShowForm(true); };
  const openEdit   = m  => { setEditData(m);   setShowForm(true); };
  const closeForm  = () => setShowForm(false);

  const handleSubmit = async formData => {
    if (editData.id) await doUpdate({ ...formData, id: editData.id });
    else              await doCreate(formData);
    setShowForm(false);
  };

  if (loading) return <p className="mt-loading">Cargando…</p>;
  if (error)   return <p className="mt-error">Error al cargar movimientos.</p>;

  return (
    <div className="mt-container">
      <h1 className="mt-title">📊 Movimientos</h1>
      <p className="mt-saldo">Saldo total: {saldo.toLocaleString("es-CL", {style:"currency",currency:"CLP"})}</p>

      <div className="filter-bar">
        <select
          className="filter-select"
          value={filterPeriodo}
          onChange={e => setFilterPeriodo(e.target.value)}
        >
          <option value="all">Todos los perí­odos</option>
          {movimientos
            .map(m => m.periodo.anio)
            .filter((v,i,a) => a.indexOf(v)===i)
            .map(año => <option key={año} value={año}>{año}</option>)
          }
        </select>

        <input
          className="filter-input"
          type="text"
          placeholder="Filtrar usuario"
          value={filterUser}
          onChange={e => setFilterUser(e.target.value)}
        />

        <select
          className="filter-select"
          value={filterTipo}
          onChange={e => setFilterTipo(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="ingreso">Ingreso</option>
          <option value="egreso">Egreso</option>
        </select>

        <input
          className="date-input"
          type="date"
          value={filterFecha}
          onChange={e => setFilterFecha(e.target.value)}
        />

        <button
          className="btn-secondary mt-sort-btn"
          onClick={() => setSortMontoAsc(!sortMontoAsc)}
        >
          Monto {sortMontoAsc ? "↑" : "↓"}
        </button>

        <button className="btn-primary mt-create-btn" onClick={openCreate}>
          + Crear Movimiento
        </button>
      </div>

      <MovimientosTable
        data={filtered}
        onEdit={openEdit}
        onDelete={doDelete}
      />

      {showForm && (
        <MovimientoForm
          initialData={editData}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}
    </div>
  );
}
