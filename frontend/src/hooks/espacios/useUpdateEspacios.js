import { updateEspacioRequest } from "../../services/espacios.service.js";
import { useState } from 'react';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useUpdateEspacios = (setEspacios) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataEspacio, setDataEspacio] = useState([]); 

    const handleClickUpdate = () => {
        if (dataEspacio.length > 0) {
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedEspacioData) => {
        if (updatedEspacioData) {
            try {
                const updatedEspacio = await updateEspacioRequest(updatedEspacioData, dataEspacio[0].id);
                showSuccessAlert('¡Actualizado!', 'El espacio ha sido actualizado correctamente.');
                setIsPopupOpen(false);
                
                setEspacios(prevEspacios => prevEspacios.map(espacio => 
                    espacio.id === updatedEspacio.id ? updatedEspacio : espacio
                ));
                
                setDataEspacio([]);
            } catch (error) {
                console.error('Error al actualizar el espacio:', error);
                showErrorAlert('Cancelado', 'Ocurrió un error al actualizar el espacio.');
            }
        }
    };

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataEspacio,
        setDataEspacio
    };

}


export default useUpdateEspacios;