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
  },
  relations: {
    usuario: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "id_usuario" },
      nullable: false,
      onDelete: "CASCADE",
    },
  propuesta: {
      type: "many-to-one",
      target: "Propuesta",
      joinColumn: true,
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
