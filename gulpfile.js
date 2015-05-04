var gulp = require('gulp');

gulp.task('test', function () {

  var validate = require('gulp-jsvalidate');
  
  return gulp.src(['src/js/*.js'])
    .pipe(validate());

});