<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/css/header.css' ?>"> <!-- hoja de estilos del header -->
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/bootstrap-icons/bootstrap-icons.min.css' ?>"> <!-- Iconos de bootstrap -->
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/css/main.css' ?>"> <!-- Font Inter y estilos generales-->
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/css/inventario/inventario.css' ?>">

    <title>Inventario</title>
</head>

<body>

    <!-- Header -->
    <?php
    $paginaActual = 'inventario';
    require_once LAYOUT_PATH . 'header.php';
    ?>

    <main>

        <header id="inventarioHeader">
            <h1 class="inter-semibold">Inventario</h1>

            <div id="dropdowns">
                <select id="mes" name="mes">
                    <option value="" selected disabled style="font-weight: bold; background-color: #bbbbbb; color: #ffffff;">Mes</option>
                    <option value="1">Enero</option>
                    <option value="2">Febrero</option>
                    <option value="3">Marzo</option>
                    <option value="4">Abril</option>
                    <option value="5">Mayo</option>
                    <option value="6">Junio</option>
                    <option value="7">Julio</option>
                    <option value="8">Agosto</option>
                    <option value="9">Septiembre</option>
                    <option value="10">Octubre</option>
                    <option value="11">Noviembre</option>
                    <option value="12">Diciembre</option>
                </select>

                <select id="anio" name="anio">
                    <option value="" selected disabled style="font-weight: bold; background-color: #bbbbbb; color: #ffffff;">Año</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                    <option value="2030">2030</option>
                    <option value="2031">2031</option>
                    <option value="2032">2032</option>
                </select>

                <div class="selector-distribuidora-diario">
                    <i class="bi bi-truck" aria-hidden="true"></i>
                    <select id="distribuidoraDiario" name="distribuidoraDiario">
                        <option value="" selected disabled style="font-weight: bold; background-color: #bbbbbb; color: #ffffff;">Proveedor</option>
                    </select>
                </div>
            </div>
        </header>

        <section class="barra-filtros-inventario">
            <div class="filtros-categorias">
                <button type="button" class="boton-filtro-activo">Todos</button>
            </div>

            <button type="button" class="btn-generar-diario">
                <span>Generar diario</span>
            </button>
        </section>

        <section class="header-lista-produtos">

            <div class="titulo-lista">
                <p class="inter-semibold">Lista Productos</p>
                <span class="inter-semibold" id="contadorProductos">0 registros</span>
            </div>

            <div class="lista-funcionalidades">
                <button type="button" class="btn-agregar-producto inter-semibold">
                    <i class="bi bi-plus-lg"></i>
                    <span>Agregar producto</span>
                </button>

                <div class="barra-busqueda-inventario">
                    <i class="bi bi-search"></i>
                    <input type="text" id="buscarProducto" placeholder="Buscar producto">
                    <i class="bi bi-x-lg btn-limpiar-busqueda" role="button" aria-label="Limpiar búsqueda"></i>
                </div>
            </div>
        </section>

        <section class="contenedor-tabla-productos">
            <div class="mensaje-inventario-sin-distribuidora" aria-hidden="true">INVENTARIO</div>

            <table class="tabla-productos">
                <thead>
                    <tr>
                        <th class="centrado"><button type="button" class="btn-ordenar-tabla" data-orden="nombre_producto">Producto <span class="icono-orden"></span></button></th>
                        <th class="centrado">Categoría</th>
                        <th class="centrado"><button type="button" class="btn-ordenar-tabla" data-orden="nombre_distribuidora">Proveedor <span class="icono-orden"></span></button></th>
                        <th class="centrado">Existencias actuales</th>
                        <th class="centrado">Existencias ideales</th>
                        <th class="centrado">Acciones</th>
                    </tr>
                </thead>
                <tbody id="cuerpoTablaProductos"></tbody>
            </table>
        </section>

    </main>

    <div class="modal-overlay-producto-crear">
        <div class="form-container-producto modal-crear-producto">
            <div class="modal-header-producto">
                <h2>Agregar producto</h2>
                <i class="bi bi-x-lg closeModal" role="button" aria-label="Cerrar"></i>
            </div>

            <form action="#" method="POST" id="formCrearProducto" autocomplete="off">
                <div class="form-group-producto">
                    <label for="nombreCrearProducto">Nombre</label>
                    <input type="text" id="nombreCrearProducto" name="nombre" required>
                </div>

                <div class="form-group-producto">
                    <label for="categoriaCrearProducto">Categoría</label>
                    <select id="categoriaCrearProducto" name="idCategoria" required>
                        <option value="" selected disabled>Seleccione una categoría</option>
                    </select>
                </div>

                <div class="form-group-producto">
                    <label for="distribuidoraCrearProducto">Distribuidora</label>
                    <select id="distribuidoraCrearProducto" name="idDistribuidora" required>
                        <option value="" selected disabled>Seleccione una distribuidora</option>
                    </select>
                </div>

                <div class="form-group-producto">
                    <label for="stockIdealCrearProducto">Stock ideal</label>
                    <input type="number" id="stockIdealCrearProducto" name="stockIdeal" min="0" step="1" value="0" required>
                </div>

                <div class="modal-buttons-producto">
                    <button type="button" class="btn-cancelar-producto">Cancelar</button>
                    <button type="submit" class="btn-guardar-producto">Guardar producto</button>
                </div>
            </form>
        </div>
    </div>

    <div class="modal-overlay-producto-editar">
        <div class="form-container-producto modal-editar-producto">
            <div class="modal-header-producto">
                <h2>Editar producto</h2>
                <i class="bi bi-x-lg closeModal" role="button" aria-label="Cerrar"></i>
            </div>

            <form action="#" method="POST" id="formActualizarProducto" autocomplete="off">
                <div class="form-group-producto">
                    <label for="nombreEditarProducto">Nombre</label>
                    <input type="text" id="nombreEditarProducto" name="nombre" required>
                </div>

                <div class="form-group-producto">
                    <label for="categoriaEditarProducto">Categoría</label>
                    <select id="categoriaEditarProducto" name="idCategoria" required>
                        <option value="" selected disabled>Seleccione una categoría</option>
                    </select>
                </div>

                <div class="form-group-producto">
                    <label for="distribuidoraEditarProducto">Distribuidora</label>
                    <select id="distribuidoraEditarProducto" name="idDistribuidora" required>
                        <option value="" selected disabled>Seleccione una distribuidora</option>
                    </select>
                </div>

                <div class="form-group-producto">
                    <label for="stockIdealEditarProducto">Stock ideal</label>
                    <input type="number" id="stockIdealEditarProducto" name="stockIdeal" min="0" step="1" required>
                </div>

                <div class="modal-buttons-producto">
                    <button type="button" class="btn-cancelar-producto">Cancelar</button>
                    <button type="submit" class="btn-guardar-producto">Guardar cambios</button>
                </div>
            </form>
        </div>
    </div>

    <div class="modal-overlay-producto-eliminar">
        <div class="form-container-producto modal-eliminar-producto">
            <div class="modal-header-producto">
                <h2>Eliminar producto</h2>
                <i class="bi bi-x-lg closeModal" role="button" aria-label="Cerrar"></i>
            </div>

            <p class="mensaje-eliminar-producto" id="mensajeEliminarProducto"></p>

            <div class="modal-buttons-producto">
                <button type="button" class="btn-cancelar-producto">Cancelar</button>
                <button type="button" class="btn-confirmar-eliminar-producto">Sí, eliminar</button>
            </div>
        </div>
    </div>

    <div class="modal-overlay-diario">
        <div class="form-container-producto modal-diario">
            <div class="modal-header-producto">
                <span class="marca-diario">APROSAM</span>
                <h2 id="tituloListaDiario"></h2>
                <i class="bi bi-x-lg closeModal" role="button" aria-label="Cerrar"></i>
            </div>

            <div class="contenedor-lista-diario" id="listaDiario"></div>

            <div class="modal-buttons-producto">
                <button type="button" class="btn-imprimir-diario">
                    <i class="bi bi-printer"></i> Imprimir / Guardar PDF
                </button>
                <button type="button" class="btn-cancelar-producto">Cerrar</button>
            </div>
        </div>
    </div>

</body>

<script src="<?= BASE_URL ?>public/assets/js/sweetalert2.all.min.js"></script>
<script src="<?= BASE_URL . 'public/assets/js/main.js' ?>"></script>
<script>
    const BASE_URL = "<?= BASE_URL ?>";
</script>
<script src="<?= BASE_URL . 'public/assets/js/inventario/inventario.js' ?>"></script>

</html>