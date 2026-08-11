import { sanitizarDatos } from '../utils/seguridad.js';

export async function hacerPut() {
    const datos = {
        nombreUsuario: document.querySelector('input[name="nombreUsuario"]').value,
        correoUsuario: document.querySelector('input[name="correoUsuario"]').value,
        metodo: 'PUT'
    };
    
    console.log('PUT - Enviando:', datos);
    
    const respuesta = await fetch('https://httpbin.org/put', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });
    
    const infoRespuesta = await respuesta.json();
    const infoSanitizada = sanitizarDatos(infoRespuesta);
    console.log('PUT - Respuesta completa:', infoSanitizada);
    console.log('PUT - json recibido:', infoSanitizada.json);
    return infoSanitizada;
}