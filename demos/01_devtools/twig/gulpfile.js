/*!
 * @see https://markgoodyear.com/2014/01/getting-started-with-gulp/
 * $ npm install gulp del gulp-autoprefixer gulp-concat gulp-jshint gulp-minify-css gulp-notify gulp-rename gulp-ruby-sass gulp-uglify --save-dev
 * other suggested packages: gulp-cache gulp-livereload
 */

// load gulp
var gulp = require('gulp');

// load other plugins
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var del = require('del');
var jshint = require('gulp-jshint');
// var livereload = require('gulp-livereload');
var minifycss = require('gulp-minify-css');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var sass = require('gulp-ruby-sass');
var uglify = require('gulp-uglify');

// define CSS tasks
gulp.task('styles', function() {
  return sass('src/scss/*.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// define JS tasks
gulp.task('scripts', function() {
  return gulp.src('src/js/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// files removed from src/ may still linger in dist/, so clean up your act before publishing again; ** includes parent folder!!
gulp.task('clean', function(cb) {
    return del(['dist/css/**', 'dist/js/**']);
});

// watch for changes
gulp.task('watch', function() {
  gulp.watch('src/css/**/*.scss', ['styles']);
  gulp.watch('src/js/**/*.js', ['scripts']);
  // livereload.listen();
  // gulp.watch(['dist/**']).on('change', livereload.changed);
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles','scripts');
});

