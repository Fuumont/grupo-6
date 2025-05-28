"use strict";
import { EntitySchema } from "typeorm";

const ActividadSchema = new EntitySchema({
  name: "Actividad",
  tableName: "actividades",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    descripcion: {
      type: "text",
      nullable: true,
    },
    fecha: {
      type: "date",
      nullable: false,
    },
    estado: {
      type: "varchar",
      length: 20,
      default: "pendiente",
      nullable: false,
    },
    aprobada_por_dde: {
      type: "boolean",
      default: false,
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_ACTIVIDAD_ID",
      columns: ["id"],
      unique: true,
    },
  ],
});

export default ActividadSchema;
