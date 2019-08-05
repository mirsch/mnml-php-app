<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/assets/css/main.css">
    <link rel="stylesheet" href="/assets/lib/css/@fortawesome/fontawesome-free/css/all.min.css">
    <?php
    foreach (getCSS() as $cssFile) {
        echo '<link rel="stylesheet" href="' . $cssFile . '">';
    }
    ?>
</head>

<body>
<div class="columns is-fullheight">
    <div class="column is-2 is-sidebar-menu is-hidden-mobile">
        <aside class="menu">
            <p class="menu-label">
                Navigation
            </p>
            <ul class="menu-list">
                <?php include "partials/navigation.php"; ?>
            </ul>
        </aside>
    </div>
    <div class="column is-main-content" id="main_content">
        <?php echo $content; ?>
    </div>
</div>
</body>
<?php
foreach (getJS() as $jsFile) {
    echo '<script type="module" src="' . $jsFile . '"></script>';
}
?>
</html>
