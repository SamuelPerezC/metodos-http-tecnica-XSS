import { sanitizarDatos } from '../utils/seguridad.js';

export async function hacerPost(formulario) {
    const datosFormulario = new FormData(formulario);
    console.log('POST - nombre:', datosFormulario.get('nombreUsuario'));
    console.log('POST - correo:', datosFormulario.get('correoUsuario'));
    
    const respuesta = await fetch('https://httpbin.org/post', {
        method: 'POST',
        body: datosFormulario
    });
    
    const infoRespuesta = await respuesta.json();
    const infoSanitizada = sanitizarDatos(infoRespuesta);
    console.log('POST - Respuesta completa:', infoSanitizada);
    return infoSanitizada;
}