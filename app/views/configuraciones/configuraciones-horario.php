<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/css/header.css' ?>">
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/bootstrap-icons/bootstrap-icons.min.css' ?>">
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/css/main.css' ?>">
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/css/configuraciones/configuraciones.css' ?>">
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/css/configuraciones/configuraciones-horario.css' ?>">
    <title>Configuraciones del sistema | Horario</title>
</head>

<body>

    <?php
    $paginaActual = 'configuraciones';
    $seccionConfiguracion = 'horario';
    require_once LAYOUT_PATH . 'header.php';
    ?>


    <div class="config-layout">

        <?php require_once LAYOUT_PATH . 'sidebar-configuraciones.php'; ?>


        <main class="content">
            <div class="contenedor-principal">

                <div class="contenedor-colaboradoras">

                    <div class="colaboradoras-header">
                        <div>
                            <h2>Colaboradoras</h2>
                            <p>Administrar las colaboradoras.</p>
                        </div>

                        <button class="btn-anadir-nueva-colaboradora">
                            <i class="bi bi-plus-lg"></i>
                            <span>Añadir colaboradora</span>
                        </button>
                    </div>

                    <div class="lista-colaboradoras">

                        <!-- Lista de colaboradoras inyectadas desde JS -->

                    </div>

                    <div class="colaboradoras-footer">
                        <span class="footer-total-colaboradoras">0 colaboradoras registradas</span>
                    </div>

                </div>

            </div>
        </main>

        <!-- Modal editar colaboradora -->
        <div class="modal-overlay-edit">
            <div class="form-container modal-editar-colaboradora">
                <div class="modal-header">
                    <h2>Editar colaboradora</h2>
                    <i class="bi bi-x-lg closeModal" role="button" aria-label="Cerrar"></i>
                </div>

                <form action="#" method="POST" id="formActualizarColaboradora">
                    <div class="form-group">
                        <label for="nombre">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value="María"
                            required>
                    </div>

                    <div class="form-group">
                        <label for="rol">Apellido</label>
                        <input
                            type="text"
                            id="apellido"
                            name="apellido"
                            value="Hernandez">
                    </div>

                    <div class="modal-buttons">
                        <button type="button" class="btn-cancelar">Cancelar</button>
                        <button type="submit" class="btn-guardar">Guardar cambios</button>
                    </div>
                </form>
            </div>
        </div>


        <!-- Modal crear colaboradora -->
        <div class="modal-overlay-create">
            <div class="form-container modal-crear-colaboradora">
                <div class="modal-header">
                    <h2>Editar colaboradora</h2>
                    <i class="bi bi-x-lg closeModal" role="button" aria-label="Cerrar"></i>
                </div>

                <form action="#" method="POST" id="formCrearColaboradora">
                    <div class="form-group">
                        <label for="nombre">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value=""
                            required>
                    </div>

                    <div class="form-group">
                        <label for="rol">Apellido</label>
                        <input
                            type="text"
                            id="apellido"
                            name="apellido"
                            value="">
                    </div>

                    <div class="modal-buttons">
                        <button type="button" class="btn-cancelar">Cancelar</button>
                        <button type="submit" class="btn-anadir-colaboradora">Añadir colaboradora</button>
                    </div>
                </form>
            </div>
        </div>


    </div>

</body>

<script src="<?= BASE_URL ?>public/assets/js/sweetalert2.all.min.js"></script>
<script>
    const BASE_URL = "<?= BASE_URL ?>";
</script>
<script src="<?= BASE_URL . 'public/assets/js/configuraciones/configuraciones-horario.js' ?>"></script>

</html>