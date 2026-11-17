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
            <h1>Inventario</h1>
            <p>Configuración de la sección de inventario.</p>
        </main>

    </div>

</body>

</html>
