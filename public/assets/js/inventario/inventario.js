/* =========================================================
   Configuración
   ========================================================= */
const CATEGORIAS_OCULTAS = ["carnes", "verduras", "jabones"];
const ORDEN_PROVEEDORES = ["supercoop", "pava"];
const ORDEN_CATEGORIAS_DIARIO = [
  "abarrotes",
  "articuloslimpieza",
  "articulospersonales",
];

const COLORES_CATEGORIAS = {
  abarrotes: { fondo: "#fcf4d8", texto: "#8e571f" },
  articuloslimpieza: { fondo: "#ddf9f3", texto: "#286e67" },
  articulospersonales: { fondo: "#f1edfc", texto: "#633eaa" },
  carnes: { fondo: "#fde9eb", texto: "#9d374f" },
  jabones: { fondo: "#e5faeb", texto: "#39754a" },
  verduras: { fondo: "#f0fada", texto: "#56742d" },
};

/* =========================================================
   Estado
   ========================================================= */
let listaProductos = [];
let listaCategorias = [];
let listaDistribuidoras = [];
let idProductoEditar = null;
let resolverConfirmacionEliminar = null;
let categoriaFiltroActiva = "";
let ordenCampo = "nombre_producto";
let ordenDireccion = "asc";
const stockEditableEnGuardado = new Set();

/* =========================================================
   Referencias al DOM
   ========================================================= */
const cuerpoTablaProductos = document.getElementById("cuerpoTablaProductos");
const modalDiario = document.querySelector(".modal-overlay-diario");
const listaDiario = document.getElementById("listaDiario");

/* =========================================================
   Utilidades
   ========================================================= */
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

  return separado
    .split(" ")
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
}

function normalizarTexto(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function claveCategoria(nombre) {
  return normalizarTexto(nombre).replace(/\s/g, "");
}

function esCategoriaVisible(categoria) {
  return !CATEGORIAS_OCULTAS.includes(
    claveCategoria(categoria.nombre_categoria),
  );
}

function ordenarProveedores(proveedores) {
  return [...proveedores].sort((primero, segundo) => {
    const nombrePrimero = normalizarTexto(primero.nombre_distribuidora);
    const nombreSegundo = normalizarTexto(segundo.nombre_distribuidora);
    const posicionPrimero = ORDEN_PROVEEDORES.indexOf(nombrePrimero);
    const posicionSegundo = ORDEN_PROVEEDORES.indexOf(nombreSegundo);

    if (posicionPrimero !== -1 || posicionSegundo !== -1) {
      if (posicionPrimero === -1) return 1;
      if (posicionSegundo === -1) return -1;

      return posicionPrimero - posicionSegundo;
    }

    return nombrePrimero.localeCompare(nombreSegundo, "es");
  });
}

function prioridadCategoriaDiario(nombre) {
  const clave = claveCategoria(nombre);
  const indice = ORDEN_CATEGORIAS_DIARIO.indexOf(clave);

  return indice === -1 ? ORDEN_CATEGORIAS_DIARIO.length : indice;
}

function colorCategoria(nombre) {
  const clave = claveCategoria(nombre);

  if (COLORES_CATEGORIAS[clave]) {
    return COLORES_CATEGORIAS[clave];
  }

  let hash = 0;

  for (const caracter of clave) {
    hash = (hash * 31 + caracter.charCodeAt(0)) % 100000;
  }

  const colores = Object.values(COLORES_CATEGORIAS);

  return colores[hash % colores.length];
}

function escaparHTML(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, (caracter) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[caracter]);
}

function normalizarProducto(producto) {
  return {
    ...producto,
    nombre_categoria: formatearNombreCategoria(producto.nombre_categoria),
    nombre_distribuidora: String(producto.nombre_distribuidora ?? ""),
  };
}

/* =========================================================
   Punto de entrada
   ========================================================= */
async function init() {
  registrarEventos();
  registrarEventosModales();
  registrarValidacionCamposRequired();
  actualizarIndicadoresOrden();
  await cargarDatosIniciales();
}

/* =========================================================
   Registro de eventos
   ========================================================= */
