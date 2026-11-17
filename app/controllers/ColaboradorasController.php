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
}
