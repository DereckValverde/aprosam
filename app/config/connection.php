<?php

require_once 'config.php';

class Database
{

    private static $instance = null;
    private $conn;

    private function __construct()
    {
        try {

            $this->conn = new PDO("sqlite:" . DB_PATH);

            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

            //Activar claves foráneas
            $this->conn->exec('PRAGMA foreign_keys = ON;');
        } catch (PDOException $error) {
            die("Error de conexión" . $error->getMessage());
        }
    }

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new Database();
        }

        return self::$instance;
    }

    public function getConnection()
    {
        return $this->conn;
    }

    private function __clone() {}
}