function registrarEventos() {
  const btnAgregarProducto = document.querySelector(".btn-agregar-producto");

  if (btnAgregarProducto) {
    btnAgregarProducto.addEventListener("click", abrirModalCrearProducto);
  }

  const btnGenerarDiario = document.querySelector(".btn-generar-diario");

  if (btnGenerarDiario) {
    btnGenerarDiario.addEventListener("click", abrirModalDiario);
  }

  const cuerpoTabla = cuerpoTablaProductos;

  if (cuerpoTabla) {
    cuerpoTabla.addEventListener("click", manejarClicTablaProductos);
    cuerpoTabla.addEventListener("focusin", manejarFocusStockEditable);
    cuerpoTabla.addEventListener("keydown", manejarTecladoStockEditable);
    cuerpoTabla.addEventListener("change", manejarCambioStockEditable);
  }

  document.querySelectorAll(".btn-ordenar-tabla").forEach((boton) => {
    boton.addEventListener("click", manejarClicOrden);
  });

  const contenedorFiltros = document.querySelector(".filtros-categorias");

  if (contenedorFiltros) {
    contenedorFiltros.addEventListener("click", manejarClicFiltroCategoria);
  }

  const distribuidoraDiario = document.getElementById("distribuidoraDiario");

  if (distribuidoraDiario) {
    distribuidoraDiario.addEventListener("change", renderProductos);
  }

  const buscador = document.getElementById("buscarProducto");

  if (buscador) {
    buscador.addEventListener("input", () => {
      actualizarBotonLimpiarBusqueda();
      renderProductos();
    });
  }

  const btnLimpiar = document.querySelector(".btn-limpiar-busqueda");

  if (btnLimpiar && buscador) {
    btnLimpiar.addEventListener("click", () => {
      buscador.value = "";
      actualizarBotonLimpiarBusqueda();
      buscador.focus();
      renderProductos();
    });
  }
}

function registrarEventosModales() {
  const modales = [
    {
      clase: "modal-overlay-producto-crear",
      formulario: "formCrearProducto",
      submit: manejarSubmitCrearProducto,
    },
    {
      clase: "modal-overlay-producto-editar",
      formulario: "formActualizarProducto",
      submit: manejarSubmitActualizarProducto,
    },
  ];

  modales.forEach(({ clase, formulario, submit }) => {
    const modal = document.querySelector(`.${clase}`);
    const form = document.getElementById(formulario);

    if (modal) {
      modal.addEventListener("click", (event) => {
        if (event.target.closest(".closeModal, .btn-cancelar-producto")) {
          cerrarModal(clase);
        }
      });
    }

    if (form) {
      form.addEventListener("submit", submit);
    }
  });

  const modalEliminar = document.querySelector(
    ".modal-overlay-producto-eliminar",
  );

  if (modalEliminar) {
    modalEliminar.addEventListener("click", (event) => {
      const cancelar = event.target.closest(".btn-cancelar-producto");
      const confirmar = event.target.closest(
        ".btn-confirmar-eliminar-producto",
      );

      if (!cancelar && !confirmar && !event.target.closest(".closeModal")) {
        return;
      }

      modalEliminar.style.display = "none";

      if (resolverConfirmacionEliminar) {
        resolverConfirmacionEliminar(!!confirmar);
        resolverConfirmacionEliminar = null;
      }
    });
  }

  if (modalDiario) {
    modalDiario.addEventListener("click", (event) => {
      if (event.target.closest(".btn-imprimir-diario")) {
        window.print();
        return;
      }

      if (event.target.closest(".closeModal, .btn-cancelar-producto")) {
        cerrarModal("modal-overlay-diario");
      }
    });
  }
}

