"use strict";
import { EntitySchema, EntitySchemaOptions } from "typeorm";

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
    },

    propuestaId: {
      type: "int"
    },
    rut_usuario: {
      type: "varchar",
      length: 12
    }
  },
  relations: {
    propuesta: {
      type: "many-to-one",
      target: "Propuesta",
      joinColumn: {
        name: "propuestaId",
        referencedColumnName: "id"
      },
      nullable: false
    },
    usuario: {
      type: "many-to-one",
      target: "User", 
      joinColumn: {
        name: "rut_usuario",
        referencedColumnName: "rut"
      },
      nullable: false,

      createForeignKeyConstraints: true
    }
  }
});