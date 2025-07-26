import React from "react";
import { FaEdit, FaTrash, FaFilePdf } from "react-icons/fa";
import "@styles/PeriodosTable.css";

export default function PeriodosTable({
  data,
  onEdit,
  onDelete,
  onExportMovimientos,
  exporting
}) {
  return (
    <table className="pt-table">
      <thead className="pt-thead">
        <tr>
          <th>Año</th>
          <th>Inicio</th>
          <th>Fin</th>
          <th>Activo</th>
         <th>Responsable</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map(p => (
          <tr key={p.id} className="pt-tr">
            <td>{p.anio}</td>
            <td>{p.display_inicio}</td>
            <td>{p.display_fin}</td>
            <td>{p.activo ? "Sí" : "No"}</td>
           <td>{p.responsable}</td>
            <td className="pt-td-actions">
              <button
                className="pt-btn pt-btn-edit"
                onClick={() => onEdit(p)}
                title="Editar"
              >
                <FaEdit className="pt-icon" />
              </button>
              <button
                className="pt-btn pt-btn-delete"
                onClick={() => onDelete(p.id)}
                title="Eliminar"
              >
                <FaTrash className="pt-icon" />
              </button>

              <button
                className="pt-btn pt-btn-export"
                onClick={() => onExportMovimientos(p.id)}
                disabled={exporting}
                title={exporting ? "Exportando…" : "Descargar PDF"}
              >
                <FaFilePdf className="pt-icon" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
