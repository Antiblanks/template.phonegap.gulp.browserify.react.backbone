var browserify = require('browserify');
var gulp = require('gulp');
var gutil = require('gulp-util');
var handleErrors = require('../util/handle-errors');
var source = require('vinyl-source-stream');

gulp.task('browserify', function(){
    return browserify({
        entries: ['./src/js/main.js'],
        extensions: ['.jsx'],
        paths: ['./node_modules','./src/js/']
    })
        .transform('reactify')
        .transform('jstify')
        .bundle({debug: true})
        .on('error', handleErrors)
        .pipe(source('app.js'))
        .pipe(gulp.dest('./www'));
});
