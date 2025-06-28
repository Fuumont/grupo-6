"use strict";
import { AppDataSource } from "../config/configDb.js";
import Periodo from "../entity/periodo.academico.entity.js";

const periodoRepo = AppDataSource.getRepository(Periodo);

// Crear un nuevo periodo académico
export async function createPeriodoService(data) {
  try {
    const existente = await periodoRepo.findOneBy({ anio: data.anio });
    if (existente) {
      return [null, "Ya existe un periodo con ese año."];
    }

    const nuevo = periodoRepo.create(data);
    const guardado = await periodoRepo.save(nuevo);
    return [guardado, null];
  } catch (error) {
    console.error("Error al crear periodo:", error);
    return [null, "Error interno del servidor"];
  }
}

// Obtener todos los periodos
export async function getPeriodosService() {
  try {
    const periodos = await periodoRepo.find({ order: { anio: "DESC" } });

    if (!periodos || periodos.length === 0)
      return [[], "No se encontraron periodos académicos."];

    return [periodos, null];
  } catch (error) {
    console.error("Error al obtener periodos:", error);
    return [null, "Error interno del servidor"];
  }
}

// Obtener un periodo por ID
export async function getPeriodoService(id) {
  try {
    const periodo = await periodoRepo.findOneBy({ id });

    if (!periodo)
      return [null, "Periodo académico no encontrado"];

    return [periodo, null];
  } catch (error) {
    console.error("Error al obtener periodo:", error);
    return [null, "Error interno del servidor"];
  }
}

// Actualizar un periodo académico
export async function updatePeriodoService(id, data) {
  try {
    const periodo = await periodoRepo.findOneBy({ id });

    if (!periodo)
      return [null, "Periodo no encontrado"];

    const actualizado = { ...periodo, ...data, updatedAt: new Date() };
    await periodoRepo.save(actualizado);

    return [actualizado, null];
  } catch (error) {
    console.error("Error al actualizar periodo:", error);
    return [null, "Error interno del servidor"];
  }
}

// Eliminar un periodo académico
export async function deletePeriodoService(id) {
  try {
    const periodo = await periodoRepo.findOneBy({ id });

    if (!periodo)
      return [null, "Periodo no encontrado"];

    const eliminado = await periodoRepo.remove(periodo);
    return [eliminado, null];
  } catch (error) {
    console.error("Error al eliminar periodo:", error);
    return [null, "Error interno del servidor"];
  }
}
