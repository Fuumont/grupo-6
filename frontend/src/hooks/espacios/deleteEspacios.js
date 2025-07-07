import deleteEspacioRequest from "../../services/espacios.service.js";
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteEspacio = (fetchEspacios, setDataEspacio) => {
    const handleDelete = async (dataEspacio) => {
        if (dataEspacio.length > 0) {
            try {
                const result = await deleteDataAlert();
                if (result.isConfirmed) {
                    const response = await deleteEspacioRequest(dataEspacio[0].id);
                    if (response.status === 'Client error') {
                        return showErrorAlert('Error', response.details);
                    }
                    showSuccessAlert('¡Eliminado!', 'El espacio ha sido eliminado correctamente.');
                    await fetchEspacios();
                    setDataEspacio([]);
                } else {
                    showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
                }
            } catch (error) {
                console.error('Error al eliminar el espacio:', error);
                showErrorAlert('Cancelado', 'Ocurrió un error al eliminar el espacio.');
            }
        }
    };

    return {
        handleDelete
    };
}

export default useDeleteEspacio;
