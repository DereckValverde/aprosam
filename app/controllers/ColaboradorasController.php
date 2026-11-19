<?php

class ColaboradorasController
{

    private $colaboradoraModel;


    public function __construct()
    {

        $this->colaboradoraModel = model('Colaboradora');
    }

    public function apiColaboradoras()
    {
        header('Content-Type: application/json');
        $colaboradoras = $this->colaboradoraModel->getColaboradoras();

        if ($colaboradoras) {
            echo json_encode([
                'success' => true,
                'data' => $colaboradoras
            ]);
        }
    }

    public function apiCrearColaboradora()
    {
        header('Content-Type: application/json');

        $datos = json_decode(file_get_contents('php://input'), true);

        if (!is_array($datos)) {
            $datos = $_POST;
        }

        //Validar datos recibidos
        if (
            empty(trim($datos['nombre'] ?? ''))
        ) {
            http_response_code(400);

            echo json_encode([
                'success' => false,
                'message' => 'El nombre es obligatorio.'
            ]);

            return;
        }

        $colaboradoraCreada = $this->colaboradoraModel->crearColaboradora($datos);

        if ($colaboradoraCreada) {
            echo json_encode([
                'success' => true,
                'message' => 'Persona creada correctamente.'
            ]);
        } else {
            http_response_code(500);

            echo json_encode([
                'success' => false,
                'message' => 'Error al crear la persona.'
            ]);
        }
    }

    public function apiActualizarColaboradora($idColaboradora)
    {
        header('Content-Type: application/json');

        $datos = json_decode(file_get_contents('php://input'), true);

        if (!is_array($datos)) {
            $datos = $_POST;
        }

        //Validar datos recibidos
        if (
            empty(trim($datos['nombre'] ?? '')) ||
            empty(trim($datos['apellido1'] ?? ''))
        ) {
            http_response_code(400);

            echo json_encode([
                'success' => false,
                'message' => 'El nombre y el apellido son obligatorios.'
            ]);

            return;
        }

        $actualizada = $this->colaboradoraModel->actualizarPorId(
            $idColaboradora,
            $datos
        );

        if ($actualizada) {
            echo json_encode([
                'success' => true,
                'message' => 'Persona actualizada correctamente.'
            ]);
        } else {
            http_response_code(500);

            echo json_encode([
                'success' => false,
                'message' => 'Error al actualizar la persona.'
            ]);
        }
    }

    public function apiEliminarColaboradora($idColaboradora)
    {
        header('Content-Type: application/json');

        $respuesta = $this->colaboradoraModel->eliminarColaboradora($idColaboradora);

        if ($respuesta) {
            echo json_encode([
                'success' => true,
                'message' => 'Persona eliminada correctamente.'
            ]);
        } else {
            http_response_code(500);

            echo json_encode([
                'success' => false,
                'message' => 'Error al eliminar la persona.'
            ]);
        }
    }
}
