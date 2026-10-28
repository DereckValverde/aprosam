<?php


class Horario
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
}
