'use strict';

var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
     del = require('del'),
  useref = require('gulp-useref'),
     iff = require('gulp-if'),
    csso = require('gulp-csso');

var options = {
  src: './src/',
  dist: './dist/'
}


gulp.task('compileSass', function() {
  return gulp.src(options.src + 'scss/main.scss')
    .pipe(maps.init())
    .pipe(sass())
    .pipe(maps.write('./'))
    .pipe(gulp.dest(options.src + 'css/'));
});

gulp.task('html', ['compileSass'], function() {
  var assets = useref.assets();
  return gulp.src(options.src + 'index.html')
              .pipe(assets)
              .pipe(iff('*.js', uglify()))
              .pipe(iff('*.css', csso()))
              .pipe(assets.restore())
              .pipe(useref())
              .pipe(gulp.dest(options.dist));
});

gulp.task('watchFiles', function() {
  gulp.watch(options.src + 'scss/**/*.scss', ['compileSass']);
});

gulp.task('assets', function(){
  return gulp.src([options.src + 'img/**/*', 
                   options.src + 'fonts/**/*',
                   options.src + 'font-awesome/**/*',
                   options.src + 'mail/**/*'], {base: options.src})
          .pipe(gulp.dest(options.dist));
})

// watch sass
gulp.task('serve', ['compileSass', 'watchFiles']);

gulp.task('clean', function() {
  del([options.dist]);
  // delete compiles css and map
  del([options.src + 'css/main.css*']);
});

gulp.task('build', ['html', 'assets'])

gulp.task('default', ['clean'], function(){
  gulp.start('build');
});