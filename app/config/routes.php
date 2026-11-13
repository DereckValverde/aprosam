<?php
//app/config/routes.php

$router = new Router();

//Ruta principal
$router->get('', ['HorarioController', 'index']);

//Rutas para el módulo de Horario
$router->get('horario', ['HorarioController', 'index']);

//Rutas para el módulo de Inventario
$router->get('inventario', ['InventarioController', 'index']);
$router->get('categorias', ['InventarioController', 'apiObtenerCategorias']);

//Rutas para el módulo de Medicamento
$router->get('medicamentos', ['MedicamentosController', 'index']);

//Rutas para el módulo de configuraciones
$router->get('configuraciones', ['ConfiguracionesController', 'index']);

//Ruta de prueba para obtener colaboradoras
$router->get('colaboradoras', ['HorarioController', 'apiColaboradoras']);

//Rutas de errores
$router->get('error/404', ['ErrorController', 'error404']);

return $router;
