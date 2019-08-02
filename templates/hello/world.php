<?php
useLayout('layout/test.php');

requireCSS([
    'a.css',
    'b.css'
]);
requireJS('a.js');
?>

<h2>Hello World</h2>

<?php include('partials/a_partial.php'); ?>
