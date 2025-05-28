"use strict";
import { EntitySchema } from "typeorm";

export const AprobacionSchema = new EntitySchema({
  name: "Aprobacion",
  tableName: "aprobacion", 
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true
    },
    voto: {
      type: "boolean",
      nullable: false
    },
    comentario: {
      type: "text",
      nullable: true
    },
    fecha_voto: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP"
    }
  },

  relations: {
    propuesta: {
      type: "many-to-one",
      target: "Propuesta",
      joinColumn: "propuestaId",
      nullable: false
    },
    usuario: {
      type: "many-to-one",
      target: "User",
      joinColumn: "rutUsuario",
      nullable: false
    }
  }
});

export default AprobacionSchema;