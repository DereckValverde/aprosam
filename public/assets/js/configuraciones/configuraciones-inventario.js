/***********************
 * Variables Globales
 ************************/
let arrayListaCategorias = [];
let idCategoriaEditar = null;
let resolverConfirmacionEliminar = null;

function formatearNombreCategoria(nombre) {
  const texto = String(nombre ?? "").trim();

  if (!texto) {
    return "";
  }

  let separado = texto.replace(/[_-]+/g, " ");
  let anterior;

  do {
    anterior = separado;

    separado = separado.replace(
      /([a-z0-9áéíóúñü]{2}|[A-ZÁÉÍÓÚÑÜ][a-záéíóúñü]|[A-ZÁÉÍÓÚÑÜ]{2})([A-ZÁÉÍÓÚÑÜ][a-záéíóúñü])/g,
      "$1 $2",
    );
  } while (separado !== anterior);

  separado = separado.toLowerCase().replace(/\s+/g, " ").trim();

  return separado.charAt(0).toUpperCase() + separado.slice(1);
}

function init() {
  registrarEventos();
  registrarEventosModal();
  registrarEventosModalCrearCategoria();
  registrarEventosModalEliminarCategoria();
  registrarValidacionCamposRequired();
  mostrarCategorias();
}

function registrarEventos() {
  //Identificar si se hizo clic en btn añadir categoría
  const btnAnadirCategoria = document.querySelector(
    ".btn-anadir-nueva-categoria",
  );

  if (btnAnadirCategoria) {
    btnAnadirCategoria.addEventListener("click", abrirModalCrearCategoria);
  }
  //Identificar si se hizo clic en btn de editar o eliminar
  const contenedorListaCategorias = document.querySelector(
    ".lista-categorias",
  );

  if (contenedorListaCategorias) {
    contenedorListaCategorias.addEventListener(
      "click",
      manejarClicListaCategoria,
    );
  }
}

function registrarEventosModal() {
  const modal = document.querySelector(".modal-overlay-edit");
  const formularioEditar = document.getElementById("formActualizarCategoria");

  if (modal) {
    modal.addEventListener("click", manejarClicModal);
  }

  if (formularioEditar) {
    formularioEditar.addEventListener("submit", manejarSubmitModal);
  }
}

function registrarEventosModalCrearCategoria() {
  const modal = document.querySelector(".modal-overlay-create");
  const formularioCrear = document.getElementById("formCrearCategoria");

  if (modal) {
    modal.addEventListener("click", manejarClicModalCrearCategoria);
  }

  if (formularioCrear) {
    formularioCrear.addEventListener("submit", manejarSubmitModalCrear);
  }
}

function registrarEventosModalEliminarCategoria() {
  const modal = document.querySelector(".modal-overlay-eliminar");

  if (modal) {
    modal.addEventListener("click", manejarClicModalEliminarCategoria);
  }
}

function registrarValidacionCamposRequired() {
  const campos = document.querySelectorAll(
    ".modal-overlay-edit input[required], .modal-overlay-create input[required]",
  );

  campos.forEach((campo) => {
    campo.addEventListener("invalid", () => {
      campo.setCustomValidity("Este campo es obligatorio.");
    });

    campo.addEventListener("input", () => {
      campo.setCustomValidity(
        campo.value.trim() === "" ? "Este campo es obligatorio." : "",
      );
    });
  });

  const formularios = document.querySelectorAll(
    "#formActualizarCategoria, #formCrearCategoria",
  );

  formularios.forEach((formulario) => {
    formulario.addEventListener("reset", () => {
      formulario.querySelectorAll("input").forEach((campo) => {
        campo.setCustomValidity("");
      });
    });
  });
}

/****************************
 * Handlers
 ****************************/
function manejarClicListaCategoria(event) {
  const boton = event.target.closest(".btn-editar, .btn-eliminar");

  if (!boton) return;

  const elemento = boton.closest(".categoria");

  if (!elemento) return;

  const id = elemento.dataset.id;

  if (boton.classList.contains("btn-editar")) {
    abrirModalEditar(id);
  } else if (boton.classList.contains("btn-eliminar")) {
    eliminarCategoria(id);
  }
}

