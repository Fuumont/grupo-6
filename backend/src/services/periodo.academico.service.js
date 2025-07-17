"use strict";

import { AppDataSource } from "../config/configDb.js";
import Periodo from "../entity/periodo.academico.entity.js";

const periodoRepo = AppDataSource.getRepository(Periodo);

/**
 * Toma un string "YYYY-MM-DD" o un Date (que venga de Joi)
 * y devuelve un Date local a medianoche de ese mismo día.
 */
function parseLocalDate(input) {
  let y, m, d;
  if (typeof input === "string") {
    // Split de la cadena
    [y, m, d] = input.split("-").map(Number);
    m = m - 1;
  } else if (input instanceof Date) {
    // Extraer la parte UTC (no la local)
    y = input.getUTCFullYear();
    m = input.getUTCMonth();
    d = input.getUTCDate();
  } else {
    throw new Error("Fecha inválida en service: " + input);
  }
  // Construir fecha local a medianoche
  return new Date(y, m, d);
}

// Crear un nuevo periodo académico
export async function createPeriodoService(data) {
  try {
    // 1) Evitar duplicados por año
    const existe = await periodoRepo.findOneBy({ anio: data.anio });
    if (existe) {
      return [null, "Ya existe un periodo con ese año."];
    }

    // 2) Parsear correctamente ambas fechas
    const fechaInicio = parseLocalDate(data.fecha_inicio);
    const fechaFin    = parseLocalDate(data.fecha_fin);

    // 3) Crear y guardar la entidad
    const nuevo = periodoRepo.create({
      anio:         data.anio,
      fecha_inicio: fechaInicio,
      fecha_fin:    fechaFin,
      activo:       data.activo
    });
    const guardado = await periodoRepo.save(nuevo);
    return [guardado, null];
  } catch (err) {
    console.error("Error al crear periodo:", err);
    return [null, "Error interno del servidor"];
  }
}

// Obtener todos los periodos académicos
export async function getPeriodosService() {
  try {
    const periodos = await periodoRepo.find({ order: { anio: "DESC" } });
    if (!periodos.length) {
      return [[], "No se encontraron periodos académicos."];
    }
    return [periodos, null];
  } catch (err) {
    console.error("Error al obtener periodos:", err);
    return [null, "Error interno del servidor"];
  }
}

// Obtener un solo periodo por ID
export async function getPeriodoService(id) {
  try {
    const p = await periodoRepo.findOneBy({ id });
    if (!p) return [null, "Periodo académico no encontrado"];
    return [p, null];
  } catch (err) {
    console.error("Error al obtener periodo:", err);
    return [null, "Error interno del servidor"];
  }
}

// Actualizar un periodo académico
export async function updatePeriodoService(id, data) {
  try {
    const periodo = await periodoRepo.findOneBy({ id });
    if (!periodo) return [null, "Periodo no encontrado"];

    // Mismo parseo UTC→local
    const fechaInicio = parseLocalDate(data.fecha_inicio);
    const fechaFin    = parseLocalDate(data.fecha_fin);

    Object.assign(periodo, {
      anio:         data.anio,
      fecha_inicio: fechaInicio,
      fecha_fin:    fechaFin,
      activo:       data.activo,
      updatedAt:    new Date()
    });

    const actualizado = await periodoRepo.save(periodo);
    return [actualizado, null];
  } catch (err) {
    console.error("Error al actualizar periodo:", err);
    return [null, "Error interno del servidor"];
  }
}

// Eliminar un periodo académico
export async function deletePeriodoService(id) {
  try {
    const periodo = await periodoRepo.findOneBy({ id });
    if (!periodo) return [null, "Periodo no encontrado"];
    const eliminado = await periodoRepo.remove(periodo);
    return [eliminado, null];
  } catch (err) {
    console.error("Error al eliminar periodo:", err);
    return [null, "Error interno del servidor"];
  }
}
