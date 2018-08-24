/**
 * lyqbox.js - LyqBox - Lyquix lightbox functionality
 *
 * @version     2.0.0-beta-2
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

if(lqx && typeof lqx.lyqbox == 'undefined') {
	lqx.lyqbox = (function(){
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
					'<div class="counter">' +
						'<span class="current"></span>' +
						' of <span class="total"></span>' +
					'</div>' +
				'</div>'
		};

		var vars = {
			album: [],
			currentImageIndex: 0,
			initialized: false
		};

		var init = function(){
			// Initialize only if enabled
			if(lqx.opts.lyqbox.enabled) {
				lqx.log('Initializing `lyqbox`');

				// Copy default opts and vars
				jQuery.extend(lqx.opts.lyqbox, opts);
				opts = lqx.opts.lyqbox;
				jQuery.extend(lqx.vars.lyqbox, vars);
				vars = lqx.vars.lyqbox;

				// Trigger functions on lqxready
				lqx.vars.window.on('lqxready', function() {
					// Add a mututation observer to run setup if lyqbox is added after document ready
					lqx.mutation.addHandler('addNode', '[data-lyqbox]', function(e){
						setup();
					});
				});

				// Initialize on document ready
				lqx.vars.window.ready(function() {
					if(jQuery('[data-lyqbox]').length) {
						setup();
					}
				});
			}

			return lqx.lyqbox.init = true;
		};

		var setup = function() {
			if(!vars.initialized) {
				enable();
				build();

				// to handle alertbox and hash url at the same time, we prioritize the alertbox first.
				// using promise, we make sure the alertbox shows first, and show the hash url content after the promise is done (alertbox is closed)
				var alertPromise = alert(jQuery('[data-lyqbox-type=alert]'));

				// check hash after promise is resolved/reject. Rejected is a valid return due to alerbox already shown before/cookie found.
				alertPromise.always(function afterAlertCheck() {
					hash();
				});

				vars.initialized = true;
			}
		};

		// show the hash url content
		var hash = function() {
			if (window.location.hash.substr(1) !== '') {
				// get hash value and display the appropriate content
				var contentData = window.location.hash.substr(1).split('_');

				if (jQuery('[data-lyqbox=' + contentData[0] + '][data-lyqbox-alias=' + contentData[1] + ']').length){
					start(jQuery('[data-lyqbox=' + contentData[0] + '][data-lyqbox-alias=' + contentData[1] + ']'));
				}
			}
		};

		// show alertbox if found.
		var alert = function(alertbox) {
			var deferred = jQuery.Deferred();
			// assume that there is only one alertbox at any given time.
			if (alertbox.length == 1) {
				// check if a cookie for this alertbox exists, if so return deferred reject.
				var cookieName = 'lyqbox-alert-' + alertbox.attr('data-lyqbox');
				var alertCookieFound = localStorage.getItem(cookieName);
				if (alertCookieFound) {
					deferred.reject();
				}
				// if no cookie found, show the alertbox
				else {
					// show the alertbox
					start(alertbox);

					// add listener to the close button to save the cookie and return deferred resolved
					jQuery('.lyqbox .close').on('click', function alertBoxCloseButtonClicked() {
						var cookieName = 'lyqbox-alert-' + vars.album[vars.currentImageIndex].albumId;
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

		// Loop through anchors and areamaps looking for either data-lightbox attributes or rel attributes
		// that contain 'lightbox'. When these are clicked, start lightbox.
		var enable = function() {
			// we initialize everything
			lqx.vars.body.on('click', '[data-lyqbox]', function(event) {
				jQuery('.lyqbox').addClass('open');
				start(jQuery(event.currentTarget));
				return false;
			});

		};

		var build = function() {
			// append html structure
			jQuery(opts.html).appendTo(lqx.vars.body);

			// assign the html container class to namespace variable
			vars.overlay = jQuery('.lyqbox');

			// assign active content container to the first .content box
			vars.containerActive = vars.overlay.find('.content-wrapper').first().addClass('active');

			// Add swipe event handler
			lqx.util.swipe('.lyqbox .content-wrapper', swipeHandler);

			// prev button click handling
			vars.overlay.find('.prev').on('click', function() {
				if (vars.currentImageIndex === 0) {
					changeContent(vars.album.length - 1);
				} else {
					changeContent(vars.currentImageIndex - 1);
				}
				return false;
			});

			// next button click handling
			vars.overlay.find('.next').on('click', function() {
				if (vars.currentImageIndex === vars.album.length - 1) {
					changeContent(0);
				} else {
					changeContent(vars.currentImageIndex + 1);
				}
				return false;
			});

			// close button click handling
			vars.overlay.find('.close').on('click', function() {
				// disable the close button for alertbox, cookie save handling to prevent the alert box to reappear will be done on the deferred section on alert function to make sure in the case alert and hashurl found,
				// that the alert box is closed properly before showing a hash url content.
				if (vars.album[vars.currentImageIndex].type == 'alert')
					return false;

				// else close the lightbox
				end();
				return false;
			});

		};

        // special function remove video iframe from DOM, otherwise it will still play in the background
        var stopVideo = function(type) {
            if (type == 'video') {
                vars.containerActive.find('.content.video .video-container iframe').remove();
            }
        };


		// Show overlay and lightbox. If the image is part of a set, add siblings to album array.
		var start = function(data) {
			vars.album = [];
			var currentIndex = 0;

			function addToAlbum(data) {
				vars.album.push({
					albumId: data.attr('data-lyqbox'),
					type: data.attr('data-lyqbox-type'),
					link: data.attr('data-lyqbox-url'),
					title: data.attr('data-lyqbox-title'),
					caption: data.attr('data-lyqbox-caption'),
					credit: data.attr('data-lyqbox-credit'),
					class: data.attr('data-lyqbox-class'),
					alias: data.attr('data-lyqbox-alias'),
					html: data.attr('data-lyqbox-html'),
				});
			}

			var items;

			// build the album, the object which contains all values passed from the attribute
			var datalyqboxValue = data.attr('data-lyqbox');
			if (datalyqboxValue) {
				items = jQuery(data.prop('tagName') + '[data-lyqbox="' + datalyqboxValue + '"]');

				for (var i = 0; i < items.length; i = ++i) {
					addToAlbum(jQuery(items[i]));
					//
					if (items[i] === data[0]) {
						currentIndex = i;
					}
				}
			}

			// change the content to item at index
			changeContent(currentIndex);
		};

		var loadHTML = function(url) {
			var deferred = jQuery.Deferred();
			// we are using load so one can specify a target with: url.html #targetelement
			var $container = jQuery('<div></div>').load(url, function(response, status) {
				if (status !== 'error') {
					deferred.resolve($container.contents());
				}
				deferred.fail();
			});
			return deferred.promise();
		};

		var addHash = function() {
			if (vars.album[vars.currentImageIndex].alias)
				window.location.hash = vars.album[vars.currentImageIndex].albumId + '_' + vars.album[vars.currentImageIndex].alias;
		};

		// change content, for now we have 3 types, image, iframe and HTML.
		var changeContent = function(index) {
			disableKeyboardNav();
			vars.overlay.addClass('open');

			// deferred var to be used on alert type lyqbox only, just in case it's loading HTML content from a file
			var promise = jQuery.Deferred();

			// process the new content
			switch (vars.album[index].type) {
				case 'image':
					var image = jQuery('<img />');
					var preloader = new Image();
					preloader.src = vars.album[index].link;
					preloader.onload = function() {
						var preloaderObject;
						image.attr('src', vars.album[index].link);

						preloaderObject = jQuery(preloader);

						updateContent(image, index, vars.album[index].type);
						addHash();

						// important line of code to make sure opacity is computed and applied as a starting value to the element so that the css transition works.
						window.getComputedStyle(image[0]).opacity();
					};

					break;

				case 'video':
					var video = jQuery('<iframe></iframe>');
					video.attr('src', vars.album[index].link);

					updateContent('<div class="video-container">' + video.prop('outerHTML') + '</div>', index, vars.album[index].type);
					addHash();
					break;

				case 'html':
				case 'alert':
					// note that the alert lyqbox can grab html content from a file, put the file URL inside the data-lyqbox-url attribute
					// OR can grab the html content from string, put the string inside the data-lyqbox-html attribute
					// the priority is given to the data-lyqbox-url attribute first, if this is blank, then data-lyqbox-html will be processed instead.

					// check if url is not empty
					if (vars.album[index].link !== '' && typeof vars.album[index].link !== 'undefined' ) {
						promise = loadHTML(vars.album[index].link);

						promise.done(function htmlLoaded(htmlResult) {
							if (htmlResult !== '')
								updateContent(htmlResult, index, vars.album[index].type);
						});
					} else {
						updateContent(vars.album[index].html, index, vars.album[index].type);
					}
					break;

				default:
					break;
			}
		};

		var updateContent = function(content, index, type) {
            stopVideo(type);
			vars.overlay.find('.content-wrapper').not('.active').addClass('active').find('.content').removeClass().addClass('content ' + type).empty().append(content);
			vars.containerActive.removeClass('active');
			vars.containerActive = vars.overlay.find('.content-wrapper.active');
			vars.currentImageIndex = index;
			updateUIandKeyboard();
		};

		// Display the image and its details and begin preload neighboring images.
		var updateUIandKeyboard = function() {
			updateUI();
			enableKeyboardNav();
		};

		// Display caption, image number, and closing button.
		var updateUI = function() {

			// alert type will hide title, caption and credit????
			if(vars.album[vars.currentImageIndex].type != 'alert' ) {
				// display title
				if (typeof vars.album[vars.currentImageIndex].title !== 'undefined' &&
					vars.album[vars.currentImageIndex].title !== '') {
					vars.overlay.find('.title')
						.html(vars.album[vars.currentImageIndex].title);
				} else  {
					vars.overlay.find('.title').html('');
				}
				// display caption
				if (typeof vars.album[vars.currentImageIndex].caption !== 'undefined' &&
					vars.album[vars.currentImageIndex].caption !== '') {
					vars.overlay.find('.caption')
						.html(vars.album[vars.currentImageIndex].caption);
				} else  {
					vars.overlay.find('.caption').html('');
				}
				// display credit
				if (typeof vars.album[vars.currentImageIndex].credit !== 'undefined' &&
					vars.album[vars.currentImageIndex].credit !== '') {
					vars.overlay.find('.credit')
						.html(vars.album[vars.currentImageIndex].credit);
				} else  {
					vars.overlay.find('.credit').html('');
				}

				// display counter (current and total) and nav only if gallery
				if (vars.album.length > 1)  {
					vars.overlay.find('.current').text(vars.currentImageIndex + 1);
					vars.overlay.find('.total').text(vars.album.length);
				} else  {
					vars.overlay.find('.prev,.next').addClass('hide');
					vars.overlay.find('.counter').addClass('hide');
				}
			} else {
				vars.overlay.find('.prev,.next').addClass('hide');
				vars.overlay.find('.counter').addClass('hide');
			}
		};

		var enableKeyboardNav = function() {
			lqx.vars.document.on('keyup.keyboard', jQuery.proxy(keyboardAction, lqx.lyqbox));
		};

		var disableKeyboardNav = function() {
			lqx.vars.document.off('.keyboard');
		};

		var swipeHandler = function(sel, dir) {
			console.log(sel, dir);
			if(dir == 'lt') keyboardAction({keyCode: 39}); // swipe to the left equals right arrow
			if(dir == 'rt') keyboardAction({keyCode: 37}); // swipe to the right equals left arrow
		};

		var keyboardAction = function(event) {
			var KEYCODE_ESC = 27;
			var KEYCODE_LEFTARROW = 37;
			var KEYCODE_RIGHTARROW = 39;

			var keycode = event.keyCode;
			var key = String.fromCharCode(keycode).toLowerCase();
			if (keycode === KEYCODE_ESC || key.match(/x|o|c/)) {
				end();
			} else if (keycode === KEYCODE_LEFTARROW) {
				if (vars.currentImageIndex === 0) {
					changeContent(vars.album.length - 1);
				} else {
					changeContent(vars.currentImageIndex - 1);
				}
			} else if (keycode === KEYCODE_RIGHTARROW) {
				if (vars.currentImageIndex === vars.album.length - 1) {
					changeContent(0);
				} else {
					changeContent(vars.currentImageIndex + 1);
				}
			}
		};

		// This only works in Chrome 9, Firefox 4, Safari 5, Opera 11.50 and in IE 10
		var removeHash = function() {
			var scrollV, scrollH, loc = window.location;
			if ('pushState' in history)
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
			disableKeyboardNav();
			vars.overlay.removeClass('open');
			stopVideo(vars.album[vars.currentImageIndex].type);
			removeHash();
		};

		return {
			init: init
		};
	})();
	lqx.lyqbox.init();
}