function init() {
  registrarEventos();
  cargarListaColaboradoras();
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
  const btnEditar = event.target.closest(".btn-editar");

  if (!btnEditar) return;

  const idColaboradora = btnEditar.dataset.id;

  //funcion para abrir modal
  //abrirModalEditar(idColaboradora);
}

/****************************
 * Acciones
 ****************************/
// funtion abrirModalEditar(idColaboradora){}

async function cargarListaColaboradoras() {}
init();
