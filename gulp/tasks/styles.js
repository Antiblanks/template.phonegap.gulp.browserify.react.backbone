var gulp = require('gulp');
var less = require('gulp-less');
var handleErrors = require('../util/handle-errors');

gulp.task('styles', function () {
    return gulp.src('./src/css/app.less')
        .pipe(less())
        .on('error', handleErrors)
        .pipe(gulp.dest('./www'));
});