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

    <div id="menu-header">
        <i class="bi bi-list"></i>
    </div>
</header>