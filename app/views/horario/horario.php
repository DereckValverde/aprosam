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
                    <div id="colaboradorasHeader">
                        <span>────────</span>
                        <span>Colaboradoras</span>
                        <span>────────</span>
                    </div>

                    <div id="listaColaboradoras">
                        <!-- Lista de colaboradoras inyectadas desde JS -->
                    </div>
                </section>
            </div>

            <div id="panelHorario" class="inter-normal">
                <section id="horarioTop">
                    <header id="horarioTitulo">
                        <p>Agosto 2022</p>
                    </header>

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
                </section>

                <section id="horarioVista" class="horarioVacio"></section>
            </div>
        </div>
    </main>

    <script src="<?= BASE_URL . 'public/assets/js/main.js' ?>"></script>
    <script>
        const BASE_URL = "<?= BASE_URL ?>";
    </script>
    <script src="<?= BASE_URL . 'public/assets/js/horario/horario.js' ?>"></script>
</body>

</html>