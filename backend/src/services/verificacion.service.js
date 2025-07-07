import { AppDataSource } from "../config/configDb.js";
import PropuestaSchema from "../entity/propuesta.entity.js";
import AprobacionSchema from "../entity/aprobacion.entity.js"
import { In } from "typeorm";


export async function verificarPropuesta(id){
    const aprobacionRepository = AppDataSource.getRepository(AprobacionSchema);
    const propuestaRepository = AppDataSource.getRepository(PropuestaSchema);

    const directivos = ["Presidente", "Vice Presidente", "Secretario", "Tesorero"];

    // busca todos los votos correspondientes a directivos en la propuesta
    const aprobacionesDirectivos = await aprobacionRepository.find({
        where: { 
            propuesta: { id: id },
            usuario: { rol: In(directivos) }
        },
        relations: ["usuario"]
    });

    // verifica si estan todos los votos de directivos
    const rolesAprobados = aprobacionesDirectivos.map(a => a.usuario.rol);
    const todosDirectivos =directivos.every(rol => rolesAprobados.includes(rol));
    // verifica si todos votaron o no
    if (todosDirectivos) {
        const todosVotaronSi = aprobacionesDirectivos.every(a => a.voto === true);
        if (todosVotaronSi) {
            await propuestaRepository.update(id, { estado: "Aprobada Internamente" });
        }else {
            await propuestaRepository.update(id, { estado: "Rechazada" });
        }
        return true;
    }
    return false;
}