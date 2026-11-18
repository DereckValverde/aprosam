/***********************
 * Variables Globales
 ************************/
let arrayListaColaboradoras = [];
let idColaboradoraEditar = null;

function init() {
  registrarEventos();
  registrarEventosModal();
  mostrarColaboradoras();
}

function registrarEventos() {
  //Identificar si se hizo clic en btn de editar o eliminar
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

function registrarEventosModal() {
  const modal = document.querySelector(".modal-overlay");
  const formulario = document.getElementById("formActualizarColaboradora");

  if (modal) {
    modal.addEventListener("click", manejarClicModal);
  }

  if (formulario) {
    formulario.addEventListener("submit", manejarSubmitModal);
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
  } else if (boton.classList.contains("btn-eliminar")) {
    console.log(`Eliminar: ${id}`);
  }
}

function manejarClicModal(event) {
  const btnCerrar = event.target.closest(".closeModal, .btn-cancelar");

  if (!btnCerrar) return;

  cerrarModal();
}

async function manejarSubmitModal(event) {
  event.preventDefault();

  const formulario = event.target;
  const datosFormulario = new FormData(formulario);

  const nombre = datosFormulario.get("nombre").trim();
  const apellido1 = datosFormulario.get("apellido").trim();

  await actualizarDatosColaboradora(idColaboradoraEditar, nombre, apellido1);
}

/****************************
 * Acciones
 ****************************/
function abrirModalEditar(idColaboradora) {
  //Buscar colaboradora por ID
  const colaboradora = arrayListaColaboradoras.find(
    (c) => c.idColaboradora == idColaboradora,
  );

  if (!colaboradora) return;

  //guardar ID de la colaboradora que se está editando
  idColaboradoraEditar = idColaboradora;

  const modal = document.querySelector(".modal-overlay");
  const areaNombre = document.getElementById("nombre");
  const areaApellido = document.getElementById("apellido");

  //colocar datos en los inputs
  areaNombre.value = colaboradora.nombre ?? "";
  areaApellido.value = colaboradora.apellido1 ?? "";

  //mostrar modal
  modal.style.display = "flex";
}

function cerrarModal() {
  const modal = document.querySelector(".modal-overlay");

  modal.style.display = "none";

  idColaboradoraEditar = null;
}

async function cargarListaColaboradoras() {
  //Consultar API
  const response = await fetch(BASE_URL + "colaboradoras");

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const resultado = await response.json();

  if (!resultado.success) {
    throw new Error("No se pudieron obtener las colaboradoras");
  }
  return resultado.data;
}

async function actualizarDatosColaboradora(id, nombre, apellido) {
  const datos = {
    nombre: nombre,
    apellido1: apellido,
  };

  try {
    const response = await fetch(BASE_URL + `colaboradoras/actualizar/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const resultado = await response.json();

    if (!resultado.success) {
      throw new Error(resultado.message);
    }

    //Actualizar la lista de colaboradoras
    await mostrarColaboradoras();

    //cerrar Modal
    cerrarModal();

    //Cambiar este console.log por un alert con SweetAlert2
    alertaColaboradoraActualizada(resultado.message);
  } catch (error) {
    console.error("Error al actualizar colaboradora:", error);

    //cambiar por sweetAlert
    alertaErrorActualizarColaboradora();
  }
}

/****************************
 * Render
 ****************************/
async function mostrarColaboradoras() {
  const listaColaboradoras = document.querySelector(".lista-colaboradoras");

  try {
    //array de colaboradoras
    arrayListaColaboradoras = await cargarListaColaboradoras();

    listaColaboradoras.innerHTML = "";

    arrayListaColaboradoras.forEach((colaboradora) => {
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
                ${colaboradora.apellido2 ?? ""}
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

    //Actualizar contador del footer
    actualizarContadorColaboradoras(arrayListaColaboradoras.length);
  } catch (error) {
    console.error(`Error al mostrar las colaboradoras: `, error);
  }
}

function actualizarContadorColaboradoras(cantidad) {
  const footer = document.querySelector(".footer-total-colaboradoras");

  if (!footer) return;

  cantidad = cantidad ?? 0;

  const texto =
    cantidad === 1 ? "colaboradora registrada" : "colaboradoras registradas";

  footer.textContent = `${cantidad} ${texto}`;
}

function alertaColaboradoraActualizada(mensaje) {
  Swal.fire({
    toast: true,
    position: "bottom-right",
    icon: "success",
    title: mensaje,
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
  });
}

function alertaErrorActualizarColaboradora() {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: "Algo falló al actualizar la colaboradora",
  });
}

init();
