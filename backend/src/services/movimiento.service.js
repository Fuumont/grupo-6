"use strict";
import { AppDataSource } from "../config/configDb.js";
import MovimientoSchema from "../entity/movimiento.entity.js";
import ActividadSchema from "../entity/actividad.entity.js";
import PeriodoAcademicoSchema from "../entity/periodo.academico.entity.js";
import User from "../entity/user.entity.js";

const movimientoRepo = AppDataSource.getRepository(MovimientoSchema);
const actividadRepo = AppDataSource.getRepository(ActividadSchema);
const periodoRepo = AppDataSource.getRepository(PeriodoAcademicoSchema);
const usuarioRepo = AppDataSource.getRepository(User);

// Crear un nuevo movimiento
export async function crearMovimientoService(data, userId) {
  try {
    const fecha = data.fecha || new Date();

    const periodo = await periodoRepo.findOneBy({ id: data.id_periodo });
    if (!periodo || !periodo.activo)
      return [null, "Periodo académico inválido o inactivo."];

    if (fecha < new Date(periodo.fecha_inicio) || fecha > new Date(periodo.fecha_fin))
      return [null, "La fecha no está dentro del periodo académico activo."];

    const usuario = await usuarioRepo.findOneBy({ id: userId });
    if (!usuario) return [null, "Usuario no encontrado."];
    if (usuario.rol !== "tesorero")
      return [null, "Solo el tesorero puede registrar movimientos."];

    if (data.tipo === "egreso") {
      if (data.id_actividad) {
        const actividad = await actividadRepo.findOneBy({ id: data.id_actividad });
        if (!actividad || actividad.aprobada_por_dde !== true)
          return [null, "La actividad asociada no está aprobada por la DDE."];
      }

      const movimientos = await movimientoRepo.findBy({ periodo: { id: data.id_periodo } });
      const saldoActual = movimientos.reduce((acc, m) =>
        m.tipo === "ingreso" ? acc + parseFloat(m.monto) : acc - parseFloat(m.monto), 0);
      if (saldoActual < data.monto)
        return [null, "Saldo insuficiente para realizar este egreso."];
    }

    const todosMovimientos = await movimientoRepo.findBy({ periodo: { id: data.id_periodo } });
    const saldoAntes = todosMovimientos.reduce((acc, m) =>
      m.tipo === "ingreso" ? acc + parseFloat(m.monto) : acc - parseFloat(m.monto), 0);

    const saldo_resultante = data.tipo === "ingreso"
      ? saldoAntes + data.monto
      : saldoAntes - data.monto;

    const nuevoMovimiento = movimientoRepo.create({
      monto: data.monto,
      tipo: data.tipo,
      descripcion: data.descripcion,
      fecha: fecha,
      usuario: { id: userId },
      actividad: data.id_actividad ? { id: data.id_actividad } : null,
      periodo: { id: data.id_periodo },
      saldo_resultante,
    });

    const guardado = await movimientoRepo.save(nuevoMovimiento);
    return [guardado, null];
  } catch (error) {
    console.error("Error al crear movimiento:", error);
    return [null, "Error interno del servidor."];
  }
}

// Obtener todos los movimientos 
export async function getMovimientosService() {
  try {
    const movimientos = await movimientoRepo.find({
      relations: ["usuario", "actividad", "periodo"],
      order: { id: "ASC" }
    });

    if (!movimientos || movimientos.length === 0)
      return [[], "No se encontraron movimientos"];

    const dataSanitizada = movimientos.map(m => ({
      id: m.id,
      monto: m.monto,
      tipo: m.tipo,
      descripcion: m.descripcion,
      fecha: m.fecha,
      saldo_resultante: m.saldo_resultante,
      usuario: {
        nombreCompleto: m.usuario?.nombreCompleto || "Usuario eliminado"
      },
      actividad: m.actividad ? {
        nombre: m.actividad.nombre
      } : null,
      periodo: {
        anio: m.periodo.anio
      }
    }));

    return [dataSanitizada, null];
  } catch (error) {
    console.error("Error al obtener movimientos:", error);
    return [null, "Error interno del servidor"];
  }
}

