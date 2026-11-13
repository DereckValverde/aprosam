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
}
