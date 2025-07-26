"use strict";

import { AppDataSource } from "../config/configDb.js";
import MovimientoSchema from "../entity/movimiento.entity.js";
import PropuestaSchema from "../entity/propuesta.entity.js";
import PeriodoAcademicoSchema from "../entity/periodo.academico.entity.js";
import User from "../entity/user.entity.js";

const movimientoRepo = AppDataSource.getRepository(MovimientoSchema);
const propuestaRepo  = AppDataSource.getRepository(PropuestaSchema);
const periodoRepo    = AppDataSource.getRepository(PeriodoAcademicoSchema);
const usuarioRepo    = AppDataSource.getRepository(User);

// Helper para obtener YYYY-MM-DD en horario local
function getLocalDateString() {
  const d = new Date();
  const day   = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year  = d.getFullYear();
  return `${year}-${month}-${day}`;
}

// Crear un nuevo movimiento
export async function crearMovimientoService(data, userId) {
  try {
    // 1) Determinar la cadena YYYY-MM-DD
    const fechaStr = typeof data.fecha === "string" && data.fecha.length === 10
      ? data.fecha
      : getLocalDateString();
    // 2) Convertir para validar
    const fechaObj = new Date(fechaStr);

    const periodo = await periodoRepo.findOneBy({ id: data.id_periodo });
    if (!periodo || !periodo.activo)
      return [null, "Periodo académico inválido o inactivo."];

    if (fechaObj < new Date(periodo.fecha_inicio) ||
        fechaObj > new Date(periodo.fecha_fin)) {
      return [null, "La fecha no está dentro del periodo académico activo."];
    }

    const usuario = await usuarioRepo.findOneBy({ id: userId });
    if (!usuario) return [null, "Usuario no encontrado."];
    if (usuario.rol !== "tesorero")
      return [null, "Solo el tesorero puede registrar movimientos."];

    // Validación de egresos obligando propuesta aprobada por DDE
    if (data.tipo === "egreso") {
      const propuestaId = data.id_propuesta ?? data.propuestaId;
      if (!propuestaId) {
        return [null, "Para crear un egreso debes indicar una propuesta aprobada por la DDE."];
      }
      const propuesta = await propuestaRepo.findOneBy({ id: propuestaId });
      if (!propuesta || propuesta.estado_dde !== true) {
        return [null, "La propuesta no ha sido aprobada por la DDE."];
      }

      const movs = await movimientoRepo.findBy({ periodo: { id: data.id_periodo } });
      const saldoActual = movs.reduce(
        (acc, m) => m.tipo === "ingreso"
          ? acc + parseFloat(m.monto)
          : acc - parseFloat(m.monto),
        0
      );
      if (saldoActual < data.monto)
        return [null, "Saldo insuficiente para realizar este egreso."];
    }

    // 3) Creamos el movimiento usando la cadena
    const nuevoMovimiento = movimientoRepo.create({
      monto:       data.monto,
      tipo:        data.tipo,
      descripcion: data.descripcion,
      fecha:       fechaStr,
      usuario:     { id: userId },
      periodo:     { id: data.id_periodo },
      propuesta:   (data.id_propuesta ?? data.propuestaId)
                    ? { id: data.id_propuesta ?? data.propuestaId }
                    : null
    });

    const guardado = await movimientoRepo.save(nuevoMovimiento);
    return [guardado, null];
  } catch (error) {
    console.error("Error al crear movimiento:", error);
    return [null, "Error interno del servidor."];
  }
}

// Obtener todos los movimientos activos
export async function getMovimientosService() {
  try {
    const movimientos = await movimientoRepo
      .createQueryBuilder("m")
      .leftJoinAndSelect("m.usuario", "usuario")
      .leftJoinAndSelect("m.propuesta", "propuesta")
      .leftJoinAndSelect("m.periodo", "periodo")
      .where("m.activo = :activo", { activo: true })
      .orderBy("m.id", "ASC")
      .getMany();

    if (!movimientos.length) {
      return [[], "No se encontraron movimientos"];
    }

    const saldo = movimientos.reduce(
      (acc, m) =>
        m.tipo === "ingreso" ? acc + parseFloat(m.monto) : acc - parseFloat(m.monto),
      0
    );

    const dataSanitizada = movimientos.map(m => ({
      id:          m.id,
      monto:       m.monto,
      tipo:        m.tipo,
      descripcion: m.descripcion,
      fecha:       m.fecha,
      usuario:     { nombreCompleto: m.usuario?.nombreCompleto || "Usuario eliminado" },
      propuesta:   m.propuesta ? { nombre: m.propuesta.nombre } : null,
      periodo:     { anio: m.periodo.anio }
    }));

    return [{ movimientos: dataSanitizada, saldo }, null];
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
      relations: ["usuario", "propuesta", "periodo"]
    });
    if (!movimiento) return [null, "Movimiento no encontrado"];

    const data = {
      id:          movimiento.id,
      monto:       movimiento.monto,
      tipo:        movimiento.tipo,
      descripcion: movimiento.descripcion,
      fecha:       movimiento.fecha,
      usuario:     { nombreCompleto: movimiento.usuario?.nombreCompleto || "Usuario eliminado" },
      propuesta:   movimiento.propuesta ? { nombre: movimiento.propuesta.nombre } : null,
      periodo:     { anio: movimiento.periodo.anio }
    };
    return [data, null];
  } catch (error) {
    console.error("Error al obtener movimiento:", error);
    return [null, "Error interno del servidor"];
  }
}

