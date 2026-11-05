/* =========================================================
   Configuración
   ========================================================= */
const MAX_POR_TURNO = 2;
const DIAS_SEMANA = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

/* =========================================================
   Estado
   ========================================================= */
var bordeSeleccionado = null;
var colorSeleccionado = null;
var itemColaboradoraParaSustituir = null;
var listaColaboradorasCache = [];

/* =========================================================
   Referencias al DOM
   ========================================================= */
const selectMes = document.getElementById("mes");
const selectAnio = document.getElementById("anio");
const btnGuardarHorario = document.getElementById("btnGuardarHorario");

/* =========================================================
   Punto de entrada
   ========================================================= */
function init() {
  registrarEventos();
  cargarListaColaboradoras();
  verificarSeleccionHorario();
}

/* =========================================================
   Registro de eventos
   ========================================================= */
function registrarEventos() {
  selectMes.addEventListener("change", verificarSeleccionHorario);
  selectAnio.addEventListener("change", verificarSeleccionHorario);
  btnGuardarHorario.addEventListener("click", imprimirHorario);

  iniciarDragAndDrop();
  detectarDrop();
  iniciarFiltros();

  detectarBordeSeleccionado();
  detectarDiaSeleccionado();
  eliminarBorde();

  detectarCheckBoxColores();
  detectarColorSeleccionado();

  dobleClicIzquierdoColaboradora();
  iniciarEventosModalSustituirColaboradora();

  document.addEventListener("contextmenu", alClicDerecho);
}