// Obtener un solo movimiento
export async function getMovimientoService(id) {
  try {
    const movimiento = await movimientoRepo.findOne({
      where: { id },
      relations: ["usuario", "actividad", "periodo"]
    });

    if (!movimiento)
      return [null, "Movimiento no encontrado"];

    const data = {
      id: movimiento.id,
      monto: movimiento.monto,
      tipo: movimiento.tipo,
      descripcion: movimiento.descripcion,
      fecha: movimiento.fecha,
      saldo_resultante: movimiento.saldo_resultante,
      usuario: {
        nombreCompleto: movimiento.usuario?.nombreCompleto || "Usuario eliminado"
      },
      actividad: movimiento.actividad ? {
        nombre: movimiento.actividad.nombre
      } : null,
      periodo: {
        anio: movimiento.periodo.anio
      }
    };

    return [data, null];
  } catch (error) {
    console.error("Error al obtener movimiento:", error);
    return [null, "Error interno del servidor"];
  }
}

// Eliminar un movimiento
export async function deleteMovimientoService(id) {
  try {
    const movimiento = await movimientoRepo.findOneBy({ id });

    if (!movimiento)
      return [null, "Movimiento no encontrado"];

    const eliminado = await movimientoRepo.remove(movimiento);

    return [eliminado, null];
  } catch (error) {
    console.error("Error al eliminar movimiento:", error);
    return [null, "Error interno del servidor"];
  }
}

// Actualizar un movimiento por ID
export async function updateMovimientoService(id, data) {
  try {
    const movimiento = await movimientoRepo.findOneBy({ id });

    if (!movimiento)
      return [null, "Movimiento no encontrado"];

    // Validar periodo
    const periodo = await periodoRepo.findOneBy({ id: data.id_periodo });
    if (!periodo) {
      return [null, "Periodo académico no existe."];
    }

    // Validar actividad solo si se envía
    let actividad = null;
    if (data.id_actividad) {
      actividad = await actividadRepo.findOneBy({ id: data.id_actividad });
      if (!actividad || !actividad.aprobada_por_dde) {
        return [null, "La actividad especificada no existe o no está aprobada por la DDE."];
      }
    }

    // Validar fecha dentro del periodo
    const fecha = new Date(data.fecha);
    if (fecha < new Date(periodo.fecha_inicio) || fecha > new Date(periodo.fecha_fin)) {
      return [null, "La fecha está fuera del rango del periodo académico."];
    }

    // Calcular saldo antes de este movimiento
    const todosMovimientos = await movimientoRepo.findBy({ periodo: { id: data.id_periodo } });
    const saldoAntes = todosMovimientos
      .filter((m) => m.id !== id)
      .reduce((acc, m) => m.tipo === "ingreso"
        ? acc + parseFloat(m.monto)
        : acc - parseFloat(m.monto), 0);

    const saldo_resultante = data.tipo === "ingreso"
      ? saldoAntes + data.monto
      : saldoAntes - data.monto;

    if (data.tipo === "egreso" && saldo_resultante < 0) {
      return [null, "Saldo insuficiente para este egreso después de la modificación."];
    }

    const actualizado = {
      ...movimiento,
      monto: data.monto,
      tipo: data.tipo,
      descripcion: data.descripcion,
      fecha: data.fecha,
      periodo: { id: data.id_periodo },
      actividad: actividad ? { id: actividad.id } : null,
      saldo_resultante,
      updatedAt: new Date(),
    };

    await movimientoRepo.save(actualizado);
    return [actualizado, null];
  } catch (error) {
    console.error("Error al actualizar movimiento:", error);
    return [null, "Error interno del servidor"];
  }
}
