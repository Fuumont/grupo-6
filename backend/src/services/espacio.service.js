"use strict";
import EspacioSchema from "../entity/espacio.entity.js";
import { AppDataSource } from "../config/configDb.js";

//  Obtiene todos los espacios
export async function getEspacioService() {
    try {
        const espacioRepository = AppDataSource.getRepository(EspacioSchema);
        const espacios = await espacioRepository.find();
        if (!espacios || espacios.length === 0) return [null, "No hay espacios registrados"];
        return [espacios, null];
    } catch (error) {
        console.error("Error al obtener los espacios:", error);
        return [null, "Error interno del servidor"];
    }
}

// Obtiene 1 espacio por su id
export async function getEspacioByIdService(id) {
    try {
        const espacioRepository = AppDataSource.getRepository(EspacioSchema);
        const espacio = await espacioRepository.findOne({ where: { id: id } });
        if (!espacio) return [null, "No hay espacios registrados con este id"];
        return [espacio, null];
    } catch (error) {
        console.error("Error al obtener el espacio:", error);
        return [null, "Error interno del servidor"];
    }
}

// Crea un espacio
export async function createEspacioService(body) {
    try {
        const espacioRepository = AppDataSource.getRepository(EspacioSchema);
        const espacio = espacioRepository.create(body);
        const espacioSaved = await espacioRepository.save(espacio);
        return [espacioSaved, null];
    } catch (error) {
        console.error("Error al crear el espacio:", error);
        return [null, "Error interno del servidor"];
    }
}
// Actualiza un espacio
export async function updateEspacioService(id, body) {
    try {
        const espacioRepository = AppDataSource.getRepository(EspacioSchema);
        const espacio = await espacioRepository.findOne({ where: { id: id } });
        if (!espacio) return [null, "No hay espacios registrados con este id"];
        const espacioUpdated = await espacioRepository.save({ ...espacio, ...body });
        return [espacioUpdated, null];
    } catch (error) {
        console.error("Error al actualizar el espacio:", error);
        return [null, "Error interno del servidor"];
    }
}   

// Elimina un espacio
export async function deleteEspacioService(id) { 
    try {
        const espacioRepository = AppDataSource.getRepository(EspacioSchema);
        const espacio = await espacioRepository.findOne({ where: { id: id } });
        if (!espacio) return [null, "No hay espacios registrados con este id"];
        await espacioRepository.remove(espacio);
        return [espacio, null];
    } catch (error) {
        console.error("Error al eliminar el espacio:", error);
        return [null, "Error interno del servidor"];
    }
}