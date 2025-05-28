"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isTesorero } from "../middlewares/authorization.middleware.js";
import {
  createPeriodo,
  deletePeriodo,
  getPeriodo,
  getPeriodos,
  updatePeriodo,
} from "../controllers/periodo.academico.controller.js";

const router = Router();

// Aplicar autenticación y validación de rol tesorero a todas las rutas
router.use(authenticateJwt).use(isTesorero);

router
  .get("/", getPeriodos) // Obtener todos los periodos académicos
  .get("/buscar", getPeriodo) // Obtener un periodo por ID
  .post("/", createPeriodo) // Crear un nuevo periodo académico
  .put("/", updatePeriodo) // Actualizar un periodo académico
  .delete("/", deletePeriodo); // Eliminar un periodo académico

export default router;