function registrarValidacionCamposRequired() {
  const campos = document.querySelectorAll(
    ".modal-overlay-producto-crear input[required], .modal-overlay-producto-crear select[required], .modal-overlay-producto-editar input[required], .modal-overlay-producto-editar select[required]",
  );

  campos.forEach((campo) => {
    const mensaje = () => {
      const valor = String(campo.value ?? "").trim();

      if (valor === "") {
        return "Este campo es obligatorio.";
      }

      if (
        campo.type === "number" &&
        (!Number.isInteger(Number(valor)) || Number(valor) < 0)
      ) {
        return "Ingrese un número entero mayor o igual a 0.";
      }

      return "";
    };

    campo.addEventListener("invalid", () => {
      campo.setCustomValidity(mensaje() || "Este campo es obligatorio.");
    });

    campo.addEventListener("input", () => {
      campo.setCustomValidity(mensaje());
    });

    campo.addEventListener("change", () => {
      campo.setCustomValidity(mensaje());
    });
  });

  document
    .querySelectorAll("#formCrearProducto, #formActualizarProducto")
    .forEach((formulario) => {
      formulario.addEventListener("reset", () => {
        formulario
          .querySelectorAll("input, select")
          .forEach((campo) => campo.setCustomValidity(""));
      });
    });
}

/* =========================================================
   Handlers
   ========================================================= */
function manejarClicTablaProductos(event) {
  const boton = event.target.closest(
    ".btn-editar-producto, .btn-eliminar-producto, .btn-ajustar-stock",
  );

  if (!boton) return;

  const fila = boton.closest("tr");

  if (!fila) return;

  const id = fila.dataset.id;

  if (boton.classList.contains("btn-editar-producto")) {
    abrirModalEditar(id);
  } else if (boton.classList.contains("btn-eliminar-producto")) {
    eliminarProducto(id);
  } else {
    ajustarStock(id, Number(boton.dataset.delta));
  }
}

function manejarFocusStockEditable(event) {
  const input = event.target.closest(".stock-editable");

  if (!input) return;

  input.dataset.valorOriginal = String(Number(input.value));
  input.select();
}

function manejarTecladoStockEditable(event) {
  const input = event.target.closest(".stock-editable");

  if (!input) return;

  if (event.key === "Enter") {
    event.preventDefault();
    guardarStockEditable(input);
    input.blur();
  } else if (event.key === "Escape") {
    event.preventDefault();
    input.value = input.dataset.valorOriginal ?? input.value;
    input.blur();
  }
}

function manejarCambioStockEditable(event) {
  const input = event.target.closest(".stock-editable");

  if (!input) return;

  guardarStockEditable(input);
}

async function guardarStockEditable(input) {
  const fila = input.closest("tr");

  if (!fila || stockEditableEnGuardado.has(input)) return;

  const idProducto = fila.dataset.id;
  const valorOriginal = Number(input.dataset.valorOriginal ?? input.value);
  const nuevoValor = Number(input.value);

  if (!Number.isInteger(nuevoValor) || nuevoValor < 0) {
    input.value = valorOriginal;
    alertaErrorStockEditable();
    return;
  }

  if (nuevoValor === valorOriginal) return;

  stockEditableEnGuardado.add(input);
  input.disabled = true;

  try {
    await ajustarStock(idProducto, nuevoValor - valorOriginal, input);
  } finally {
    stockEditableEnGuardado.delete(input);
    input.disabled = false;
  }
}

function manejarClicOrden(event) {
  const boton = event.target.closest(".btn-ordenar-tabla");

  if (!boton) return;

  const campo = boton.dataset.orden;

  if (ordenCampo === campo) {
    ordenDireccion = ordenDireccion === "asc" ? "desc" : "asc";
  } else {
    ordenCampo = campo;
    ordenDireccion = "asc";
  }

  actualizarIndicadoresOrden();
  renderProductos();
}

function actualizarIndicadoresOrden() {
  document.querySelectorAll(".btn-ordenar-tabla").forEach((boton) => {
    const icono = boton.querySelector(".icono-orden");

    if (!icono) return;

    icono.textContent =
      boton.dataset.orden === ordenCampo
        ? ordenDireccion === "asc"
          ? "↑"
          : "↓"
        : "";
  });
}

function manejarClicFiltroCategoria(event) {
  const boton = event.target.closest(".filtro-categoria");

  if (!boton) return;

  categoriaFiltroActiva = boton.dataset.categoria ?? "";

  document.querySelectorAll(".filtro-categoria").forEach((filtro) => {
    filtro.classList.toggle("boton-filtro-activo", filtro === boton);
  });

  renderProductos();
}

