import { escaparHTML, sanitizarDatos, crearElementoSeguro } from './utils/seguridad.js';

// Funcion para extraer datos del usuario
function extraerDatosUsuario(datos) {
    let nombre = 'No especificado';
    let correo = 'No especificado';
    let metodo = 'No especificado';
    let url = 'No disponible';
    
    if (datos.form) {
        nombre = datos.form.nombreUsuario || 'No especificado';
        correo = datos.form.correoUsuario || 'No especificado';
        metodo = 'POST (FormData)';
        url = datos.url || 'No disponible';
    } else if (datos.json) {
        nombre = datos.json.nombreUsuario || 'No especificado';
        correo = datos.json.correoUsuario || 'No especificado';
        metodo = datos.json.metodo || 'No especificado';
        url = datos.url || 'No disponible';
    } else if (datos.data) {
        try {
            const parsed = typeof datos.data === 'string' ? JSON.parse(datos.data) : datos.data;
            nombre = parsed.nombreUsuario || 'No especificado';
            correo = parsed.correoUsuario || 'No especificado';
            metodo = parsed.metodo || 'No especificado';
            url = datos.url || 'No disponible';
        } catch (e) {
            console.warn('No se pudo parsear data:', e);
        }
    }
    
    return { nombre, correo, metodo, url };
}

// Funcion para obtener y validar datos
function obtenerDatosSeguros() {
    try {
        const datosRaw = sessionStorage.getItem('datoInfo');
        const metodoRaw = sessionStorage.getItem('metodoUsado');
        
        if (!datosRaw) {
            return {
                error: true,
                mensaje: 'No se encontraron datos en sessionStorage',
                metodo: metodoRaw || 'Desconocido'
            };
        }
        
        const datos = JSON.parse(datosRaw);
        const datosSanitizados = sanitizarDatos(datos);
        
        return {
            error: false,
            datos: datosSanitizados,
            metodo: metodoRaw || 'Desconocido'
        };
        
    } catch (error) {
        console.error('Error al procesar datos:', error);
        return {
            error: true,
            mensaje: 'Error al procesar los datos: ' + error.message,
            metodo: 'Error'
        };
    }
}

// Funcion para mostrar datos de forma segura (SIN innerHTML)
function mostrarDatosSeguros() {
    const resultado = obtenerDatosSeguros();
    
    const metodoUsadoEl = document.getElementById('metodoUsado');
    const estadoPeticionEl = document.getElementById('estadoPeticion');
    const datosRespuestaEl = document.getElementById('datosRespuesta');
    const detalleJSONEl = document.getElementById('detalleJSON');
    
    // Limpiar contenedor de forma segura
    while (datosRespuestaEl.firstChild) {
        datosRespuestaEl.removeChild(datosRespuestaEl.firstChild);
    }
    
    if (resultado.error) {
        metodoUsadoEl.textContent = 'Error';
        estadoPeticionEl.textContent = 'Fallido';
        estadoPeticionEl.style.color = '#f44336';
        
        // Crear elementos sin innerHTML
        const divError = document.createElement('div');
        divError.style.cssText = 'padding: 20px; text-align: center; color: #f44336;';
        
        const tituloError = document.createElement('p');
        tituloError.style.fontSize = '20px';
        tituloError.style.fontWeight = 'bold';
        tituloError.textContent = 'Error al cargar los datos';
        divError.appendChild(tituloError);
        
        const mensajeError = document.createElement('p');
        mensajeError.textContent = escaparHTML(resultado.mensaje);
        divError.appendChild(mensajeError);
        
        const sugerencia = document.createElement('p');
        sugerencia.style.cssText = 'font-size: 14px; color: #999; margin-top: 20px;';
        sugerencia.textContent = 'Por favor, vuelva al formulario y envie los datos nuevamente.';
        divError.appendChild(sugerencia);
        
        datosRespuestaEl.appendChild(divError);
        detalleJSONEl.textContent = 'No hay datos disponibles';
        return;
    }
    
    const { nombre, correo, metodo, url } = extraerDatosUsuario(resultado.datos);
    
    metodoUsadoEl.textContent = metodo;
    
    if (metodo.includes('POST')) {
        estadoPeticionEl.textContent = 'Recurso creado exitosamente';
        estadoPeticionEl.style.color = '#4CAF50';
    } else if (metodo.includes('PUT')) {
        estadoPeticionEl.textContent = 'Recurso actualizado completamente';
        estadoPeticionEl.style.color = '#FF9800';
    } else if (metodo.includes('PATCH')) {
        estadoPeticionEl.textContent = 'Recurso actualizado parcialmente';
        estadoPeticionEl.style.color = '#9C27B0';
    } else if (metodo.includes('DELETE')) {
        estadoPeticionEl.textContent = 'Recurso eliminado exitosamente';
        estadoPeticionEl.style.color = '#f44336';
    } else {
        estadoPeticionEl.textContent = 'Operacion completada';
        estadoPeticionEl.style.color = '#2196F3';
    }
    
    // Renderizar datos de forma segura usando SOLO createElement y textContent
    const container = document.createElement('div');
    
    const campos = [
        { label: 'Nombre:', valor: nombre },
        { label: 'Correo:', valor: correo },
        { label: 'URL:', valor: url },
        { label: 'Metodo:', valor: metodo }
    ];
    
    campos.forEach(function(campo) {
        const div = document.createElement('div');
        div.className = 'campo';
        
        const label = document.createElement('label');
        label.textContent = campo.label;
        div.appendChild(label);
        
        const span = document.createElement('span');
        span.className = 'valor';
        span.textContent = campo.valor;
        div.appendChild(span);
        
        container.appendChild(div);
    });
    
    datosRespuestaEl.appendChild(container);
    
    // Mostrar detalles tecnicos
    try {
        const jsonString = JSON.stringify(resultado.datos, null, 2);
        detalleJSONEl.textContent = jsonString;
    } catch (error) {
        detalleJSONEl.textContent = 'Error al mostrar detalles: ' + error.message;
    }
    
    // Limpiar datos sensibles
    sessionStorage.removeItem('datoInfo');
    sessionStorage.removeItem('metodoUsado');
    
    console.log('Datos mostrados de forma segura y sessionStorage limpiado');
}

// Ejecucion principal
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('Iniciando carga de respuesta');
        mostrarDatosSeguros();
        console.log('Respuesta cargada exitosamente');
    } catch (error) {
        console.error('Error critico:', error);
        const datosRespuestaEl = document.getElementById('datosRespuesta');
        if (datosRespuestaEl) {
            // Limpiar contenedor
            while (datosRespuestaEl.firstChild) {
                datosRespuestaEl.removeChild(datosRespuestaEl.firstChild);
            }
            
            const div = document.createElement('div');
            div.style.cssText = 'padding: 20px; text-align: center; background: #ffebee; border-radius: 5px; color: #c62828;';
            
            const p = document.createElement('p');
            p.textContent = 'Ocurrio un error al mostrar los datos. Por favor, intente nuevamente.';
            div.appendChild(p);
            
            datosRespuestaEl.appendChild(div);
        }
    }
});