"use strict";
import {
    createAprobacionService,
    deleteAprobacionService,
    getAprobacionByIdService,
    getAprobacionesByPropuestaIdService,
    getAprobacionService,
    updateAprobacionService,
} from "../services/aprobacion.service.js";

import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";	

// Controller para obtener todas las aprobaciones (dudando de la utilidad de esto)

export async function getAprobaciones(req, res) {
    try {
        const [aprobaciones, errorAprobaciones] = await getAprobacionService();

        if (errorAprobaciones) return handleErrorClient(res, 404, errorAprobaciones);

        aprobaciones.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Aprobaciones encontradas", aprobaciones);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// Controller para obtener una aprobacion por id

export async function getAprobacionesByPropuestaId(req, res) {
    try {
        const { id } = req.params;

        const [aprobaciones, errorAprobaciones] = await getAprobacionesByPropuestaIdService(id);

        if (errorAprobaciones) return handleErrorClient(res, 404, errorAprobaciones);

        aprobaciones.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Aprobaciones encontradas", aprobaciones);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// Controller para obtener una aprobacion por id (tambien dudo se sera util, tentativo por ahora)

export async function getAprobacionById(req, res) {
    try {
        const { id } = req.params;

        const [aprobacion, errorAprobacion] = await getAprobacionByIdService(id);

        if (errorAprobacion) return handleErrorClient(res, 404, errorAprobacion);

        handleSuccess(res, 200, "Aprobación encontrada", aprobacion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// Controller para crear una aprobacion

export async function createAprobacion(req, res) {
    try {
        const { body } = req;

        const [aprobacion, errorAprobacion] = await createAprobacionService(body);

        if (errorAprobacion) return handleErrorClient(res, 400, errorAprobacion);

        handleSuccess(res, 201, "Aprobación creada", aprobacion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// Controller para actualizar una aprobacion

export async function updateAprobacion(req, res) {
    try {
        const { id } = req.params;
        const body = req.body;

        const [aprobacion, errorAprobacion] = await updateAprobacionService(id, body);

        if (errorAprobacion) return handleErrorClient(res, 404, errorAprobacion);

        handleSuccess(res, 200, "Aprobación actualizada", aprobacion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// controller para eliminar una aprobacion

export async function deleteAprobacion(req, res) {
    try {
        const { id } = req.params;

        const [aprobacion, errorAprobacion] = await deleteAprobacionService(id);

        if (errorAprobacion) return handleErrorClient(res, 404, errorAprobacion);

        handleSuccess(res, 200, "Aprobación eliminada", aprobacion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}