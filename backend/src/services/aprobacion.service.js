"use strict";
import AprobacionSchema from "../entity/aprobacion.entity.js";
import PropuestaSchema from "../entity/propuesta.entity.js";
import UserSchema from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";


// obtener todas las aprobaciones tampoco se si sera util xd

export async function getAprobacionService() {
    try {
        const aprobacionRepository = AppDataSource.getRepository(AprobacionSchema);
        const aprobaciones = await aprobacionRepository.find({ relations: ["usuario", "propuesta"],
            select: {
                usuario: {
                    rut: true,
                    nombreCompleto: true,
                    rol: true
                },
                propuesta: {
                    nombre_actividad: true,
                    objetivo: true,
                    fecha_propuesta: true,
                    estado: true,
                },
            } 
        });
        if (!aprobaciones || aprobaciones.length === 0) return [null, "No hay aprobaciones registradas"];
        return [aprobaciones, null];
    } catch (error) {
        console.error("Error al obtener las aprobaciones:", error);
        return [null, "Error interno del servidor"];
    }
}

//obtener aprobaciones por id de propuesta
export async function getAprobacionesByPropuestaIdService(id) {
    try {
        const aprobacionRepository = AppDataSource.getRepository(AprobacionSchema);

        const aprobaciones = await aprobacionRepository.find({
            where: { propuesta: { id: id } }, 
            select: {
                usuario: {
                    rut: true,
                    nombreCompleto: true,
                    rol: true
                },
                propuesta: {
                    nombre_actividad: true,
                    objetivo: true,
                    fecha_propuesta: true,
                    estado: true,
                },
            } 
        });

        if (!aprobaciones || aprobaciones.length === 0) 
            return [null, "No hay aprobaciones registradas para esta propuesta"];
        return [aprobaciones, null];
    } catch (error) {
        console.error("Error al obtener las aprobaciones:", error);
        return [null, "Error interno del servidor"];
    }
}

// obtener aprobacion por id ??? no se si sera util 
export async function getAprobacionByIdService(id) {
    try {
        const aprobacionRepository = AppDataSource.getRepository(AprobacionSchema);
        const aprobacion = await aprobacionRepository.findOne({ where: { id: id },
        relations: ["usuario", "propuesta"],
            select: {
                usuario: {
                    rut: true,
                    nombreCompleto: true,
                    rol: true
                },
                propuesta: {
                    nombre_actividad: true,
                    objetivo: true,
                    fecha_propuesta: true,
                    estado: true,
                },
            }  });

        if (!aprobacion) return [null, "No hay aprobaciones registradas con este id"];
        return [aprobacion, null];
    } catch (error) {
        console.error("Error al obtener la aprobacion:", error);
        return [null, "Error interno del servidor"];
    }
}
// crear una aprobacion
export async function createAprobacionService(body, user) {
    try {
        const userRepository = AppDataSource.getRepository(UserSchema);
        const aprobacionRepository = AppDataSource.getRepository(AprobacionSchema);
        const propuestaRepository = AppDataSource.getRepository(PropuestaSchema);

        // comprueba si existe el usuario en la db
        const usuario = await userRepository.findOne({ where: { id: user } });
        if (!usuario) return [null, "El usuario votante no existe"];

        // comprueba si existe la propuesta en la db
        const propuesta = await propuestaRepository.findOne({ where: { id: body.propuesta } });
        if (!propuesta || propuesta.length === 0) return [null, "La propuesta no existe"];

        const aprobacion = aprobacionRepository.create({
            ...body,
            propuesta: propuesta,
            usuario: usuario
        });
        const aprobacionSaved = await aprobacionRepository.save(aprobacion);

        return [aprobacionSaved, null];
    } catch (error) {
        console.error("Error al crear la aprobacion:", error);
        return [null, "Error interno del servidor"];
    }
}
// actualizar aprobacion
export async function updateAprobacionService(id, body) {
    try {
        const aprobacionRepository = AppDataSource.getRepository(AprobacionSchema);
        const aprobacion = await aprobacionRepository.findOne({ where: { id: id } });
        if (!aprobacion) return [null, "No hay aprobaciones registradas con este id"];
        const aprobacionUpdated = await aprobacionRepository.save({ ...aprobacion, ...body });
        return [aprobacionUpdated, null];
    } catch (error) {
        console.error("Error al actualizar la aprobacion:", error);
        return [null, "Error interno del servidor"];
    }
}
// eliminar aprobacion, tampoco tengo claro si sera util pero aca va xd
export async function deleteAprobacionService(id) {
    try {
        const aprobacionRepository = AppDataSource.getRepository(AprobacionSchema);
        const aprobacion = await aprobacionRepository.findOne({ where: { id: id } });
        if (!aprobacion) return [null, "No hay aprobaciones registradas con este id"];
        await aprobacionRepository.remove(aprobacion);
        return [aprobacion, null];
    } catch (error) {
        console.error("Error al eliminar la aprobacion:", error);
        return [null, "Error interno del servidor"];
    }
}


