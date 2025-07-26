"use strict";

import { AppDataSource } from "../config/configDb.js";
import Periodo from "../entity/periodo.academico.entity.js";
import User from "../entity/user.entity.js";

const periodoRepo = AppDataSource.getRepository(Periodo);
const userRepo    = AppDataSource.getRepository(User);

/**
 * Toma un string "YYYY-MM-DD" o un Date (que venga de Joi)
 * y devuelve un Date local a medianoche de ese mismo día.
 */
function parseLocalDate(input) {
  let y, m, d;
  if (typeof input === "string") {
    [y, m, d] = input.split("-").map(Number);
    m = m - 1;
  } else if (input instanceof Date) {
    y = input.getUTCFullYear();
    m = input.getUTCMonth();
    d = input.getUTCDate();
  } else {
    throw new Error("Fecha inválida en service: " + input);
  }
  return new Date(y, m, d);
}

// Crear un nuevo periodo académico
export async function createPeriodoService(data, id_usuario) {
  try {
    const existe = await periodoRepo.findOneBy({ anio: data.anio });
    if (existe) {
      return [null, "Ya existe un periodo con ese año."];
    }

    const fechaInicio = parseLocalDate(data.fecha_inicio);
    const fechaFin    = parseLocalDate(data.fecha_fin);

    const usuario = await userRepo.findOneBy({ id: id_usuario });
    if (!usuario) {
      return [null, "Usuario responsable no encontrado."];
    }

    const nuevo = periodoRepo.create({
      anio:         data.anio,
      fecha_inicio: fechaInicio,
      fecha_fin:    fechaFin,
      activo:       data.activo,
      usuario
    });
    const guardado = await periodoRepo.save(nuevo);
    return [guardado, null];
  } catch (err) {
    console.error("Error al crear periodo:", err);
    return [null, "Error interno del servidor"];
  }
}

// Obtener todos los periodos académicos (solo nombreCompleto del usuario)
export async function getPeriodosService() {
  try {
    const periodos = await periodoRepo.find({
      relations: ["usuario"],
      order: { anio: "DESC" }
    });
    if (!periodos.length) {
      return [[], "No se encontraron periodos académicos."];
    }

    const sanitizados = periodos.map(p => ({
      id:           p.id,
      anio:         p.anio,
      fecha_inicio: p.fecha_inicio,
      fecha_fin:    p.fecha_fin,
      activo:       p.activo,
      usuario: {
        nombreCompleto: p.usuario?.nombreCompleto ?? ""
      }
    }));

    return [sanitizados, null];
  } catch (err) {
    console.error("Error al obtener periodos:", err);
    return [null, "Error interno del servidor"];
  }
}

// Obtener un solo periodo por ID (solo nombreCompleto del usuario)
export async function getPeriodoService(id) {
  try {
    const p = await periodoRepo.findOne({
      where: { id },
      relations: ["usuario"]
    });
    if (!p) return [null, "Periodo académico no encontrado"];

    const sanitizado = {
      id:           p.id,
      anio:         p.anio,
      fecha_inicio: p.fecha_inicio,
      fecha_fin:    p.fecha_fin,
      activo:       p.activo,
      usuario: {
        nombreCompleto: p.usuario?.nombreCompleto ?? ""
      }
    };

    return [sanitizado, null];
  } catch (err) {
    console.error("Error al obtener periodo:", err);
    return [null, "Error interno del servidor"];
  }
}

// Actualizar un periodo académico
export async function updatePeriodoService(id, data, id_usuario) {
  try {
    const periodo = await periodoRepo.findOne({ where: { id } });
    if (!periodo) return [null, "Periodo no encontrado"];

    const fechaInicio = parseLocalDate(data.fecha_inicio);
    const fechaFin    = parseLocalDate(data.fecha_fin);

    const usuario = await userRepo.findOneBy({ id: id_usuario });
    if (!usuario) {
      return [null, "Usuario responsable no encontrado."];
    }

    periodoRepo.merge(periodo, {
      anio:         data.anio,
      fecha_inicio: fechaInicio,
      fecha_fin:    fechaFin,
      activo:       data.activo,
      usuario,
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
