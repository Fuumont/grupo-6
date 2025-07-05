"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isTesorero } from "../middlewares/authorization.middleware.js";
import { generarReportePDF } from "../controllers/pdf.controller.js";
import {
  createMovimiento,
  deleteMovimiento,
  getMovimiento,
  getMovimientos,
  getSaldo,
  updateMovimiento,
} from "../controllers/movimiento.controller.js";


const router = Router();

// Aplicar autenticación y validación de rol tesorero a todas las rutas
router.use(authenticateJwt).use(isTesorero);

router
  .get("/", getMovimientos) // Obtener todos los movimientos
  .get("/buscar", getMovimiento) // Obtener un movimiento por ID
  .post("/", createMovimiento) // Crear nuevo movimiento
  .put("/", updateMovimiento) // Actualizar un movimiento por ID
  .delete("/", deleteMovimiento) // Eliminar un movimiento por ID
  .get("/saldo", getSaldo)// Obtener el saldo actual
  .get("/reporte/:id_periodo", generarReportePDF);


export default router;
