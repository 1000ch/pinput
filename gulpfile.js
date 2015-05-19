var gulp = require('gulp');

gulp.task('html', function () {
  
  var htmlmin = require('gulp-htmlmin');

  return gulp.src(['src/html/*.html'])
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('dist/html/'));
});

gulp.task('css', function () {
  
  var csso = require('gulp-csso');
  
  return gulp.src(['src/css/lib/jquery-ui.custom.css'])
    .pipe(csso())
    .pipe(gulp.dest('dist/css/lib/'));
});

gulp.task('js', function () {

  var browserify = require("browserify");
  var babelify   = require("babelify");
  var source     = require('vinyl-source-stream');
  var buffer     = require('vinyl-buffer');
  var uglify     = require("gulp-uglify");

  browserify({
    entries: ['src/js/background.js'],
    extensions: ['.js']
  }).transform(babelify)
    .bundle()
    .pipe(source('background.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'));

  browserify({
    entries: ['src/js/options.js'],
    extensions: ['.js']
  }).transform(babelify)
    .bundle()
    .pipe(source('options.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'));

  browserify({
    entries: ['src/js/popup.js'],
    extensions: ['.js']
  }).transform(babelify)
    .bundle()
    .pipe(source('popup.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('copy', function () {
  
  gulp.src([
    'bower_components/bootstrap/dist/fonts/*'
  ]).pipe(gulp.dest('src/fonts'))
    .pipe(gulp.dest('dist/fonts'));
  
  gulp.src([
    'bower_components/bootstrap/dist/css/bootstrap.min.css'
  ]).pipe(gulp.dest('src/css/lib'))
    .pipe(gulp.dest('dist/css/lib'));
  
  gulp.src([
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/bootstrap/dist/js/bootstrap.min.js'
  ]).pipe(gulp.dest('src/js/lib'))
    .pipe(gulp.dest('dist/js/lib'));

  gulp.src([
    'src/js/lib/jquery-ui.custom.min.js'
  ]).pipe(gulp.dest('dist/js/lib'));

  gulp.src([
    'src/icons/*.png'
  ]).pipe(gulp.dest('dist/icons'));

  gulp.src([
    'src/manifest.json'
  ]).pipe(gulp.dest('dist'));
});

gulp.task('build', function () {
  gulp.start('html', 'css', 'js', 'copy');
});

gulp.task('test', function () {

  var eslint = require('gulp-eslint');
  
  return gulp.src(['src/js/*.js'])
    .pipe(eslint({
      useEslintrc: true
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('watch', function () {

  gulp.watch(['src/html/*.html'], function () {
    gulp.start('html');
  });

  gulp.watch(['src/js/*.js'], function () {
    gulp.start('js');
  });
});