function manejarClicModalCrearCategoria(event) {
  const btnCerrar = event.target.closest(".closeModal, .btn-cancelar");

  if (!btnCerrar) return;

  cerrarModal("modal-overlay-create");
}

function manejarClicModal(event) {
  const btnCerrar = event.target.closest(".closeModal, .btn-cancelar");

  if (!btnCerrar) return;

  cerrarModal("modal-overlay-edit");
}

function manejarClicModalEliminarCategoria(event) {
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

  const nombre = formatearNombreCategoria(datosFormulario.get("nombre"));

  await actualizarDatosCategoria(idCategoriaEditar, nombre);
}

async function manejarSubmitModalCrear(event) {
  event.preventDefault();

  const formulario = event.target;
  const datosFormulario = new FormData(formulario);

  const nombre = formatearNombreCategoria(datosFormulario.get("nombre"));

  await crearCategoria(nombre);
}

/****************************
 * Acciones
 ****************************/
function abrirModalCrearCategoria() {
  const abrirModalCrearCategoria = document.querySelector(
    ".modal-overlay-create",
  );

  if (abrirModalCrearCategoria) {
    abrirModalCrearCategoria.style.display = "flex";
  }
}

function abrirModalEditar(idCategoria) {
  //Buscar categoría por ID
  const categoria = arrayListaCategorias.find(
    (c) => c.idCategoria == idCategoria,
  );

  if (!categoria) return;

  //guardar ID de la categoría que se está editando
  idCategoriaEditar = idCategoria;

  const modal = document.querySelector(".modal-overlay-edit");
  const areaNombre = document.getElementById("nombre");

  //colocar datos en los inputs
  areaNombre.value = formatearNombreCategoria(categoria.nombre_categoria ?? "");

  //mostrar modal
  modal.style.display = "flex";
}

function cerrarModal(nombreModal) {
  const modal = document.querySelector(`.${nombreModal}`);

  //cierra modal
  modal.style.display = "none";

  //limpia inputs
  modal.querySelector("form").reset();

  idCategoriaEditar = null;
}

async function eliminarCategoria(idCategoria) {
  const categoria = arrayListaCategorias.find(
    (c) => c.idCategoria == idCategoria,
  );

  const nombre = formatearNombreCategoria(
    categoria?.nombre_categoria ?? "la categoría",
  );

  // Esperar la confirmación del usuario
  const confirmado = await confirmarEliminado(nombre);

  if (!confirmado) {
    return;
  }

  try {
    const response = await fetch(
      BASE_URL + `categorias/eliminar/${idCategoria}`,
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

    await mostrarCategorias();

    alertaCategoriaEliminada(nombre);
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);

    alertaErrorEliminarCategoria(nombre);
  }
}

function confirmarEliminado(nombreCategoria) {
  const modal = document.querySelector(".modal-overlay-eliminar");
  const mensaje = document.getElementById("mensajeEliminarCategoria");

  mensaje.textContent = `¿Quiere eliminar la categoría "${formatearNombreCategoria(nombreCategoria)}"? Esta acción no se puede revertir.`;
  modal.style.display = "flex";

  return new Promise((resolver) => {
    resolverConfirmacionEliminar = resolver;
  });
}

async function cargarListaCategorias() {
  //Consultar API
  const response = await fetch(BASE_URL + "categorias");

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const resultado = await response.json();

  if (!resultado.success) {
    throw new Error("No se pudieron obtener las categorías");
  }
  return resultado.data;
}

