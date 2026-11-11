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
            </div>
        </header>

        <section class="barra-filtros-inventario">
            <div class="filtros-categorias">
                <button class="boton-filtro-activo">Todos</button>
                <button>Abarrotes</button>
                <button>Art. Personales</button>
                <button>Jabones</button>
            </div>

            <button class="btn-generar-diario">
                Generar diario
            </button>
        </section>

    </main>

</body>

<script src="<?= BASE_URL . 'public/assets/js/main.js' ?>"></script>

</html>