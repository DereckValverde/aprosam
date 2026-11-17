function init() {
  registrarEventos();
  mostrarColaboradoras();
}

function registrarEventos() {
  const contenedorListaColaboradoras = document.querySelector(
    ".lista-colaboradoras",
  );

  if (contenedorListaColaboradoras) {
    contenedorListaColaboradoras.addEventListener(
      "click",
      manejarClicListaColaboradora,
    );
  }
}

/****************************
 * Handlers
 ****************************/
function manejarClicListaColaboradora(event) {
  const boton = event.target.closest(".btn-editar, .btn-eliminar");

  if (!boton) return;

  const elemento = boton.closest(".colaboradora");

  if (!elemento) return;

  const id = elemento.dataset.id;

  if (boton.classList.contains("btn-editar")) {
    abrirModalEditar(id);
  }

  if (boton.classList.contains("btn-eliminar")) {
    console.log(`Eliminar: ${id}`);
  }
}

/****************************
 * Acciones
 ****************************/
function abrirModalEditar(idColaboradora) {
  console.log(`El id pasado es: ${idColaboradora}`);
}

async function cargarListaColaboradoras() {
  //Consultar API
  try {
    const response = await fetch(BASE_URL + "colaboradoras");

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const colaboradoras = await response.json();

    if (colaboradoras.success) {
      //retorna el array de colaboradoras
      return colaboradoras.data;
    }
  } catch (e) {
    console.error("Error al cargar las colaboradoras: ", e);
  }
}

/****************************
 * Render
 ****************************/
async function mostrarColaboradoras() {
  const listaColaboradoras = document.querySelector(".lista-colaboradoras");
  const colaboradoras = await cargarListaColaboradoras();

  colaboradoras.forEach((colaboradora) => {
    const divColaboradora = document.createElement("div");

    divColaboradora.className = "colaboradora";
    divColaboradora.dataset.id = colaboradora.idColaboradora;

    divColaboradora.innerHTML = `
    <div class="colaboradora-info">
        <div class="avatar-colaboradora">
            ${colaboradora.nombre?.charAt(0).toUpperCase() ?? ""}
        </div>

        <div class="datos-colaboradora">
            <span class="nombre-colaboradora">
                ${colaboradora.nombre}
            </span>

            <span class="apellido-colaboradora">
                ${colaboradora.apellido1 ?? ""}
            </span>
        </div>
    </div>

    <div class="acciones-colaboradora">
        <button class="btn-editar" title="Editar colaboradora">
            <i class="bi bi-pencil"></i>
        </button>

        <button class="btn-eliminar" title="Eliminar colaboradora">
            <i class="bi bi-trash3"></i>
        </button>
    </div>
    `;

    listaColaboradoras.appendChild(divColaboradora);
  });
}
init();
