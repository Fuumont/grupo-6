"use strict";
import PropuestaSchema from "../entity/propuesta.entity.js";

// obtener todas las propuestas
export async function getPropuestaService(){
    try{
        const propuestaRepository = AppDataSource.getRepository(PropuestaSchema);
        const propuestas = await propuestaRepository.find();
        if (!propuestas || propuestas.length === 0) return [null, "No hay propuestas registradas"];
        return [propuestas, null];
    }catch(error){
        console.error("Error al obtener las propuestas:", error);
        return [null, "Error interno del servidor"];
    }
}

// obtener una propuesta por rut del usuario
export async function getMyPropuestasService(rut){
    try{
        const propuestaRepository = AppDataSource.getRepository(PropuestaSchema);
        const propuestas = await propuestaRepository.find({ where: { rut_creador: rut } });
        if (!propuestas || propuestas.length === 0) return [null, "No hay propuestas registradas por este usuario"];
        return [propuestas, null];
    }catch(error){
        console.error("Error al obtener las propuestas:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getPropuestaByIdService(id){
    try{
        const propuestaRepository = AppDataSource.getRepository(PropuestaSchema);
        const propuesta = await propuestaRepository.findOne({ where: { id: id } });
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
        const propuesta = propuestaRepository.create(body);
        const propuestaSaved = await propuestaRepository.save(propuesta);
        return [propuestaSaved, null];
    }catch(error){
        console.error("Error al crear la propuesta:", error);
        return [null, "Error interno del servidor"];
    }
}

// Actualizar propuesta (se va a usar mas que nada para que el presindente actualice el estado)
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
// Elimina una propuesta
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