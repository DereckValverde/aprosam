//colaboradoras máximas por turno
const MAX_POR_TURNO = 2;

//Dropdowns del horario
const selectMes = document.getElementById("mes");
const selectAnio = document.getElementById("anio");

function actualizarContadorTurnos(nombre, cambio) {
  const cajas = document.querySelectorAll(
    `#listaColaboradoras .cajaContenido[data-nombre="${nombre}"]`,
  );

  cajas.forEach((caja) => {
    const spanTurnos = caja.querySelector(".cajaTurnos span");
    if (!spanTurnos) return;

    const actual = parseInt(spanTurnos.textContent, 10) || 0;
    const nuevoTotal = Math.max(0, actual + cambio);

    spanTurnos.textContent = `${nuevoTotal} ${nuevoTotal === 1 ? "Turno" : "Turnos"}`;
  });
}

function actualizarHorario(mes, anio) {
  const horarioVista = document.getElementById("horarioVista");

  //Limpiar vista vacía inicial
  horarioVista.classList.remove("horarioVacio");

  //Espacios iniciales: lunes = 0, domingo = 6

  const espacios = (determinarPrimerDia(mes, anio) + 6) % 7;
  const totalDias = determinarCantidadDiasMes(mes, anio);

  //crear cajaDias
  const cajaDias = document.createElement("div");
  cajaDias.id = "cajaDias";

  for (let i = 0; i < espacios; i++) {
    cajaDias.appendChild(crearEspacioDia());
  }

  for (let j = 1; j <= totalDias; j++) {
    cajaDias.appendChild(crearDia(j));
  }

  horarioVista.replaceChildren(crearEncabezadoHorario(), cajaDias);
}

function crearEncabezadoHorario() {
  const DIAS_SEMANA = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

  const encabezado = document.createElement("div");

  encabezado.id = "nombreSemana";
  encabezado.className = "inter-bold";

  DIAS_SEMANA.forEach((nombre, indice) => {
    const dia = document.createElement("div");
    dia.className = "nombreDia";

    if (indice === 0) dia.classList.add("lunes");
    if (indice === DIAS_SEMANA.length - 1) dia.classList.add("domingo");

    dia.textContent = nombre;
    encabezado.appendChild(dia);
  });

  return encabezado;
}

function crearEspacioDia() {
  const divEspacio = document.createElement("div");

  divEspacio.classList.add("dia");
  divEspacio.classList.add("espacioDia");

  divEspacio.innerHTML = `
      <div class="diaHeader"></div>
    `;

  return divEspacio;
}

function crearDia(numero) {
  const divDia = document.createElement("div");

  divDia.classList.add("dia");

  divDia.innerHTML = `
      <div class="diaHeader">${numero}</div>

      <div class="turnoManana dropCaja">
        <div class="turno-contenedor">
          <i class="bi bi-sun"></i>
          <div class="nombresTurno"></div>
        </div>
      </div>

      <hr class="divisorTurnos">

      <div class="turnoTarde dropCaja">
        <div class="turno-contenedor">
          <i class="bi bi-moon"></i>
          <div class="nombresTurno"></div>
        </div>
      </div>
    `;

  return divDia;
}

async function cargarListaColaboradoras() {
  const listaColaboradoras = document.getElementById("listaColaboradoras");

  try {
    const response = await fetch(BASE_URL + "colaboradoras");

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const datos = await response.json();

    if (!datos.success) {
      listaColaboradoras.replaceChildren();
      return;
    }

    const fragmento = document.createDocumentFragment();

    datos.data.forEach((colaboradora) => {
      fragmento.appendChild(crearColaboradora(colaboradora));
    });

    listaColaboradoras.replaceChildren(fragmento);
  } catch (error) {
    console.error("Error al cargar las colaboradoras:", error);
  }
}

