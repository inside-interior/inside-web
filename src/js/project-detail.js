var
	Modernizr    = require('modernizr'),
	Flickity     = require('flickity'),
	ScrollReveal = require('scrollreveal'),

	scroll_reveal;

window.is_external_js_loaded = true;

if (document.readyState !== 'uninitialized' || document.readyState !== 'loading') {
	// DOM already loaded, i.e. too late to add event listener
	onDOMLoaded();
}
else {
	document.addEventListener('DOMContentLoaded', onDOMLoaded);
}

function onDOMLoaded() {
	var
		html         = document.documentElement,
		body         = document.body,
		screen_width = window.innerWidth || html.clientWidth || body.clientWidth;

	/* ========================================
	 * REVEAL (ANIMATE) CONTENT WHEN VISIBLE
	 * ======================================== */

	scroll_reveal = ScrollReveal({
		distance   : '50px',
		delay      : 150,
		scale      : 1,
		viewFactor : 0.2,
		easing     : 'ease-out'
	});

	if (!window.is_external_js_timeout) {
		scroll_reveal.reveal('.js-title');

		if (screen_width < 960) {
			html.classList.add('start-lt-960');

			scroll_reveal.reveal('.js-detail');
			scroll_reveal.reveal('.js-photo');
			scroll_reveal.reveal('.js-next-project-div');
		}
		else {
			html.classList.add('start-gte-960');

			scroll_reveal.reveal('.js-detail',           { delay : 250  });
			scroll_reveal.reveal('.js-next-project-div', { delay : 1000 }); // 1000 because there is thumbnails reveal
			scroll_reveal.reveal('.js-prev-project-div', { delay : 1000 }); // 1000 because there is thumbnails reveal
		}
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
		menu_btn.innerHTML = 'close';
		body.classList.add(MENU_OPEN_CLASS_NAME);

		is_menu_open = !is_menu_open;
	}

	if (screen_width >= 960) {
		body.classList.add(SCROLL_UP_CLASS_NAME);
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
			body.classList.remove(MENU_OPEN_CLASS_NAME);
			is_menu_open = false;
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
	 * GALLERY CAROUSEL - DESKTOP
	 * =============================== */

	var
		SELECTED_THUMBNAIL_CLASS_NAME = 'is-selected',

		projects      = document.getElementsByClassName('js-gallery')[0],
		parent_el     = document.getElementsByClassName('js-page-content')[0],
		photo_el_list = document.getElementsByClassName('project__photo'),

		thumbnails_el,
		thumbnail_el_list,

		carousel,

		is_using_carousel   = false,
		prev_selected_index = 0;

	trySetupCarousel();

	function trySetupCarousel() {
		if (screen_width >= 960) {
			if (!is_using_carousel) {
				is_using_carousel = true;
				setUpCarousel();
			}
		}
		else {
			if (is_using_carousel) {
				is_using_carousel = false;
				destroyCarousel();
			}
		}
	}

	function setUpCarousel() {
		var
			flickity_settings = {
				draggable       : true,
				cellAlign       : 'center',
				wrapAround      : true,
				pageDots        : false,
				prevNextButtons : false
			},

			num_of_project = projects.childNodes.length,
			thumbnail_src  = projects.getAttribute('data-thumbnail-src'),
			next_project;

		if (num_of_project > 1) {
			next_project = document.getElementsByClassName('js-next-project')[0];

			thumbnails_el = document.createElement('div');
			thumbnails_el.classList.add('project__thumbnails');
			thumbnails_el.classList.add('js-thumbnails');

			for (var idx = 0; idx < num_of_project; idx++) {
				var thumbnail_el = document.createElement('div');

				thumbnail_el.style.backgroundImage = 'url("' + thumbnail_src + '")';
				thumbnail_el.classList.add('project__thumbnail');
				thumbnail_el.classList.add('js-thumbnail');

				thumbnails_el.appendChild(thumbnail_el);
			}

			parent_el.insertBefore(thumbnails_el, next_project);

			scroll_reveal.reveal('.js-thumbnails', { delay : window.is_external_js_timeout ? 0 : 750 });

			thumbnail_el_list = document.getElementsByClassName('js-thumbnail');

			Array.prototype.forEach.call(thumbnail_el_list, function(thumbnail, index) {
				thumbnail.onclick = function() {
					carousel.select(index);
				};
			});
		}

		carousel = new Flickity(projects, flickity_settings);

		document.addEventListener('keydown', showAdjacentImg);

		// === START HACK: to position carousel properly in Chrome
		var
			height     = projects.clientHeight,
			width      = height * (3580 / 2480),
			max_height = screen_width * 0.5195,
			max_width  = screen_width * 0.75;

		Array.prototype.forEach.call(photo_el_list, function(photo) {
			photo.style.width  = (width  > max_width  ? max_width  : width)  + 'px';
			photo.style.height = (height > max_height ? max_height : height) + 'px';
		});

		is_carousel_width_hack_resetted = false;
		// === END HACK

		carousel.on('cellSelect', function() {
			var selected_index = carousel.selectedIndex;

			if (thumbnail_el_list) {
				thumbnail_el_list[prev_selected_index].classList.remove(SELECTED_THUMBNAIL_CLASS_NAME);
				thumbnail_el_list[selected_index]     .classList   .add(SELECTED_THUMBNAIL_CLASS_NAME);

				prev_selected_index = selected_index;
			}
		});

		carousel.select(prev_selected_index);

		carousel.resize(); // HACK: to position carousel properly

		scroll_reveal.reveal('.js-gallery', { delay : (window.is_external_js_timeout ? 0 : 500) });
	}

	function destroyCarousel() {
		document.removeEventListener('keydown', showAdjacentImg);
		thumbnails_el && parent_el.removeChild(thumbnails_el);
		thumbnail_el_list = null;
		carousel.destroy();
	}

	function showAdjacentImg(event) {
		var
			LEFT_ARROW  = 37,
			RIGHT_ARROW = 39,

			key_code = event.keyCode;

		switch (key_code) {
			case LEFT_ARROW:
				carousel.previous();
				break;
			case RIGHT_ARROW:
				carousel.next();
				break;
		}
	}

	var is_carousel_width_hack_resetted = false;

	window.onresize = function() {
		screen_width = window.innerWidth || html.clientWidth || body.clientWidth;

		if (!is_carousel_width_hack_resetted) {
			Array.prototype.forEach.call(photo_el_list, function(photo) {
				photo.style.width  = '';
				photo.style.height = '';
			});

			is_carousel_width_hack_resetted = true;
		}

		trySetupCarousel();
	};
}
