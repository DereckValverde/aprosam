<?php

$scriptName = str_replace('\\', '/', $_SERVER['SCRIPT_NAME'] ?? '/index.php');
$basePath = rtrim(preg_replace('#/index\.php.*$#', '', $scriptName), '/');

define('BASE_URL', $basePath . '/');
define('APP_PATH', dirname(__DIR__) . '/');
define('PUBLIC_PATH', dirname(__DIR__) . '/public/');
define('VIEW_PATH', APP_PATH . 'views/');
define('LAYOUT_PATH', VIEW_PATH . 'layouts/');

define('DB_PATH', APP_PATH . 'database/database.db');
