// src/pages/Movimientos.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import MovimientosTable from "@components/MovimientosTable";
import MovimientoForm   from "@components/MovimientoForm";

import useGetMovimientos          from "@hooks/movimientos/useGetMovimientos";
import useCreateMovimiento        from "@hooks/movimientos/useCreateMovimiento";
import useUpdateMovimiento        from "@hooks/movimientos/useUpdateMovimiento";
import useDeleteMovimiento        from "@hooks/movimientos/useDeleteMovimiento";
import useGetMovimientosInactivos from "@hooks/movimientos/useGetMovimientosInactivos";
import useRestoreMovimiento       from "@hooks/movimientos/useRestoreMovimiento";

import "@styles/Movimientos.css";

// Helper para convertir "YYYY-MM-DD" o "YYYY-MM-DDTHH:mm:ss..." en "DD-MM-YYYY"
function formatDate(fecha) {
  if (!fecha) return "";
  const iso = typeof fecha === "string" ? fecha : fecha.toISOString();
  const [datePart] = iso.split("T");
  const [year, month, day] = datePart.split("-");
  return `${day}-${month}-${year}`;
}

export default function Movimientos() {
  const navigate = useNavigate();

  // fetch movimientos activos
  const {
    movimientos,
    saldo,
    fetchMovimientos,
    loading,
    error
  } = useGetMovimientos();

  const { doCreate } = useCreateMovimiento(fetchMovimientos);
  const { doUpdate } = useUpdateMovimiento(fetchMovimientos);
  const { doDelete } = useDeleteMovimiento(fetchMovimientos);

  // fetch movimientos inactivos
  const {
    inactivos,
    loading: loadingInactivos,
    error: errorInactivos,
    refetchInactivos
  } = useGetMovimientosInactivos();

  // restaurar un movimiento
  const { doRestore } = useRestoreMovimiento(() => {
    fetchMovimientos();
    refetchInactivos();
  });

  // confirmación antes de inactivar
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text:  "¿Deseas inactivar este movimiento?",
      icon:  "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, inactivar",
      cancelButtonText: "Cancelar",
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await doDelete(id);
        await Swal.fire("Inactivado", "Movimiento marcado como inactivo.", "success");
      } catch {
        await Swal.fire("Error", "No se pudo inactivar el movimiento.", "error");
      } finally {
        fetchMovimientos();
      }
    }
  };

  // filtros y orden
  const [filterPeriodo, setFilterPeriodo] = useState("all");
  const [filterUser,    setFilterUser]    = useState("");
  const [filterTipo,    setFilterTipo]    = useState("all");
  const [filterFecha,   setFilterFecha]   = useState("");
  const [sortMontoAsc,  setSortMontoAsc]  = useState(true);

  // formulario crear/editar
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState({});

  const openCreate = () => {
    setEditData({});
    setShowForm(true);
  };
  const openEdit = (m) => {
    setEditData(m);
    setShowForm(true);
  };
  const closeForm = () => setShowForm(false);

  const handleSubmit = async (formData) => {
    try {
      if (editData.id) {
        await doUpdate({ ...formData, id: editData.id });
        Swal.fire("¡Actualizado!", "Movimiento actualizado correctamente.", "success");
      } else {
        await doCreate(formData);
        Swal.fire("¡Creado!", "Movimiento creado correctamente.", "success");
      }
    } catch (err) {
      Swal.fire("Error", err.message || "Ocurrió un problema.", "error");
    } finally {
      setShowForm(false);
      fetchMovimientos();
    }
  };

  // modal inactivos
  const [showInactivos, setShowInactivos] = useState(false);
  const openInactivos  = () => { refetchInactivos(); setShowInactivos(true); };
  const closeInactivos = () => setShowInactivos(false);

  // aplicar filtros
  const filtered = useMemo(() => {
    let arr = movimientos;
    if (filterPeriodo !== "all")
      arr = arr.filter(m => m.periodo.anio.toString() === filterPeriodo);
    if (filterUser)
      arr = arr.filter(m =>
        m.usuario.nombreCompleto.toLowerCase().includes(filterUser.toLowerCase())
      );
    if (filterTipo !== "all")
      arr = arr.filter(m => m.tipo === filterTipo);
    if (filterFecha)
      arr = arr.filter(m => m.fecha === filterFecha);

    return arr.sort((a, b) =>
      sortMontoAsc
        ? Number(a.monto) - Number(b.monto)
        : Number(b.monto) - Number(a.monto)
    );
  }, [
    movimientos,
    filterPeriodo,
    filterUser,
    filterTipo,
    filterFecha,
    sortMontoAsc
  ]);

  if (loading) return <p className="mt-loading">Cargando…</p>;
  if (error)   return <p className="mt-error">Error al cargar movimientos.</p>;

  return (
    <div className="mt-container">
      <h1 className="mt-title">Movimientos</h1>
      <p className="mt-saldo">
        Saldo total:{" "}
        {saldo.toLocaleString("es-CL", {
          style: "currency",
          currency: "CLP"
        })}
      </p>

      <div className="filter-bar">
        <select
          className="filter-select"
          value={filterPeriodo}
          onChange={e => setFilterPeriodo(e.target.value)}
        >
          <option value="all">Todos los períodos</option>
          {movimientos
            .map(m => m.periodo.anio)
            .filter((v, i, a) => a.indexOf(v) === i)
            .map(año => (
              <option key={año} value={año}>
                {año}
              </option>
            ))}
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

        <div className="mt-btn-group">
          <button
            className="btn-primary mt-create-btn"
            onClick={openCreate}
          >
            + Crear Movimiento
          </button>
          <button
            className="btn-warning mt-create-btn"
            onClick={openInactivos}
          >
            Movimientos inactivos
          </button>
        </div>
      </div>

      <MovimientosTable
        data={filtered}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      {showForm && (
        <MovimientoForm
          initialData={editData}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}

      {showInactivos && (
        <div className="bg">
          <div className="popup" style={{ width: "80vw", maxWidth: "900px" }}>
            <button
              className="btn-secondary btn-sm close"
              onClick={closeInactivos}
            >
              X
            </button>
            <h2>Movimientos inactivos</h2>

            {loadingInactivos && <p>Cargando…</p>}
            {errorInactivos && <p className="mt-error">Error al cargar inactivos.</p>}

            {!loadingInactivos && !errorInactivos && (
              inactivos.length === 0
                ? (
                  <div style={{ padding: "1rem", textAlign: "center" }}>
                    No existen movimientos inactivos.
                  </div>
                )
                : (
                  <table className="mt-table">
                    <thead>
                      <tr>
                        <th>Descripción</th>
                        <th>Fecha</th>
                        <th>Monto</th>
                        <th>Tipo</th>
                        <th>Usuario</th>
                        <th>Período</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inactivos.map(m => (
                        <tr key={m.id}>
                          <td>{m.descripcion}</td>
                          <td>{formatDate(m.fecha)}</td>
                          <td>{m.monto}</td>
                          {/* Aplicamos color en el popup */}
                          <td className={`mt-tipo mt-tipo--${m.tipo}`}>
                            {m.tipo === "ingreso" ? "+ ingreso" : "- egreso"}
                          </td>
                          <td>{m.usuario.nombreCompleto}</td>
                          <td>{m.periodo.anio}</td>
                          <td>
                            <button
                              className="btn-primary btn-sm"
                              onClick={async () => {
                                try {
                                  await doRestore(m.id);
                                  Swal.fire(
                                    "Restaurado",
                                    "Movimiento activo nuevamente.",
                                    "success"
                                  );
                                } catch {
                                  Swal.fire(
                                    "Error",
                                    "No se pudo restaurar el movimiento.",
                                    "error"
                                  );
                                }
                              }}
                            >
                              Restaurar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
            )}

            <button
              className="btn-secondary"
              onClick={closeInactivos}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
