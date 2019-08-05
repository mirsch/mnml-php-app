<?php

$navigation = [
    'home' => [
        'path' => '/',
        'title' => 'Dashboard',
    ],
    'hello' => [
        'path' => '/hello/',
        'title' => 'Hello',
        'childs' => [
            'world' => [
                'path' => '/hello/world',
                'title' => 'hello World!',
            ],
        ],
    ],
];

function makeMenu(array $menu) : string
{
    $currentUrl = $_SERVER['REQUEST_URI'];
    $content = '';
    foreach ($menu as $item) {
        $childs = '';
        if (! empty($item['childs'])) {
            $childs = makeMenu($item['childs']);
        }
        $active = false;
        if (strpos($childs, 'class="is-active"') !== false) {
            $active = true;
        } elseif (substr_count($item['path'], '/') >= 2 && preg_match('/^' . preg_quote($item['path'], '/') . '/', $currentUrl)) {
            $active = true;
        }
        $content .= '<li><a href="' . $item['path'] . '" ' . ($active ? ' class="is-active"' : '') . '>' . $item['title'] . '</a>';
        if ($childs) {
            $content .= '<ul>' . $childs . '</ul>';
        }
        $content .= '</li>';
    }

    return $content;
}

echo makeMenu($navigation);
