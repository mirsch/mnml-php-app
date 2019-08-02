<?php

declare(strict_types=1);

$GLOBALS['APP_LAYOUT'] =  TEMPLATES_DIR . 'layout/main.php';
function useLayout(string $layout)
{
    $GLOBALS['APP_LAYOUT'] = TEMPLATES_DIR . $layout;
    if (! file_exists($GLOBALS['APP_LAYOUT'])) {
        throw new InvalidArgumentException(sprintf('Layout %s not found.', $layout));
    }
}

$GLOBALS['APP_JS'] = [];
/**
 * @param string|array $fileName
 */
function requireJS($fileName) : void
{
    if (is_string($fileName)) {
        $fileName = [$fileName];
    }
    foreach ($fileName as $file) {
        if (! in_array($file, $GLOBALS['APP_JS'])) {
            $GLOBALS['APP_JS'][] = $file;
        }
    }
}

function getJS() : array
{
    return $GLOBALS['APP_JS'];
}

$GLOBALS['APP_CSS'] = [];
/**
 * @param string|array $fileName
 */
function requireCSS($fileName)
{
    if (is_string($fileName)) {
        $fileName = [$fileName];
    }
    foreach ($fileName as $file) {
        if (! in_array($file, $GLOBALS['APP_CSS'])) {
            $GLOBALS['APP_CSS'][] = $file;
        }
    }
}

function getCSS() : array
{
    return $GLOBALS['APP_CSS'];
}
