"use strict";

const { src, dest } = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require('gulp-strip-css-comments');
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const panini = require("panini");
const del = require("del");
const notify = require("gulp-notify");
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const browserSync = require("browser-sync").create();
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const ttfToWoff = require("gulp-ttf-to-woff");
const svgSprite = require('gulp-svg-sprite');
const webp = require('gulp-webp');
const avif = require('gulp-avif');
const newer = require('gulp-newer');
// const newer = require("gulp-newer");

/* Paths */
const srcPath = 'src/';
const distPath = 'dist/';

const path = {
    build: {
        html: distPath,
        js: distPath + "assets/js/",
        css: distPath + "assets/css/",
        images: distPath + "assets/images/",
        fonts: distPath + "assets/fonts/"
    },
    src: {
        html: srcPath + "*.html",
        js: srcPath + "assets/js/*.js",
        css: srcPath + "assets/scss/*.scss",
        images: srcPath + "assets/images/**/*.{jpg,png,gif,ico,webp,webmanifest,xml,json,svg}",
        imagesnosvg: srcPath + ['assets/images/**/*.{jpg,png,gif,ico,webp,webmanifest,xml,json,svg}', "!assets/images/**/!(svg)"],
        imagessvg: srcPath + "assets/images/**/*.svg",
        fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}"
    },
    watch: {
        html: srcPath + "**/*.html",
        js: srcPath + "assets/js/**/*.js",
        css: srcPath + "assets/scss/**/*.scss",
        images: srcPath + "assets/images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json,svg}",
        imagessvg: distPath + "assets/images/**/*.svg",
        imagesnosvg: srcPath + ['assets/images/**/*.{jpg,png,gif,ico,webp,webmanifest,xml,json,svg}', "!assets/images/**/!(svg)"],
        fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}"
    },
    clean: "./" + distPath
}


/* Tasks */


function serve() {
    browserSync.init({
        server: {
            baseDir: "./" + distPath
        }
    });
}

function html(cb) {
    panini.refresh();
    return src(path.src.html, { base: srcPath })
        .pipe(plumber())
        .pipe(panini({
            root: srcPath,
            layouts: srcPath + 'layouts/',
            partials: srcPath + 'partials/',
            helpers: srcPath + 'helpers/',
            data: srcPath + 'data/'
        }))
        .pipe(dest(path.build.html))
        .pipe(browserSync.reload({ stream: true }));

    cb();
}

function css(cb) {
    return src(path.src.css, { base: srcPath + "assets/scss/" })
        .pipe(plumber({
            errorHandler: function (err) {
                notify.onError({
                    title: "SCSS Error",
                    message: "Error: <%= error.message %>"
                })(err);
                this.emit('end');
            }
        }))
        .pipe(sass({
            includePaths: './node_modules/'
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: true
        }))
        // .pipe(cssbeautify())
        // .pipe(dest(path.build.css))
        .pipe(cssnano({
            zindex: false,
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(removeComments())
        .pipe(dest(path.build.css))
        .pipe(browserSync.reload({ stream: true }));

    cb();
}

function cssWatch(cb) {
    return src(path.src.css, { base: srcPath + "assets/scss/" })
        .pipe(plumber({
            errorHandler: function (err) {
                notify.onError({
                    title: "SCSS Error",
                    message: "Error: <%= error.message %>"
                })(err);
                this.emit('end');
            }
        }))
        .pipe(sass({
            includePaths: './node_modules/'
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: true
        }))
        .pipe(cssnano({
            zindex: false,
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(removeComments())
        .pipe(dest(path.build.css))
        .pipe(browserSync.reload({ stream: true }));

    cb();
}

function js(cb) {
    return src(path.src.js, { base: srcPath + 'assets/js/' })
        .pipe(plumber({
            errorHandler: function (err) {
                notify.onError({
                    title: "JS Error",
                    message: "Error: <%= error.message %>"
                })(err);
                this.emit('end');
            }
        }))
        //.pipe(webpack(require('./webpack.config.js')))
        .pipe(webpackStream({
            mode: "production",
            entry: {
                app: './src/assets/js/app.js',
                // main: './src/assets/js/main.js',
                 //knowledge: './src/assets/js/knowledge.js',
                 //single: './src/assets/js/single.js',
                 //servers: './src/assets/js/servers.js',
                 //hosting: './src/assets/js/hosting.js',
                 //about: './src/assets/js/about.js',
                 //reselling: './src/assets/js/reselling.js',
                 //modal: './src/assets/js/modal.js',
            },
            output: {
                filename: '[name].js',
            },
        }))
        .pipe(uglify())
        // .pipe(rename({
        //     suffix: ".min",
        //     extname: ".js"
        // }))
        .pipe(dest(path.build.js))
        .pipe(browserSync.reload({ stream: true }));



    cb();
}

function jsWatch(cb) {
    return src(path.src.js, { base: srcPath + 'assets/js/' })
        .pipe(plumber({
            errorHandler: function (err) {
                notify.onError({
                    title: "JS Error",
                    message: "Error: <%= error.message %>"
                })(err);
                this.emit('end');
            }
        }))
        //.pipe(webpack(require('./webpack.config.js')))
        .pipe(webpackStream({
            mode: "production",
            entry: {
                app: './src/assets/js/app.js',
                 //main: './src/assets/js/main.js',
                 //knowledge: './src/assets/js/knowledge.js',
                 //single: './src/assets/js/single.js',
                 //servers: './src/assets/js/servers.js',
                 //hosting: './src/assets/js/hosting.js',
                 //about: './src/assets/js/about.js',
                 //reselling: './src/assets/js/reselling.js',
                 //modal: './src/assets/js/modal.js',
            },
            output: {
                filename: '[name].js',
            },
        }))
        .pipe(uglify())
        .pipe(dest(path.build.js))
        .pipe(browserSync.reload({ stream: true }));

    cb();
}

function images(cb) {
    return src(path.src.imagesnosvg)
        .pipe(newer(path.build.images))
        .pipe(avif({ quality: 90 }))
        
        .pipe(src(path.src.images))
        .pipe(newer(path.build.images))
        .pipe(webp())
        
        .pipe(src(path.src.images))
        .pipe(newer(path.build.images))
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 1,
            svgoPlugins: [
                {
                    removeViewBox: true
                }
            ]
        }))
        .pipe(dest(path.build.images))
        .pipe(browserSync.reload({ stream: true }));

    cb();
}

function sprite(cb){
    return src(path.src.imagessvg)
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: '../sprite.svg',
                    example: true
                }
            }
        }))
        .pipe(dest(path.build.images))

    cb()
}

function fonts(cb) {
    return src(path.src.fonts)
        .pipe(ttfToWoff())
        .pipe(dest(path.build.fonts))
        .pipe(browserSync.reload({ stream: true }));

    cb();
}



function clean(cb) {
    return del(path.clean);

    cb();
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], cssWatch);
    gulp.watch([path.watch.js], jsWatch);
    gulp.watch([path.watch.images], images);
    gulp.watch([path.watch.fonts], fonts);
    gulp.watch([path.watch.images], sprite);
}

const build = gulp.series(clean, gulp.parallel(html, css, js, images, fonts ,  sprite));
const watch = gulp.parallel(build, watchFiles, serve);



/* Exports Tasks */
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;
exports.sprite = sprite;
