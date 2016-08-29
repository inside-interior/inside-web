var
	file_system  = require('fs'),
	jade         = require('jade'),
	project_list = require('./src/project_list.json'),

	jade_dir = './src/html/',
	dist_dir = './dist/',

	projects,
	permalink,
	project_dir,

	next_project_idx,
	prev_project_idx,
	locals;

// ========================================
// Compile index / home page
// ========================================
compileJade({
	input_file_path  : jade_dir + 'home.jade',
	output_file_path : dist_dir + 'index.html',
	locals           : project_list,
	jade_options     : {
		pretty       : false,
		compileDebug : true,
		cache        : true
	}
});

// ========================================
// Build individual project detail page
// ========================================
project_list.forEach(function(project_category) {
	projects = project_category.projects;

	projects.forEach(function(project, index) {
		permalink   = project.permalink;
		project_dir = dist_dir + permalink;

		if (!file_system.existsSync(project_dir)) file_system.mkdirSync(project_dir);

		next_project_idx = (index + 1 + projects.length) % projects.length;
		prev_project_idx = (index - 1 + projects.length) % projects.length;
		locals           = {
			cur_project  : project,
			next_project : projects[next_project_idx],
			prev_project : projects[prev_project_idx]
		};

		compileJade({
			input_file_path  : jade_dir + 'project-detail.jade',
			output_file_path : project_dir + '/index.html',
			locals           : locals,
			jade_options     : {
				pretty       : false,
				compileDebug : true,
				cache        : true
			}
		});
	});
});

function compileJade(options) {
	var
		fn   = jade.compileFile(options.input_file_path, options.jade_options),
		html = fn(options.locals);

	file_system.writeFile(options.output_file_path, html, function(err) {
		if (err) throw err;
		console.log('Jade file compiled to ' + options.output_file_path);
	});
}
