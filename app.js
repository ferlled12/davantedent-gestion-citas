class Cita {
    constructor(id, fecha, hora, nombre, apellidos, dni, telefono, fechaNac, observaciones) {
        this.id = id;
        const [anio, mes, dia] = fecha.split('-');
        const [horaCita, minuto] = hora.split(':');
        
        this.fecha = { dia, mes, anio, hora: horaCita, minuto };
        this.paciente = { nombre, apellidos, dni, telefono, fechaNac };
        this.observaciones = observaciones;
    }
}

const form = document.getElementById('form-cita');
const tbodyCitas = document.getElementById('tbody-citas');
const filaVacia = document.getElementById('fila-vacia');
const STORAGE_KEY = 'davanteDent_citas';

document.addEventListener('DOMContentLoaded', cargarCitas);

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (validarFormulario()) {
        guardarCita();
    }
});

document.getElementById('btn-cancelar').addEventListener('click', limpiarFormulario);

// Funciones de localStorage
function obtenerCitasLS() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function guardarCitasLS(citas) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(citas));
}

// Lógica Principal
function cargarCitas() {
    const citas = obtenerCitasLS();
    renderizarTabla(citas);
}

function guardarCita() {
    const idInput = document.getElementById('id-cita').value;
    const isEditing = idInput !== '';
    
    // Capturar datos del formulario
    const fecha = document.getElementById('fecha-cita').value;
    const hora = document.getElementById('hora-cita').value;
    const nombre = document.getElementById('nombre').value;
    const apellidos = document.getElementById('apellidos').value;
    const dni = document.getElementById('dni').value;
    const telefono = document.getElementById('telefono').value;
    const fechaNac = document.getElementById('fecha-nac').value;
    const observaciones = document.getElementById('observaciones').value;

    // Crear ID único
    const id = isEditing ? Number(idInput) : Date.now();

    const nuevaCita = new Cita(id, fecha, hora, nombre, apellidos, dni, telefono, fechaNac, observaciones);
    let citas = obtenerCitasLS();

    if (isEditing) {
        // Modificar existente
        citas = citas.map(c => c.id === id ? nuevaCita : c);
    } else {
        // Añadir nueva
        citas.push(nuevaCita);
    }

    guardarCitasLS(citas);
    renderizarTabla(citas);
    limpiarFormulario();
}

function renderizarTabla(citas) {
    // Limpiar tabla (manteniendo la referencia a fila-vacia en memoria o regenerándola)
    tbodyCitas.innerHTML = ''; 

    if (citas.length === 0) {
        tbodyCitas.innerHTML = `<tr id="fila-vacia"><td colspan="8" style="text-align: center;">No hay datos</td></tr>`;
        return;
    }

    citas.forEach((cita, index) => {
        const tr = document.createElement('tr');
        // El identificador se guarda en un data-attribute, pero mostramos el orden (index + 1)
        tr.dataset.id = cita.id; 
        
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${cita.fecha.dia}/${cita.fecha.mes}/${cita.fecha.anio} ${cita.fecha.hora}:${cita.fecha.minuto}</td>
            <td>${cita.paciente.nombre} ${cita.paciente.apellidos}</td>
            <td>${cita.paciente.dni}</td>
            <td>${cita.paciente.telefono}</td>
            <td>${cita.paciente.fechaNac}</td>
            <td>${cita.observaciones}</td>
            <td>
                <button type="button" onclick="cargarCitaEnFormulario(${cita.id})">Modificar</button>
                <button type="button" class="btn-eliminar" onclick="eliminarCita(${cita.id})">Eliminar</button>
            </td>
        `;
        tbodyCitas.appendChild(tr);
    });
}

function eliminarCita(id) {
    if(confirm('¿Estás seguro de eliminar esta cita?')){
        let citas = obtenerCitasLS();
        citas = citas.filter(c => c.id !== id);
        guardarCitasLS(citas);
        renderizarTabla(citas);
    }
}

// Cargar desde localStorage al formulario, nunca desde la vista HTML
function cargarCitaEnFormulario(id) {
    const citas = obtenerCitasLS();
    const cita = citas.find(c => c.id === id);
    if (!cita) return;

    // Reconstruir los strings de los inputs type="date" y type="time"
    const fechaString = `${cita.fecha.anio}-${cita.fecha.mes}-${cita.fecha.dia}`;
    const horaString = `${cita.fecha.hora}:${cita.fecha.minuto}`;

    document.getElementById('id-cita').value = cita.id;
    document.getElementById('fecha-cita').value = fechaString;
    document.getElementById('hora-cita').value = horaString;
    document.getElementById('nombre').value = cita.paciente.nombre;
    document.getElementById('apellidos').value = cita.paciente.apellidos;
    document.getElementById('dni').value = cita.paciente.dni;
    document.getElementById('telefono').value = cita.paciente.telefono;
    document.getElementById('fecha-nac').value = cita.paciente.fechaNac;
    document.getElementById('observaciones').value = cita.observaciones;

    document.getElementById('btn-cancelar').classList.remove('hidden');
    document.getElementById('btn-guardar').textContent = 'Actualizar cita';
}

function limpiarFormulario() {
    form.reset();
    document.getElementById('id-cita').value = '';
    document.getElementById('btn-cancelar').classList.add('hidden');
    document.getElementById('btn-guardar').textContent = 'Guardar cita';
    
    // Limpiar errores visuales
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => input.classList.remove('input-error'));
    const errores = form.querySelectorAll('.error-message');
    errores.forEach(error => {
        error.textContent = '';
        error.classList.remove('active');
    });
}

// Validaciones
function validarFormulario() {
    let esValido = true;

    const regexDNI = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
    // Solo números (9 dígitos para teléfonos de España)
    const regexTlf = /^[0-9]{9}$/; 

    esValido &= validarCampo('fecha-cita', val => val.trim() !== '', 'La fecha es obligatoria.');
    esValido &= validarCampo('hora-cita', val => val.trim() !== '', 'La hora es obligatoria.');
    esValido &= validarCampo('nombre', val => val.trim() !== '', 'El nombre no puede estar vacío.');
    esValido &= validarCampo('apellidos', val => val.trim() !== '', 'Los apellidos son obligatorios.');
    esValido &= validarCampo('dni', val => regexDNI.test(val), 'Formato de DNI inválido (ej: 12345678A).');
    esValido &= validarCampo('telefono', val => regexTlf.test(val), 'El teléfono debe contener 9 números. No letras.');
    esValido &= validarCampo('fecha-nac', val => val.trim() !== '', 'Debe indicar la fecha de nacimiento.');

    return Boolean(esValido);
}

function validarCampo(id, condicion, mensajeError) {
    const input = document.getElementById(id);
    const errorSpan = document.getElementById(`error-${id}`);
    
    if (!condicion(input.value)) {
        input.classList.add('input-error');
        errorSpan.textContent = mensajeError;
        errorSpan.classList.add('active');
        return false;
    } else {
        input.classList.remove('input-error');
        errorSpan.textContent = '';
        errorSpan.classList.remove('active');
        return true;
    }
}