import { sanitizarDatos } from '../utils/seguridad.js';

export async function hacerPatch() {
    const datos = {
        nombreUsuario: document.querySelector('input[name="nombreUsuario"]').value,
        correoUsuario: document.querySelector('input[name="correoUsuario"]').value,
        metodo: 'PATCH'
    };
    
    console.log('PATCH - Enviando:', datos);
    
    const respuesta = await fetch('https://httpbin.org/patch', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });
    
    const infoRespuesta = await respuesta.json();
    const infoSanitizada = sanitizarDatos(infoRespuesta);
    console.log('PATCH - Respuesta completa:', infoSanitizada);
    console.log('PATCH - json recibido:', infoSanitizada.json);
    return infoSanitizada;
}