var changed = require('gulp-changed');
var gulp = require('gulp');

gulp.task('facebook', function() {
    var dest = './www/facebook';
	return gulp.src('./src/facebook/**')
		.pipe(changed(dest)) // Ignore unchanged files
		.pipe(gulp.dest(dest));
});
