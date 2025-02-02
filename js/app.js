// Constructores
const $ = document;

function Seguro(marca, year, tipo){
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}
// Realiza la cotización con los datos
Seguro.prototype.cotizarSeguro = function(){
    /*
        1 = Estadounidense 1.15
        2 = Asiatico 1.05
        3 = Europeo 1.35
    */

    let cantidad;
    const base = 2000;

    console.log(this.marca)
    switch(this.marca){
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35;
            break;
        default:
            break;
    }

    // Leer el año
    const diferencia = new Date().getFullYear() - this.year;

    // Cada año que la diferencia es mayor, el costo va a reducirse un 3%
    cantidad -= ((diferencia * 3) * cantidad ) / 100;

    /* 
        Si el seguro es básico se multiplica por un 30% más
        Si el seguro es completo se multiplica por un 50% más
    */
    if(this.tipo === 'basico'){
        cantidad *= 1.30;
    }else{
        cantidad *= 1.50;
    }

    return cantidad;
}


function UI(){}

// Llena las opciones de los años
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(),
          min = max - 20;

    const selectYear = $.querySelector('#year');

    for(let i = max; i > min; i-- ){
        let option = $.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

// Muestra alertas en la patalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {

    const div = $.createElement('div');

    if(tipo === 'error'){
        div.classList.add('mensaje', 'error');
    }else{
        div.classList.add('mensaje', 'correcto');
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    // Insertar en el HTML
    const formulario = $.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, $.querySelector('#resultado'));

    setTimeout(() => {
        div.remove();
    }, 3000);
}

UI.prototype.mostrarResultado = (total, seguro) => {

    const { marca, year, tipo } = seguro;

    let textoMarca;

    switch(marca){
        case '1':
            textoMarca = 'Americano'
            break;
        case '2':
            textoMarca = 'Asiatico'
            break;
        case '3':
            textoMarca = 'Europeo'
            break;
        default:
            break;
    }

    // Crear el resultado
    const div = $.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
                    <p class="header">Tu resumen</p>
                    <p class="font-bold">Marca: <span class="font-normal">${textoMarca}</span></p>
                    <p class="font-bold">Año: <span class="font-normal">${year}</span></p>
                    <p class="font-bold">Tipo: <span class="font-normal capitalize">${tipo}</span></p>
                    <p class="font-bold">Total: <span class="font-normal">$${total}</span></p>
    `;

    // Insertar en el HTML
    const resultadoDiv = $.querySelector('#resultado');

    // Mostrar Spinner
    const spinner = $.querySelector('#cargando');
    spinner.style.display = 'block';
    setTimeout(() => {
        spinner.style.display = 'none'; // Se oculta el spinner
        resultadoDiv.appendChild(div); // Inmeditamente después de muestra el resultado 'resumen'
    }, 3000);
}

// Instanciar UI
const ui = new UI();

$.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones(); // Llena el select con los años...
})

eventListeners();
function eventListeners(){
    const formulario = $.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e){
    e.preventDefault();

    // Leer la marca seleccionada
    const marca = $.querySelector('#marca').value;

    // Leer el año seleccionado
    const year = $.querySelector('#year').value;
    
    // Leer el tipo de cobertura
    const tipo = $.querySelector('input[name="tipo"]:checked').value;


    if(marca === '' || year === '' || tipo === ''){
        ui.mostrarMensaje('Todos los campos son necesarios', 'error');
        return;
    }

    ui.mostrarMensaje('Cotizando...', 'correcto');

    // Ocultar las cotizaciones previas
    const resultado = $.querySelector('#resultado div');
    if(resultado != null){
        resultado.remove();
    }

    // Instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    console.log(seguro);

    // Utilizar el prototype que va a cotizar
    ui.mostrarResultado(total, seguro);

}