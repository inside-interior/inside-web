var
	html         = document.documentElement,
	body         = document.body,
	screen_width = window.innerWidth || html.clientWidth || body.clientWidth;

html.classList.remove('no-js');
html.classList.add('js');

localStorage.proximaLoaded && html.classList.add('proxima-loaded');
localStorage.axisLoaded    && html.classList.add('axis-loaded');

if (screen_width < 556)      html.classList.add('start-lt-556',  'start-lt-960');
else if (screen_width < 960) html.classList.add('start-gte-556', 'start-lt-960');
else                         html.classList.add('start-gte-556', 'start-gte-960');

if (getIEVersion()) html.classList.add('is-ie');

setTimeout(function() {
	if (!window.is_external_js_loaded) {
		html.classList.add('external-js-timeout');
		window.is_external_js_timeout = true;
	}
}, 2000);

// Source: https://codepen.io/gapcode/pen/vEJNZN
function getIEVersion() {
	var ua = window.navigator.userAgent;

	// Test values; Uncomment to check result …

	// IE 10
	// ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

	// IE 11
	// ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

	// Edge 12 (Spartan)
	// ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

	// Edge 13
	// ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

	var msie = ua.indexOf('MSIE ');
	if (msie > 0) {
		// IE 10 or older => return version number
		return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
	}

	var trident = ua.indexOf('Trident/');
	if (trident > 0) {
		// IE 11 => return version number
		var rv = ua.indexOf('rv:');
		return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
	}

	var edge = ua.indexOf('Edge/');
	if (edge > 0) {
		// Edge (IE 12+) => return version number
		return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
	}

	// other browser
	return false;
}

document.addEventListener('DOMContentLoaded', function() {
	var
		lang         = html.lang,
		lang_link_el = document.getElementsByClassName('lang__link--' + lang)[0];

	lang_link_el && lang_link_el.classList.add('is-current');
	lang_link_el && lang_link_el.removeAttribute('href');;
});
