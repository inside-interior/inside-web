var
	file_system = require('fs'),
	path        = require('path'),
	mkdirp      = require('mkdirp'),
	cheerio     = require('cheerio'),
	getDirName  = require('path').dirname,

	DIST_DIR    = './dist/',
	LOCALES_DIR = './src/locales/',

	I18N_ATTR_TEXT = 'data-i18n',
	I18N_ATTR_ATTR = 'data-i18n-attr',
	I18N_ATTR_LINK = 'data-i18n-link',
	i18n_attr_attr_list_multi_lang = [], // for supporting different attribute value according to the language

	html_files = [],

	i18n_config = {
		default : 'id',
		locales : ['en']
	};

// traverse dist directory, find all .html files
traverse(DIST_DIR);

var locales_to_be_translated = i18n_config.locales.concat(i18n_config.default);

locales_to_be_translated.forEach(function(locale, idx) {
	var compile_to_root = idx === locales_to_be_translated.length - 1;

	i18n_attr_attr_list_multi_lang.push(I18N_ATTR_TEXT + '-' + locale);

	compile(locale, DIST_DIR, compile_to_root);
});

function traverse(dir) {
	var list = file_system.readdirSync(dir);

	list.forEach(function(file) {
		var file_extension = path.extname(file);

		file = path.resolve(dir, file);

		if (file_extension === '.html') {
			html_files.push(file);
		}

		var stat = file_system.statSync(file);

		if (stat && stat.isDirectory()) traverse(file);
	})
}

function compile(locale, dist_dir, save_at_root) {
	var strings_dict = require(LOCALES_DIR + locale);

	html_files.forEach(function (html_file) {
		file_system.readFile(html_file, 'utf8', function (err, content) {
			if (err) return console.error(err);

			var $ = cheerio.load(content);

			$('html').attr('lang', locale);

			// Replacing I18N_ATTR_TEXT and I18N_ATTR_ATTR
			$('html').find('[' +  I18N_ATTR_TEXT + ']').each(function(idx, elem) {
				var
					string_key = $(elem).attr(I18N_ATTR_TEXT),
					attr_name  = $(elem).attr(I18N_ATTR_ATTR),

					string = getValue(strings_dict, string_key);

				if (attr_name) {
					$(elem).attr(attr_name, string);
					$(elem).removeAttr(I18N_ATTR_ATTR);
				}
				else {
					$(elem).text(string);
				}

				$(elem).removeAttr(I18N_ATTR_TEXT);
			});

			// Replacing I18N_ATTR_ATTR that has different value for different language
			var selector_str = '[' + i18n_attr_attr_list_multi_lang.join('][') + ']';
			$('html').find(selector_str).each(function(idx, elem) {
				var
					attr_name = $(elem).attr(I18N_ATTR_ATTR),
					attr_val  = $(elem).attr(I18N_ATTR_TEXT + '-' + locale);

				$(elem).attr(attr_name, attr_val);

				i18n_attr_attr_list_multi_lang.forEach(function(attr_name_multi_lang) {
					$(elem).removeAttr(attr_name_multi_lang);
				})
				$(elem).removeAttr(I18N_ATTR_ATTR);
			});

			// Replacing I18N_ATTR_LINK
			$('html').find('[' +  I18N_ATTR_LINK + ']').each(function(idx, elem) {
				var attr_list = $(elem).attr(I18N_ATTR_LINK).split(',');

				attr_list.forEach(function(attr_name) {
					if (!$(elem).attr(attr_name))
						return console.warn('build-html-i18n: Cannot find attribute ' + attr_name);

					var
						link_list   = $(elem).attr(attr_name).split(','),
						link_prefix = save_at_root ? '' : '../';

					link_list.forEach(function(link, idx) {
						link_list[idx] = link_prefix + link;
					});

					$(elem).attr(attr_name, link_list.join(','));
				});

				$(elem).removeAttr(I18N_ATTR_LINK);
			});

			var
				dist_dir_absolute = path.resolve(dist_dir),
				save_to           = dist_dir_absolute + '/',
				path_suffix       = path.relative(dist_dir_absolute, html_file);

			if (!save_at_root) save_to += locale + '/';

			save_to += path_suffix;

			writeFile(save_to, $.html(), function(err) {
				if(err) return console.error(err);
			});
		});
	});
}

function getValue(obj, string_key) {
	return string_key.split('.').reduce(index, obj);
}

function index(obj, i) {
	return obj[i]
}

function writeFile(path, contents, cb) {
	mkdirp(getDirName(path), function (err) {
		if (err) return cb(err);

		file_system.writeFile(path, contents, cb);
	});
}
