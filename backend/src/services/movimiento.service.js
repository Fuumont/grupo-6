"use strict";
import { AppDataSource } from "../config/configDb.js";
import MovimientoSchema from "../entity/movimiento.entity.js";
import PropuestaSchema from "../entity/propuesta.entity.js";
import PeriodoAcademicoSchema from "../entity/periodo.academico.entity.js";
import User from "../entity/user.entity.js";

const movimientoRepo = AppDataSource.getRepository(MovimientoSchema);
const propuestaRepo = AppDataSource.getRepository(PropuestaSchema);
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

    // Validación de egresos
    if (data.tipo === "egreso") {
      if (data.propuestaId) {
        const propuesta = await propuestaRepo.findOneBy({ id: data.propuestaId });
        if (!propuesta || propuesta.estado_dde !== true)
          return [null, "La propuesta no ha sido aprobada por la DDE."];
      }

      const movimientos = await movimientoRepo.findBy({ periodo: { id: data.id_periodo } });
      const saldoActual = movimientos.reduce((acc, m) =>
        m.tipo === "ingreso" ? acc + parseFloat(m.monto) : acc - parseFloat(m.monto), 0);
      if (saldoActual < data.monto)
        return [null, "Saldo insuficiente para realizar este egreso."];
    }

    const nuevoMovimiento = movimientoRepo.create({
      monto: data.monto,
      tipo: data.tipo,
      descripcion: data.descripcion,
      fecha: fecha,
      usuario: { id: userId },
      periodo: { id: data.id_periodo },
      propuesta: data.propuestaId ? { id: data.propuestaId } : null
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
      relations: ["usuario", "propuesta", "periodo"],
      order: { id: "ASC" }
    });

    if (!movimientos || movimientos.length === 0)
      return [[], "No se encontraron movimientos"];

    // Calcular saldo dinámico
    const saldo = movimientos.reduce((acc, m) =>
      m.tipo === "ingreso" ? acc + parseFloat(m.monto) : acc - parseFloat(m.monto), 0);

    const dataSanitizada = movimientos.map(m => ({
      id: m.id,
      monto: m.monto,
      tipo: m.tipo,
      descripcion: m.descripcion,
      fecha: m.fecha,
      usuario: {
        nombreCompleto: m.usuario?.nombreCompleto || "Usuario eliminado"
      },
      propuesta: m.propuesta ? {
        nombre: m.propuesta.nombre
      } : null,
      periodo: {
        anio: m.periodo.anio
      }
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

    if (!movimiento)
      return [null, "Movimiento no encontrado"];

    const data = {
      id: movimiento.id,
      monto: movimiento.monto,
      tipo: movimiento.tipo,
      descripcion: movimiento.descripcion,
      fecha: movimiento.fecha,
      usuario: {
        nombreCompleto: movimiento.usuario?.nombreCompleto || "Usuario eliminado"
      },
      propuesta: movimiento.propuesta ? {
        nombre: movimiento.propuesta.nombre
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
    if (!movimiento) return [null, "Movimiento no encontrado"];

    const periodo = await periodoRepo.findOneBy({ id: data.id_periodo });
    if (!periodo) return [null, "Periodo académico no existe."];

    // Validar propuesta si viene
    let propuesta = null;
    if (data.id_propuesta) {
      propuesta = await propuestaRepo.findOneBy({ id: data.id_propuesta });
      if (!propuesta || !propuesta.estado_dde)
        return [null, "La propuesta no existe o no ha sido aprobada por la DDE"];
    }

    const fecha = new Date(data.fecha);
    if (fecha < new Date(periodo.fecha_inicio) || fecha > new Date(periodo.fecha_fin))
      return [null, "La fecha está fuera del rango del periodo académico."];

    // Saldo sin contar el movimiento actual
    const todosMovimientos = await movimientoRepo.findBy({ periodo: { id: data.id_periodo } });
    const saldoAntes = todosMovimientos
      .filter((m) => m.id !== id)
      .reduce((acc, m) =>
        m.tipo === "ingreso" ? acc + parseFloat(m.monto) : acc - parseFloat(m.monto), 0);

    const saldo_resultante = data.tipo === "ingreso"
      ? saldoAntes + data.monto
      : saldoAntes - data.monto;

    if (data.tipo === "egreso" && saldo_resultante < 0)
      return [null, "Saldo insuficiente para este egreso después de la modificación."];

    const actualizado = {
      ...movimiento,
      monto: data.monto,
      tipo: data.tipo,
      descripcion: data.descripcion,
      fecha: data.fecha,
      periodo: { id: data.id_periodo },
      propuesta: propuesta ? { id: propuesta.id } : null,
      updatedAt: new Date(),
    };

    await movimientoRepo.save(actualizado);
    return [actualizado, null];
  } catch (error) {
    console.error("Error al actualizar movimiento:", error);
    return [null, "Error interno del servidor"];
  }
}
  // obtener el saldo total de los movimientos
export async function calcularSaldoService() {
  try {
    const movimientos = await movimientoRepo.find({
      select: ["tipo", "monto"]
    });

    if (!Array.isArray(movimientos) || movimientos.length === 0) {
      return [0, "No hay movimientos registrados"];
    }

    const saldo = movimientos.reduce((acc, movimiento) => {
      const monto = parseFloat(movimiento.monto);
      return movimiento.tipo === "ingreso" ? acc + monto : acc - monto;
    }, 0);

    return [saldo, null];
  } catch (error) {
    console.error("Error al calcular el saldo:", error);
    return [null, "Error interno al calcular saldo"];
  }
}