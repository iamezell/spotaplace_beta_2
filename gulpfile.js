var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('default', function(){
  // place code for your default task here
  //testing gulp script 3
  gulp.src('./lib/**/*.js')
    .pipe(concat("all.js"))
    .pipe(gulp.dest('./dist/'))
});