"use strict";
import Joi from "joi";

export const movimientoValidation = Joi.object({
  monto: Joi.number()
    .positive()
    .precision(2)
    .max(99999999.99)
    .required()
    .messages({
      "number.base":     "El monto debe ser un número.",
      "number.positive": "El monto debe ser un valor positivo en pesos chilenos.",
      "number.max":      "El monto no puede exceder $99 999 999,99.",
      "number.precision":"El monto no puede tener más de 2 decimales.",
      "any.required":    "El monto es obligatorio."
    }),

  tipo: Joi.string()
    .valid("ingreso", "egreso")
    .required()
    .messages({
      "string.base":    "El tipo debe ser una cadena de texto.",
      "any.only":       "El tipo debe ser 'ingreso' o 'egreso'.",
      "any.required":   "El tipo es obligatorio."
    }),

  descripcion: Joi.string()
    .min(10)
    .max(100)
    .pattern(/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ.,\-()]+$/)
    .required()
    .messages({
      "string.empty":         "La descripción no puede estar vacía.",
      "string.min":           "La descripción debe tener al menos 10 caracteres.",
      "string.max":           "La descripción debe tener como máximo 100 caracteres.",
      "string.pattern.base":  "La descripción contiene caracteres inválidos.",
      "any.required":         "La descripción es obligatoria."
    }),

  fecha: Joi.date()
    .less("now")
    .optional()
    .messages({
      "date.base": "La fecha debe ser válida.",
      "date.less": "La fecha no puede ser futura."
    }),

  // No permitimos que el cliente envíe el id_usuario (se asigna desde el token)
  id_usuario: Joi.forbidden()
    .messages({
      "any.unknown": "No envíes el usuario; se toma del token."
    }),

  id_actividad: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base": "El ID de la actividad debe ser un número.",
      "number.integer": "El ID de la actividad debe ser un entero positivo."
    }),

  id_propuesta: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base":    "El ID de la propuesta debe ser un número.",
      "number.integer": "El ID de la propuesta debe ser un entero positivo."
    }),

  id_periodo: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base":    "El ID del periodo académico debe ser numérico.",
      "number.integer": "El ID del periodo académico debe ser un entero positivo.",
      "any.required":   "El ID del periodo académico es obligatorio."
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales."
  });