function iniciarDragAndDrop() {
  const listaColaboradoras = document.getElementById("listaColaboradoras");

  listaColaboradoras.addEventListener("dragstart", (event) => {
    const caja = event.target.closest(".cajaContenido");

    if (!caja) return;

    const id = caja.dataset.nombre;

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

    limpiarIndicadorActivoBordes();
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

function iniciarFiltros() {
  const listaColaboradoras = document.getElementById("listaColaboradoras");

  listaColaboradoras.addEventListener("click", (event) => {
    const cajaFiltro = event.target.closest(".cajaFiltro");

    if (!cajaFiltro) return;

    const estabaFiltroActivo = cajaFiltro.classList.contains("filtro-activo");

    const cajaContenido =
      cajaFiltro.parentElement.querySelector(".cajaContenido");

    const nombre = cajaContenido.dataset.nombre;

    // Limpiar otros filtros por si están activos
    limpiarFiltros();

    if (estabaFiltroActivo) return;

    cajaFiltro.classList.add("filtro-activo");

    aplicarFiltro(nombre);
  });
}

function abrirModalParaSustituirColaboradora(itemColaboradora, x, y) {
  itemColaboradoraParaSustituir = itemColaboradora;

  const elementoTitular = itemColaboradora.querySelector(".nombreColaboradora");
  if (!elementoTitular) return;

  const nombreTitular =
    elementoTitular.dataset.nombre || elementoTitular.textContent.trim();
  const elementoSustituta = itemColaboradora.querySelector(".nombreSustituta");
  const sustitutaActual = elementoSustituta
    ? (
        elementoSustituta.dataset.nombre || elementoSustituta.textContent
      ).replace(/[()]/g, "").trim()
    : "";

  const modal = document.querySelector(".modalSustituirColaboradora");
  modal.querySelector(".tituloModal").textContent = nombreTitular;

  poblarSelectSustitutas(itemColaboradora, nombreTitular, sustitutaActual);

  const btnEliminarSustituta = modal.querySelector(".btnEliminarSustituta");
  if (btnEliminarSustituta) {
    btnEliminarSustituta.style.display = sustitutaActual ? "inline-block" : "none";
  }

  // Posicionar modal
  modal.style.display = "flex";
  const modalAncho = 300;
  const modalAlto = 170;
  let posX = x + 30;
  let posY = y - 20;

  if (posX + modalAncho > window.innerWidth) {
    posX = Math.max(10, x - modalAncho - 10);
  }
  if (posY + modalAlto > window.innerHeight) {
    posY = Math.max(10, window.innerHeight - modalAlto - 10);
  }

  modal.style.left = `${posX}px`;
  modal.style.top = `${posY}px`;
}

function poblarSelectSustitutas(itemColaboradora, nombreTitular, sustitutaActual) {
  const select = document.getElementById("modalListaColaboradoras");
  select.replaceChildren();

  if (!listaColaboradorasCache || listaColaboradorasCache.length === 0) {
    const cajas = document.querySelectorAll(
      "#listaColaboradoras .cajaContenido",
    );
    listaColaboradorasCache = Array.from(cajas).map((caja) => ({
      nombre: caja.dataset.nombre,
    }));
  }

  const turno = itemColaboradora.closest(".nombresTurno");
  const otrosNombresEnTurno = turno
    ? [
        ...turno.querySelectorAll(".nombreColaboradora, .nombreSustituta"),
      ]
        .filter((el) => !itemColaboradora.contains(el))
        .map((el) =>
          (el.dataset.nombre || el.textContent).replace(/[()]/g, "").trim(),
        )
    : [];

  const fragmento = document.createDocumentFragment();

  listaColaboradorasCache.forEach((colaboradora) => {
    if (colaboradora.nombre === nombreTitular) return;
    if (otrosNombresEnTurno.includes(colaboradora.nombre)) return;

    const option = document.createElement("option");
    option.value = colaboradora.nombre;
    option.textContent = colaboradora.nombre;

    if (colaboradora.nombre === sustitutaActual) {
      option.selected = true;
    }

    fragmento.appendChild(option);
  });

  select.appendChild(fragmento);
}

function iniciarEventosModalSustituirColaboradora() {
  const modal = document.querySelector(".modalSustituirColaboradora");
  if (!modal) return;

  modal.addEventListener("click", (event) => {
    // Botón Aceptar
    if (event.target.closest(".btnAceptar")) {
      const select = document.getElementById("modalListaColaboradoras");
      const nombreSeleccionado = select.value;

      if (!nombreSeleccionado || !itemColaboradoraParaSustituir) {
        cerrarModalSustitucion();
        return;
      }

      asignarSustituta(itemColaboradoraParaSustituir, nombreSeleccionado);
      cerrarModalSustitucion();
    }

    // Botón Cancelar
    if (event.target.closest(".btnCancelar")) {
      cerrarModalSustitucion();
    }

    // Botón Quitar sustituta
    if (event.target.closest(".btnEliminarSustituta")) {
      if (itemColaboradoraParaSustituir) {
        const sustituta =
          itemColaboradoraParaSustituir.querySelector(".nombreSustituta");
        if (sustituta) {
          quitarSustituta(sustituta);
        }
      }
      cerrarModalSustitucion();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.style.display === "flex") {
      cerrarModalSustitucion();
    }
  });

  document.addEventListener("mousedown", (event) => {
    if (
      modal.style.display === "flex" &&
      !modal.contains(event.target) &&
      !event.target.closest(".nombreColaboradora") &&
      !event.target.closest(".nombreSustituta")
    ) {
      cerrarModalSustitucion();
    }
  });
}

function cerrarModalSustitucion() {
  const modal = document.querySelector(".modalSustituirColaboradora");
  if (modal) {
    modal.style.display = "none";
  }
  itemColaboradoraParaSustituir = null;
}

function asignarSustituta(itemColaboradora, nombreSustituta) {
  let spanSustituta = itemColaboradora.querySelector(".nombreSustituta");

  if (!spanSustituta) {
    spanSustituta = document.createElement("span");
    spanSustituta.classList.add("nombreSustituta");
    itemColaboradora.appendChild(spanSustituta);
  }

  spanSustituta.dataset.nombre = nombreSustituta;
  spanSustituta.textContent = `(${nombreSustituta})`;
  spanSustituta.title =
    "Clic derecho para eliminar sustitución | Doble clic para cambiar";

  refrescarFiltroActivo();
}

/* =========================================================
   Handlers
   ========================================================= */
function verificarSeleccionHorario() {
  if (selectMes.value === "" || selectAnio.value === "") {
    return;
  }

  const mesSeleccionado = Number(selectMes.value);
  const anioSeleccionado = Number(selectAnio.value);

  colocarTituloHorario(mesSeleccionado, anioSeleccionado);

  actualizarHorario(mesSeleccionado, anioSeleccionado);
}

async function imprimirHorario() {
  const confirmado = await mostrarMensajeGuardarHorario();

  if (confirmado) {
    const horarioVista = document.getElementById("horarioVista");

    if (horarioVista.classList.contains("horarioVacio")) return;

    const { hoja, zona } = crearContenedorImpresion(horarioVista);

    try {
      await html2pdf().set(opcionesPdf()).from(hoja).save();
    } catch (error) {
      console.error("No se pudo generar el PDF del horario:", error);
      mostrarAlertaPdfFallido();
    } finally {
      zona.remove();
    }
  }
}

function alClicDerecho(event) {
  const elementoSustituta = event.target.closest(".nombreSustituta");
  if (elementoSustituta) {
    event.preventDefault();
    event.stopPropagation();
    quitarSustituta(elementoSustituta);
    return;
  }

  const elementoNombre = event.target.closest(".nombreColaboradora");
  if (elementoNombre) {
    event.preventDefault();
    event.stopPropagation();
    quitarColaboradora(elementoNombre);
    return;
  }
}

function dobleClicIzquierdoColaboradora() {
  const horarioVista = document.getElementById("horarioVista");

  horarioVista.addEventListener("dblclick", (event) => {
    const item =
      event.target.closest(".itemColaboradora") ||
      event.target.closest(".nombreColaboradora")?.parentElement;

    if (!item) return;

    const x = event.clientX;
    const y = event.clientY;

    abrirModalParaSustituirColaboradora(item, x, y);
  });
}

function detectarColorSeleccionado() {
  const listaColores = document.getElementById("listaColores");

  listaColores.addEventListener("click", (event) => {
    const cajaColor = event.target.closest(".cajaColor");

    if (!cajaColor) return;

    // Quitar la selección visual de los demás colores
    document.querySelectorAll(".cajaColor").forEach((caja) => {
      caja.classList.remove("color-seleccionado");
    });

    // Marcar visualmente el color seleccionado
    cajaColor.classList.add("color-seleccionado");

    // Obtener el nombre del color
    const nombreColor = cajaColor.querySelector("p").textContent.trim();

    colorSeleccionado = nombreColor;

    // Desactivar cualquier borde seleccionado
    limpiarIndicadorActivoBordes();
    bordeSeleccionado = null;
  });
}

function detectarBordeSeleccionado() {
  const listaBordes = document.getElementById("listaBordes");

  listaBordes.addEventListener("click", (event) => {
    const cajaBorde = event.target.closest(".cajaBorde");

    if (!cajaBorde) return;

    // Eliminar otros indicadores de bordes
    limpiarIndicadorActivoBordes();

    // Quitar la selección visual de los colores
    document.querySelectorAll(".cajaColor").forEach((caja) => {
      caja.classList.remove("color-seleccionado");
    });

    // Desactivar el color seleccionado
    colorSeleccionado = null;

    // Colocar indicador de que el borde está activo
    cajaBorde.appendChild(crearCajaActivo());

    // Guardar el borde seleccionado
    const span = cajaBorde.querySelector(".textoBorde");
    bordeSeleccionado = span.textContent;
  });
}

function detectarDiaSeleccionado() {
  const horarioVista = document.getElementById("horarioVista");

  //Evento para pintar el borde
  horarioVista.addEventListener("click", (event) => {
    if (bordeSeleccionado != null && colorSeleccionado == null) {
      const dia = event.target.closest(".dia");

      pintarBordeDia(dia);
    }
  });

  horarioVista.addEventListener("click", (event) => {
    if (bordeSeleccionado == null && colorSeleccionado != null) {
      const dia = event.target.closest(".dia");

      pintarFondoDia(dia);
    }
  });
}

function eliminarBorde() {
  const horarioVista = document.getElementById("horarioVista");

  horarioVista.addEventListener("contextmenu", (event) => {
    const dia = event.target.closest(".dia");

    if (!dia) return;

    event.preventDefault();

    dia.classList.remove("borde-verduras", "borde-pava", "borde-diario");
  });
}
function detectarCheckBoxColores() {
  const checkBoxColores = document.getElementById("checkBoxColores");

  checkBoxColores.addEventListener("click", () => {
    if (checkBoxColores) {
      activarColoresSeccion();
    }
  });
}

const COLORES_DIA = {
  Rojo: "--color-dia-rojo",
  Morado: "--color-dia-morado",
  Amarillo: "--color-dia-amarillo",
  Azul: "--color-dia-azul",
  Verde: "--color-dia-verde",
  Blanco: "--color-dia-blanco",
};

function pintarFondoDia(dia) {
  if (!dia) return;

  const variable = COLORES_DIA[colorSeleccionado];
  if (!variable) return;
  dia.style.backgroundColor = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
}

/* =========================================================
   Impresión
   ========================================================= */
const ANCHO_HOJA_IMPRESION = 800;
const ALTO_HOJA_IMPRESION = 540;
const ANCHO_CONTENIDO_IMPRESION = 1494;

function opcionesPdf() {
  return {
    margin: [12, 12, 12, 12],
    filename: nombreArchivoHorario(),
    image: { type: "jpeg", quality: 1.0 },
    html2canvas: {
      scale: 4,
      width: ANCHO_HOJA_IMPRESION,
      height: ALTO_HOJA_IMPRESION,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      letterRendering: true,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "landscape",
      compress: true,
    },
  };
}

function nombreArchivoHorario() {
  const titulo = document.querySelector(".nombreHorario").textContent.trim();
  return `Horario ${titulo}.pdf`.replace(/\s+/g, " ");
}

function crearContenedorImpresion(horarioVista) {
  const zona = document.createElement("div");
  zona.style.position = "absolute";
  zona.style.top = "0";
  zona.style.left = "0";
  zona.style.width = "0";
  zona.style.height = "0";
  zona.style.overflow = "hidden";

  const hoja = document.createElement("div");
  hoja.style.position = "relative";
  hoja.style.width = `${ANCHO_HOJA_IMPRESION}px`;
  hoja.style.height = `${ALTO_HOJA_IMPRESION}px`;
  hoja.style.overflow = "hidden";
  hoja.style.backgroundColor = "#ffffff";

  const contenido = document.createElement("div");
  contenido.style.width = `${ANCHO_CONTENIDO_IMPRESION}px`;
  contenido.style.backgroundColor = "#ffffff";
  contenido.style.fontFamily = getComputedStyle(horarioVista).fontFamily;
  contenido.style.textRendering = "optimizeLegibility";
  contenido.style.webkitFontSmoothing = "antialiased";
  contenido.style.MozOsxFontSmoothing = "grayscale";

  const titulo = document.getElementById("horarioTitulo").cloneNode(true);
  titulo.removeAttribute("id");
  titulo.style.margin = "0";
  titulo.style.paddingBottom = "40px";
  titulo.style.fontSize = "1.9rem";

  titulo.style.width = "100%";
  titulo.style.textAlign = "center";
  titulo.style.display = "flex";
  titulo.style.justifyContent = "center";
  titulo.style.alignItems = "center";

  const nombreTitulo = titulo.querySelector(".nombreHorario");
  if (nombreTitulo) nombreTitulo.style.margin = "0";

  const vista = horarioVista.cloneNode(true);
  vista.removeAttribute("id");
  vista.classList.remove("filtroActivo");
  vista.style.height = "auto";
  vista.style.marginTop = "0";
  vista.style.overflow = "visible";
  vista.style.flex = "0 0 auto";
  vista.style.background = "#eaeaec";
  vista.style.borderRadius = "14px";

  vista.querySelectorAll(".dia.prueba").forEach((dia) => {
    dia.classList.remove("prueba");
  });

  const semana = vista.querySelector("#nombreSemana");
  if (semana) semana.style.position = "static";

  contenido.append(titulo, vista);
  hoja.appendChild(contenido);
  zona.appendChild(hoja);
  document.body.appendChild(zona);

  const ancho = contenido.offsetWidth;
  const alto = contenido.offsetHeight;
  const escala = Math.min(
    ANCHO_HOJA_IMPRESION / ancho,
    ALTO_HOJA_IMPRESION / alto,
  );

  contenido.style.position = "absolute";
  contenido.style.transformOrigin = "top left";
  contenido.style.transform = `scale(${escala})`;
  contenido.style.left = `${(ANCHO_HOJA_IMPRESION - ancho * escala) / 2}px`;
  contenido.style.top = `${(ALTO_HOJA_IMPRESION - alto * escala) / 2}px`;

  return { hoja, zona };
}

function mostrarAlertaPdfFallido() {
  Swal.fire({
    toast: true,
    position: "bottom",
    icon: "error",
    title: "No se pudo generar el PDF",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: "alerta-error",
    },
  });
}

async function mostrarMensajeGuardarHorario() {
  const result = await Swal.fire({
    title: "¿Guardar horario?",
    text: "Se generará y descargará un archivo PDF.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#047857",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, guardar PDF",
    cancelButtonText: "Cancelar",
  });

  return result.isConfirmed;
}

/* =========================================================
   Acciones
   ========================================================= */
function agregarColaboradora(caja, nombreColaboradora) {
  const dia = caja.closest(".dia");
  const divisor = dia.querySelector(".divisorTurnos");
  const contenedorNombres = caja.querySelector(".nombresTurno");

  const items = contenedorNombres.querySelectorAll(".itemColaboradora");

  // Validar si ese nombre ya está en ese turno (como titular o como sustituta)
  const nombresEnTurno = [
    ...contenedorNombres.querySelectorAll(
      ".nombreColaboradora, .nombreSustituta",
    ),
  ].map((el) =>
    (el.dataset.nombre || el.textContent).replace(/[()]/g, "").trim(),
  );

  // Si ya está, enviar alerta y no permitir añadir
  if (nombresEnTurno.includes(nombreColaboradora)) {
    mostrarAlertaColaboradoraRepetida();
    return;
  }

  if (items.length >= MAX_POR_TURNO) {
    return;
  }

  divisor.classList.add("divisorVisible");

  if (items.length === 1) {
    contenedorNombres.appendChild(crearSeparadorY());
  }

  contenedorNombres.appendChild(crearNombreColaboradora(nombreColaboradora));

  actualizarContadorTurnos(nombreColaboradora, 1);

  refrescarFiltroActivo();
}

function quitarSustituta(elementoSustituta) {
  elementoSustituta.remove();
  cerrarModalSustitucion();
  refrescarFiltroActivo();
}

function quitarColaboradora(elementoNombre) {
  const item = elementoNombre.closest(".itemColaboradora") || elementoNombre;
  const titular = item.querySelector(".nombreColaboradora") || elementoNombre;
  const nombre = titular.dataset.nombre || titular.textContent.trim();
  const contenedor = item.closest(".nombresTurno");
  const dia = item.closest(".dia");
  const divisor = dia ? dia.querySelector(".divisorTurnos") : null;

  item.remove();
  cerrarModalSustitucion();
  actualizarContadorTurnos(nombre, -1);

  if (contenedor) {
    const itemsRestantes = contenedor.querySelectorAll(".itemColaboradora");
    if (itemsRestantes.length <= 1) {
      contenedor.querySelectorAll(".separadorY").forEach((sep) => sep.remove());
    }
  }

  if (dia && divisor) {
    const totalEnDia = dia.querySelectorAll(".nombreColaboradora").length;
    if (totalEnDia === 0) {
      divisor.classList.remove("divisorVisible");
    }
  }

  refrescarFiltroActivo();
}

function pintarBordeDia(dia) {
  if (!dia || !bordeSeleccionado) return;

  // Eliminar bordes anteriores
  dia.classList.remove("borde-verduras", "borde-pava", "borde-diario");

  // Aplicar el nuevo borde
  switch (bordeSeleccionado) {
    case "Verduras":
      dia.classList.add("borde-verduras");
      break;

    case "Pava":
      dia.classList.add("borde-pava");
      break;

    case "Diario":
      dia.classList.add("borde-diario");
      break;
  }
}

function reiniciarColoresYBordes() {
  colorSeleccionado = null;
  bordeSeleccionado = null;

  // Quitar indicadores de selección de colores
  document.querySelectorAll(".cajaColor").forEach((caja) => {
    caja.classList.remove("color-seleccionado");
  });

  // Quitar indicadores de selección de bordes
  limpiarIndicadorActivoBordes();
}
/* =========================================================
   Render
   ========================================================= */
function actualizarHorario(mes, anio) {
  const horarioVista = document.getElementById("horarioVista");
  horarioVista.classList.remove("horarioVacio");

  const espacios = (determinarPrimerDia(mes, anio) + 6) % 7;
  const totalDias = determinarCantidadDiasMes(mes, anio);

  const cajaDias = document.createElement("div");
  cajaDias.id = "cajaDias";

  // Crear espacios vacíos iniciales
  for (let i = 0; i < espacios; i++) {
    cajaDias.appendChild(crearEspacioDia());
  }

  // Crear los días del mes
  for (let j = 1; j <= totalDias; j++) {
    cajaDias.appendChild(crearDia(j));
  }

  // Crear espacios vacíos finales para rellenar
  const totalCeldas = espacios + totalDias;
  const espaciosFinales = totalCeldas % 7 === 0 ? 0 : 7 - (totalCeldas % 7);

  for (let k = 0; k < espaciosFinales; k++) {
    cajaDias.appendChild(crearEspacioDia());
  }

  horarioVista.replaceChildren(crearEncabezadoHorario(), cajaDias);

  limpiarFiltros();
}

function crearEncabezadoHorario() {
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

  divEspacio.classList.add("dia", "espacioDia");

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

function crearColaboradora(colaboradora) {
  const contenedor = document.createElement("div");

  contenedor.className = "colaboradorasFondo";

  contenedor.innerHTML = `
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
  `;

  const cajaContenido = contenedor.querySelector(".cajaContenido");

  cajaContenido.dataset.nombre = colaboradora.nombre;

  contenedor.querySelector(".cajaNombre span").textContent =
    colaboradora.nombre;

  return contenedor;
}

function crearSeparadorY() {
  const elementoY = document.createElement("span");
  elementoY.classList.add("separadorY");
  elementoY.textContent = " y ";

  return elementoY;
}

function crearCajaActivo() {
  const cajaActivo = document.createElement("span");

  cajaActivo.textContent = "activo";
  cajaActivo.classList.add("activo");

  return cajaActivo;
}

function crearNombreColaboradora(nombre) {
  const item = document.createElement("div");
  item.classList.add("itemColaboradora");

  const elemento = document.createElement("span");
  elemento.classList.add("nombreColaboradora");
  elemento.dataset.nombre = nombre;
  elemento.textContent = nombre;
  elemento.title = "Clic derecho para eliminar | Doble clic para sustituir";

  item.appendChild(elemento);
  return item;
}

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

function aplicarFiltro(nombre) {
  const horarioVista = document.getElementById("horarioVista");

  horarioVista.classList.add("filtroActivo");

  document.querySelectorAll(".dia.prueba").forEach((dia) => {
    dia.classList.remove("prueba");
  });

  document
    .querySelectorAll(".nombreColaboradora, .nombreSustituta")
    .forEach((elemento) => {
      const nombreElemento = (
        elemento.dataset.nombre || elemento.textContent
      )
        .replace(/[()]/g, "")
        .trim();

      if (nombreElemento !== nombre) return;

      elemento.closest(".dia")?.classList.add("prueba");
    });
}

function limpiarFiltros() {
  //quitar filtroActivo
  const horarioVista = document.getElementById("horarioVista");

  horarioVista.classList.remove("filtroActivo");

  // Apagar todos los iconos
  document.querySelectorAll(".cajaFiltro.filtro-activo").forEach((filtro) => {
    filtro.classList.remove("filtro-activo");
  });

  // Quitar resaltado de todos los días
  document.querySelectorAll(".dia.prueba").forEach((dia) => {
    dia.classList.remove("prueba");
  });
}

function limpiarIndicadorActivoBordes() {
  document.querySelectorAll(".activo").forEach((caja) => {
    caja.remove();
    bordeSeleccionado = null;
  });
}

function refrescarFiltroActivo() {
  const filtroActivo = document.querySelector(".cajaFiltro.filtro-activo");

  if (!filtroActivo) return;

  const caja = filtroActivo.closest(".cajaColaboradora");
  const nombre = caja.querySelector(".cajaContenido").dataset.nombre;

  aplicarFiltro(nombre);
}

function mostrarAlertaColaboradoraRepetida() {
  Swal.fire({
    toast: true,
    position: "bottom",
    icon: "error",
    title: "Esa colaboradora ya está en ese turno",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,

    customClass: {
      popup: "alerta-error",
    },
  });
}

function colocarTituloHorario(indexMes, anioSeleccionado) {
  const mes = document.getElementById("mes")[indexMes].textContent;

  document.querySelector(".nombreHorario").textContent =
    `${mes} ${anioSeleccionado}`;
}

function activarColoresSeccion() {
  const coloresSeccion = document.getElementById("coloresSeccion");

  const estabaDeshabilidato =
    coloresSeccion.classList.contains("divDeshabilitado");

  if (estabaDeshabilidato) {
    coloresSeccion.classList.remove("divDeshabilitado");
    reiniciarColoresYBordes();
    limpiarIndicadorActivoBordes();
  } else {
    coloresSeccion.classList.add("divDeshabilitado");
    reiniciarColoresYBordes();
  }
}

/* =========================================================
   Cálculos puros
   ========================================================= */
function determinarPrimerDia(mes, anio) {
  const fecha = new Date(anio, mes - 1, 1);

  return fecha.getDay();
}

function determinarCantidadDiasMes(mes, anio) {
  return new Date(anio, mes, 0).getDate();
}

/* =========================================================
   Datos / API
   ========================================================= */
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
      listaColaboradorasCache = [];
      return;
    }

    listaColaboradorasCache = datos.data;

    const fragmento = document.createDocumentFragment();

    datos.data.forEach((colaboradora) => {
      fragmento.appendChild(crearColaboradora(colaboradora));
    });

    listaColaboradoras.replaceChildren(fragmento);
  } catch (error) {
    console.error("Error al cargar las colaboradoras:", error);
  }
}

/* =========================================================
   Arranque
   ========================================================= */
init();
