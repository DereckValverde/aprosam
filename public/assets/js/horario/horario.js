/* Función encargada de actualizar el horario,
   tomando en cuenta el mes y el año seleccionados. */
function actualizarHorario(mes, anio) {
  const horarioVista = document.getElementById("horarioVista");

  // Quitar la clase que indica que el horario está vacío
  horarioVista.classList.remove("horarioVacio");

  // Determinar en qué día empieza el mes
  const dia = determinarPrimerDia(mes, anio);

  // Determinar la cantidad total de días del mes
  const totalDias = determinarCantidadDiasMes(mes, anio);

  //Colocar header de los días
  horarioVista.innerHTML = `
    <div id="nombreSemana" class="inter-bold">
        <div class="nombreDia lunes">LUN</div>
        <div class="nombreDia">MAR</div>
        <div class="nombreDia">MIÉ</div>
        <div class="nombreDia">JUE</div>
        <div class="nombreDia">VIE</div>
        <div class="nombreDia">SÁB</div>
        <div class="nombreDia domingo">DOM</div>
    </div>

    <div id="cajaDias"></div>
  `;

  let espacios = dia - 1;

  //cambiar espacios = 6 si el día es domingo (domingo es = 0)
  if (espacios === -1) {
    espacios = 6;
  }

  //div donde van a ir los campos vacíos y los días
  const cajaDias = document.getElementById("cajaDias");

  //for para generar los campos vacíos antes del primer día de la semana
  for (let i = 0; i < espacios; i++) {
    const div = document.createElement("div");

    div.classList.add("dia");
    div.classList.add("espacioDia");

    div.innerHTML = `
      <div class="diaHeader"></div>
    `;

    cajaDias.appendChild(div);
  }

  // for para generar los días de la semana
  for (let j = 1; j <= totalDias; j++) {
    const divDia = document.createElement("div");

    divDia.classList.add("dia");

    divDia.innerHTML = `
      <div class="diaHeader">${j}</div>

      <div class="turnoManana dropCaja"></div>

      <hr class="divisorTurnos">

      <div class="turnoTarde dropCaja">

      </div>
    `;

    cajaDias.appendChild(divDia);
  }
}

/*
  Función encargada de traer todas las colaboradoras
  existentes y colocarlas en el UI del módulo de horario.
*/
async function cargarListaColaboradoras() {
  const listaColaboradoras = document.getElementById("listaColaboradoras");

  try {
    // Consultar la API para obtener las colaboradoras
    const response = await fetch(BASE_URL + "colaboradoras");

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const colaboradoras = await response.json();

    listaColaboradoras.innerHTML = "";

    if (colaboradoras.success) {
      colaboradoras.data.forEach((colaboradora) => {
        listaColaboradoras.innerHTML += `
          <div class="colaboradorasFondo">
            <div class="cajaColaboradora">
              <div draggable="true" class="cajaContenido" data-nombre="${colaboradora.nombre}">
                <div class="cajaNombre">
                  <img
                    src="${BASE_URL}public/assets/images/logo.jpg"
                    alt="Imagen de colaboradora"
                  >
                  <span>${colaboradora.nombre}</span>
                </div>

                <div class="cajaTurnos">
                  <span>0 Turnos</span>
                </div>
              </div>

              <div class="cajaFiltro">
                <i class="bi bi-funnel"></i>
              </div>
            </div>
          </div>
        `;
      });
    }
  } catch (error) {
    console.error("Error al cargar las colaboradoras:", error);
  }
}

/*
  Determina el día de la semana en que comienza el mes.

  Parámetros:
  mes: 1 = enero, 2 = febrero, ..., 12 = diciembre.
  anio: año seleccionado.

  Retorno:
  domingo = 0, lunes = 1, ..., sábado = 6.
*/
function determinarPrimerDia(mes, anio) {
  const fecha = new Date(anio, mes - 1, 1);

  return fecha.getDay();
}

/*
  Determina la cantidad de días del mes seleccionado.
  También contempla los años bisiestos.

  Parámetros:
  mes: 1 = enero, ..., 12 = diciembre.
  anio: año seleccionado.
*/
function determinarCantidadDiasMes(mes, anio) {
  return new Date(anio, mes, 0).getDate();
}

// Obtener los selectores de mes y año
const mes = document.getElementById("mes");
const anio = document.getElementById("anio");

