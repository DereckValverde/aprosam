<?php

//Método para cargar vistas
function view(string $viewPath)
{

    $file = VIEW_PATH . '/' . $viewPath . '.php';

    if (file_exists($file)) {

        require_once $file;
    } else {
        die("La vista '{$viewPath}' no existe.");
    }
}

function model($model)
{
    require_once __DIR__ . '/../models/' . $model . '.php';

    return new $model();
}
