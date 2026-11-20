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
