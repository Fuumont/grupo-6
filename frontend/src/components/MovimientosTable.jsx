import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "@styles/MovimientosTable.css";

function formatDate(fecha) {
  if (!fecha) return "";
  const iso = typeof fecha === "string"
    ? fecha
    : fecha.toISOString();
  const [datePart] = iso.split("T");
  const [year, month, day] = datePart.split("-");
  return `${day}-${month}-${year}`;
}

export default function MovimientosTable({ data, onEdit, onDelete }) {
  return (
    <table className="mt-table">
      <thead>
        <tr>
          <th>Descripción</th>
          <th>Fecha</th>
          <th>Monto</th>
          <th>Tipo</th>
          <th>Usuario</th>
          <th>Período</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map(m => (
          <tr key={m.id}>
            <td>{m.descripcion}</td>
            {}
            <td>{formatDate(m.fecha)}</td>
            <td>{Number(m.monto).toLocaleString("es-CL")}</td>
            <td className={`mt-tipo mt-tipo--${m.tipo}`}>
              {m.tipo === "ingreso" ? "+ ingreso" : "- egreso"}
            </td>
            <td>{m.usuario.nombreCompleto}</td>
            <td>{m.periodo.anio}</td>
            <td>
              <button
                className="btn-icon"
                title="Editar"
                onClick={() => onEdit(m)}
              >
                <FaEdit />
              </button>
              <button
                className="btn-icon"
                title="Eliminar"
                onClick={() => onDelete(m.id)}
              >
                <FaTrash />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
