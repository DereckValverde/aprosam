<?php
// app/core/Router.php

class Router
{
    private array $routes = [];

    public function get(string $url, array $handler): void
    {
        $this->addRoute('GET', $url, $handler);
    }

    public function post(string $url, array $handler)
    {
        $this->addRoute('POST', $url, $handler);
    }

    private function addRoute(string $method, string $url, array $handler): void
    {
        $url = trim($url, '/');
        $this->routes[$method][$url] = $handler;
    }

    public function dispatch(string $url, string $method): void
    {
        $url = trim($url, '/');
        $segments = $url !== '' ? explode('/', $url) : [];

        $routeKey = '';
        $params = [];

        for ($i = count($segments); $i >= 0; $i--) {
            $tempRoute = implode('/', array_slice($segments, 0, $i));
            if (isset($this->routes[$method][$tempRoute])) {
                $routeKey = $tempRoute;
                $params = array_slice($segments, $i);
                break;
            }
        }

        if (($routeKey !== '' || $url === '') && isset($this->routes[$method][$routeKey])) {
            [$controllerClass, $methodName] = $this->routes[$method][$routeKey];

            $controllerFile = APP_PATH . '/controllers/' . $controllerClass . '.php';

            if (file_exists($controllerFile)) {
                require_once $controllerFile;

                $controller = new $controllerClass();

                if (method_exists($controller, $methodName)) {
                    call_user_func_array([$controller, $methodName], $params);
                    return;
                }
            }
        }

        http_response_code(404);
        header('Location: ' . BASE_URL . 'error/404');
    }
}
