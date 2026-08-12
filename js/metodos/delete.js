import { sanitizarDatos } from '../utils/seguridad.js';

export async function hacerDelete() {
    const datos = {
        nombreUsuario: document.querySelector('input[name="nombreUsuario"]').value,
        correoUsuario: document.querySelector('input[name="correoUsuario"]').value,
        metodo: 'DELETE'
    };
    
    console.log('DELETE - Enviando:', datos);
    
    const respuesta = await fetch('https://httpbin.org/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });
    
    const infoRespuesta = await respuesta.json();
    const infoSanitizada = sanitizarDatos(infoRespuesta);
    console.log('DELETE - Respuesta completa:', infoSanitizada);
    console.log('DELETE - json recibido:', infoSanitizada.json);
    return infoSanitizada;
}