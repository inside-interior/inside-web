var photo_quality = 70;

module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		responsive_images: {
			project_images: {
				options: {
					concurrency : 3,
					sizes       : [
						// Square (home)
						{
							width       : 175,
							height      : 175,
							aspectRatio : false,
							quality     : photo_quality,
							name        : 'sq-xs'
						},
						{
							width       : 310,
							height      : 310,
							aspectRatio : false,
							quality     : photo_quality,
							name        : 'sq-sm'
						},
						{
							width       : 445,
							height      : 445,
							aspectRatio : false,
							quality     : photo_quality,
							name        : 'sq-me'
						},
						{
							width       : 580,
							height      : 580,
							aspectRatio : false,
							quality     : photo_quality,
							name        : 'sq-la'
						},
						{
							width       : 715,
							height      : 715,
							aspectRatio : false,
							quality     : photo_quality,
							name        : 'sq-xl'
						},
						{
							width       : 850,
							height      : 850,
							aspectRatio : false,
							quality     : photo_quality,
							name        : 'sq-xxl'
						},
						// Non-square (project detail)
						{
							width   : 200,
							height  : 200,
							quality : photo_quality,
							name    : 'xs'
						},
						{
							width   : 500,
							height  : 500,
							quality : photo_quality,
							name    : 'sm'
						},
						{
							width   : 800,
							height  : 800,
							quality : photo_quality,
							name    : 'me'
						},
						{
							width   : 1100,
							height  : 1100,
							quality : photo_quality,
							name    : 'la'
						},
						{
							width   : 1400,
							height  : 1400,
							quality : photo_quality,
							name    : 'xl'
						},
						{
							width   : 1700,
							height  : 1700,
							quality : photo_quality,
							name    : 'xxl'
						}
					]
				},
				files: [{
					expand : true,
					src    : ['**/*.{jpg,gif,png}'],
					cwd    : 'src/images/projects/',
					dest   : 'dist/images/projects/'
				}]
			},
			project_thumbnail: {
				options: {
					concurrency : 3,
					sizes       : [
						{
							width       : 100,
							height      : 71,
							aspectRatio : false,
							quality     : 80
						}
					]
				},
				files: [{
					expand : true,
					src    : ['**/*.{jpg,gif,png}'],
					cwd    : 'src/images/projects/',
					dest   : 'dist/images/projects_thumbnail/'
				}]
			},
			intro_header: {
				options: {
					concurrency : 3,
					sizes       : [
						{
							width   : 200,
							quality : photo_quality,
							name    : 'xs'
						},
						{
							width   : 400,
							quality : photo_quality,
							name    : 'sm'
						},
						{
							width   : 600,
							quality : photo_quality,
							name    : 'me'
						},
						{
							width   : 800,
							quality : photo_quality,
							name    : 'la'
						},
						{
							width   : 1000,
							quality : photo_quality,
							name    : 'xl'
						}
					]
				},
				files: [{
					'dist/images/header_bg.jpg': 'src/images/header_bg.jpg'
				}]
			},
			expertises: {
				options: {
					concurrency : 3,
					sizes       : [
						{
							width   : 320,
							quality : photo_quality
						}
					]
				},
				files: [{
					expand : true,
					src    : ['**/*.{jpg,gif,png}'],
					cwd    : 'src/images/expertises/',
					dest   : 'dist/images/expertises/'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-responsive-images');

	grunt.registerTask('default', ['responsive_images']);
};
