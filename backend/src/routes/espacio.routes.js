"use-strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

import {
    createEspacio,
    deleteEspacio,
    getEspacioById,
    getEspacios,
    updateEspacio,
} from "../controllers/espacio.controller.js";

const router = Router();
router
    .use(authenticateJwt)
    .get("/", getEspacios)
    .get("/:id", getEspacioById)
    .post("/", createEspacio)
    .patch("/:id", updateEspacio)
    .delete("/:id", deleteEspacio);

export default router;