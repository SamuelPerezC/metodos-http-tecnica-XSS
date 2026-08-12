import { hacerPost } from './metodos/post.js';
import { hacerPut } from './metodos/put.js';
import { hacerPatch } from './metodos/patch.js';
import { hacerDelete } from './metodos/delete.js';

// Función para procesar respuesta y redirigir
async function procesarRespuesta(funcion, metodo) {
    try {
        const datoInfo = await funcion();
        sessionStorage.setItem('datoInfo', JSON.stringify(datoInfo));
        sessionStorage.setItem('metodoUsado', metodo);
        location.href = 'respuesta.html';
    } catch (error) {
        console.error('Error en', metodo, ':', error);
        alert('Error al enviar datos. Ver consola para detalles.');
    }
}

// Código principal
document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formulario');
    const btnPut = document.getElementById('btnPut');
    const btnPatch = document.getElementById('btnPatch');
    const btnDelete = document.getElementById('btnDelete');

    // Evento POST
    formulario.addEventListener('submit', async function(event) {
        event.preventDefault();
        await procesarRespuesta(function() {
            return hacerPost(formulario);
        }, 'POST');
    });

    // Evento PUT
    btnPut.addEventListener('click', async function() {
        await procesarRespuesta(hacerPut, 'PUT');
    });

    // Evento PATCH
    btnPatch.addEventListener('click', async function() {
        await procesarRespuesta(hacerPatch, 'PATCH');
    });

    // Evento DELETE
    btnDelete.addEventListener('click', async function() {
        await procesarRespuesta(hacerDelete, 'DELETE');
    });
});