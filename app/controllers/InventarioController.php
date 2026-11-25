<?php

class InventarioController
{

    private $inventarioModel;

    public function __construct()
    {
        $this->inventarioModel = model('Inventario');
    }


    public function index()
    {
        view('inventario/inventario');
    }

    public function apiObtenerProductos()
    {
        header('Content-Type: application/json');

        $productos = $this->inventarioModel->obtenerProductos();

        echo json_encode([
            'success' => true,
            'data' => $productos
        ]);
    }

    public function apiObtenerDistribuidoras()
    {
        header('Content-Type: application/json');

        $distribuidoras = $this->inventarioModel->obtenerDistribuidoras();

        echo json_encode([
            'success' => true,
            'data' => $distribuidoras
        ]);
    }

    public function apiCrearProducto()
    {
        header('Content-Type: application/json');

        $datos = $this->leerDatosProducto();
        $producto = $this->validarDatosProducto($datos);

        if (!$producto) {
            http_response_code(400);

            echo json_encode([
                'success' => false,
                'message' => 'Verifique los datos del producto.'
            ]);

            return;
        }

        if ($this->inventarioModel->crearProducto($producto)) {
            echo json_encode([
                'success' => true,
                'message' => 'Producto creado correctamente.'
            ]);
        } else {
            http_response_code(500);

            echo json_encode([
                'success' => false,
                'message' => 'Error al crear el producto.'
            ]);
        }
    }

    public function apiActualizarProducto($idProducto)
    {
        header('Content-Type: application/json');

        $datos = $this->leerDatosProducto();
        $producto = $this->validarDatosProducto($datos);

        if (!$producto) {
            http_response_code(400);

            echo json_encode([
                'success' => false,
                'message' => 'Verifique los datos del producto.'
            ]);

            return;
        }

        if ($this->inventarioModel->actualizarProducto($idProducto, $producto)) {
            echo json_encode([
                'success' => true,
                'message' => 'Producto actualizado correctamente.'
            ]);
        } else {
            http_response_code(500);

            echo json_encode([
                'success' => false,
                'message' => 'Error al actualizar el producto.'
            ]);
        }
    }

    public function apiActualizarStock($idProducto)
    {
        header('Content-Type: application/json');

        $datos = json_decode(file_get_contents('php://input'), true);
        $delta = filter_var($datos['delta'] ?? null, FILTER_VALIDATE_INT);

        if ($delta === false || $delta === 0) {
            http_response_code(400);

            echo json_encode([
                'success' => false,
                'message' => 'El ajuste de stock no es válido.'
            ]);

            return;
        }

        $stockActual = $this->inventarioModel->ajustarStock($idProducto, $delta);

        if ($stockActual === null) {
            http_response_code(500);

            echo json_encode([
                'success' => false,
                'message' => 'Error al ajustar el stock actual.'
            ]);

            return;
        }

        echo json_encode([
            'success' => true,
            'stock_actual' => $stockActual
        ]);
    }

    public function apiEliminarProducto($idProducto)
    {
        header('Content-Type: application/json');

        if ($this->inventarioModel->eliminarProducto($idProducto)) {
            echo json_encode([
                'success' => true,
                'message' => 'Producto eliminado correctamente.'
            ]);
        } else {
            http_response_code(500);

            echo json_encode([
                'success' => false,
                'message' => 'Error al eliminar el producto.'
            ]);
        }
    }

    private function leerDatosProducto()
    {
        $datos = json_decode(file_get_contents('php://input'), true);

        return is_array($datos) ? $datos : $_POST;
    }

    private function validarDatosProducto($datos)
    {
        $nombre = trim($datos['nombre'] ?? '');
        $stockIdeal = filter_var(
            $datos['stockIdeal'] ?? null,
            FILTER_VALIDATE_INT,
            ['options' => ['min_range' => 0]]
        );
        $idCategoria = filter_var(
            $datos['idCategoria'] ?? null,
            FILTER_VALIDATE_INT,
            ['options' => ['min_range' => 1]]
        );
        $idDistribuidora = filter_var(
            $datos['idDistribuidora'] ?? null,
            FILTER_VALIDATE_INT,
            ['options' => ['min_range' => 1]]
        );

        if (
            $nombre === '' ||
            $stockIdeal === false ||
            $idCategoria === false ||
            $idDistribuidora === false
        ) {
            return null;
        }

        return [
            'nombre' => $nombre,
            'stockIdeal' => $stockIdeal,
            'idCategoria' => $idCategoria,
            'idDistribuidora' => $idDistribuidora
        ];
    }

    public function apiObtenerCategorias()
    {
        header('Content-Type: application/json');

        $categorias = $this->inventarioModel->obtenerCategorias();

        if ($categorias) {
            echo json_encode([
                'success' => true,
                'data' => $categorias
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Categorias no encontradas'
            ]);
        }
    }

    public function apiCrearCategoria()
    {
        header('Content-Type: application/json');

        $datos = json_decode(file_get_contents('php://input'), true);

        if (!is_array($datos)) {
            $datos = $_POST;
        }

        if (empty(trim($datos['nombre'] ?? ''))) {
            http_response_code(400);

            echo json_encode([
                'success' => false,
                'message' => 'El nombre es obligatorio.'
            ]);

            return;
        }

        $categoriaCreada = $this->inventarioModel->crearCategoria($datos);

        if ($categoriaCreada) {
            echo json_encode([
                'success' => true,
                'message' => 'Categoría creada correctamente.'
            ]);
        } else {
            http_response_code(500);

            echo json_encode([
                'success' => false,
                'message' => 'Error al crear la categoría.'
            ]);
        }
    }

    public function apiActualizarCategoria($idCategoria)
    {
        header('Content-Type: application/json');

        $datos = json_decode(file_get_contents('php://input'), true);

        if (!is_array($datos)) {
            $datos = $_POST;
        }

        if (empty(trim($datos['nombre'] ?? ''))) {
            http_response_code(400);

            echo json_encode([
                'success' => false,
                'message' => 'El nombre es obligatorio.'
            ]);

            return;
        }

        $actualizada = $this->inventarioModel->actualizarCategoria(
            $idCategoria,
            $datos
        );

        if ($actualizada) {
            echo json_encode([
                'success' => true,
                'message' => 'Categoría actualizada correctamente.'
            ]);
        } else {
            http_response_code(500);

            echo json_encode([
                'success' => false,
                'message' => 'Error al actualizar la categoría.'
            ]);
        }
    }

    public function apiEliminarCategoria($idCategoria)
    {
        header('Content-Type: application/json');

        $respuesta = $this->inventarioModel->eliminarCategoria($idCategoria);

        if ($respuesta) {
            echo json_encode([
                'success' => true,
                'message' => 'Categoría eliminada correctamente.'
            ]);
        } else {
            http_response_code(500);

            echo json_encode([
                'success' => false,
                'message' => 'Error al eliminar la categoría.'
            ]);
        }
    }
}