async function manejarSubmitCrearProducto(event) {
  event.preventDefault();

  await crearProducto(leerDatosFormulario(event.target));
}

async function manejarSubmitActualizarProducto(event) {
  event.preventDefault();

  await actualizarProducto(leerDatosFormulario(event.target));
}

/* =========================================================
   Datos / API
   ========================================================= */
async function cargarDatosIniciales() {
  try {
    const [productos, categorias, distribuidoras] = await Promise.all([
      cargarLista("productos", "No se pudieron obtener los productos."),
      cargarLista("categorias", "No se pudieron obtener las categorías."),
      cargarLista(
        "distribuidoras",
        "No se pudieron obtener las distribuidoras.",
      ),
    ]);

    listaProductos = productos.map(normalizarProducto);
    listaCategorias = categorias.map((categoria) => ({
      ...categoria,
      nombreMostrado: formatearNombreCategoria(categoria.nombre_categoria),
    }));
    listaDistribuidoras = ordenarProveedores(distribuidoras);

    renderFiltrosCategorias();
    llenarSelects();
    renderProductos();
  } catch (error) {
    console.error("Error al cargar el inventario:", error);
    alertaErrorCargarInventario();
  }
}

async function cargarLista(ruta, mensajeError) {
  const response = await fetch(BASE_URL + ruta);

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const resultado = await response.json();

  if (!resultado.success) {
    throw new Error(resultado.message ?? mensajeError);
  }

  return resultado.data;
}

async function recargarProductos() {
  const productos = await cargarLista(
    "productos",
    "No se pudieron obtener los productos.",
  );

  listaProductos = productos.map(normalizarProducto);
  renderProductos();
}

/* =========================================================
   Render
   ========================================================= */
function renderFiltrosCategorias() {
  const contenedor = document.querySelector(".filtros-categorias");

  if (!contenedor) return;

  const categoriasVisibles = listaCategorias.filter(esCategoriaVisible);

  const filtros = [
    { id: "", nombre: "Todos" },
    ...categoriasVisibles.map((categoria) => ({
      id: String(categoria.idCategoria),
      nombre: categoria.nombreMostrado,
    })),
  ];

  contenedor.innerHTML = filtros
    .map(
      (filtro) => `
        <button
            type="button"
            class="filtro-categoria ${filtro.id === categoriaFiltroActiva ? "boton-filtro-activo" : ""}"
            data-categoria="${escaparHTML(filtro.id)}">
            ${escaparHTML(filtro.nombre)}
        </button>
      `,
    )
    .join("");
}

function llenarSelects() {
  const selectsCategoria = [
    document.getElementById("categoriaCrearProducto"),
    document.getElementById("categoriaEditarProducto"),
  ];

  selectsCategoria.forEach((select) => {
    if (!select) return;

    select.innerHTML =
      '<option value="" selected disabled>Seleccione una categoría</option>' +
      listaCategorias
        .filter(esCategoriaVisible)
        .map(
          (categoria) =>
            `<option value="${escaparHTML(categoria.idCategoria)}">${escaparHTML(categoria.nombreMostrado)}</option>`,
        )
        .join("");
  });

  const selectsDistribuidora = [
    document.getElementById("distribuidoraCrearProducto"),
    document.getElementById("distribuidoraEditarProducto"),
  ];

  selectsDistribuidora.forEach((select) => {
    if (!select) return;

    select.innerHTML =
      '<option value="" selected disabled>Seleccione una distribuidora</option>' +
      listaDistribuidoras
        .map(
          (distribuidora) =>
            `<option value="${escaparHTML(distribuidora.idDistribuidora)}">${escaparHTML(distribuidora.nombre_distribuidora)}</option>`,
        )
        .join("");
  });

  const distribuidoraDiario = document.getElementById("distribuidoraDiario");

  if (distribuidoraDiario) {
    const seleccionActual = distribuidoraDiario.value;

    distribuidoraDiario.innerHTML =
      '<option value="" selected disabled style="font-weight: bold; background-color: #bbbbbb; color: #ffffff;">Proveedor</option>' +
      listaDistribuidoras
        .map(
          (distribuidora) =>
            `<option value="${escaparHTML(distribuidora.idDistribuidora)}">${escaparHTML(distribuidora.nombre_distribuidora)}</option>`,
        )
        .join("");

    if (seleccionActual) {
      distribuidoraDiario.value = seleccionActual;
    }
  }
}

