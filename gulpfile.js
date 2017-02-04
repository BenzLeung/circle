/**
 * @file Gulp File
 * @author liangweibin@baidu.com
 * @date 2017/2/4
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

var gulp = require('gulp');
var clean = require('gulp-clean');
var imageMin = require('gulp-imagemin');
var imageMinPngCrush = require('imagemin-pngcrush');
var requireJsOptimize = require('gulp-requirejs-optimize');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var rename = require('gulp-rename');
var procseeHtml = require('gulp-processhtml');

var DIST_PATH = 'dist';

gulp.task('clean', function () {
    gulp.src('dist/*')
        .pipe(clean());
});

gulp.task('images', function () {
    gulp.src('res/*.png')
        .pipe(imageMin({
            plugins: [imageMinPngCrush()]
        }))
        .pipe(gulp.dest(DIST_PATH + '/images'));
});

gulp.task('js', function () {
    gulp.src('js/config.js')
        .pipe(requireJsOptimize({
            mainConfigFile: 'js/config.js',
            out: 'script.js'
        }))
        .pipe(replace(/res\/(.+?).png/g, 'dist/images/$1.png'))
        .pipe(gulp.dest(DIST_PATH + '/js'));
    gulp.src('lib/require.js')
        .pipe(uglify())
        .pipe(gulp.dest(DIST_PATH + '/js'));
});

gulp.task('css', function () {
    gulp.src('css/*.css')
        .pipe(minifyCss())
        .pipe(gulp.dest(DIST_PATH + '/css'));
});

gulp.task('html', function () {
    gulp.src('index-src.html')
        .pipe(procseeHtml())
        .pipe(minifyHtml())
        .pipe(rename('index.html'))
        .pipe(gulp.dest('.'));
});

gulp.task('default', ['clean', 'images', 'js', 'css', 'html']);
