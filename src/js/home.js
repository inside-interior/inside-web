var
	SmoothScroll = require('smooth-scroll'),
	Modernizr    = require('modernizr'),
	Flickity     = require('flickity'),
	ScrollReveal = require('scrollreveal'),

	scroll_reveal;

window.lazySizesConfig = window.lazySizesConfig || {};
window.lazySizesConfig.expand = 888;

require('svg4everybody')();
require('lazysizes');

window.is_external_js_loaded = true;

// Source: JQuery - https://github.com/jquery/jquery/blob/master/src/core/ready.js
if (
		document.readyState === 'complete' ||
		(document.readyState !== 'loading' && !document.documentElement.doScroll)
) {
	window.setTimeout(onDOMLoaded);
}
else {
	document.addEventListener('DOMContentLoaded', onDOMLoaded);
	window.addEventListener('load', onDOMLoaded);
}

function onDOMLoaded() {
	var
		html         = document.documentElement,
		lang         = html.lang,
		body         = document.body,
		screen_width = window.innerWidth || html.clientWidth || body.clientWidth;

	SmoothScroll.init({
		speed  : 500,
		easing : 'Linear'
	});

	/* ========================================
	 * REVEAL (ANIMATE) CONTENT WHEN VISIBLE
	 * ======================================== */

	if (!window.is_external_js_timeout) {
		scroll_reveal = ScrollReveal({
			distance   : '50px',
			delay      : 150,
			scale      : 1,
			viewFactor : 0.4,
			easing     : 'ease-out'
		});

		var
			intro_el         = document.getElementsByClassName('js-intro')[0],
			style            = intro_el.currentStyle || window.getComputedStyle(intro_el, false),
			intro_bg_src     = /url\((.*)\)/.exec(style.backgroundImage)[1].replace(/('|")/g, ''),
			intro_bg_img     = new Image(),
			is_bg_img_loaded = false;

		intro_bg_img.onload = onBgImageLoaded;
		intro_bg_img.src    = intro_bg_src;

		if (intro_bg_img.complete) intro_bg_img.onload();

		function onBgImageLoaded() {
			if (!is_bg_img_loaded) {
				setTimeout(function() { body.classList.add('js-intro-bg-img-loaded'); }, 250);

				is_bg_img_loaded = true;
			}
		}

		setTimeout(onBgImageLoaded, 3000);

		scroll_reveal.reveal('.js-section-title');
		scroll_reveal.reveal('.js-about-us');

		if (screen_width < 976) scroll_reveal.reveal('.js-expertise');
		else                    scroll_reveal.reveal('.js-expertise', 250);

		scroll_reveal.reveal('.js-project-category');

		if      (screen_width < 556) scroll_reveal.reveal('.js-projects');
		else if (screen_width < 944) {
			scroll_reveal.reveal('.js-project:nth-child(2n+1)');
			scroll_reveal.reveal('.js-project:nth-child(2n)', { delay : 250 });
		}
		else {
			scroll_reveal.reveal('.js-project:nth-child(3n+1)');
			scroll_reveal.reveal('.js-project:nth-child(3n+2)', { delay : 250 });
			scroll_reveal.reveal('.js-project:nth-child(3n)',   { delay : 500 });
		}

		scroll_reveal.reveal('.js-contact-greet');

		if (screen_width < 968) scroll_reveal.reveal('.js-contact');
		else                    scroll_reveal.reveal('.js-contact', 250);
	}

	/* ===============================
	 * MENU BUTTON
	 * =============================== */

	var
		MENU_OPEN_CLASS_NAME = 'menu-open',
		SCROLL_UP_CLASS_NAME = 'scroll-up',

		menu_btn     = document.getElementsByClassName('js-menu-btn')[0],
		is_menu_open = false,

		last_scroll_pos = 0,
		cur_scroll_pos;

	menu_btn.onclick = function(event) {
		if (is_menu_open) {
			closeMenu();
		}
		else {
			openMenu();
		}

		event.stopPropagation();
	};

	function closeMenu() {
		menu_btn.innerHTML = 'menu';
		body.classList.remove(MENU_OPEN_CLASS_NAME);

		is_menu_open = !is_menu_open;
	}

	function openMenu() {
		menu_btn.innerHTML = lang === 'id' ? 'tutup' : 'close';
		body.classList.add(MENU_OPEN_CLASS_NAME);

		is_menu_open = !is_menu_open;
	}

	window.addEventListener('scroll', function() {
		cur_scroll_pos = window.pageYOffset || document.documentElement.scrollTop;

		if (cur_scroll_pos > last_scroll_pos) {
			// scroll down
			body.classList.remove(SCROLL_UP_CLASS_NAME);
		}
		else {
			// scroll up
			body.classList.add(SCROLL_UP_CLASS_NAME);
		}

		last_scroll_pos = cur_scroll_pos;
	});

	/* ===============================
	 * NAVIGATION MENU
	 * =============================== */

	var
		nav       = document.getElementsByClassName('js-nav')[0],
		nav_links = document.getElementsByClassName('js-nav-link');

	Array.prototype.forEach.call(nav_links, function(nav_link) {
		nav_link.onclick = function() {
			closeMenu();
		};
	});

	document.onkeydown = tryCloseMenu;

	function tryCloseMenu(event) {
		event = event || window.event;

		if (is_menu_open && event.keyCode == '27') { // ESC key code
			closeMenu();
		}
	}

	document.addEventListener('click', function(event) {
		if (is_menu_open && event.target !== nav && !nav.contains(event.target)) {
			closeMenu();
		}
	});

	/* ===============================
	 * HOVER EXPERTISE DESKTOP
	 * =============================== */

	var
		LAST_HOVER_CLASS = 'js-last-hover',

		expertises = document.getElementsByClassName('js-expertise');

	Array.prototype.forEach.call(expertises, function(expertise) {
		expertise.onmouseover = function() {
			expertise.classList.add(LAST_HOVER_CLASS);

			Array.prototype.forEach.call(expertises, function(_expertise) {
				if (expertise === _expertise) return;

				_expertise.classList.remove(LAST_HOVER_CLASS);
			});
		};
	});

	/* ===============================
	 * PROJECTS CAROUSEL - MOBILE
	 * =============================== */

	var
		carousel_list     = [],
		is_using_carousel = false;

	trySetupCarousel();

	function trySetupCarousel() {
		if (screen_width < 556) {
			if (!is_using_carousel) {
				setUpCarousel();
				is_using_carousel = true;
			}
		}
		else {
			if (is_using_carousel) {
				destroyCarousel();
				is_using_carousel = false;
			}
		}
	}

	function setUpCarousel() {
		var
			projects_list = document.getElementsByClassName('js-projects'),
			flickity_settings = {
				draggable       : true,
				cellAlign       : 'center',
				wrapAround      : true,
				pageDots        : false,
				prevNextButtons : false
			};

		Array.prototype.forEach.call(projects_list, function(projects) {
			carousel_list.push(new Flickity(projects, flickity_settings));
		});
	}

	function destroyCarousel() {
		carousel_list.forEach(function(carousel) {
			carousel.destroy();
		});

		carousel_list = [];
	}

	window.onresize = function() {
		screen_width = window.innerWidth || html.clientWidth || body.clientWidth;

		trySetupCarousel();
	};
}
