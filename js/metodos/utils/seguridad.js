// Funciones de sanitización para prevenir XSS

export function escaparHTML(texto) {
    if (!texto) return '';
    
    const str = String(texto);
    
    const mapa = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    
    return str.replace(/[&<>"'/`=]/g, function(caracter) {
        return mapa[caracter] || caracter;
    });
}

export function sanitizarDatos(datos) {
    if (!datos) return null;
    
    const datosSanitizados = {};
    
    for (const [clave, valor] of Object.entries(datos)) {
        if (typeof valor === 'string') {
            datosSanitizados[clave] = escaparHTML(valor);
        } else if (typeof valor === 'object' && valor !== null) {
            datosSanitizados[clave] = sanitizarDatos(valor);
        } else {
            datosSanitizados[clave] = valor;
        }
    }
    
    return datosSanitizados;
}

// Funcion para crear elementos de forma segura
export function crearElementoSeguro(tipo, atributos, contenido) {
    const elemento = document.createElement(tipo);
    
    if (atributos) {
        for (const [clave, valor] of Object.entries(atributos)) {
            if (clave === 'className') {
                elemento.className = valor;
            } else if (clave === 'style') {
                elemento.style.cssText = valor;
            } else {
                elemento.setAttribute(clave, valor);
            }
        }
    }
    
    if (contenido !== undefined && contenido !== null) {
        elemento.textContent = contenido;
    }
    
    return elemento;
}