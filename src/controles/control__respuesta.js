// VARIABLES PARA ALMACENAR LOS ELEMENTOS DEL DOM
const checkboxes = document.querySelectorAll('input[type="radio"]');
const verificarBtn = document.getElementById("verificarBtn");
// VARIABLE PARA ALMACENAR EL TIEMPO DE CARGA DE LA PAGINA
let tiempoDeCarga;

// CONTROL PARA LA HABILITACION DEL CONTENIDO
document.getElementById("empezarBtn").addEventListener("click", function () {
    // Deshabilitar el botón empezar
    this.classList.add("disabled");
    tiempoDeCarga = new Date();
    // Habilitar el contenido
    const miContainer = document.getElementById("miContainer");
    miContainer.style.pointerEvents = "auto";
    miContainer.style.opacity = "1";
});

// AGREGAR EVENTO CLICK A LOS CHECKBOXES DE TIPO RADIO
checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("click", () => {
        // Verificar si al menos uno de los checkboxes está seleccionado
        const isChecked = Array.from(checkboxes).some(
            (checkbox) => checkbox.checked
        );

        // Habilitar o deshabilitar el botón "Verificar" según el resultado
        if (isChecked) {
            verificarBtn.classList.remove("disabled");
            verificarBtn.addEventListener("click", verificar);
        } else {
            verificarBtn.classList.add("disabled");
            verificarBtn.removeEventListener("click", verificar);
        }
    });
});

// AGREGAR EVENTO CLICK A LOS CHECKBOXES DE TIPO CHECKBOX
const checkboxes2 = document.querySelectorAll('input[name="gridCheck"]');
checkboxes2.forEach((checkbox) => {
    checkbox.addEventListener("click", () => {
        // Verificar si al menos uno de los checkboxes está seleccionado
        const isChecked = Array.from(checkboxes2).some(
            (checkbox) => checkbox.checked
        );
        // Habilitar o deshabilitar el botón "Verificar" según el resultado
        if (isChecked) {
            verificarBtn.classList.remove("disabled");
            verificarBtn.addEventListener("click", verificar);
        } else {
            verificarBtn.classList.add("disabled");
            verificarBtn.removeEventListener("click", verificar);
        }
    });
});       

// AGREGAR EVENTO CLICK AL RELLENAR UN INPUT
const inputs = document.querySelectorAll('input[name="respuesta"]');
inputs.forEach((input) => {
    input.addEventListener("input", () => {
        // Verificar si al menos uno de los checkboxes está seleccionado
        const isChecked = Array.from(inputs).some(
            (input) => input.value != ""
        );
        // Habilitar o deshabilitar el botón "Verificar" según el resultado
        if (isChecked) {
            verificarBtn.classList.remove("disabled");
            verificarBtn.addEventListener("click", verificar);
        } else {
            verificarBtn.classList.add("disabled");            
            verificarBtn.removeEventListener("click", verificar);
        }
    });
});        

// OBTENER EL TIEMPO DE RESPUESTA EN MINUTOS Y SEGUNDOS
function convertirMilisegundosAMinutosYSegundos(milisegundos) {
    const segundos = Math.floor(milisegundos / 1000);
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;

    return { minutos, segundos: segundosRestantes };
}

//FUNCION PARA OBTENER LA RESPUESTA SELECCIONADA
function obtenerRespuestaSeleccionada() {
    var radios = document.getElementsByName('gridRadios');
    var value;
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            value = radios[i].value;  // will be 'option1' or 'option2'
            break;
        }
    }
    // Set the value of the hidden input field
    var hiddenInput = document.getElementById('respuesta');
    hiddenInput.value = value;
}

// AGREGAR EVENTO CHANGE A LOS RADIOBUTTONS
var radios = document.getElementsByName('gridRadios');
for (var i = 0; i < radios.length; i++) {
    radios[i].addEventListener('change', obtenerRespuestaSeleccionada);
}

// FUNCIÓN QUE CONTROLA LOS ELEMENTOS DEL CONTENIDO INCLUIDO EL TIEMPO DE RESPUESTA
function verificar(event) {
    // Prevenir la acción predeterminada del botón cuando está deshabilitado
    event.preventDefault();

    // Calcular el tiempo transcurrido desde la carga de la página hasta el clic en el botón
    let tiempoActual = new Date();
    // Obtener el tiempo transcurrido en milisegundos
    let tiempoTranscurrido = tiempoActual - tiempoDeCarga;

    // Convertir el tiempo a minutos y segundos
    let { minutos, segundos } = convertirMilisegundosAMinutosYSegundos(tiempoTranscurrido);

    // Asignar los valores de minutos y segundos a los campos ocultos en el formulario
    document.getElementById("tiempoTranscurrido__minutos").value = minutos;
    document.getElementById("tiempoTranscurrido__segundos").value = segundos;

    // Enviar el formulario
    const formulario = event.target.closest("form");
    formulario.submit();

    // Deshabilitar el botón para evitar que se envíe el formulario varias veces
    verificarBtn.classList.add("disabled");
    verificarBtn.removeEventListener("click", verificar);
}


