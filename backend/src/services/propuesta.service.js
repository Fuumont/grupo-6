"use strict";
import PropuestaSchema from "../entity/propuesta.entity.js";
import UserSchema from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";

// obtener todas las propuestas junto con los datos del creador
export async function getPropuestaService(){
    try{
        const propuestaRepository = AppDataSource.getRepository(PropuestaSchema);
        const propuestas = await propuestaRepository.find({
            relations: ["creador", "espacio"],
            select: {
                id: true,
                nombre_actividad: true,
                objetivo: true,
                fecha_propuesta: true,
                estado: true,
                fecha_creacion: true,
                creador: {
                    rut: true,
                    nombreCompleto: true,
                    rol: true
                },
                espacio: {
                    nombre: true,
                    capacidad: true,
                    horario_disponible: true,
                    dias_disponibles: true
                },
            }
        });
        if (!propuestas || propuestas.length === 0) return [null, "No hay propuestas registradas"];
        return [propuestas, null];
    }catch(error){
        console.error("Error al obtener las propuestas:", error);
        return [null, "Error interno del servidor"];
    }
}

// obtener una propuesta por id
export async function getPropuestaByIdService(id){
    try{
        const propuestaRepository = AppDataSource.getRepository(PropuestaSchema);
        const propuesta = await propuestaRepository.findOne({ where: { id: id }, relations: ["creador", "espacio"],
        select: {
            creador: {
                    rut: true,
                    nombreCompleto: true,
                    rol: true
                },
            espacio: {
                    nombre: true,
                    capacidad: true,
                    horario_disponible: true,
                    dias_disponibles: true
                } } });
        if (!propuesta) return [null, "No hay propuestas registradas con este id"];
        return [propuesta, null];
    }catch(error){
        console.error("Error al obtener la propuesta:", error);
        return [null, "Error interno del servidor"];
    }
}
// crear propuesta
export async function createPropuestaService(body){
    try{
        const propuestaRepository = AppDataSource.getRepository(PropuestaSchema);
        const userRepository = AppDataSource.getRepository(UserSchema);

        // busca el rut en la bd
        const creador = await userRepository.findOne({ where: { rut: body.rutCreador } });
        if (!creador) return [null, "El usuario creador no existe"];

        // busca el espacio en la bd
        const espacio = await userRepository.findOne({ where: { id: body.Espacio } });
        if (!espacio) return [null, "No se encontro el espacio"];

        // Asigna el usuario y el espacio
        const propuesta = propuestaRepository.create({
            ...body,
            creador: creador,
            espacio: espacio
        });

        const propuestaSaved = await propuestaRepository.save(propuesta);
        return [propuestaSaved, null];
    }catch(error){
        console.error("Error al crear la propuesta:", error);
        return [null, "Error interno del servidor"];
    }
}

// actualizar propuesta (se va a usar mas que nada para que el presindente actualice el estado)
export async function updatePropuestaService(id, body){
    try{
        const propuestaRepository = AppDataSource.getRepository(PropuestaSchema);
        const propuesta = await propuestaRepository.findOne({ where: { id: id } });
        if (!propuesta) return [null, "No hay propuestas registradas con este id"];
        const propuestaUpdated = await propuestaRepository.save({ ...propuesta, ...body });
        return [propuestaUpdated, null];
    }catch(error){
        console.error("Error al actualizar la propuesta:", error);
        return [null, "Error interno del servidor"];
    }
}
// elimina una propuesta
export async function deletePropuestaService(id){
    try{
        const propuestaRepository = AppDataSource.getRepository(PropuestaSchema);
        const propuesta = await propuestaRepository.findOne({ where: { id: id } });
        if (!propuesta) return [null, "No hay propuestas registradas con este id"];
        await propuestaRepository.remove(propuesta);
        return [propuesta, null];
    }catch(error){
        console.error("Error al eliminar la propuesta:", error);
        return [null, "Error interno del servidor"];
    }
}