function productosFiltrados() {
  const buscador = document.getElementById("buscarProducto");
  const distribuidoraDiario = document.getElementById("distribuidoraDiario");
  const idDistribuidora = distribuidoraDiario?.value ?? "";
  const texto = normalizarTexto(buscador?.value ?? "");
  const terminos = texto ? texto.split(" ") : [];

  const filtrados = listaProductos.filter((producto) => {
    const coincideDistribuidora =
      idDistribuidora === "" ||
      String(producto.idDistribuidora) === String(idDistribuidora);

    if (!coincideDistribuidora) {
      return false;
    }

    const coincideCategoria =
      categoriaFiltroActiva === "" ||
      String(producto.idCategoria) === categoriaFiltroActiva;

    if (!coincideCategoria) {
      return false;
    }

    if (terminos.length === 0) {
      return true;
    }

    const nombre = normalizarTexto(producto.nombre_producto);
    const nombreCompacto = nombre.replace(/\s/g, "");

    return terminos.every(
      (termino) => nombre.includes(termino) || nombreCompacto.includes(termino),
    );
  });

  return filtrados.sort((primero, segundo) => {
    const valorPrimero = String(primero[ordenCampo] ?? "");
    const valorSegundo = String(segundo[ordenCampo] ?? "");
    const comparacion = valorPrimero.localeCompare(valorSegundo, "es", {
      sensitivity: "base",
      numeric: true,
    });

    if (comparacion !== 0) {
      return ordenDireccion === "asc" ? comparacion : -comparacion;
    }

    return primero.nombre_producto.localeCompare(
      segundo.nombre_producto,
      "es",
      { sensitivity: "base", numeric: true },
    );
  });
}

function renderProductos() {
  const cuerpoTabla = cuerpoTablaProductos;

  if (!cuerpoTabla) return;

  const distribuidoraDiario = document.getElementById("distribuidoraDiario");
  const sinDistribuidora = !distribuidoraDiario?.value;
  const contenedorTabla = cuerpoTabla.closest(".contenedor-tabla-productos");

  contenedorTabla?.classList.toggle("sin-distribuidora", sinDistribuidora);

  if (sinDistribuidora) {
    cuerpoTabla.innerHTML = "";
    actualizarContadorProductos(0);
    actualizarBotonLimpiarBusqueda();
    return;
  }

  const productos = productosFiltrados();

  actualizarContadorProductos(productos.length);
  actualizarBotonLimpiarBusqueda();

  if (productos.length === 0) {
    cuerpoTabla.innerHTML =
      '<tr class="fila-vacia"><td colspan="6">No hay productos para mostrar.</td></tr>';

    return;
  }

  cuerpoTabla.innerHTML = productos
    .map((producto) => {
      const color = colorCategoria(producto.nombre_categoria);
      const stock = Number(producto.stock_actual);

      return `
        <tr data-id="${escaparHTML(producto.idProducto)}">
            <td><span class="nombre-producto">${escaparHTML(producto.nombre_producto)}</span></td>
            <td class="centrado">
                <span class="etiqueta-categoria" style="color: ${color.texto};">
                    ${escaparHTML(producto.nombre_categoria)}
                </span>
            </td>
            <td class="centrado">${escaparHTML(producto.nombre_distribuidora)}</td>
            <td class="centrado">
                <div class="control-stock">
                    <button type="button" class="btn-ajustar-stock" data-delta="-1" title="Restar 1" ${stock <= 0 ? "disabled" : ""}>−</button>
                    <input
                        type="number"
                        class="stock-editable"
                        inputmode="numeric"
                        min="0"
                        step="1"
                        value="${stock}"
                        data-valor-original="${stock}"
                        aria-label="Stock actual de ${escaparHTML(producto.nombre_producto)}"
                        title="Escriba el stock actual y pulse Enter"
                        autocomplete="off"
                    >
                    <button type="button" class="btn-ajustar-stock" data-delta="1" title="Sumar 1">+</button>
                </div>
            </td>
            <td class="centrado">${Number(producto.stock_ideal)}</td>
            <td class="centrado">
                <div class="celda-acciones">
                    <button type="button" class="btn-editar-producto" title="Editar producto">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn-eliminar-producto" title="Eliminar producto">
                        <i class="bi bi-trash3"></i>
                    </button>
                </div>
            </td>
        </tr>
      `;
    })
    .join("");
}