// Soft‑delete
export async function deleteMovimientoService(id) {
  try {
    const movimiento = await movimientoRepo.findOneBy({ id });
    if (!movimiento) return [null, "Movimiento no encontrado"];
    movimiento.activo = false;
    const inactivado = await movimientoRepo.save(movimiento);
    return [inactivado, null];
  } catch (error) {
    console.error("Error al inactivar movimiento:", error);
    return [null, "Error interno del servidor"];
  }
}

// Actualizar un movimiento
export async function updateMovimientoService(id, data) {
  try {
    const mov = await movimientoRepo.findOneBy({ id });
    if (!mov) return [null, "Movimiento no encontrado"];

    const periodo = await periodoRepo.findOneBy({ id: data.id_periodo });
    if (!periodo) return [null, "Periodo académico no existe."];

    // parseamos "YYYY-MM-DD"
    const [year, month, day] = data.fecha.split("-").map(Number);
    const fechaObj = new Date(year, month - 1, day);
    fechaObj.setHours(12, 0, 0, 0);

    if (fechaObj < new Date(periodo.fecha_inicio) ||
        fechaObj > new Date(periodo.fecha_fin)) {
      return [null, "La fecha está fuera del rango del periodo académico."];
    }

    const todosMovs = await movimientoRepo.findBy({ periodo: { id: data.id_periodo } });
    const saldoAntes = todosMovs
      .filter(m2 => m2.id !== id)
      .reduce((acc, m2) =>
        m2.tipo === "ingreso" ? acc + parseFloat(m2.monto) : acc - parseFloat(m2.monto),
      0);
    const saldoResult = data.tipo === "ingreso"
      ? saldoAntes + data.monto
      : saldoAntes - data.monto;
    if (data.tipo === "egreso" && saldoResult < 0)
      return [null, "Saldo insuficiente para este egreso después de la modificación."];

    const actualizado = {
      ...mov,
      monto:       data.monto,
      tipo:        data.tipo,
      descripcion: data.descripcion,
      fecha:       fechaObj,
      periodo:     { id: data.id_periodo },
      propuesta:   data.propuestaId ? { id: data.propuestaId } : null,
      updatedAt:   new Date()
    };
    await movimientoRepo.save(actualizado);
    return [actualizado, null];
  } catch (error) {
    console.error("Error al actualizar movimiento:", error);
    return [null, "Error interno del servidor"];
  }
}

// Calcular saldo
export async function calcularSaldoService() {
  try {
    const movimientos = await movimientoRepo.find({ select: ["tipo", "monto"] });
    if (!movimientos.length) return [0, "No hay movimientos registrados"];
    const saldo = movimientos.reduce((acc, m) =>
      m.tipo === "ingreso" ? acc + parseFloat(m.monto) : acc - parseFloat(m.monto),
    0);
    return [saldo, null];
  } catch (error) {
    console.error("Error al calcular saldo:", error);
    return [null, "Error interno al calcular saldo"];
  }
}

// Obtener movimientos inactivos
export async function getMovimientosInactivosService() {
  try {
    const movs = await movimientoRepo
      .createQueryBuilder("m")
      .leftJoinAndSelect("m.usuario",   "usuario")
      .leftJoinAndSelect("m.propuesta", "propuesta")
      .leftJoinAndSelect("m.periodo",   "periodo")
      .where("m.activo = :activo", { activo: false })
      .orderBy("m.id", "ASC")
      .getMany();

    return [movs, null];
  } catch (error) {
    console.error("Error al obtener movimientos inactivos:", error);
    return [null, "Error interno del servidor"];
  }
}

// Restaurar movimiento
export async function restoreMovimientoService(id) {
  try {
    const mov = await movimientoRepo.findOneBy({ id });
    if (!mov) return [null, "Movimiento no encontrado"];
    mov.activo = true;
    const rest = await movimientoRepo.save(mov);
    return [rest, null];
  } catch (error) {
    console.error("Error al restaurar movimiento:", error);
    return [null, "Error interno del servidor"];
  }
}
