<?php

class ConfiguracionesController
{

    //Ruta principal: muestra por defecto la configuración de horario
    public function index()
    {
        view('configuraciones/configuraciones-horario');
    }

    public function horario()
    {
        view('configuraciones/configuraciones-horario');
    }

    public function medicamentos()
    {
        view('configuraciones/configuraciones-medicamentos');
    }

    public function inventario()
    {
        view('configuraciones/configuraciones-inventario');
    }
}
