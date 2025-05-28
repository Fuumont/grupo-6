"use strict";
import { EntitySchema } from "typeorm";

const MovimientoSchema = new EntitySchema({
  name: "Movimiento",
  tableName: "movimientos",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    monto: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    tipo: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    descripcion: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    fecha: {
      type: "date",
      nullable: false,
    },
    saldo_resultante: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: true,
    },
  },
  relations: {
    usuario: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "id_usuario" },
      nullable: false,
      onDelete: "CASCADE",
    },
    actividad: {
      type: "many-to-one",
      target: "Actividad",
      joinColumn: { name: "id_actividad" },
      nullable: true,
    },
    periodo: {
      type: "many-to-one",
      target: "PeriodoAcademico",
      joinColumn: { name: "id_periodo" },
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_MOVIMIENTO",
      columns: ["id"],
      unique: true,
    },
  ],
});

export default MovimientoSchema;
