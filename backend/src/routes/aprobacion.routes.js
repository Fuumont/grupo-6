"use-strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    createAprobacion,
    deleteAprobacion,
    getAprobacionById,
    getAprobaciones,
    getAprobacionesByPropuestaId,
    getMyAprobaciones,
    updateAprobacion,
} from "../controllers/aprobacion.controller.js";

const router = Router();
router
    .use(authenticateJwt)
    .get("/", getAprobaciones)
    .get("/my", getMyAprobaciones)
    .get("/:id", getAprobacionById)
    .get("/propuesta/:id", getAprobacionesByPropuestaId)
    .post("/", createAprobacion)
    .patch("/:id", updateAprobacion)
    .delete("/:id", deleteAprobacion);
    
export default router;