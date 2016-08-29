var
	gulp   = require('gulp'),
	inline = require('gulp-inline'),
	uglify = require('gulp-uglify');

gulp.task('inline-js', function () {
	gulp.src('dist/**/*.html')
		.pipe(
			inline(
				{
					base          : 'dist/',
					js            : uglify,
					disabledTypes : ['svg', 'img', 'css'],
					ignore        : ['/js/home.js', '/js/project-detail.js']
				}
			)
		)
		.pipe(gulp.dest('dist/'));
});
