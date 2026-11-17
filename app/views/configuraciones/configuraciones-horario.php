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

                                    <span class="rol-colaboradora">
                                        Administradora
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

                                    <span class="rol-colaboradora">
                                        Colaboradora
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


    </div>

</body>

</html>
