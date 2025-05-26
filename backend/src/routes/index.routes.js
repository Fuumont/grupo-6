"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import movimientosRoutes from "./movimientos.routes.js";
import periodoRoutes from "./periodo.academico.routes.js";

const router = Router();

router
  .use("/auth", authRoutes)
  .use("/user", userRoutes)
  .use("/movimientos", movimientosRoutes)
  .use("/periodos", periodoRoutes);

export default router;
