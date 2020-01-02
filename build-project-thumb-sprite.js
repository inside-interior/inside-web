var
	fs     = require('fs'),
	sprity = require('sprity'),

	sprity_options = {
		out    : './dist/images/projects/',
		src    : './dist/images/projects_thumbnail/**/*.jpg',
		split  : true,
		name   : 'thumb',
		margin : 0,
		engine : 'jimp'
	};

sprity.create(sprity_options, function() {});
