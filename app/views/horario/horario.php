<!DOCTYPE html>
<html lang="es" data-bs-theme="light">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/css/header.css' ?>"> <!-- hoja de estilos del header -->
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/bootstrap-icons/bootstrap-icons.min.css' ?>"> <!-- Iconos de bootstrap -->
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/css/main.css' ?>"> <!-- Font Inter -->
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/css/horario/horario.css' ?>"> <!-- hoja de estilos propia para el módulo de horario -->
    <link rel="stylesheet" href=""> <!-- estilo para el font -->

    <title>Horario</title>
</head>

<body>

    <!-- Header -->
    <?php
    $paginaActual = 'horario';
    require_once LAYOUT_PATH . 'header.php';
    ?>

    <main>

        <!-- Header del módulo de horario -->
        <header id="horarioHeader">

            <h1 class="inter-semibold">Horario</h1>

            <button id="btnGuardarHorario" type="button">
                <span>Guardar Horario</span>
            </button>

        </header>

        <div id="horarioGrid">

            <div id="panelFuncionalidades">

                <section id="coloresSeccion">

                    <div id="coloresHeader">
                        <span class="inter-semibold">Colores y bordes</span>
                        <input type="checkbox">
                    </div>

                    <div id="coloresFondo">
                        <section id="listaColores">

                            <div class="cajaColor">
                                <p>Rojo</p>
                            </div>

                            <div class="cajaColor">
                                <p>Morado</p>
                            </div>

                            <div class="cajaColor">
                                <p>Amarillo</p>
                            </div>

                            <div class="cajaColor">
                                <p>Azul</p>
                            </div>

                            <div class="cajaColor">
                                <p>Verde</p>

                            </div>

                            <div class="cajaColor">
                                <p>Blanco</p>
                            </div>

                        </section>

                        <section id="listaBordes">

                        </section>
                    </div>


                </section>


                <section id="colaboradorasSeccion">
                    <p>colaboradoras</p>
                </section>

            </div>

            <div id="panelHorario">

                <header class="horarioTitulo">
                    <p>horarioTitulo</p>
                </header>

                <section id="horarioVista">
                    <p>horarioVista</p>
                </section>
            </div>

        </div>






    </main>

</body>

<script src="<?= BASE_URL . 'public/assets/js/main.js' ?>"></script>

</html>