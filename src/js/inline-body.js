var
	FontFaceObserver = require('fontfaceobserver'),

	proxima = new FontFaceObserver('proxima'),
	axis    = new FontFaceObserver('axis');

require('es6-promise').polyfill();

proxima.load().then(function() {
	document.documentElement.classList.add('proxima-loaded');
	localStorage.proximaLoaded = true;
});

axis.load().then(function() {
	document.documentElement.classList.add('axis-loaded');
	localStorage.axisLoaded = true;
});
