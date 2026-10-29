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

  horarioVista.classList.remove("horarioVacio");

  const dia = determinarPrimerDia(mes, anio);
  const totalDias = determinarCantidadDiasMes(mes, anio);

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

  if (espacios === -1) {
    espacios = 6;
  }

  const cajaDias = document.getElementById("cajaDias");

  for (let i = 0; i < espacios; i++) {
    const div = document.createElement("div");

    div.classList.add("dia");
    div.classList.add("espacioDia");

    div.innerHTML = `
      <div class="diaHeader"></div>
    `;

    cajaDias.appendChild(div);
  }

  for (let j = 1; j <= totalDias; j++) {
    const divDia = document.createElement("div");

    divDia.classList.add("dia");

    divDia.innerHTML = `
      <div class="diaHeader">${j}</div>

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

    cajaDias.appendChild(divDia);
  }
}

async function cargarListaColaboradoras() {
  const listaColaboradoras = document.getElementById("listaColaboradoras");

  try {
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

function determinarPrimerDia(mes, anio) {
  const fecha = new Date(anio, mes - 1, 1);

  return fecha.getDay();
}

function determinarCantidadDiasMes(mes, anio) {
  return new Date(anio, mes, 0).getDate();
}

const mes = document.getElementById("mes");
const anio = document.getElementById("anio");

function verificarSeleccionHorario() {
  const mesSeleccionado = Number(mes.value);
  const anioSeleccionado = Number(anio.value);

  actualizarHorario(mesSeleccionado, anioSeleccionado);
}

mes.addEventListener("change", verificarSeleccionHorario);
anio.addEventListener("change", verificarSeleccionHorario);

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

    mostrar(caja, nombreColaboradora);
  });
}

function mostrar(caja, nombre) {
  const dia = caja.closest(".dia");
  const divisor = dia.querySelector(".divisorTurnos");
  const contenedorNombres = caja.querySelector(".nombresTurno");

  const colaboradoras = contenedorNombres.querySelectorAll(
    ".nombreColaboradora",
  );

  if (colaboradoras.length >= 2) {
    return;
  }

  divisor.classList.add("divisorVisible");

  if (colaboradoras.length === 1) {
    const elementoY = document.createElement("span");
    elementoY.classList.add("separadorY");
    elementoY.textContent = " y ";
    contenedorNombres.appendChild(elementoY);
  }

  const elemento = document.createElement("span");
  elemento.textContent = nombre;
  elemento.classList.add("nombreColaboradora");
  elemento.title = "Clic derecho para eliminar";

  contenedorNombres.appendChild(elemento);

  actualizarContadorTurnos(nombre, 1);
}

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();

  const elementoNombre = event.target.closest(".nombreColaboradora");
  if (!elementoNombre) return;

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
});

document.getElementById("horarioVista").addEventListener("click", (event) => {
  const btnEliminar = event.target.closest(".btnEliminarColaboradora");
  if (!btnEliminar) return;

  const chip = btnEliminar.closest(".chipColaboradora");
  const nombreElemento = chip.querySelector(".nombreColaboradora");
  const nombre = nombreElemento ? nombreElemento.textContent.trim() : null;

  const contenedor = chip.closest(".nombresTurno");
  const dia = chip.closest(".dia");
  const divisor = dia.querySelector(".divisorTurnos");

  chip.remove();

  if (nombre) {
    actualizarContadorTurnos(nombre, -1);
  }

  const separador = contenedor.querySelector(".separadorY");
  if (separador) {
    separador.remove();
  }

  const totalEnDia = dia.querySelectorAll(".chipColaboradora").length;
  if (totalEnDia === 0) {
    divisor.classList.remove("divisorVisible");
  }
});

cargarListaColaboradoras();

iniciarDragAndDrop();
detectarDrop();

verificarSeleccionHorario();
