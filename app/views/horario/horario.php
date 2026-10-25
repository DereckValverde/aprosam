<!DOCTYPE html>
<html lang="es" data-bs-theme="light">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/css/header.css' ?>">
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/bootstrap-icons/bootstrap-icons.min.css' ?>">
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/css/main.css' ?>">
    <link rel="stylesheet" href="<?= BASE_URL . 'public/assets/css/horario/horario.css' ?>">

    <title>Horario</title>
</head>

<body>

    <?php
    $paginaActual = 'horario';
    require_once LAYOUT_PATH . 'header.php';
    ?>

    <main>

        <header id="horarioHeader">
            <h1 class="inter-semibold">Horario</h1>

            <button id="btnGuardarHorario" type="button">
                <i class="bi bi-floppy"></i>
                <span>Guardar Horario</span>
            </button>
        </header>

        <div id="horarioGrid">

            <div id="panelFuncionalidades">

                <section id="coloresSeccion">

                    <div id="coloresHeader">
                        <span class="inter-normal">Colores y bordes</span>
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

                <section id="colaboradorasSeccion" class="inter-normal">

                    <div class="inter-normal" id="colaboradorasHeader">
                        <span>────────</span>
                        <span>Colaboradoras</span>
                        <span>────────</span>
                    </div>

                    <div id="listaColaboradoras">

                        <div class="colaboradorasFondo">
                            <div class="cajaColaboradora">
                                <div class="cajaContenido">
                                    <div class="cajaNombre">
                                        <img src="<?= BASE_URL . 'public/assets/images/logo.jpg' ?>" alt="">
                                        <span>Dereck</span>
                                    </div>
                                    <div class="cajaTurnos">
                                        <span>4 turnos</span>
                                    </div>
                                </div>
                                <div class="cajaFiltro">
                                    <i class="bi bi-funnel"></i>
                                </div>
                            </div>
                        </div>

                        <div class="colaboradorasFondo">
                            <div class="cajaColaboradora">
                                <div class="cajaContenido">
                                    <div class="cajaNombre">
                                        <img src="<?= BASE_URL . 'public/assets/images/logo.jpg' ?>" alt="">
                                        <span>Nancy</span>
                                    </div>
                                    <div class="cajaTurnos">
                                        <span>2 turnos</span>
                                    </div>
                                </div>
                                <div class="cajaFiltro">
                                    <i class="bi bi-funnel"></i>
                                </div>
                            </div>
                        </div>

                        <?php for ($i = 0; $i < 8; $i++): ?>
                            <div class="colaboradorasFondos">
                                <div class="cajaColaboradora">
                                    <div class="cajaContenido">
                                        <div class="cajaNombre">
                                            <img src="<?= BASE_URL . 'public/assets/images/logo.jpg' ?>" alt="">
                                            <span>Pedro</span>
                                        </div>
                                        <div class="cajaTurnos">
                                            <span>5 turnos</span>
                                        </div>
                                    </div>
                                    <div class="cajaFiltro">
                                        <i class="bi bi-funnel"></i>
                                    </div>
                                </div>
                            </div>
                        <?php endfor; ?>

                    </div>

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

    <script src="<?= BASE_URL . 'public/assets/js/main.js' ?>"></script>

</body>

</html>