<?php

require_once __DIR__ . '/app/config/config.php';
require_once __DIR__ . '/app/core/Router.php';

require_once __DIR__ . '/app/helpers/helpers.php';

$router = require_once __DIR__ . '/app/config/routes.php';

$url = $_GET['url'] ?? '';

if ($url === '') {
    $pathInfo = $_SERVER['PATH_INFO'] ?? '';
    $url = $pathInfo !== ''
        ? $pathInfo
        : (parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/');
}

$url = trim($url, '/');
$method = $_SERVER['REQUEST_METHOD'];

$router->dispatch($url, $method);