function actualizarContadorProductos(cantidad) {
  const contador = document.getElementById("contadorProductos");

  if (!contador) return;

  const texto = cantidad === 1 ? "registro" : "registros";

  contador.textContent = `${cantidad} ${texto}`;
}

function actualizarBotonLimpiarBusqueda() {
  const buscador = document.getElementById("buscarProducto");
  const barra = buscador?.closest(".barra-busqueda-inventario");

  if (!buscador || !barra) return;

  barra.classList.toggle("con-busqueda", buscador.value.length > 0);
}

/* =========================================================
   Modales
   ========================================================= */
function abrirModalCrearProducto() {
  const modal = document.querySelector(".modal-overlay-producto-crear");
  const formulario = document.getElementById("formCrearProducto");

  if (!modal || !formulario) return;

  formulario.reset();
  formulario.querySelectorAll("input, select").forEach((campo) => {
    campo.setCustomValidity("");
  });

  modal.style.display = "flex";
}

function abrirModalEditar(idProducto) {
  const producto = listaProductos.find(
    (producto) => producto.idProducto == idProducto,
  );

  if (!producto) return;

  const modal = document.querySelector(".modal-overlay-producto-editar");
  const formulario = document.getElementById("formActualizarProducto");

  if (!modal || !formulario) return;

  idProductoEditar = idProducto;

  document.getElementById("nombreEditarProducto").value =
    producto.nombre_producto;
  document.getElementById("categoriaEditarProducto").value =
    producto.idCategoria;
  document.getElementById("distribuidoraEditarProducto").value =
    producto.idDistribuidora;
  document.getElementById("stockIdealEditarProducto").value =
    producto.stock_ideal;

  formulario.querySelectorAll("input, select").forEach((campo) => {
    campo.setCustomValidity("");
  });

  modal.style.display = "flex";
}

