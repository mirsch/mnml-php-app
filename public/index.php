<?php

declare(strict_types=1);

define('TEMPLATES_DIR', __DIR__ . '/../templates/');

error_reporting(E_ALL);

$uri = $_SERVER['REQUEST_URI'] ?? null;

// protect directory traversal
if (strpos($uri, '..') !== false) {
    throw new InvalidArgumentException('Invalid Uri');
}

$template = TEMPLATES_DIR . 'home/home.php';
if ($uri && $uri !== '/') {
    $template = TEMPLATES_DIR . $uri . '.php';
    if (is_dir(TEMPLATES_DIR . $uri)) {
        $template = TEMPLATES_DIR . $uri . '/index.php';
    }
    if (! file_exists($template)) {
        http_response_code(404);
        throw new InvalidArgumentException('Not found.');
    }
}

function protectedIncludeScope(string $template, array $data)
{
    require_once __DIR__ . '/../includes/template_functions.php';
    extract($data);
    include func_get_arg(0);
}

try {
    ob_start();
    protectedIncludeScope($template, []);
    $content = ob_get_clean();

    ob_start();
    $data['content'] = $content;
    protectedIncludeScope($GLOBALS['APP_LAYOUT'], $data);
    $output = ob_get_clean();
} catch (Throwable $e) {
    ob_end_clean();
    throw $e;
}
echo $output;
