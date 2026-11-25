<?php

$scriptName = str_replace('\\', '/', $_SERVER['SCRIPT_NAME'] ?? '/index.php');
$basePath = rtrim(preg_replace('#/index\.php.*$#', '', $scriptName), '/');

define('BASE_URL', $basePath . '/');
define('APP_PATH', dirname(__DIR__) . '/');
define('PUBLIC_PATH', dirname(__DIR__) . '/public/');
define('VIEW_PATH', APP_PATH . 'views/');
define('LAYOUT_PATH', VIEW_PATH . 'layouts/');

$dbPath = APP_PATH . 'database/database.db';
$dbDemoPath = APP_PATH . 'database/database.demo.db';

// Si alguien clona el proyecto y aún no tiene BD local, se crea desde la demo anónima.
if (!file_exists($dbPath) && file_exists($dbDemoPath)) {
    @copy($dbDemoPath, $dbPath);
}

define('DB_PATH', file_exists($dbPath) ? $dbPath : $dbDemoPath);
