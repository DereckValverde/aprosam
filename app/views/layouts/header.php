<header id="header">

    <div id="logo">
        <span class="inter-normal">APROSAM</span>
    </div>

    <nav id="navbar">
        <ul>
            <li>
                <a class="inter-normal <?= $paginaActual === 'horario' ? 'boton-activo' : '' ?>" href="<?= BASE_URL . 'horario' ?>">Horario</a>
            </li>
            <li>
                <a class="inter-normal <?= $paginaActual === 'medicamentos' ? 'boton-activo' : '' ?>" href="<?= BASE_URL . 'medicamentos' ?>">Medicamentos</a>

            </li>
            <li>
                <a class="inter-normal <?= $paginaActual === 'inventario' ? 'boton-activo' : '' ?>" href="<?= BASE_URL . 'inventario' ?>">Inventario</a>

            </li>

        </ul>
    </nav>
    <a class="config-link <?= $paginaActual === 'configuraciones' ? 'activo' : '' ?>" href="<?= BASE_URL . 'configuraciones' ?>" aria-label="Configuraciones" title="Configuraciones">
        <div id="menu-header">
            <i class="bi bi-gear"></i>
        </div>

    </a>
</header>
<script src="<?= BASE_URL . 'public/assets/js/header.js' ?>"></script>