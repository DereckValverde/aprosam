<?php

class Colaboradora
{

    private $db;


    public function __construct()
    {
        require_once dirname(__DIR__) . '/config/connection.php';
        $this->db = Database::getInstance()->getConnection();
    }

    public function getColaboradoras()
    {
        $query = "
        SELECT * FROM Colaboradoras
        ";

        $stmt = $this->db->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function actualizarPorId($idColaboradora, $datos)
    {
        $query = "UPDATE colaboradoras
              SET nombre = :nombre,
                  apellido1 = :apellido1
              WHERE idColaboradora = :id";

        $stmt = $this->db->prepare($query);

        return $stmt->execute([
            ':nombre' => trim($datos['nombre']),
            ':apellido1' => trim($datos['apellido1']),
            ':id' => $idColaboradora
        ]);
    }
}