function crearColaboradora(colaboradora) {
  const contenedor = document.createElement("div");

  contenedor.className = "colaboradorasFondo";

  contenedor.innerHTML += `
          <div class="colaboradorasFondo">
            <div class="cajaColaboradora">
              <div draggable="true" class="cajaContenido">
                <div class="cajaNombre">
                  <img
                    src="${BASE_URL}public/assets/images/logo.jpg"
                    alt="Imagen de colaboradora"
                  >
                  <span></span>
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

  const cajaContenido = contenedor.querySelector(".cajaContenido");

  cajaContenido.dataset.nombre = colaboradora.nombre;

  cajaContenido.querySelector(".cajaContenido span").textContent =
    colaboradora.nombre;

  return contenedor;
}

function determinarPrimerDia(mes, anio) {
  const fecha = new Date(anio, mes - 1, 1);

  return fecha.getDay();
}

function determinarCantidadDiasMes(mes, anio) {
  return new Date(anio, mes, 0).getDate();
}

function iniciarFiltros() {
  const listaColaboradoras = document.getElementById("listaColaboradoras");

  listaColaboradoras.addEventListener("click", (event) => {
    const cajaFiltro = event.target.closest(".cajaFiltro");

    if (!cajaFiltro) return;

    const estabaFiltroActivo = cajaFiltro.classList.contains("filtro-activo");

    const cajaContenido =
      cajaFiltro.parentElement.querySelector(".cajaContenido");

    const nombre = cajaContenido.dataset.nombre;

    //limpiar otros filtros por si están activos
    limpiarFiltros();

    if (estabaFiltroActivo) return;

    cajaFiltro.classList.add("filtro-activo");

    ejecutarFiltro(nombre);
  });
}

function ejecutarFiltro(nombre) {
  document.querySelectorAll(".nombreColaboradora").forEach((colaboradora) => {
    if (colaboradora.textContent !== nombre) return;

    colaboradora.closest(".dia").classList.add("prueba"); // hay que resaltar más lindo, por ahora solo es gb: red;
  });
}

function limpiarFiltros() {
  // Apagar todos los iconos
  document.querySelectorAll(".cajaFiltro.filtro-activo").forEach((filtro) => {
    filtro.classList.remove("filtro-activo");
  });

  //quitar resaltado de todos los días
  document.querySelectorAll(".dia.prueba").forEach((dia) => {
    dia.classList.remove("prueba");
  });
}

function verificarSeleccionHorario() {
  if (selectMes.value === "" || selectAnio.value === "") {
    return;
  }

  const mesSeleccionado = Number(mes.value);
  const anioSeleccionado = Number(anio.value);

  actualizarHorario(mesSeleccionado, anioSeleccionado);
}

function iniciarDragAndDrop() {
  const listaColaboradoras = document.getElementById("listaColaboradoras");

  listaColaboradoras.addEventListener("dragstart", (event) => {
    const caja = event.target.closest(".cajaContenido");

    if (!caja) return;

    const id = caja.dataset.nombre;
    const nombre = caja.querySelector(".cajaNombre span").textContent;

    event.dataTransfer.setData("text/plain", id);

    const fantasma = caja.cloneNode(true);

    fantasma.classList.add("achicar");

    document.body.appendChild(fantasma);

    event.dataTransfer.setDragImage(
      fantasma,
      fantasma.offsetWidth / 2,
      fantasma.offsetHeight / 2,
    );

    requestAnimationFrame(() => fantasma.remove());
  });
}

function detectarDrop() {
  const horarioVista = document.getElementById("horarioVista");

  horarioVista.addEventListener("dragover", (event) => {
    const caja = event.target.closest(".dropCaja");
    if (!caja) return;

    event.preventDefault();
  });

  horarioVista.addEventListener("dragenter", (event) => {
    const caja = event.target.closest(".dropCaja");
    if (!caja) return;

    caja.classList.add("cajaActiva");
  });

  horarioVista.addEventListener("dragleave", (event) => {
    const caja = event.target.closest(".dropCaja");
    if (!caja) return;

    if (event.relatedTarget && caja.contains(event.relatedTarget)) {
      return;
    }

    caja.classList.remove("cajaActiva");
  });

  horarioVista.addEventListener("drop", (event) => {
    const caja = event.target.closest(".dropCaja");
    if (!caja) return;

    event.preventDefault();
    caja.classList.remove("cajaActiva");

    const nombreColaboradora = event.dataTransfer.getData("text/plain");

    agregarColaboradora(caja, nombreColaboradora);
  });
}

function agregarColaboradora(caja, nombreColaboradora) {
  const dia = caja.closest(".dia");
  const divisor = dia.querySelector(".divisorTurnos");
  const contenedorNombres = caja.querySelector(".nombresTurno");

  const colaboradoras = contenedorNombres.querySelectorAll(
    ".nombreColaboradora",
  );

  if (colaboradoras.length >= MAX_POR_TURNO) {
    return;
  }

  divisor.classList.add("divisorVisible");

  if (colaboradoras.length === 1) {
    contenedorNombres.appendChild(crearSeparadorY());
  }

  contenedorNombres.appendChild(crearNombreColaboradora(nombreColaboradora));

  actualizarContadorTurnos(nombreColaboradora, 1);
}

function crearSeparadorY() {
  const elementoY = document.createElement("span");
  elementoY.classList.add("separadorY");
  elementoY.textContent = " y ";

  return elementoY;
}

function crearNombreColaboradora(nombre) {
  const elemento = document.createElement("span");
  elemento.classList.add("nombreColaboradora");
  elemento.textContent = nombre;
  elemento.title = "Clic derecho para eliminar";

  return elemento;
}

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();

  const elementoNombre = event.target.closest(".nombreColaboradora");
  if (!elementoNombre) return;

  quitarColaboradora(elementoNombre);
});

function quitarColaboradora(elementoNombre) {
  const nombre = elementoNombre.textContent.trim();
  const contenedor = elementoNombre.closest(".nombresTurno");
  const dia = elementoNombre.closest(".dia");
  const divisor = dia.querySelector(".divisorTurnos");

  elementoNombre.remove();
  actualizarContadorTurnos(nombre, -1);

  const separador = contenedor.querySelector(".separadorY");
  if (separador) {
    separador.remove();
  }

  const totalEnDia = dia.querySelectorAll(".nombreColaboradora").length;
  if (totalEnDia === 0) {
    divisor.classList.remove("divisorVisible");
  }
}

function registrarEventos() {
  selectMes.addEventListener("change", verificarSeleccionHorario);
  selectAnio.addEventListener("change", verificarSeleccionHorario);

  iniciarDragAndDrop();
  detectarDrop();
  iniciarFiltros();
}

function init() {
  registrarEventos();
  cargarListaColaboradoras();
  verificarSeleccionHorario();
}

init();
