/**
 * lyqbox.js - LyqBox - Lyquix lightbox functionality
 *
 * @version     2.0.0-beta-5
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

if(lqx && typeof lqx.lyqbox == 'undefined') {
	lqx.lyqbox = (function(){
		/**
		 * Lyquix lightbox functionality
		 *
		 * Provides 3 types of lightboxes:
		 * 		Simple lightboxes that may includes images, HTML content, or iframes
		 * 		Galleries: a collection of multiple content that the user can navigate.
		 * 			Each gallery item has own hash URL that can be used to open page showing
		 * 			specific gallery item.
		 * 		Alerts: lightbox that opens on page load until user dismisses it
		 * Complete separation of styling (CSS) and logic (JavaScript)
		 * Use CSS animations and transitions
		 * Control galleries with left and right arrows in keyboard and swipe gestures
		 * For images, zoom in/out
		 * Option to add thumbnails
		 * Ability to create custom HTML structure
		 *
		 * To activate an element in your page with lightbox add the following attributes:
		 * data-lyqbox: Indicates that this is a lyqbox element. Leave empty for single lightboxes,
		 * 		or use an identifier that ties together elements that belong to the same gallery,
		 * 		or as unique identifier for alerts.
		 * data-lyqbox-type:
		 * 		image: use for loading images in lightbox
		 * 		video: use for loading a video iframe in lightbox
		 * 		html, alert: use for loading HTML content in lightbox
		 * data-lyqbox-url: mandatory for image and video types. Optional for html and alert types,
		 * 		used to load content from URL.
		 * data-lyqbox-title: optional item title
		 * data-lyqbox-caption: optional item caption
		 * data-lyqbox-credit: optional item credits
		 * data-lyqbox-class: optional item custom CSS classes
		 * data-lyqbox-alias: item alias to use in URL hash
		 * data-lyqbox-html: content for html or alert lightboxes
		 * data-lyqbox-thumb: for galleries only, URL to thumbnail image
		 *
		 */
		var opts = {
			html:
				'<div class="lyqbox">' +
					'<div class="content-wrapper">' +
						'<div class="content"></div>' +
						'<div class="info">' +
							'<div class="title"></div>' +
							'<div class="caption"></div>' +
							'<div class="credit"></div>' +
						'</div>' +
					'</div>' +
					'<div class="content-wrapper">' +
						'<div class="content"></div>' +
						'<div class="info">' +
							'<div class="title"></div>' +
							'<div class="caption"></div>' +
							'<div class="credit"></div>' +
						'</div>' +
					'</div>' +
					'<div class="close"></div>' +
					'<div class="prev"></div>' +
					'<div class="next"></div>' +
					'<div class="zoom-in"></div>' +
					'<div class="zoom-out"></div>' +
					'<div class="counter">' +
						'<span class="current"></span>' +
						' / <span class="total"></span>' +
					'</div>' +
					'<div class="thumbnails"></div>' +
					'<div class="loading"></div>' +
				'</div>',
			analytics: true
		};

		var vars = {
			album: [],
			currentIndex: 0,
			initialized: false,
			containerActive: null
		};

		var init = function(){
			// Copy default opts and vars
			jQuery.extend(lqx.opts.lyqbox, opts);
			opts = lqx.opts.lyqbox;
			jQuery.extend(lqx.vars.lyqbox, vars);
			vars = lqx.vars.lyqbox;

			// Initialize on lqxready
			lqx.vars.window.on('lqxready', function() {
				// Initialize only if enabled
				if(lqx.opts.lyqbox.enabled) {
					lqx.log('Initializing `lyqbox`');

					// Disable analytics if the analytics module is not enabled
					if(!lqx.opts.analytics.enabled || !lqx.opts.analytics.lyqBox) opts.analytics = false;
					if(opts.analytics) lqx.log('Setting LyqBox tracking');

					// Enable LyqBox
					lqx.vars.body.on('click', '[data-lyqbox]', function(e) {
						e.preventDefault();
						jQuery('.lyqbox').addClass('open');
						start(jQuery(e.currentTarget));
						return false;
					});

					// Initialize on document ready
					lqx.vars.window.ready(function() {
						if(jQuery('[data-lyqbox]').length) {
							setup();
						}
					});

					// Add a mututation observer to run setup if lyqbox is added after document ready
					lqx.mutation.addHandler('addNode', '[data-lyqbox]', function(e){
						if(!vars.initialized) setup();
					});
				}
			});

			return lqx.lyqbox.init = true;
		};

		var setup = function() {
			// Build the lightbox structure
			build();

			// to handle alertbox and hash url at the same time, we prioritize the alertbox first.
			// using promise, we make sure the alertbox shows first, and show the hash url content after the promise is done (alertbox is closed)
			var alertPromise = alert(jQuery('[data-lyqbox-type=alert]'));

			// check hash after promise is resolved/reject. Rejected is a valid return due to alerbox already shown before/cookie found.
			alertPromise.always(function afterAlertCheck() {
				hash();
			});

			vars.initialized = true;
		};

		var build = function() {
			// append html structure
			jQuery(opts.html).appendTo(lqx.vars.body);

			// assign the html container class to namespace variable
			vars.overlay = jQuery('.lyqbox');

			// assign active content container to the first .content box
			vars.containerActive = vars.overlay.find('.content-wrapper').first().addClass('active');

			// Add swipe event handler, only on images and videos
			lqx.util.swipe('.lyqbox .content-wrapper .content.image, .lyqbox .content-wrapper .content.video', swipeHandler);

			// prev button click handling
			vars.overlay.find('.prev').on('click', function() {
				if(vars.currentIndex === 0) {
					changeContent(vars.album.length - 1);
				}
				else {
					changeContent(vars.currentIndex - 1);
				}
				return false;
			});

			// next button click handling
			vars.overlay.find('.next').on('click', function() {
				if(vars.currentIndex === vars.album.length - 1) {
					changeContent(0);
				}
				else {
					changeContent(vars.currentIndex + 1);
				}
				return false;
			});

			// close button click handling
			vars.overlay.find('.close').on('click', function() {
				// disable the close button for alertbox, cookie save handling to prevent the alert box to reappear will be done on the deferred section on alert function to make sure in the case alert and hashurl found,
				// that the alert box is closed properly before showing a hash url content.
				if(vars.album[vars.currentIndex].type == 'alert')
					return false;

				// else close the lightbox
				end();
				return false;
			});

			// zoom in button click handling
			vars.overlay.find('.zoom-in').on('click', function() {
				var zoom = vars.overlay.find('.image-container img').attr('data-lyqbox-zoom');
				if(typeof zoom == 'undefined') zoom = 0;
				if(zoom < 4) {
					vars.overlay.find('.image-container img').attr('data-lyqbox-zoom', parseInt(zoom) + 1);
				}
				return false;
			});

			// zoom out button click handling
			vars.overlay.find('.zoom-out').on('click', function() {
				var zoom = vars.overlay.find('.image-container img').attr('data-lyqbox-zoom');
				if(typeof zoom == 'undefined') zoom = 0;
				if(zoom > 0) {
					vars.overlay.find('.image-container img').attr('data-lyqbox-zoom', parseInt(zoom) - 1);
				}
				return false;
			});
		};

		// show alertbox if found.
		var alert = function(alertbox) {
			var deferred = jQuery.Deferred();
			// assume that there is only one alertbox at any given time.
			if(alertbox.length == 1) {
				// check if a cookie for this alertbox exists, if so return deferred reject.
				var cookieName = 'lyqbox-alert-' + alertbox.attr('data-lyqbox');
				var alertCookieFound = localStorage.getItem(cookieName);
				if(alertCookieFound) {
					deferred.reject();
				}
				// if no cookie found, show the alertbox
				else {
					// show the alertbox
					start(alertbox);

					// add listener to the close button to save the cookie and return deferred resolved
					jQuery('.lyqbox .close').on('click', function() {
						var cookieName = 'lyqbox-alert-' + vars.album[vars.currentIndex].albumId;
						localStorage.setItem(cookieName, 1);

						deferred.resolve();
						end();
						return false;
					});
				}
			}
			// if no alertbox is found, return deferred reject to make way to display content for hash url if any found
			else {
				deferred.reject();
			}
			return deferred.promise();
		};

		// show the hash url content
		var hash = function() {
			var hash = window.location.hash.substr(1);
			if(hash !== '') {
				// get hash value and display the appropriate content
				var hashParts = hash.split(':');

				if(hashParts.length == 2) {
					var items = jQuery('[data-lyqbox="' + hashParts[0] + '"]');

					// Use alias
					if(isNaN(parseInt(hashParts[1]))) {
						items = items.filter('[data-lyqbox-alias=' + hashParts[1] + ']')
					}
					// Use index
					else {
						items = items.eq(hashParts[1]);
					}

					// If any items match, start the lightbox
					if(items.length) {
						lqx.vars.document.ready(function(){
							start(jQuery(items[0]));
						});
					}
				}
			}
		};

		// Show overlay and lightbox. If the image is part of a set, add siblings to album array.
		var start = function(elem) {
			lqx.log('Open LyqBox', elem);

			// Send event for lightbox opened
			if(opts.analytics) {
				ga('send', {
					'hitType': 'event',
					'eventCategory': 'LyqBox',
					'eventAction': 'Open'
				});
			}

			vars.album = [];
			vars.currentIndex = 0;
			var startIndex = 0;

			function addToAlbum(elem) {
				vars.album.push({
					albumId: elem.attr('data-lyqbox'),
					type: elem.attr('data-lyqbox-type'),
					link: elem.attr('data-lyqbox-url'),
					title: elem.attr('data-lyqbox-title'),
					caption: elem.attr('data-lyqbox-caption'),
					credit: elem.attr('data-lyqbox-credit'),
					class: elem.attr('data-lyqbox-class'),
					alias: elem.attr('data-lyqbox-alias'),
					html: elem.attr('data-lyqbox-html'),
					thumb: elem.attr('data-lyqbox-thumb'),
				});
			}

			// build the album, the object which contains all values passed from the attribute
			var datalyqboxValue = elem.attr('data-lyqbox');
			if(datalyqboxValue) {
				var items = jQuery('[data-lyqbox="' + datalyqboxValue + '"]');
				for (var i = 0; i < items.length; i = ++i) {
					addToAlbum(jQuery(items[i]));
					if(items[i] === elem[0]) {
						startIndex = i;
					}
				}
			}
			else {
				addToAlbum(elem);
			}

			// Open lyqbox
			vars.overlay.addClass('open');

			// Prepare thumbnails
			if(vars.album.length > 1) {
				thumbnails();
			}

			// change the content to item at index
			changeContent(startIndex);
		};

		// create thumbnails
		var thumbnails = function() {
			// Remove any previous thumbnails
			vars.overlay.find('.thumbnails *').remove();

			// Add new thumbnails
			for(var i = 0; i < vars.album.length; i++) {
				var src = vars.album[i].thumb;
				// If no url provided, use a blank 1x1 gif
				if(!src) src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
				jQuery('<div class="thumb" data-lyqbox-index="' + i + '"><img src="' + src + '" /></div>').appendTo(vars.overlay.find('.thumbnails')).click(function(){
					changeContent(parseInt(jQuery(this).attr('data-lyqbox-index')));
				});
			}
		};

		// change content, for now we have 3 types, image, iframe and HTML.
		var changeContent = function(index) {
			lqx.log('Jump to LyqBox slide ' + index);

			disableKeyboardNav();

			// deferred var to be used on alert type lyqbox only, just in case it's loading HTML content from a file
			var promise = jQuery.Deferred();

			// Show loader
			vars.overlay.find('.loading').removeClass('hide');

			// process the new content
			switch (vars.album[index].type) {
				case 'image':
					updateContent('<img src="' + vars.album[index].link + '" />', index, vars.album[index].type);
					break;

				case 'video':
					updateContent('<iframe src="' + vars.album[index].link + '"></iframe>', index, vars.album[index].type);
					break;

				case 'html':
				case 'alert':
					// note that the alert lyqbox can grab html content from a file, put the file URL inside the data-lyqbox-url attribute
					// OR can grab the html content from string, put the string inside the data-lyqbox-html attribute
					// the priority is given to the data-lyqbox-url attribute first, if this is blank, then data-lyqbox-html will be processed instead.

					// check if url is not empty
					if(vars.album[index].link !== '' && typeof vars.album[index].link !== 'undefined' ) {
						jQuery.ajax({
							dataType: 'text',
							error: function(xhr, stat, err){
								updateContent(err, index, vars.album[index].type);
							},
							success: function(data){
								updateContent(data, index, vars.album[index].type);
							},
							url: vars.album[index].link
						});
					}
					else {
						updateContent(vars.album[index].html, index, vars.album[index].type);
					}
					break;

				default:
					break;
			}

			// Send event for changeContent
			if(opts.analytics) {
			// Set the analytics event label
				var eventLabel = vars.album[index].type +
					(vars.album[index].albumId ? ':' + vars.album[index].albumId : '') +
					(vars.album[index].title ? ' [' + vars.album[index].title + ']' : '') +
					(vars.album[index].link ? ' (' + vars.album[index].link + ')' : '');

				ga('send', {
					'hitType': 'event',
					'eventCategory': 'LyqBox',
					'eventAction': 'View',
					'eventLabel': eventLabel
				});
			}
		};

		var updateContent = function(content, index, type) {
			// Get inactive container
			var containerInactive = vars.overlay.find('.content-wrapper').not('.active');

			// Add onload event to content, for image and videos
			if(type == 'image' || type == 'video') {
				content = jQuery(content);
				content.on('load', function(){
					// Hide loader
					vars.overlay.find('.loading').addClass('hide');
				});
				content = jQuery('<div class="' + type + '-container"></div>').append(content);
			}
			else {
				content = jQuery('<div class="' + type + '-container">' + content + '</div>');
				// Hide loader
				vars.overlay.find('.loading').addClass('hide');
			}

			// Append new content to inactive container
			containerInactive.addClass('active').find('.content').removeClass().addClass('content ' + type).empty().append(content);

			// Make previous content inactive
			vars.containerActive.removeClass('active');

			// Remove previous video
			vars.containerActive.find('.content.video iframe').remove();

			// Update active container and index
			vars.containerActive = containerInactive;
			vars.currentIndex = index;

			// Enable keyboard and update interface
			updateUIandKeyboard();

			// Add hash
			addHash();
		};

		var addHash = function() {
			// Check if we have an albumId
			if(vars.album[vars.currentIndex].albumId) {
				var hash = '#' + vars.album[vars.currentIndex].albumId + ':';
				// If an alias has been specified, use that
				if(vars.album[vars.currentIndex].alias) {
					history.replaceState(null, null, hash + vars.album[vars.currentIndex].alias);
				}
				// If not use the index
				else {
					history.replaceState(null, null, hash + vars.currentIndex);
				}
			}
		};

		// Display the image and its details and begin preload neighboring images.
		var updateUIandKeyboard = function() {
			updateUI();
			enableKeyboardNav();
		};

		// Display caption, image number, and closing button.
		var updateUI = function() {

			// alert type will hide everything except close and content
			if(vars.album[vars.currentIndex].type != 'alert' ) {
				// display title
				if(typeof vars.album[vars.currentIndex].title !== 'undefined' &&
					vars.album[vars.currentIndex].title !== '') {
					vars.overlay.find('.title')
						.html(vars.album[vars.currentIndex].title);
				}
				else {
					vars.overlay.find('.title').html('');
				}
				// display caption
				if(typeof vars.album[vars.currentIndex].caption !== 'undefined' &&
					vars.album[vars.currentIndex].caption !== '') {
					vars.overlay.find('.caption')
						.html(vars.album[vars.currentIndex].caption);
				}
				else {
					vars.overlay.find('.caption').html('');
				}
				// display credit
				if(typeof vars.album[vars.currentIndex].credit !== 'undefined' &&
					vars.album[vars.currentIndex].credit !== '') {
					vars.overlay.find('.credit')
						.html(vars.album[vars.currentIndex].credit);
				}
				else {
					vars.overlay.find('.credit').html('');
				}
				// display counter (current and total) and nav only if gallery
				if(vars.album.length > 1)  {
					vars.overlay.find('.current').text(vars.currentIndex + 1);
					vars.overlay.find('.total').text(vars.album.length);
				}
				else {
					vars.overlay.find('.prev, .next, .counter, .thumbnails').addClass('hide');
				}
				// display zoom buttons only for images
				if(vars.album[vars.currentIndex].type == 'image') {
					vars.overlay.find('.zoom-in, .zoom-out').removeClass('hide');
				}
				else {
					vars.overlay.find('.zoom-in, .zoom-out').addClass('hide');
				}
			}
			else {
				vars.overlay.find('.prev, .next, .counter, .zoom-in, .zoom-out, .thumbnails').addClass('hide');
			}
		};

		var enableKeyboardNav = function() {
			lqx.vars.document.on('keyup.keyboard', jQuery.proxy(keyboardAction, lqx.lyqbox));
		};

		var disableKeyboardNav = function() {
			lqx.vars.document.off('.keyboard');
		};

		var swipeHandler = function(sel, dir) {
			if(dir == 'l') keyboardAction({keyCode: 39}); // swipe to the left equals right arrow
			if(dir == 'r') keyboardAction({keyCode: 37}); // swipe to the right equals left arrow
		};

		var keyboardAction = function(event) {
			var KEYCODE_ESC = 27;
			var KEYCODE_LEFTARROW = 37;
			var KEYCODE_RIGHTARROW = 39;

			var keycode = event.keyCode;
			var key = String.fromCharCode(keycode).toLowerCase();
			if(keycode === KEYCODE_ESC || key.match(/x|o|c/)) {
				end();
			}
			else if(keycode === KEYCODE_LEFTARROW) {
				if(vars.currentIndex === 0) {
					changeContent(vars.album.length - 1);
				}
				else {
					changeContent(vars.currentIndex - 1);
				}
			}
			else if(keycode === KEYCODE_RIGHTARROW) {
				if(vars.currentIndex === vars.album.length - 1) {
					changeContent(0);
				}
				else {
					changeContent(vars.currentIndex + 1);
				}
			}
		};

		// This only works in Chrome 9, Firefox 4, Safari 5, Opera 11.50 and in IE 10
		var removeHash = function() {
			var scrollV, scrollH, loc = window.location;
			if('pushState' in history)
				history.pushState('', document.title, loc.pathname + loc.search);
			else {
				// Prevent scrolling by storing the page's current scroll offset
				scrollV = document.body.scrollTop;
				scrollH = document.body.scrollLeft;

				loc.hash = '';

				// Restore the scroll offset, should be flicker free
				document.body.scrollTop = scrollV;
				document.body.scrollLeft = scrollH;
			}
		};

		// Closing time
		var end = function() {
			// Stop listening to keyboard
			disableKeyboardNav();

			// Close lyqbox
			vars.overlay.removeClass('open');

			// Remove video
			vars.containerActive.find('.content.video iframe').remove();

			// Remove hash
			history.replaceState(null, null, '');

			lqx.log('Close LyqBox');

			// Send event for lightbox opened
			if(opts.analytics) {
				ga('send', {
					'hitType': 'event',
					'eventCategory': 'LyqBox',
					'eventAction': 'Close'
				});
			}
		};

		return {
			init: init
		};
	})();
	lqx.lyqbox.init();
}
