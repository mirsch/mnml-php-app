'use strict';

// Load plugins
const {series, parallel, dest, src, watch} = require('gulp');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminZopfli = require('imagemin-zopfli');
const imageminGiflossy = require('imagemin-giflossy');

const terser = require('gulp-terser');
const cssnano = require('gulp-cssnano');

const del = require('del');

const master = {
    distDir: 'public/assets/',
    assetsDir: 'assets/',

    jsFiles: 'assets/js/**/*.js',
    jsPattern: '**/*.js',
    jsDistDir: 'public/assets/js/',

    cssFiles: 'assets/css/**/*.{css,scss}',
    cssPattern: '**/*.{css}',
    cssDistDir: 'public/assets/css/',

    imageFiles: 'assets/images/**/*.{png,jpg,gif,svg}',
    imagePattern: '**/*.{png,jpg,gif,svg}',
    imagesDistDir: 'public/assets/images/',

    iconFiles: 'assets/icons/**/*.{svg}',
    iconPattern: '**/*.{svg}',
    iconsDistDir: 'public/assets/icons/',

};

const config = {

    /* parameters for image optimization */
    imagemin: [
        imageminMozjpeg({
            //quality: 85
        }),
        imageminPngquant({
            speed: 3,
            quality: [0.95, 1], //lossy settings
        }),
        imageminZopfli({
            more: true,
            // iterations: 50 // very slow but more effective
        }),
        //gif
        // imagemin.gifsicle({
        //     interlaced: true,
        //     optimizationLevel: 3
        // }),
        //gif very light lossy, use only one of gifsicle or Giflossy
        imageminGiflossy({
            optimizationLevel: 3,
            optimize: 3, //keep-empty: Preserve empty transparent frames
            lossy: 2,
        }),
        imagemin.svgo({
            js2svg: {
                pretty: true,
            },
            plugins: [
                {
                    removeViewBox: false,
                    collapseGroups: true,
                    removeUselessStrokeAndFill: false,
                },
            ],
        }),
    ],
};

/* CSS Tasks
-------------------------------------------------------------------- */
function copyCSSLibraries () {
    let libs = require('./' + master.assetsDir + 'libraries.json');
    if (!libs.css.length) {
        return Promise.resolve('No CSS libraries to copy.');
    }
    return src(libs.css, { base: './node_modules/' }).
        pipe(dest(master.distDir + 'lib/css/'));
}

function copyCSS () {
    return src(master.cssFiles).
        pipe(newer(master.cssDistDir)).
        pipe(sass()).
        pipe(dest(master.cssDistDir));
}

function minifyCSS () {
    return src(master.cssDistDir + master.cssPattern).
        pipe(newer(master.cssDistDir)).
        pipe(sourcemaps()).
        pipe(cssnano()).
        pipe(dest(master.cssDistDir));
}

/* Image Tasks
-------------------------------------------------------------------- */
function copyImages () {
    return src(master.imageFiles).
        pipe(newer(master.imagesDistDir)).
        pipe(dest(master.imagesDistDir));
}

function copySprites () {
    return src(master.iconFiles).
        pipe(newer(master.iconsDistDir)).
        pipe(dest(master.iconsDistDir));
}

function optimizeImages () {
    return src(master.imageFiles).
        pipe(newer(master.imagesDistDir)).
        pipe(imagemin(config.imagemin, {verbose: true})).
        pipe(dest(master.imagesDistDir));
}

function optimizeIcons () {
    return src(master.iconFiles).
        pipe(newer(master.iconsDistDir)).
        pipe(imagemin(config.imagemin, {verbose: true})).
        pipe(dest(master.iconsDistDir));
}

/* JavaScript Tasks
-------------------------------------------------------------------- */
function copyJavascripts () {
    return src(master.jsFiles).
        pipe(newer(master.distDir)).
        pipe(dest(master.distDir));
}

function copyJavascriptLibraries () {
    let libs = require('./' + master.assetsDir + 'libraries.json');
    if (!libs.js.length) {
        return Promise.resolve('No JS libraries to copy.');
    }
    return src(libs.js, { base: './node_modules/' }).
        pipe(dest(master.distDir + 'lib/js/'));
}

function minifyJavascripts () {
    return src(master.jsDistDir + master.jsPattern).
        pipe(plumber()).
        pipe(terser()).
        pipe(dest(master.jsDistDir));
}


/* Watch
-------------------------------------------------------------------- */
function watchFiles () {
    watch(master.assetsDir + '**/*', series(exports.assets));
}

/* Utility Tasks
-------------------------------------------------------------------- */

// Clean assets
function clean () {
    return del([master.distDir + '/*']);
}

/* Export Tasks
-------------------------------------------------------------------- */
exports.clean = clean;

exports.watch = watchFiles;

exports.assets = parallel(
    copyJavascriptLibraries,
    copyJavascripts,
    copyCSSLibraries,
    copyCSS,
    copyImages,
    copySprites,
);

exports.minimize = parallel(
    optimizeImages,
    optimizeIcons,
    minifyCSS,
    minifyJavascripts,
);

exports.dev = series(
    clean,
    exports.assets,
    exports.watch,
);

exports.build = series(
    clean,
    exports.assets,
    exports.minimize,
);

exports.default = exports.dev;
