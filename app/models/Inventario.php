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
        $query = "SELECT * FROM Categorias
        ORDER BY nombre_categoria ASC";

        $stmt = $this->db->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function crearCategoria($datos)
    {
        $query = "INSERT INTO Categorias (nombre_categoria)
        VALUES
        (:nombre)";

        $stmt = $this->db->prepare($query);

        return $stmt->execute([
            ':nombre' => trim($datos['nombre'])
        ]);
    }

    public function actualizarCategoria($idCategoria, $datos)
    {
        $query = "UPDATE Categorias
              SET nombre_categoria = :nombre
              WHERE idCategoria = :id";

        $stmt = $this->db->prepare($query);

        return $stmt->execute([
            ':nombre' => trim($datos['nombre']),
            ':id' => $idCategoria
        ]);
    }

    public function eliminarCategoria($idCategoria)
    {
        $query = "DELETE FROM Categorias
        WHERE idCategoria = :id";

        try {
            $stmt = $this->db->prepare($query);

            return $stmt->execute([
                ':id' => $idCategoria
            ]);
        } catch (PDOException $error) {
            return false;
        }
    }
}
