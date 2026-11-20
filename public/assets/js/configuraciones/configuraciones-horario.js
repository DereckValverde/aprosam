/***********************
 * Variables Globales
 ************************/
let arrayListaColaboradoras = [];
let idColaboradoraEditar = null;
let resolverConfirmacionEliminar = null;

function init() {
  registrarEventos();
  registrarEventosModal();
  registrarEventosModalCrearColaboradora();
  registrarEventosModalEliminarColaboradora();
  mostrarColaboradoras();
}

function registrarEventos() {
  //Identificar si se hizo clic en btn añadir colaboradora
  const btnAnadirColaboradora = document.querySelector(
    ".btn-anadir-nueva-colaboradora",
  );

  if (btnAnadirColaboradora) {
    btnAnadirColaboradora.addEventListener(
      "click",
      abrirModalCrearColaboradora,
    );
  }
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
  const modal = document.querySelector(".modal-overlay-edit");
  const formularioEditar = document.getElementById(
    "formActualizarColaboradora",
  );

  if (modal) {
    modal.addEventListener("click", manejarClicModal);
  }

  if (formularioEditar) {
    formularioEditar.addEventListener("submit", manejarSubmitModal);
  }
}

function registrarEventosModalCrearColaboradora() {
  const modal = document.querySelector(".modal-overlay-create");
  const formularioCrear = document.getElementById("formCrearColaboradora");

  if (modal) {
    modal.addEventListener("click", manejarClicModalCrearColaboradora);
  }

  if (formularioCrear) {
    formularioCrear.addEventListener("submit", manejarSubmitModalCrear);
  }
}

function registrarEventosModalEliminarColaboradora() {
  const modal = document.querySelector(".modal-overlay-eliminar");

  if (modal) {
    modal.addEventListener("click", manejarClicModalEliminarColaboradora);
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
    eliminarColaboladora(id);
  }
}

function manejarClicModalCrearColaboradora(event) {
  const btnCerrar = event.target.closest(".closeModal, .btn-cancelar");

  if (!btnCerrar) return;

  cerrarModal("modal-overlay-create");
}

function manejarClicModal(event) {
  const btnCerrar = event.target.closest(".closeModal, .btn-cancelar");

  if (!btnCerrar) return;

  cerrarModal("modal-overlay-edit");
}

function manejarClicModalEliminarColaboradora(event) {
  const btnCerrar = event.target.closest(".closeModal, .btn-cancelar");
  const btnConfirmar = event.target.closest(".btn-confirmar-eliminar");

  if (!btnCerrar && !btnConfirmar) return;

  const modal = document.querySelector(".modal-overlay-eliminar");
  modal.style.display = "none";

  if (resolverConfirmacionEliminar) {
    resolverConfirmacionEliminar(!!btnConfirmar);
    resolverConfirmacionEliminar = null;
  }
}

async function manejarSubmitModal(event) {
  event.preventDefault();

  const formulario = event.target;
  const datosFormulario = new FormData(formulario);

  const nombre = datosFormulario.get("nombre").trim();
  const apellido1 = datosFormulario.get("apellido").trim();

  await actualizarDatosColaboradora(idColaboradoraEditar, nombre, apellido1);
}

async function manejarSubmitModalCrear(event) {
  event.preventDefault();

  const formulario = event.target;
  const datosFormulario = new FormData(formulario);

  const nombre = datosFormulario.get("nombre").trim();
  const apellido1 = datosFormulario.get("apellido").trim();

  await crearColaboradora(nombre, apellido1);
}

/****************************
 * Acciones
 ****************************/
function abrirModalCrearColaboradora() {
  const abrirModalCrearColaboradora = document.querySelector(
    ".modal-overlay-create",
  );

  if (abrirModalCrearColaboradora) {
    abrirModalCrearColaboradora.style.display = "flex";
  }
}

