"use strict";
import {
    createPropuestaService,
    deletePropuestaService,
    getPropuestaByIdService,
    getPropuestaService,
    updatePropuestaService,
} from "../services/propuesta.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";	


// Controller de get propuestas
export async function getPropuestas(req, res) {
    try {
        const [propuestas, errorPropuestas] = await getPropuestaService();

        if (errorPropuestas) return handleErrorClient(res, 404, errorPropuestas);

        propuestas.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Propuestas encontradas", propuestas);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}


// Controller de get propuestas por id
export async function getPropuestaById(req, res) {
    try {
        const { id } = req.params;

        const [propuesta, errorPropuesta] = await getPropuestaByIdService(id);

        if (errorPropuesta) return handleErrorClient(res, 404, errorPropuesta);

        handleSuccess(res, 200, "Propuesta encontrada", propuesta);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
// Controller de crear propuestas
export async function createPropuesta(req, res) {
    try {
        const { body } = req;

        const [propuesta, errorPropuesta] = await createPropuestaService(body);

        if (errorPropuesta) return handleErrorClient(res, 404, errorPropuesta);

        handleSuccess(res, 201, "Propuesta creada", propuesta);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
// Controller de actualizar propuestas
export async function updatePropuesta(req, res) {
    try{
        const { id } = req.params;
        const { body } = req;

        const [propuesta, errorPropuesta] = await updatePropuestaService(id, body);

        if (errorPropuesta) return handleErrorClient(res, 404, errorPropuesta);

        handleSuccess(res, 200, "Propuesta actualizada", propuesta);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
// Controller de borrar propuestas
export async function deletePropuesta(req, res) {
    try {
        const { id } = req.params;

        const [propuesta, errorPropuesta] = await deletePropuestaService(id);

        if (errorPropuesta) return handleErrorClient(res, 404, errorPropuesta);

        handleSuccess(res, 200, "Propuesta eliminada", propuesta);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}