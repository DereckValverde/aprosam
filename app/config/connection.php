<?php

$directorio_db = dirname(__DIR__) . '/database';
$ruta_db = $directorio_db . '/database.db';

try {

    if (!is_dir($directorio_db)) {
        mkdir($directorio_db, 0777, true);
    }

    $conexion = new PDO("sqlite:" . $ruta_db);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conexion->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Activar soporte para foreign keys en SQLite
    $conexion->exec("PRAGMA foreign_keys = ON;");
} catch (PDOException $error) {
    die("Error al conectar: " . $error->getMessage());
}
