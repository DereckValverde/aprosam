<?php

class Inventario
{
    private $db;


    public function __construct()
    {
        require_once dirname(__DIR__) . '/config/connection.php';
        $this->db = Database::getInstance()->getConnection();
    }

    public function obtenerCategorias()
    {
        $query = "SELECT * FROM Categorias";

        $stmt = $this->db->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
