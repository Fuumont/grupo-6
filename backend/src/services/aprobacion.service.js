"use strict";
import AprobacionSchema from "../entity/aprobacion.entity.js";
import PropuestaSchema from "../entity/propuesta.entity.js";
import UserSchema from "../entity/user.entity.js";


// obtener todas las aprobaciones tampoco se si sera util xd

export async function getAprobacionService() {
    try {
        const aprobacionRepository = AppDataSource.getRepository(AprobacionSchema);
        const aprobaciones = await aprobacionRepository.find();
        if (!aprobaciones || aprobaciones.length === 0) return [null, "No hay aprobaciones registradas"];
        return [aprobaciones, null];
    } catch (error) {
        console.error("Error al obtener las aprobaciones:", error);
        return [null, "Error interno del servidor"];
    }
}

// obtener aprobaciones por rut del usuario

export async function getMyAprobacionesService(rut) {
    try {
        const aprobacionRepository = AppDataSource.getRepository(AprobacionSchema);
        const aprobaciones = await aprobacionRepository.find({ where: { rut_usuario: rut } });
        if (!aprobaciones || aprobaciones.length === 0) 
            return [null, "No hay aprobaciones registradas por este usuario"];
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
        const aprobaciones = await aprobacionRepository.find({ where: { propuestaId: id } });
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
        const aprobacion = await aprobacionRepository.findOne({ where: { id: id } });
        if (!aprobacion) return [null, "No hay aprobaciones registradas con este id"];
        return [aprobacion, null];
    } catch (error) {
        console.error("Error al obtener la aprobacion:", error);
        return [null, "Error interno del servidor"];
    }
}
// crear una aprobacion
export async function createAprobacionService(body) {
    try {
        const aprobacionRepository = AppDataSource.getRepository(AprobacionSchema);
        const aprobacion = aprobacionRepository.create(body);
        const aprobacionSaved = await aprobacionRepository.save(aprobacion);

        // Verificar unanimidad después de crear (tentativo)
        await verificarUnanimidadService(body.propuestaId);
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

//verificar unanimidad de las aprobaciones, no se si esto funciona y tampoco se si sera util lmao pero de todas formas lo dejo pa probar despues
export async function verificarUnanimidadAprobacionesService(propuestaId) {
    try {
        const aprobacionRepository = AppDataSource.getRepository(AprobacionSchema);
        const propuestaRepository = AppDataSource.getRepository(PropuestaSchema);
        
        // Obtener todos los miembros del CCAA con roles directivos (no hay usuarios con estos roles aun)
        const miembrosDirectivos = await AppDataSource.getRepository(UserSchema).find({
            where: { rol: In(["Presidente", "Vicepresidente", "Tesorero", "Secretario"]) }
        });

        // Obtener todas las aprobaciones de la propuesta (deberia)
        const aprobaciones = await aprobacionRepository.find({
            where: { propuestaId: propuestaId }
        });

        // Verificar unanimidad hell yeah
        const todosAprobaron = miembrosDirectivos.every(miembro => 
            aprobaciones.some(aprob => 
                aprob.rut_usuario === miembro.rut && aprob.voto === true
            )
        );

        // Si hay unanimidad, actualizar estado de la propuesta (aun no lo pruebo 
        // asi q se puede morir jaja)
        if (todosAprobaron) {
            await propuestaRepository.update(propuestaId, {
                estado: "Aprobada Internamente"
            });
            return true;
        }
        return false;

    } catch (error) {
        console.error("Error al verificar unanimidad:", error);
        throw error;
    }
}

