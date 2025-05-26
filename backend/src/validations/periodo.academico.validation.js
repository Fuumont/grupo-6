"use strict";
import Joi from "joi";

export const periodoValidation = Joi.object({
  anio: Joi.number().integer().min(2000).max(2100).required()
    .messages({
      "number.base": "El año debe ser un número.",
      "number.min": "El año mínimo permitido es 2000.",
      "number.max": "El año máximo permitido es 2100.",
      "any.required": "El año es obligatorio."
    }),

  fecha_inicio: Joi.date().iso().required()
    .messages({
      "date.base": "La fecha de inicio debe ser válida.",
      "any.required": "La fecha de inicio es obligatoria."
    }),

  fecha_fin: Joi.date().iso().greater(Joi.ref("fecha_inicio")).required()
    .messages({
      "date.greater": "La fecha de término debe ser posterior a la de inicio.",
      "any.required": "La fecha de término es obligatoria."
    }),

  activo: Joi.boolean().required()
    .messages({
      "boolean.base": "El estado activo debe ser verdadero o falso.",
      "any.required": "El campo activo es obligatorio."
    }),
});
