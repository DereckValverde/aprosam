<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/css/header.css' ?>"> <!-- hoja de estilos del header -->
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/bootstrap-icons/bootstrap-icons.min.css' ?>"> <!-- Iconos de bootstrap -->
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/css/main.css' ?>"> <!-- Font Inter -->
    <title>Medicamentos</title>
</head>

<body>

    <!-- Header -->
    <?php
    $paginaActual = 'medicamentos';
    require_once LAYOUT_PATH . 'header.php';
    ?>

    <main style="padding: 20px 15px;">
        <h1 class="inter-semibold">Página de Medicamentos</h1>
    </main>

</body>

<script src="<?= BASE_URL . 'public/assets/js/main.js' ?>"></script>

</html>