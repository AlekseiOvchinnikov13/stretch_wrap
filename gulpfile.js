const gulp = require('gulp'),
    rename = require("gulp-rename"),
    babel = require('gulp-babel'),
    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    browserSync = require('browser-sync').create();

const scssDir = './src/scss/**/*.scss';
const cssDir = './src/css/**/*.css';
const jsDir = './src/js/**/*.js';
const htmlDir = './**/*.html';
const imgDir = 'src/img/*';

//Очистка
function clean() {
    return del(['build/*'])
}

//Компиляция из SCSS в CSS
function sassCompile() {
    return gulp.src(scssDir)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./src/css'))
}

//Сборка всех CSS в один файл
function styles() {
    return gulp.src([
        'node_modules/bootstrap/dist/css/bootstrap-reboot.css',
        'node_modules/animate.css/animate.css',
        cssDir
    ])
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 12 versions']
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());
}

//Обработка index.js
function indexScriptProd() {
    return gulp.src(jsDir)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());
}

//Обработка index.js
function indexScriptDev() {
    return gulp.src(jsDir)
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());
}

//Сборка всех JS в один файл
function scriptsProd() {
    return gulp.src([
        './build/index.js'
    ])
        .pipe(concat('index.js'))
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());
}

//Сборка всех JS в один файл
function scriptsDev() {
    return gulp.src([
        './build/index.js'
    ])
        .pipe(concat('index.js'))
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());
}

//Оптимизация картинок
function images() {
    return gulp.src('src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('img'));
}

//Перемещение картинок
function imagesDev() {
    return gulp.src('src/img/*')
        .pipe(gulp.dest('img'))
        .pipe(browserSync.stream());
}

//Просмотр изменений
function watching() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch(scssDir, sassCompile)
    gulp.watch(cssDir, styles)
    gulp.watch(jsDir, gulp.series(indexScriptDev, scriptsDev))
    gulp.watch(imgDir, imagesDev)
    gulp.watch(htmlDir).on('change', browserSync.reload)
}

gulp.task('build', gulp.series(clean, images, sassCompile, gulp.parallel(styles, gulp.series(indexScriptProd, scriptsProd))));
gulp.task('default', gulp.series(gulp.series(clean, imagesDev, sassCompile, gulp.parallel(styles, gulp.series(indexScriptDev, scriptsDev))), watching));
