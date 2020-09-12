var
	gulp   = require('gulp'),
	inline = require('gulp-inline'),
	uglify = require('gulp-uglify');

function inlineJs() {
	return gulp.src('dist/**/*.html')
		.pipe(
			inline(
				{
					base          : 'dist/',
					js            : uglify,
					disabledTypes : ['svg', 'img', 'css'],
					ignore        : ['js/home.js', '../js/project-detail.js']
				}
			)
		)
		.pipe(gulp.dest('dist/'));
};

exports.inlineJs = inlineJs;