function abrirModalDiario() {
  const selectMes = document.getElementById("mes");
  const selectAnio = document.getElementById("anio");
  const selectDistribuidora = document.getElementById("distribuidoraDiario");

  if (!selectMes?.value || !selectAnio?.value) {
    alertaDiarioSinFecha();
    return;
  }

  if (!selectDistribuidora?.value) {
    alertaDiarioSinDistribuidora();
    return;
  }

  const nombreMes = selectMes.options[selectMes.selectedIndex].text;
  const nombreDistribuidora =
    selectDistribuidora.options[selectDistribuidora.selectedIndex].text;
  const titulo = document.getElementById("tituloListaDiario");
  const lista = listaDiario;
  const modal = modalDiario;

  titulo.textContent = `Lista Diario ${nombreMes} ${selectAnio.value} — ${nombreDistribuidora}`;

  const planes = listaProductos
    .filter(
      (producto) =>
        String(producto.idDistribuidora) ===
        String(selectDistribuidora.value),
    )
    .slice()
    .sort((primero, segundo) => {
      const prioridadPrimero = prioridadCategoriaDiario(
        primero.nombre_categoria,
      );
      const prioridadSegundo = prioridadCategoriaDiario(
        segundo.nombre_categoria,
      );

      if (prioridadPrimero !== prioridadSegundo) {
        return prioridadPrimero - prioridadSegundo;
      }

      const comparacionCategoria = primero.nombre_categoria.localeCompare(
        segundo.nombre_categoria,
        "es",
        { sensitivity: "base", numeric: true },
      );

      if (comparacionCategoria !== 0) {
        return comparacionCategoria;
      }

      return primero.nombre_producto.localeCompare(segundo.nombre_producto, "es", {
        sensitivity: "base",
        numeric: true,
      });
    })
    .map((producto) => {
      const actual = Number(producto.stock_actual);
      const ideal = Number(producto.stock_ideal);

      return {
        ...producto,
        pedir: Math.max(ideal - actual, 0),
      };
    })
    .filter((producto) => producto.pedir > 0);

  if (lista) {
    const grupos = new Map();

    planes.forEach((producto) => {
      const nombreCategoria = formatearNombreCategoria(
        producto.nombre_categoria,
      );

      if (!grupos.has(nombreCategoria)) {
        grupos.set(nombreCategoria, []);
      }

      grupos.get(nombreCategoria).push(producto);
    });

    const gruposHTML = [...grupos.entries()]
      .map(([nombreCategoria, productos]) => {
        const color = colorCategoria(productos[0].nombre_categoria);
        const filas = productos
          .map(
            (producto) => `
              <div class="fila-producto-diario">
                  <span class="nombre-producto-diario">${escaparHTML(producto.nombre_producto)}</span>
                  <span class="cantidad-producto-diario">${producto.pedir}</span>
              </div>
            `,
          )
          .join("");

        return `
          <section class="grupo-categoria-diario">
              <h3 class="titulo-categoria-diario" style="color: ${color.texto};">
                  ${escaparHTML(nombreCategoria)}
              </h3>
              ${filas}
          </section>
        `;
      })
      .join("");

    lista.innerHTML = `
      <div class="encabezado-columnas-diario">
          <span>Producto</span>
          <span>A pedir</span>
      </div>
      ${gruposHTML}
    `;
  }

  modal.style.display = "flex";
}

function cerrarModal(claseModal) {
  const modal = document.querySelector(`.${claseModal}`);

  if (!modal) return;

  modal.style.display = "none";

  const formulario = modal.querySelector("form");

  if (formulario) {
    formulario.reset();
    formulario.querySelectorAll("input, select").forEach((campo) => {
      campo.setCustomValidity("");
    });
  }

  if (claseModal === "modal-overlay-producto-editar") {
    idProductoEditar = null;
  }
}

function leerDatosFormulario(formulario) {
  const datos = new FormData(formulario);

  return {
    nombre: String(datos.get("nombre") ?? "").trim(),
    idCategoria: String(datos.get("idCategoria") ?? ""),
    idDistribuidora: String(datos.get("idDistribuidora") ?? ""),
    stockIdeal: String(datos.get("stockIdeal") ?? ""),
  };
}

/* =========================================================
   Acciones
   ========================================================= */
async function crearProducto(datos) {
  try {
    await enviarProducto("producto/crear", datos);
    await recargarProductos();

    cerrarModal("modal-overlay-producto-crear");
    alertaProductoCreado(datos.nombre);
  } catch (error) {
    console.error("Error al crear producto:", error);
    alertaErrorCrearProducto(datos.nombre);
  }
}

async function actualizarProducto(datos) {
  try {
    await enviarProducto(`productos/actualizar/${idProductoEditar}`, datos);
    await recargarProductos();

    cerrarModal("modal-overlay-producto-editar");
    alertaProductoActualizado(datos.nombre);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    alertaErrorActualizarProducto(datos.nombre);
  }
}

async function ajustarStock(idProducto, delta, inputEditable = null) {
  if (!Number.isInteger(delta) || delta === 0) return false;

  const fila = [
    ...document.querySelectorAll("#cuerpoTablaProductos tr"),
  ].find((fila) => fila.dataset.id == idProducto);
  const input = inputEditable ?? fila?.querySelector(".stock-editable");
  const valorAnterior = input
    ? Number(input.dataset.valorOriginal ?? input.value)
    : null;

  try {
    const resultado = await enviarProducto(
      `productos/actualizar-stock/${idProducto}`,
      { delta },
    );

    const producto = listaProductos.find(
      (producto) => producto.idProducto == idProducto,
    );

    if (producto) {
      producto.stock_actual = resultado.stock_actual;
    }

    actualizarFilaStock(fila, resultado.stock_actual, input);

    return true;
  } catch (error) {
    console.error("Error al ajustar el stock:", error);

    if (input && Number.isInteger(valorAnterior)) {
      actualizarFilaStock(fila, valorAnterior, input);
    }

    alertaErrorAjustarStock();

    return false;
  }
}

