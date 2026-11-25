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

    public function obtenerProductos()
    {
        $query = "SELECT p.idProducto, p.nombre_producto, p.stock_actual, p.stock_ideal,
            p.idCategoria, p.idDistribuidora, c.nombre_categoria, d.nombre_distribuidora
            FROM Inventario p
            INNER JOIN Categorias c ON p.idCategoria = c.idCategoria
            INNER JOIN Distribuidora d ON p.idDistribuidora = d.idDistribuidora
            ORDER BY p.nombre_producto ASC";

        $stmt = $this->db->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerDistribuidoras()
    {
        $query = "SELECT * FROM Distribuidora
        ORDER BY nombre_distribuidora ASC";

        $stmt = $this->db->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function crearProducto($datos)
    {
        $query = "INSERT INTO Inventario (nombre_producto, stock_ideal, idCategoria, idDistribuidora)
        VALUES (:nombre, :stockIdeal, :idCategoria, :idDistribuidora)";

        try {
            $stmt = $this->db->prepare($query);

            return $stmt->execute([
                ':nombre' => trim($datos['nombre']),
                ':stockIdeal' => (int) $datos['stockIdeal'],
                ':idCategoria' => (int) $datos['idCategoria'],
                ':idDistribuidora' => (int) $datos['idDistribuidora']
            ]);
        } catch (PDOException $error) {
            return false;
        }
    }

    public function actualizarProducto($idProducto, $datos)
    {
        $query = "UPDATE Inventario
            SET nombre_producto = :nombre,
                stock_ideal = :stockIdeal,
                idCategoria = :idCategoria,
                idDistribuidora = :idDistribuidora
            WHERE idProducto = :id";

        try {
            $stmt = $this->db->prepare($query);

            return $stmt->execute([
                ':nombre' => trim($datos['nombre']),
                ':stockIdeal' => (int) $datos['stockIdeal'],
                ':idCategoria' => (int) $datos['idCategoria'],
                ':idDistribuidora' => (int) $datos['idDistribuidora'],
                ':id' => $idProducto
            ]);
        } catch (PDOException $error) {
            return false;
        }
    }

    public function ajustarStock($idProducto, $delta)
    {
        $query = "UPDATE Inventario
            SET stock_actual = MAX(0, stock_actual + :delta)
            WHERE idProducto = :id";

        try {
            $stmt = $this->db->prepare($query);
            $actualizado = $stmt->execute([
                ':delta' => $delta,
                ':id' => $idProducto
            ]);

            if (!$actualizado) {
                return null;
            }

            $consulta = $this->db->prepare(
                'SELECT stock_actual FROM Inventario WHERE idProducto = :id'
            );
            $consulta->execute([':id' => $idProducto]);

            $stock = $consulta->fetchColumn();

            return $stock === false ? null : (int) $stock;
        } catch (PDOException $error) {
            return null;
        }
    }

    public function eliminarProducto($idProducto)
    {
        $query = "DELETE FROM Inventario
        WHERE idProducto = :id";

        try {
            $stmt = $this->db->prepare($query);

            return $stmt->execute([
                ':id' => $idProducto
            ]);
        } catch (PDOException $error) {
            return false;
        }
    }
}