async function actualizarDatosCategoria(id, nombre) {
  const datos = {
    nombre: nombre,
  };

  try {
    const response = await fetch(
      BASE_URL + `categorias/actualizar/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      },
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const resultado = await response.json();

    if (!resultado.success) {
      throw new Error(resultado.message);
    }

    //Actualizar la lista de categorías
    await mostrarCategorias();

    //cerrar Modal
    cerrarModal("modal-overlay-edit");

    alertaCategoriaActualizada(nombre);
  } catch (error) {
    console.error("Error al actualizar categoría:", error);

    alertaErrorActualizarCategoria(nombre);
  }
}

async function crearCategoria(nombre) {
  const datos = {
    nombre: nombre,
  };

  try {
    const response = await fetch(BASE_URL + "categoria/crear", {
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

    //actualizar lista categorías
    await mostrarCategorias();

    //cerrar modal de crear
    cerrarModal("modal-overlay-create");

    alertaCategoriaCreada(nombre);
  } catch (error) {
    console.error("Error al crear categoría:", error);

    alertaErrorCrearCategoria(nombre);
  }
}

/****************************
 * Render
 ****************************/
async function mostrarCategorias() {
  const listaCategorias = document.querySelector(".lista-categorias");

  try {
    //array de categorías
    arrayListaCategorias = (await cargarListaCategorias()).map((categoria) => ({
      ...categoria,
      nombre_categoria: formatearNombreCategoria(categoria.nombre_categoria),
    }));

    listaCategorias.innerHTML = "";

    arrayListaCategorias.forEach((categoria) => {
      const divCategoria = document.createElement("div");

      divCategoria.className = "categoria";
      divCategoria.dataset.id = categoria.idCategoria;

      divCategoria.innerHTML = `
    <div class="categoria-info">
        <div class="avatar-categoria">
            ${categoria.nombre_categoria?.charAt(0).toUpperCase() ?? ""}
        </div>

        <div class="datos-categoria">
            <span class="nombre-categoria">
                ${categoria.nombre_categoria}
            </span>
        </div>
    </div>

    <div class="acciones-categoria">
        <button class="btn-editar" title="Editar categoría">
            <i class="bi bi-pencil lapiz-editar-categoria"></i>
        </button>

        <button class="btn-eliminar" title="Eliminar categoría">
            <i class="bi bi-trash3 basurero-eliminar-categoria"></i>
        </button>
    </div>
    `;

      listaCategorias.appendChild(divCategoria);
    });

    //Actualizar contador del footer
    actualizarContadorCategorias(arrayListaCategorias.length);
  } catch (error) {
    console.error(`Error al mostrar las categorías: `, error);
  }
}

function actualizarContadorCategorias(cantidad) {
  const footer = document.querySelector(".footer-total-categorias");

  if (!footer) return;

  cantidad = cantidad ?? 0;

  const texto =
    cantidad === 1 ? "categoría registrada" : "categorías registradas";

  footer.textContent = `${cantidad} ${texto}`;
}

/****************************
 * Alertas
 ****************************/
function alertaCategoriaEliminada(nombreCategoria) {
  Swal.fire({
    toast: true,
    position: "bottom-right",
    icon: "success",
    title: `Se eliminó la categoría "${nombreCategoria}".`,
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
  });
}

function alertaErrorEliminarCategoria(nombreCategoria) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: `No se pudo eliminar la categoría "${nombreCategoria}".`,
  });
}

function alertaCategoriaActualizada(nombreCategoria) {
  Swal.fire({
    toast: true,
    position: "bottom-right",
    icon: "success",
    title: `Se actualizó la categoría "${nombreCategoria}" correctamente.`,
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
  });
}

function alertaErrorActualizarCategoria(nombreCategoria) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: `No se pudo actualizar la categoría "${nombreCategoria}".`,
  });
}

function alertaCategoriaCreada(nombreCategoria) {
  Swal.fire({
    toast: true,
    position: "bottom-right",
    icon: "success",
    title: `Se creó correctamente la categoría "${nombreCategoria}".`,
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
  });
}

function alertaErrorCrearCategoria(nombreCategoria) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: `Hubo un error al añadir la categoría "${nombreCategoria}".`,
  });
}

init();