function actualizarFilaStock(fila, stock, input = null) {
  if (!fila) return;

  const campoStock = input ?? fila.querySelector(".stock-editable");

  if (campoStock) {
    campoStock.value = stock;
    campoStock.dataset.valorOriginal = String(stock);
  }

  const botonRestar = fila.querySelector('[data-delta="-1"]');

  if (botonRestar) {
    botonRestar.disabled = Number(stock) <= 0;
  }
}

async function eliminarProducto(idProducto) {
  const producto = listaProductos.find(
    (producto) => producto.idProducto == idProducto,
  );
  const nombre = producto?.nombre_producto ?? "el producto";

  const confirmado = await confirmarEliminado(nombre);

  if (!confirmado) return;

  try {
    await enviarProducto(`productos/eliminar/${idProducto}`);
    await recargarProductos();

    alertaProductoEliminado(nombre);
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    alertaErrorEliminarProducto(nombre);
  }
}

/* =========================================================
   Transporte
   ========================================================= */
async function enviarProducto(ruta, datos = null) {
  const opciones = {
    method: "POST",
  };

  if (datos) {
    opciones.headers = { "Content-Type": "application/json" };
    opciones.body = JSON.stringify(datos);
  }

  const response = await fetch(BASE_URL + ruta, opciones);

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const resultado = await response.json();

  if (!resultado.success) {
    throw new Error(resultado.message);
  }

  return resultado;
}

/* =========================================================
   Confirmación
   ========================================================= */
function confirmarEliminado(nombreProducto) {
  const modal = document.querySelector(".modal-overlay-producto-eliminar");
  const mensaje = document.getElementById("mensajeEliminarProducto");

  mensaje.textContent = `¿Quiere eliminar el producto "${nombreProducto}"? Esta acción no se puede revertir.`;
  modal.style.display = "flex";

  return new Promise((resolver) => {
    resolverConfirmacionEliminar = resolver;
  });
}

/* =========================================================
   Alertas
   ========================================================= */
function alertaProductoCreado(nombreProducto) {
  Swal.fire({
    toast: true,
    position: "bottom-right",
    icon: "success",
    title: `Se creó correctamente el producto "${nombreProducto}".`,
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
  });
}

function alertaErrorCrearProducto(nombreProducto) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: `No se pudo crear el producto "${nombreProducto}".`,
  });
}

function alertaProductoActualizado(nombreProducto) {
  Swal.fire({
    toast: true,
    position: "bottom-right",
    icon: "success",
    title: `Se actualizó el producto "${nombreProducto}" correctamente.`,
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
  });
}

function alertaErrorActualizarProducto(nombreProducto) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: `No se pudo actualizar el producto "${nombreProducto}".`,
  });
}

function alertaProductoEliminado(nombreProducto) {
  Swal.fire({
    toast: true,
    position: "bottom-right",
    icon: "success",
    title: `Se eliminó el producto "${nombreProducto}".`,
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
  });
}

function alertaErrorEliminarProducto(nombreProducto) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: `No se pudo eliminar el producto "${nombreProducto}".`,
  });
}

function alertaErrorAjustarStock() {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: "No se pudo ajustar el stock actual.",
  });
}

function alertaErrorStockEditable() {
  Swal.fire({
    icon: "error",
    title: "Stock no válido",
    text: "Ingrese un número entero mayor o igual a 0.",
  });
}

function alertaDiarioSinFecha() {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: "Seleccione el mes y el año para generar el diario.",
  });
}

function alertaDiarioSinDistribuidora() {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: "Seleccione el proveedor para generar el diario.",
  });
}

function alertaErrorCargarInventario() {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: "No se pudo cargar el inventario.",
  });
}

/* =========================================================
   Arranque
   ========================================================= */
init();
