"use strict";

import {
  crearMovimientoService,
  deleteMovimientoService,
  getMovimientoService,
  getMovimientosService,
  updateMovimientoService,
} from "../services/movimiento.service.js";

import { movimientoValidation } from "../validations/movimiento.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import { calcularSaldoService } from "../services/movimiento.service.js";

// Crear un nuevo movimiento
export async function createMovimiento(req, res) {
  try {
    // Validar el body (sin id_usuario)
    const { error, value } = movimientoValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errores = error.details.map((e) => e.message);
      return handleErrorClient(res, 400, errores);
    }

    // Tomar el ID del usuario autenticado
    const userId = req.user.id;

    // Ejecutar el servicio
    const [resultado, errorServicio] = await crearMovimientoService(value, userId);

    if (errorServicio) {
      return handleErrorClient(res, 400, errorServicio);
    }

    return handleSuccess(res, 201, resultado, "Movimiento creado correctamente.");
  } catch (error) {
    return handleErrorServer(res, 500, error.message);
  }
}

// Obtener todos los movimientos
// Obtener todos los movimientos
export async function getMovimientos(req, res) {
  try {
    const [resultado, errorMovimientos] = await getMovimientosService();

    if (errorMovimientos) return handleErrorClient(res, 404, errorMovimientos);

    if (!resultado || resultado.movimientos.length === 0) {
      return handleSuccess(res, 204);
    }

    return handleSuccess(res, 200, "Movimientos encontrados", {
      movimientos: resultado.movimientos,
      saldo: resultado.saldo,
    });
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}



// Obtener un solo movimiento por ID
export async function getMovimiento(req, res) {
  try {
    const { id } = req.query;

    if (!id || isNaN(id)) {
      return handleErrorClient(res, 400, "ID inválido o no proporcionado.");
    }

    const [movimiento, errorMovimiento] = await getMovimientoService(parseInt(id));

    if (errorMovimiento) return handleErrorClient(res, 404, errorMovimiento);

    handleSuccess(res, 200, "Movimiento encontrado", movimiento);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Actualizar un movimiento
export async function updateMovimiento(req, res) {
  try {
    const { id } = req.query;
    const { body } = req;

    if (!id || isNaN(id)) {
      return handleErrorClient(res, 400, "ID inválido o no proporcionado.");
    }

    const { error } = movimientoValidation.validate(body);

    if (error) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        error.message,
      );
    }

    const [movimientoActualizado, errorActualizacion] = await updateMovimientoService(parseInt(id), body);

    if (errorActualizacion)
      return handleErrorClient(res, 400, "Error modificando el movimiento", errorActualizacion);

    handleSuccess(res, 200, "Movimiento actualizado correctamente", movimientoActualizado);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Eliminar un movimiento
export async function deleteMovimiento(req, res) {
  try {
    const { id } = req.query;

    if (!id || isNaN(id)) {
      return handleErrorClient(res, 400, "ID inválido o no proporcionado.");
    }

    const [movimientoEliminado, errorEliminacion] = await deleteMovimientoService(parseInt(id));

    if (errorEliminacion)
      return handleErrorClient(res, 404, "Error al eliminar el movimiento", errorEliminacion);

    handleSuccess(res, 200, "Movimiento eliminado correctamente", movimientoEliminado);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
// Obterner el saldo total de todos los movimientos
export async function getSaldo(req, res) {
  try {
    const [saldo, error] = await calcularSaldoService();

    if (error) {
      return handleErrorClient(res, 404, error);
    }

    return handleSuccess(res, 200, "Saldo total calculado", { saldo_total: saldo });
  } catch (error) {
    console.error("Error al calcular saldo:", error);
    return handleErrorServer(res, 500, "Error al calcular saldo");
  }
}