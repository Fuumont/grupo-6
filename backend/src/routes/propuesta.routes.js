"use-strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
    createPropuesta,
    deletePropuesta,
    getPropuestaById,
    getPropuestas,
    updatePropuesta,
} from "../controllers/propuesta.controller.js";

const router = Router();
router
    .use(authenticateJwt)
    .get("/", getPropuestas)
    .get("/:id", getPropuestaById)
    .post("/", createPropuesta)
    .patch("/:id", updatePropuesta)
    .delete("/:id", deletePropuesta);   

export default router;
