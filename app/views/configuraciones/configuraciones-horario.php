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

                        <button class="btn-agregar">
                            <i class="bi bi-plus-lg"></i>
                            <span>Añadir colaboradora</span>
                        </button>
                    </div>

                    <div class="lista-colaboradoras">

                        <!-- Colaboradora -->
                        <div class="colaboradora">

                            <div class="colaboradora-info">
                                <div class="avatar-colaboradora">
                                    K
                                </div>

                                <div class="datos-colaboradora">
                                    <span class="nombre-colaboradora">
                                        Colaboradora demo
                                    </span>

                                    <span class="apellido-colaboradora">
                                        Madrigal Gómez
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

                        </div>

                        <!-- Puedes agregar más colaboradoras aquí -->

                        <div class="colaboradora">

                            <div class="colaboradora-info">
                                <div class="avatar-colaboradora">
                                    M
                                </div>

                                <div class="datos-colaboradora">
                                    <span class="nombre-colaboradora">
                                        María
                                    </span>

                                    <span class="apellido-colaboradora">
                                        Vega Solís
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

                        </div>

                    </div>

                    <div class="colaboradoras-footer">
                        <span>2 colaboradoras registradas</span>
                    </div>

                </div>

            </div>
        </main>


        <div class="modal-overlay">
            <div class="form-container modal-editar-colaboradora">
                <div class="modal-header">
                    <h2>Editar colaboradora</h2>
                    <i class="bi bi-x-lg closeModal" role="button" aria-label="Cerrar"></i>
                </div>

                <form action="#" method="POST">
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
                        <label for="rol">Apellidos</label>
                        <input
                            type="text"
                            id="apellidos"
                            name="apellidos"
                            value="Hernandez Mora">
                    </div>

                    <div class="modal-buttons">
                        <button type="button" class="btn-cancelar">Cancelar</button>
                        <button type="submit" class="btn-guardar">Guardar cambios</button>
                    </div>
                </form>
            </div>
        </div>


    </div>

</body>

<script src="<?= BASE_URL . 'public/assets/js/configuraciones/configuraciones-horario.js' ?>"></script>

</html>