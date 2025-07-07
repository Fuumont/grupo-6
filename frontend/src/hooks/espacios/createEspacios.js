import createEspacioRequest from "../../services/espacios.service.js";
import { useState } from 'react';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

export const useCreateEspacio = (setEspacios) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataEspacio, setDataEspacio] = useState({});

    const handleClickCreate = () => {
        setIsPopupOpen(true);
    };

    const handleCreate = async (newEspacioData) => {
        if (newEspacioData) {
            try {
                const newEspacio = await createEspacioRequest(newEspacioData);
                showSuccessAlert('¡Creado!', 'El espacio ha sido creado correctamente.');
                setIsPopupOpen(false);
                
                setEspacios(prevEspacios => [...prevEspacios, newEspacio]);
                setDataEspacio({});
            } catch (error) {
                console.error('Error al crear el espacio:', error);
                showErrorAlert('Cancelado', 'Ocurrió un error al crear el espacio.');
            }
        }
    };

    return {
        handleClickCreate,
        handleCreate,
        isPopupOpen,
        setIsPopupOpen,
        dataEspacio,
        setDataEspacio
    };
}