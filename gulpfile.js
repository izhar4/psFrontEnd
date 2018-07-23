'use strict';

var gulp = require('gulp');

// Include Our Plugins
var jshint       = require('gulp-jshint');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');
var runSequence  = require('run-sequence');
var cssmin       = require('gulp-cssmin');


// Concatenate & Minify JS of controllers,services,config,infrastructure
gulp.task('scripts', function() {
    return gulp.src(['./public/js/app.js','./public/js/config/*.js','./public/js/infrastructure/*.js','./public/js/services/*.js','./public/js/controllers/*.js','./public/js/directive/*.js','./public/js/filters/*.js'])
        .pipe(concat('all.js'))
        .pipe(rename('app.min.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('./public/dist'));
});

// Concatenate & Minify JS of lib
gulp.task('lib', function() {
    return gulp.src('./public/js/lib/*.js')
        .pipe(concat('lib.js'))
        .pipe(rename('lib.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/dist'));
});
// Concatenate & Minify JS of css
gulp.task('css', function() {
    return gulp.src('./public/css/*.css')
        .pipe(cssmin())
        .pipe(concat('all.css'))
        .pipe(rename('styles.min.css'))
        .pipe(gulp.dest('./public/dist'));
});


gulp.task('default', function(callback){
    runSequence('scripts','lib','css',callback);
});