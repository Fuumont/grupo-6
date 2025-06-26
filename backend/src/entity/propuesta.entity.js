"use strict";
import { EntitySchema } from "typeorm";

const PropuestaSchema = new EntitySchema({
    name: "Propuesta",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        },
        nombre_actividad: {
            type: "varchar",
            lenght: "100",
            nullable: false
        },
        objetivo: {
            type: "text",
            nullable: false
        },
        fecha_propuesta: {
            type: "date",
            nullable: false
        },
        estado: {
            type: "varchar",
            lenght: 30,
            default: "Borrador",
            enum: ["Borrador", "Pendiente", "Aprobada Internamente", "Enviada a DDE", "Aprobada por DEE", "Rechazada"]
        },
        estado_dde: {
          type: "boolean",
          default: false,
          nullable: false
        },
        fecha_creacion: {
            type: "date",
            default: () => "CURRENT_TIMESTAMP"
        }
    },

    relations: {
    creador: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "rutCreador",
        referencedColumnName: "rut"
      },
      nullable: false
    },
    espacio: {
      type: "many-to-one",
      target: "Espacio",
      nullable: true
    },
    aprobaciones: {
      type: "one-to-many",
      target: "Aprobacion",
      inverseSide: "propuesta"
    }
    }
});

export default PropuestaSchema;

