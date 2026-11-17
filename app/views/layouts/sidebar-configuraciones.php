<?php $seccionConfiguracion = $seccionConfiguracion ?? ''; ?>

<aside class="sidebar">

    <div class="sidebar-brand">
        <span class="sidebar-brand-icon">
            <i class="bi bi-gear"></i>
        </span>
        <div class="sidebar-brand-text">
            <p class="sidebar-title">Configuraciones del sistema</p>
            <p class="sidebar-subtitle">Ajustes generales</p>
        </div>
    </div>

    <nav aria-label="Secciones de configuración">
        <ul class="sidebar-menu">
            <li>
                <a<?= $seccionConfiguracion === 'horario' ? ' class="active" aria-current="page"' : '' ?> href="<?= BASE_URL . 'configuraciones/horario' ?>">
                    <i class="bi bi-calendar3"></i>Horario
                </a>
            </li>
            <li>
                <a<?= $seccionConfiguracion === 'medicamentos' ? ' class="active" aria-current="page"' : '' ?> href="<?= BASE_URL . 'configuraciones/medicamentos' ?>">
                    <i class="bi bi-capsule"></i>Medicamentos
                </a>
            </li>
            <li>
                <a<?= $seccionConfiguracion === 'inventario' ? ' class="active" aria-current="page"' : '' ?> href="<?= BASE_URL . 'configuraciones/inventario' ?>">
                    <i class="bi bi-box-seam"></i>Inventario
                </a>
            </li>
        </ul>
    </nav>

</aside>
