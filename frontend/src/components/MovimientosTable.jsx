import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";  // <-- mismos que en Períodos

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
            <td>{m.fecha}</td>
            <td>{Number(m.monto).toLocaleString("es-CL")}</td>
            <td>{m.tipo}</td>
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
                onClick={() => {
                  if (
                    window.confirm(
                      "¿Estás seguro que deseas eliminar este movimiento?"
                    )
                  ) {
                    onDelete(m.id);
                  }
                }}
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