function abrirModalEditar(idColaboradora) {
  //Buscar colaboradora por ID
  const colaboradora = arrayListaColaboradoras.find(
    (c) => c.idColaboradora == idColaboradora,
  );

  if (!colaboradora) return;

  //guardar ID de la colaboradora que se está editando
  idColaboradoraEditar = idColaboradora;

  const modal = document.querySelector(".modal-overlay-edit");
  const areaNombre = document.getElementById("nombre");
  const areaApellido = document.getElementById("apellido");

  //colocar datos en los inputs
  areaNombre.value = colaboradora.nombre ?? "";
  areaApellido.value = colaboradora.apellido1 ?? "";

  //mostrar modal
  modal.style.display = "flex";
}

function cerrarModal(nombreModal) {
  const modal = document.querySelector(`.${nombreModal}`);

  //cierra modal
  modal.style.display = "none";

  //limpia inputs
  modal.querySelector("form").reset();

  idColaboradoraEditar = null;
}

async function eliminarColaboladora(idColaboradora) {
  const colaboradora = arrayListaColaboradoras.find(
    (c) => c.idColaboradora == idColaboradora,
  );

  const nombre = colaboradora?.nombre ?? "la colaboradora";

  // Esperar la confirmación del usuario
  const confirmado = await confirmarEliminado(nombre);

  if (!confirmado) {
    return;
  }

  try {
    const response = await fetch(
      BASE_URL + `colaboradoras/eliminar/${idColaboradora}`,
      {
        method: "POST",
      },
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const resultado = await response.json();

    if (!resultado.success) {
      throw new Error(resultado.message);
    }

    await mostrarColaboradoras();

    // Mostrar mensaje de colaboradora eliminada
    alertaColaboradoraEliminada(nombre);
  } catch (error) {
    console.error("Error al eliminar la colaboradora:", error);

    alertaErrorEliminarColaboradora(nombre);
  }
}

function confirmarEliminado(nombreColaboradora) {
  const modal = document.querySelector(".modal-overlay-eliminar");
  const mensaje = document.getElementById("mensajeEliminarColaboradora");

  mensaje.textContent = `¿Quiere eliminar a ${nombreColaboradora}? Esta acción no se puede revertir.`;
  modal.style.display = "flex";

  return new Promise((resolver) => {
    resolverConfirmacionEliminar = resolver;
  });
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
    cerrarModal("modal-overlay-edit");

    //Cambiar este console.log por un alert con SweetAlert2
    alertaColaboradoraActualizada(nombre);
  } catch (error) {
    console.error("Error al actualizar colaboradora:", error);

    //cambiar por sweetAlert
    alertaErrorActualizarColaboradora(nombre);
  }
}

async function crearColaboradora(nombre, apellido1) {
  const datos = {
    nombre: nombre,
    apellido1: apellido1,
  };

  try {
    const response = await fetch(BASE_URL + "colaboradora/crear", {
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

    //actualizar lista colaboradoras
    await mostrarColaboradoras();

    //cerrar modal de crear
    cerrarModal("modal-overlay-create");

    //mostrar alerta de colaboradora creada
    console.log("Colaboradora Creada");
    //mostrarAlerta();
  } catch (error) {
    console.error("Error al crear colaboradora:", error);

    //Mostrar alerta de fallo
    console.log("Error al crear colaboradora");
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
            <i class="bi bi-pencil lapiz-editar-colaboradora"></i>
        </button>

        <button class="btn-eliminar" title="Eliminar colaboradora">
            <i class="bi bi-trash3 basurero-eliminar-colaboradora"></i>
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

function alertaColaboradoraEliminada(nombreColaboradora) {
  Swal.fire({
    toast: true,
    position: "bottom-right",
    icon: "success",
    title: `Se eliminó a ${nombreColaboradora}`,
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
  });
}

function alertaErrorEliminarColaboradora(nombreColaboradora) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: `No se pudo eliminar a ${nombreColaboradora}`,
  });
}

function alertaColaboradoraActualizada(nombreColaboradora) {
  Swal.fire({
    toast: true,
    position: "bottom-right",
    icon: "success",
    title: `Se actualizó a ${nombreColaboradora} correctamente`,
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
  });
}

function alertaErrorActualizarColaboradora(nombreColaboradora) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: `No se pudo actualizar a ${nombreColaboradora}`,
  });
}

init();
