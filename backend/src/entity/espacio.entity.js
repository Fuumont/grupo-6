"use strict";
import { EntitySchema, EntitySchemaOptions } from "typeorm";

export const EspacioSchema = new EntitySchema({
  name: "Espacio",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true
    },
    nombre: {
      type: "varchar",
      length: 50,
      nullable: false
    },
    capacidad: {
      type: "int",
      nullable: false
    },
    horario_disponible: {
      type: "text",
      nullable: true
    },
    dias_disponibles: {
        type: "text",
        nullable: true
    }
    },
    
    relations: {
    propuestas: {
    type: "one-to-many",
    target: "Propuesta",
    inverseSide: "espacio"
    }
  }
});

export default EspacioSchema;