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

// >>>>>> Google analytics script START
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-83893933-1', 'auto');
ga('send', 'pageview');
// >>>>>> Google analytics script END
