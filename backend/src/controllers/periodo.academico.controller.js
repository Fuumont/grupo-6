"use strict";

import {
  createPeriodoService,
  deletePeriodoService,
  getPeriodoService,
  getPeriodosService,
  updatePeriodoService,
} from "../services/periodo.academico.service.js";

import { periodoValidation } from "../validations/periodo.academico.validation.js";

import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

// Crear un nuevo periodo académico
export async function createPeriodo(req, res) {
  try {
    const { error, value } = periodoValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errores = error.details.map((e) => e.message);
      return handleErrorClient(res, 400, errores);
    }

    // Extraemos el id del usuario logueado (igual que en Movimientos)
    const id_usuario = req.user.id;

    // Pasamos el cuerpo validado y el id del usuario al servicio
    const [periodoCreado, errorServicio] = await createPeriodoService(
      value,
      id_usuario
    );

    if (errorServicio) {
      return handleErrorClient(res, 400, errorServicio);
    }

    return handleSuccess(
      res,
      201,
      periodoCreado,
      "Periodo creado exitosamente."
    );
  } catch (error) {
    return handleErrorServer(res, 500, error.message);
  }
}

// Obtener todos los periodos académicos
export async function getPeriodos(req, res) {
  try {
    const [periodos, errorServicio] = await getPeriodosService();

    if (errorServicio) {
      return handleSuccess(res, 200, [], errorServicio);
    }

    return handleSuccess(res, 200, periodos, "Periodos encontrados.");
  } catch (error) {
    return handleErrorServer(res, 500, error.message);
  }
}

// Obtener un periodo por ID
export async function getPeriodo(req, res) {
  try {
    const { id } = req.query;
    if (!id || isNaN(id)) {
      return handleErrorClient(res, 400, "ID inválido o no proporcionado.");
    }

    const [periodo, errorServicio] = await getPeriodoService(parseInt(id));
    if (errorServicio) {
      return handleErrorClient(res, 404, errorServicio);
    }

    return handleSuccess(res, 200, periodo, "Periodo encontrado.");
  } catch (error) {
    return handleErrorServer(res, 500, error.message);
  }
}

// Actualizar un periodo académico
export async function updatePeriodo(req, res) {
  try {
    const { id } = req.query;
    if (!id || isNaN(id)) {
      return handleErrorClient(res, 400, "ID inválido o no proporcionado.");
    }

    const { error, value } = periodoValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const mensajes = error.details.map((e) => e.message);
      return handleErrorClient(res, 400, mensajes);
    }

    // Igual que en Movimientos, extraemos el usuario
    const id_usuario = req.user.id;

    // Pasamos el id, el cuerpo validado y el usuario al servicio
    const [periodoActualizado, errorServicio] = await updatePeriodoService(
      parseInt(id),
      value,
      id_usuario
    );
    if (errorServicio) {
      return handleErrorClient(res, 400, errorServicio);
    }

    return handleSuccess(
      res,
      200,
      periodoActualizado,
      "Periodo actualizado correctamente."
    );
  } catch (error) {
    return handleErrorServer(res, 500, error.message);
  }
}

// Eliminar un periodo académico
export async function deletePeriodo(req, res) {
  try {
    const { id } = req.query;
    if (!id || isNaN(id)) {
      return handleErrorClient(res, 400, "ID inválido o no proporcionado.");
    }

    const [periodoEliminado, errorServicio] = await deletePeriodoService(
      parseInt(id)
    );
    if (errorServicio) {
      return handleErrorClient(res, 404, errorServicio);
    }

    return handleSuccess(
      res,
      200,
      periodoEliminado,
      "Periodo eliminado correctamente."
    );
  } catch (error) {
    return handleErrorServer(res, 500, error.message);
  }
}
