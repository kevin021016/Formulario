const regex_letras = new RegExp('^[a-zñáéíóúü\\s]+$', 'i');
const regex_numeros = new RegExp('^[0-9]+$', 'i');

function solo_letras(e) {
    var tecla = e.key;
    return regex_letras.test(tecla);
}

document.getElementById('nombres').addEventListener('keydown', function (e) {
    if (!solo_letras(e)) {
        e.preventDefault(); // Evita el ingreso del carácter no permitido
    }
});

document.getElementById('apellido_paterno').addEventListener('keydown', function (e) {
    if (!solo_letras(e)) {
        e.preventDefault(); // Evita el ingreso del carácter no permitido
    }
});

document.getElementById('apellido_materno').addEventListener('keydown', function (e) {
    if (!solo_letras(e)) {
        e.preventDefault(); // Evita el ingreso del carácter no permitido
    }
});

function solo_numeros(e) {
    var tecla = e.key;
    return regex_numeros.test(tecla) || ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key);;
}

document.getElementById('telefono').addEventListener('keydown', function (e) {
    if (!solo_numeros(e)) {
        e.preventDefault(); 
    }
});

