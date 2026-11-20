<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/css/header.css' ?>">
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/bootstrap-icons/bootstrap-icons.min.css' ?>">
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/css/main.css' ?>">
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/css/configuraciones/configuraciones.css' ?>">
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/css/configuraciones/configuraciones-inventario.css' ?>">
    <title>Configuraciones del sistema | Inventario</title>
</head>

<body>

    <?php
    $paginaActual = 'configuraciones';
    $seccionConfiguracion = 'inventario';
    require_once LAYOUT_PATH . 'header.php';
    ?>

    <div class="config-layout">

        <?php require_once LAYOUT_PATH . 'sidebar-configuraciones.php'; ?>

        <main class="content">
            <div class="contenedor-principal">

                <div class="contenedor-categorias">

                    <div class="categorias-header">
                        <div>
                            <h2>Categorías</h2>
                            <p>Administrar las categorías.</p>
                        </div>

                        <button class="btn-anadir-nueva-categoria">
                            <i class="bi bi-plus-lg"></i>
                            <span>Añadir categoría</span>
                        </button>
                    </div>

                    <div class="lista-categorias">

                        <!-- Lista de categorías inyectadas desde JS -->

                    </div>

                    <div class="categorias-footer">
                        <span class="footer-total-categorias">0 categorías registradas</span>
                    </div>

                </div>

            </div>
        </main>

        <!-- Modal editar categoría -->
        <div class="modal-overlay-edit">
            <div class="form-container modal-editar-categoria">
                <div class="modal-header">
                    <h2>Editar categoría</h2>
                    <i class="bi bi-x-lg closeModal" role="button" aria-label="Cerrar"></i>
                </div>

                <form action="#" method="POST" id="formActualizarCategoria" autocomplete="off">
                    <div class="form-group">
                        <label for="nombre">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value=""
                            required>
                    </div>

                    <div class="modal-buttons">
                        <button type="button" class="btn-cancelar">Cancelar</button>
                        <button type="submit" class="btn-guardar">Guardar cambios</button>
                    </div>
                </form>
            </div>
        </div>


        <!-- Modal crear categoría -->
        <div class="modal-overlay-create">
            <div class="form-container modal-crear-categoria">
                <div class="modal-header">
                    <h2>Añadir categoría</h2>
                    <i class="bi bi-x-lg closeModal" role="button" aria-label="Cerrar"></i>
                </div>

                <form action="#" method="POST" id="formCrearCategoria" autocomplete="off">
                    <div class="form-group">
                        <label for="nombre">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value=""
                            required>
                    </div>

                    <div class="modal-buttons">
                        <button type="button" class="btn-cancelar">Cancelar</button>
                        <button type="submit" class="btn-anadir-categoria">Añadir categoría</button>
                    </div>
                </form>
            </div>
        </div>


        <div class="modal-overlay-eliminar">
            <div class="form-container modal-eliminar-categoria">
                <div class="modal-header">
                    <h2>Eliminar categoría</h2>
                    <i class="bi bi-x-lg closeModal" role="button" aria-label="Cerrar"></i>
                </div>

                <p class="mensaje-eliminar" id="mensajeEliminarCategoria"></p>

                <div class="modal-buttons">
                    <button type="button" class="btn-cancelar">Cancelar</button>
                    <button type="button" class="btn-confirmar-eliminar">Sí, eliminar</button>
                </div>
            </div>
        </div>


    </div>

</body>

<script src="<?= BASE_URL ?>public/assets/js/sweetalert2.all.min.js"></script>
<script>
    const BASE_URL = "<?= BASE_URL ?>";
</script>
<script src="<?= BASE_URL . 'public/assets/js/configuraciones/configuraciones-inventario.js' ?>"></script>

</html>
