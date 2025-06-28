"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import propuestaRoutes from "./propuesta.routes.js";
import espacioRoutes from "./espacio.routes.js";
import aprobacionRoutes from "./aprobacion.routes.js"
import movimientosRoutes from "./movimientos.routes.js";
import periodoRoutes from "./periodo.academico.routes.js";

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/propuesta", propuestaRoutes)
    .use("/espacio", espacioRoutes)
    .use("/aprobacion", aprobacionRoutes)
    .use("/movimientos", movimientosRoutes)
    .use("/periodos", periodoRoutes);

export default router;