/*
  Actualiza el horario solamente cuando ambos selectores
  tienen un valor seleccionado.
*/
function verificarSeleccionHorario() {
  //Comentado por ahora para pruebas
  //hace que no valide y cargue por defecto 1 y 2026
  // if (mes.value === "" || anio.value === "") {
  //   return;
  // }

  const mesSeleccionado = Number(mes.value);
  const anioSeleccionado = Number(anio.value);

  actualizarHorario(mesSeleccionado, anioSeleccionado);
}

// Escuchar cambios en el mes y el año
mes.addEventListener("change", verificarSeleccionHorario);
anio.addEventListener("change", verificarSeleccionHorario);

//ejecutar evento encargado de escuchar el dragAndDrop
function iniciarDragAndDrop() {
  const listaColaboradoras = document.getElementById("listaColaboradoras");

  listaColaboradoras.addEventListener("dragstart", (event) => {
    const caja = event.target.closest(".cajaContenido");

    if (!caja) return;

    const id = caja.dataset.nombre;
    const nombre = caja.querySelector(".cajaNombre span").textContent;

    // Guardar el id para recuperarlo cuando se suelte la colaboradora
    event.dataTransfer.setData("text/plain", id);

    console.log(`Se hizo drag a ${nombre}`);
    console.log(id);

    const fantasma = caja.cloneNode(true);

    fantasma.classList.add("achicar");

    document.body.appendChild(fantasma);

    event.dataTransfer.setDragImage(
      fantasma,
      fantasma.offsetWidth / 2,
      fantasma.offsetHeight / 2,
    );

    // Eliminar la copia después de iniciar el arrastre
    requestAnimationFrame(() => fantasma.remove());
  });
}

function detectarDrop() {
  const horarioVista = document.getElementById("horarioVista");

  // Detectar cuando se arrastra un elemento sobre una caja
  horarioVista.addEventListener("dragover", (event) => {
    const caja = event.target.closest(".dropCaja");
    if (!caja) return;

    event.preventDefault();
  });

  // Detectar cuando el cursor entra en una caja
  horarioVista.addEventListener("dragenter", (event) => {
    const caja = event.target.closest(".dropCaja");
    if (!caja) return;

    caja.classList.add("cajaActiva");
  });

  // Detectar cuando el cursor sale realmente de una caja
  horarioVista.addEventListener("dragleave", (event) => {
    const caja = event.target.closest(".dropCaja");
    if (!caja) return;

    if (event.relatedTarget && caja.contains(event.relatedTarget)) {
      return;
    }

    caja.classList.remove("cajaActiva");
  });

  // Detectar cuando se suelta la colaboradora
  horarioVista.addEventListener("drop", (event) => {
    const caja = event.target.closest(".dropCaja");
    if (!caja) return;

    event.preventDefault();
    caja.classList.remove("cajaActiva");

    // Recuperar el ID de la colaboradora arrastrada
    const nombreColaboradora = event.dataTransfer.getData("text/plain");

    /* Lógica para asignar colaboradora a la caja */
    mostrar(caja, nombreColaboradora);
  });
}

function mostrar(caja, nombre) {
  const dia = caja.closest(".dia");
  const divisor = dia.querySelector(".divisorTurnos");

  // Limitar a 2 colaboradoras por turno
  const cantidad = caja.querySelectorAll(".nombreColaboradora").length;

  if (cantidad >= 2) {
    console.log("Máximo de colaboradoras alcanzado.");
    return;
  }

  // Mostrar el divisor cuando se asigna una colaboradora
  divisor.classList.add("divisorVisible");

  if (cantidad > 0) {
    const elementoY = document.createElement("div");
    elementoY.classList.add("nombreColaboradora");
    elementoY.textContent = "y";
    caja.appendChild(elementoY);
  }

  const elemento = document.createElement("div");
  elemento.textContent = nombre;
  elemento.classList.add("nombreColaboradora");

  caja.appendChild(elemento);
}

// Cargar la lista de colaboradoras al iniciar
cargarListaColaboradoras();

//Llamada de funciones encargadas del dragAndDrop del módulo horario
iniciarDragAndDrop();
detectarDrop();

//llamada TEMPORAL para que el horario cargue de una vez
verificarSeleccionHorario();
