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

                        <section id="listaColores" class="inter-normal">

                            <div class="cajaColor cajaColor--rojo">
                                <p>Rojo</p>
                            </div>

                            <div class="cajaColor cajaColor--morado">
                                <p>Morado</p>
                            </div>

                            <div class="cajaColor cajaColor--amarillo">
                                <p>Amarillo</p>
                            </div>

                            <div class="cajaColor cajaColor--azul">
                                <p>Azul</p>
                            </div>

                            <div class="cajaColor cajaColor--verde">
                                <p>Verde</p>
                            </div>

                            <div class="cajaColor cajaColor--blanco">
                                <p>Blanco</p>
                            </div>

                        </section>

                        <hr style="margin: 0 5px;">

                        <section id="listaBordes" class="inter-normal">

                            <div class="cajaBorde cajaBorde--verdura">
                                <span>• Verduras</span>
                                <span class="activo">activo</span>
                            </div>
                            <div class="cajaBorde cajaBorde--limpieza">
                                <span>• Limpieza</span>
                            </div>
                            <div class="cajaBorde cajaBorde--diario">
                                <span>• Diario</span>
                            </div>
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