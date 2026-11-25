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
$router->get('productos', ['InventarioController', 'apiObtenerProductos']);
$router->get('distribuidoras', ['InventarioController', 'apiObtenerDistribuidoras']);

//Rutas para el módulo de Medicamento
$router->get('medicamentos', ['MedicamentosController', 'index']);

//Rutas para el módulo de configuraciones
$router->get('configuraciones', ['ConfiguracionesController', 'index']);
$router->get('configuraciones/horario', ['ConfiguracionesController', 'horario']);
$router->get('configuraciones/medicamentos', ['ConfiguracionesController', 'medicamentos']);
$router->get('configuraciones/inventario', ['ConfiguracionesController', 'inventario']);

//Inventario: Crear un producto
$router->post('producto/crear', ['InventarioController', 'apiCrearProducto']);

//Inventario: Actualizar un producto
$router->post('productos/actualizar', ['InventarioController', 'apiActualizarProducto']);

//Inventario: Ajustar el stock actual de un producto
$router->post('productos/actualizar-stock', ['InventarioController', 'apiActualizarStock']);

//Inventario: Eliminar un producto
$router->post('productos/eliminar', ['InventarioController', 'apiEliminarProducto']);

//Configuraciones: Crear una categoría
$router->post('categoria/crear', ['InventarioController', 'apiCrearCategoria']);

//Configuraciones: Crear una colaboradora
$router->post('colaboradora/crear', ['ColaboradorasController', 'apiCrearColaboradora']);

//Configuraciones: Actualizar una colaboradora
$router->post('colaboradoras/actualizar', ['ColaboradorasController', 'apiActualizarColaboradora']);

//Configuraciones: Actualizar una categoría
$router->post('categorias/actualizar', ['InventarioController', 'apiActualizarCategoria']);

//Configuraciones: eliminar una categoría
$router->post('categorias/eliminar', ['InventarioController', 'apiEliminarCategoria']);

//Configuraciones: eliminar una colaboradora
$router->post('colaboradoras/eliminar', ['ColaboradorasController', 'apiEliminarColaboradora']);

//Ruta de prueba para obtener colaboradoras
$router->get('colaboradoras', ['ColaboradorasController', 'apiColaboradoras']);

//Rutas de errores
$router->get('error/404', ['ErrorController', 'error404']);

return $router;
