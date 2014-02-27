var gulp = require('gulp');
var concat = require('gulp-concat');
var inject = require("gulp-inject");

gulp.task('default', function(){
  // place code for your default task here
  //testing gulp script 3
  gulp.src('./lib/**/*.js')
    .pipe(concat("all.js"))
    .pipe(gulp.dest('./dist/'))

  gulp.src('./lib/views/.html')
  .pipe(inject(gulp.src(["./src/*.js", "./src/*.css"], {read: false}))) // Not necessary to read the files (will speed up things), we're only after their paths
  .pipe(gulp.dest("./dist"));
});