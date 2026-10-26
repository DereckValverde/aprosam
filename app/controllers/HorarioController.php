<?php

class HorarioController
{

    private $horarioModel;


    public function __construct()
    {
        $this->horarioModel = model('Horario');
    }




    public function apiColaboradoras()
    {
        header('Content-Type: application/json');
        $colaboradoras = $this->horarioModel->getColaboradoras();

        if ($colaboradoras) {
            echo json_encode([
                'success' => true,
                'data' => $colaboradoras
            ]);
        }
    }



    //Ruta que va a la vista de "horario"
    public function index()
    {
        view('horario/horario');
    }
}
