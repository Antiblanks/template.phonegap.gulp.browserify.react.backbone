var changed = require('gulp-changed');
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');

gulp.task('resources', function() {
    var dest = './www/res';
	return gulp.src('./src/res/**')
		.pipe(changed(dest)) // Ignore unchanged files
		.pipe(imagemin()) // Optimize
		.pipe(gulp.dest(dest));
});
