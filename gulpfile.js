var gulp = require('gulp');

var jshint = require('gulp-jshint');

gulp.task('jshint', function() {
    gulp.src('./src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');

gulp.task('imagemin', function() {
    var imgSrc = './src/img/**/*';
    var imgDst = './dist/img';

    gulp.src(imgSrc)
        .pipe(changed(imgDst))
        .pipe(imagemin())
        .pipe(gulp.dest(imgDst));
});

var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');

gulp.task('scripts', function() {
    gulp.src('./src/js/*.js')
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('default', ['jshint', 'imagemin', 'scripts']);
