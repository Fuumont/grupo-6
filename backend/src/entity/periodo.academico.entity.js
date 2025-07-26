"use strict";
import { EntitySchema } from "typeorm";

const PeriodoAcademicoSchema = new EntitySchema({
  name: "PeriodoAcademico",
  tableName: "periodos_academicos",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    anio: {
      type: "int",
      nullable: false,
      unique: true,
    },
    fecha_inicio: {
      type: "date",
      nullable: false,
    },
    fecha_fin: {
      type: "date",
      nullable: false,
    },
    activo: {
      type: "boolean",
      default: false,
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_PERIODO_ANIO",
      columns: ["anio"],
      unique: true,
    },
  ],
  relations: {
    usuario: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "id_usuario" },
      eager: true,
      nullable: true,
      onDelete: "CASCADE",
    },
  },
});

export default PeriodoAcademicoSchema;
