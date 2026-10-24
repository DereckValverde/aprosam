<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/css/header.css' ?>"> <!-- hoja de estilos del header -->
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/bootstrap-icons/bootstrap-icons.min.css' ?>"> <!-- Iconos de bootstrap -->
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/css/main.css' ?>"> <!-- Font Inter -->
    <title>Inventario</title>
</head>

<body>

    <!-- Header -->
    <?php
    $paginaActual = 'inventario';
    require_once LAYOUT_PATH . 'header.php';
    ?>

    <h1>Página de inventario</h1>

</body>

<script src="<?= BASE_URL . 'public/assets/js/main.js' ?>"></script>


</html>