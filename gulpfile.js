var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('gulp-browserify');
var livereload = require('gulp-livereload');

gulp.task('styles', function() {
  return sass('src/scss/*.scss', { style: 'compressed' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('production/css'))
    .pipe(livereload());
});

gulp.task('scripts', function() {
  return gulp.src('src/js/*.js')
    .pipe(browserify({
      insertGlobals : true,
      debug : !gulp.env.production
    }))
    .pipe(gulp.dest('./production/js'))
    .pipe(livereload());
});

gulp.task('ejs',function(){
    return gulp.src('views/**/*.ejs')
    .pipe(livereload());
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('src/scss/*.scss', ['styles']);
    gulp.watch('views/**/*.ejs', ['ejs']);
    gulp.watch('src/js/**/*.js', ['scripts']);
});

gulp.task('build', ['styles','scripts']);

gulp.task('server',function(){

  var stream = nodemon({
          'script': 'app.js',
          'ignore': 'public/**',
          'env': { 'NODE_ENV': 'development' } });
 stream
     .on('restart', function () {
       console.log('restarted!')
     })
     .on('crash', function() {
       console.error('Application has crashed!\n')
        stream.emit('restart', 3)  // restart the server in 3 seconds
     })
});

gulp.task('serve', ['server','watch']);
