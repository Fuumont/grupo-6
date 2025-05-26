"use strict";
import {
    createEspacioService,
    deleteEspacioService,
    getEspacioByIdService,
    getEspacioService,
    updateEspacioService,
} from "../services/espacio.service.js";

import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";	

// Controller para obtener todos los espacios
export async function getEspacios(req, res) {
    try {
        const [espacios, errorEspacios] = await getEspacioService();

        if (errorEspacios) return handleErrorClient(res, 404, errorEspacios);

        espacios.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Espacios encontrados", espacios);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// Controller para obtener un espacio po id
export async function getEspacioById(req, res) {
    try {
        const { id } = req.params;

        const [espacio, errorEspacio] = await getEspacioByIdService(id);

        if (errorEspacio) return handleErrorClient(res, 404, errorEspacio);

        handleSuccess(res, 200, "Espacio encontrado", espacio);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// Controller para crear un espacio
export async function createEspacio(req, res) {
    try {
        const body = req.body;

        const [espacio, errorEspacio] = await createEspacioService(body);

        if (errorEspacio) return handleErrorClient(res, 400, errorEspacio);

        handleSuccess(res, 201, "Espacio creado", espacio);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// Controller para actualizar un espacio
export async function updateEspacio(req, res) {
    try {
        const { id } = req.params;
        const body = req.body;

        const [espacio, errorEspacio] = await updateEspacioService(id, body);

        if (errorEspacio) return handleErrorClient(res, 404, errorEspacio);

        handleSuccess(res, 200, "Espacio actualizado", espacio);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}


// Controller para borrar un espacio
export async function deleteEspacio(req, res) {
    try {
        const { id } = req.params;

        const [espacio, errorEspacio] = await deleteEspacioService(id);

        if (errorEspacio) return handleErrorClient(res, 404, errorEspacio);

        handleSuccess(res, 200, "Espacio eliminado", espacio);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
