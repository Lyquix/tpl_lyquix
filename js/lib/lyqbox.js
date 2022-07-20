/**
 * lyqbox.js - LyqBox - Lyquix lightbox functionality
 *
 * @version     2.3.3
 * @package     wp_theme_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/wp_theme_lyquix
 */

 if(lqx && !('lyqbox' in lqx)) {
	lqx.lyqbox = (function(){
		/**
		 * Lyquix lightbox functionality
		 *
		 * Provides 3 types of lightboxes:
		 * 		Simple lightboxes that may includes images, HTML content, or iframes
		 * 		Galleries: a collection of multiple content that the user can navigate.
		 * 			Each gallery slide has own hash URL that can be used to open page showing
		 * 			specific gallery slide.
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
		 * data-lyqbox-title: optional slide title
		 * data-lyqbox-caption: optional slide caption
		 * data-lyqbox-credit: optional slide credits
		 * data-lyqbox-class: optional slide custom CSS classes
		 * data-lyqbox-alias: slide alias to use in URL hash
		 * data-lyqbox-html: content for html or alert lightboxes
		 * data-lyqbox-thumb: for galleries only, URL to thumbnail image
		 * data-lyqbox-alert-dismiss set the text for the dismiss button for alerts, if not set it defaults to "Dismiss"
		 * data-lyqbox-alert-expire: set the expiration time for alerts, if not set it defaults to 30 days
		 *
		 */
		var opts = {
			lyqboxId: '#lyqbox',
			html:
				'<div id="lyqbox">' +
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
			analytics: {
				enabled: true,
				nonInteraction: true
			}
		};

		var vars = {
			overlay: null,
			closeElem: null,
			nextElem: null,
			prevElem: null,
			zoomInElem: null,
			zoomOutElem: null,
			thumbsElem: null,
			loadingElem: null,
			titleElem: null,
			captionElem: null,
			creditElem: null,
			counterElem: null,
			counterCurrElem: null,
			counterTotalElem: null,
			album: [],
			currentIndex: 0,
			initialized: false,
			containerActive: null,
			navEnabled: false
		};

		var init = function(){
			// Copy default opts and vars
			jQuery.extend(true, lqx.opts.lyqbox, opts);
			opts = lqx.opts.lyqbox;
			jQuery.extend(true, lqx.vars.lyqbox, vars);
			vars = lqx.vars.lyqbox;

			// Initialize on lqxready
			lqx.vars.window.on('lqxready', function() {
				// Initialize only if enabled
				if(opts.enabled) {
					lqx.log('Initializing `lyqbox`');

					// Disable analytics if the analytics module is not enabled
					opts.analytics.enabled = lqx.opts.analytics.enabled ? opts.analytics.enabled : false;
					if(opts.analytics.enabled) lqx.log('Setting LyqBox tracking');

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

			// Run only once
			lqx.lyqbox.init = function(){
				lqx.warn('lqx.lyqbox.init already executed');
			};

			return true;
		};

		var setup = function() {
			// Append HTML structure
			if(jQuery(opts.lyqboxId).length) {
				lqx.error('There is an existing #lyqbox element!');
				return false;
			}
			else {
				jQuery(opts.html).appendTo(lqx.vars.body);
			}

			// Get jQuery elements
			vars.overlay = jQuery(opts.lyqboxId);
			vars.closeElem = jQuery(opts.lyqboxId + ' .close');
			vars.nextElem = jQuery(opts.lyqboxId + ' .next');
			vars.prevElem = jQuery(opts.lyqboxId + ' .prev');
			vars.zoomInElem = jQuery(opts.lyqboxId + ' .zoom-in');
			vars.zoomOutElem = jQuery(opts.lyqboxId + ' .zoom-out');
			vars.thumbsElem = jQuery(opts.lyqboxId + ' .thumbnails');
			vars.loadingElem  = jQuery(opts.lyqboxId + ' .loading');
			vars.titleElem  = jQuery(opts.lyqboxId + ' .info .title');
			vars.captionElem  = jQuery(opts.lyqboxId + ' .info .caption');
			vars.creditElem  = jQuery(opts.lyqboxId + ' .info .credit');
			vars.counterElem  = jQuery(opts.lyqboxId + ' .counter');
			vars.counterCurrElem  = jQuery(opts.lyqboxId + ' .counter .current');
			vars.counterTotalElem  = jQuery(opts.lyqboxId + ' .counter .total');

			// Assign active content container to the first .content box
			vars.containerActive = vars.overlay.find('.content-wrapper').first().addClass('active');

			// Listen for click on lyqbox items
			lqx.vars.body.on('click', '[data-lyqbox]', function(e) {
				e.preventDefault();
				vars.overlay.addClass('open');
				start(jQuery(e.currentTarget));
			});

			// Prev button click handling
			vars.prevElem.on('click', function() {
				prev();
			});

			// Next button click handling
			vars.nextElem.on('click', function() {
				next();
			});

			// Add keyboard listener
			lqx.vars.document.on('keyup', function(e){
				if(e.key == "Escape" || e.key == "Esc") {
					end();
				}
				else if(e.key == "ArrowLeft" || e.key == "Left") {
					prev();
				}
				else if(e.key == "ArrowRight" || e.key == "Right") {
					next();
				}
			});

			// Add swipe event handler, only on images and videos
			lqx.util.swipe(opts.lyqboxId + ' .content.image, ' + opts.lyqboxId + ' .content.video', function(swp){
				if(swp.dir.indexOf('l') != -1) next(); // Swipe to the left equals right arrow
				if(swp.dir.indexOf('r') != -1) prev(); // Swipe to the right equals left arrow
			});

			// Close and dismiss button click handling
			vars.overlay.on('click', '.close, .dismiss button', function() {
				end();
			});

			// Zoom in button click handling
			vars.zoomInElem.on('click', function() {
				var zoom = vars.overlay.find('.image-container img').attr('data-lyqbox-zoom');
				if(typeof zoom == 'undefined') zoom = 0;
				if(zoom < 4) {
					vars.overlay.find('.image-container img').attr('data-lyqbox-zoom', parseInt(zoom) + 1);
				}
			});

			// Zoom out button click handling
			vars.zoomOutElem.on('click', function() {
				var zoom = vars.overlay.find('.image-container img').attr('data-lyqbox-zoom');
				if(typeof zoom == 'undefined') zoom = 0;
				if(zoom > 0) {
					vars.overlay.find('.image-container img').attr('data-lyqbox-zoom', parseInt(zoom) - 1);
				}
			});

			// Thumbnails click handling
			vars.thumbsElem.on('click', '.thumb', function(){
				if(vars.navEnabled) {
					load(parseInt(jQuery(this).attr('data-lyqbox-index')));
				}
			});

			// If alerts show that first, otherwise show hash
			var alertElem = jQuery('[data-lyqbox-type=alert]').eq(0);
			if(alertElem.length) {
				// Check if a cookie for this alert exists, if so return deferred reject.
				if(lqx.util.cookie('lyqbox-alert-' + alertElem.attr('data-lyqbox').slugify()) == null) {
					start(alertElem);
				}
				else {
					showHash();
				}
			}
			else {
				showHash();
			}

			vars.initialized = true;
		};

		// Show the hash url content
		var showHash = function(endIfNoHash) {
			var hash = window.location.hash.substr(1);
			if(hash !== '') {
				// Try alias only first
				var slide = jQuery('[data-lyqbox-alias="' + hash + '"]').eq(0);
				if(slide.length) {
					start(slide);
				}
				else {
					// Try album+alias and album+id
					// Assumes is has 2 parts separated by colon
					var hashParts = hash.split(':');

					if(hashParts.length == 2) {
						// Get all slides within album
						slide = jQuery('[data-lyqbox="' + hashParts[0] + '"]');

						// Are there any slide with the same albumid?
						if(slide.length) {
							// Is it an alias or an index?
							if(isNaN(parseInt(hashParts[1]))) {
								slide = slide.filter('[data-lyqbox-alias=' + hashParts[1] + ']').eq(0);
							}
							else {
								slide = slide.eq(hashParts[1]);
							}

							// If any slide match, start the lightbox
							if(slide.length) {
								lqx.vars.document.ready(function(){
									start(slide);
								});
							}
						}
					}
				}

			}
			else if(endIfNoHash) {
				// Change album type to prevent getting caught in end()
				vars.album[vars.currentIndex].type = '';
				end();
			}
		};

		// Show overlay and lightbox. If the image is part of a set, add siblings to album array.
		var start = function(elem) {
			lqx.log('Open LyqBox', elem);

			// Send event for lightbox opened
			if(opts.analytics.enabled && typeof ga !== 'undefined') {
				ga('send', {
					'hitType': 'event',
					'eventCategory': 'LyqBox',
					'eventAction': 'Open',
					'nonInteraction': opts.analytics.nonInteraction
				});
			}

			vars.album = [];
			vars.currentIndex = 0;
			var startIndex = 0;

			function addToAlbum(elem) {
				var slide = {
					albumId: elem.attr('data-lyqbox'),
					type: elem.attr('data-lyqbox-type'),
					link: elem.attr('data-lyqbox-url'),
					title: elem.attr('data-lyqbox-title'),
					caption: elem.attr('data-lyqbox-caption'),
					credit: elem.attr('data-lyqbox-credit'),
					class: elem.attr('data-lyqbox-class'),
					alias: elem.attr('data-lyqbox-alias'),
					html: elem.attr('data-lyqbox-html'),
					pdf: elem.attr('data-lyqbox-pdf'),
					thumb: elem.attr('data-lyqbox-thumb'),
					dismiss: elem.attr('data-lyqbox-alert-dismiss'),
					expire: elem.attr('data-lyqbox-alert-expire')
				};
				for (var key in slide){
					if(typeof slide[key] == 'undefined') {
						switch(key) {
							case 'dismiss':
								slide[key] = 'Dismiss';
								break;

							case 'expire':
								slide[key] = (30 * 24 * 60 * 60);
								break;

							default:
								slide[key] = '';
								break;
						}
					}
				}
				vars.album.push(slide);
			}

			// build the album, the object which contains all values passed from the attribute
			var albumId = elem.attr('data-lyqbox');
			if(albumId) {
				var slides = jQuery('[data-lyqbox="' + albumId + '"]');
				for (var i = 0; i < slides.length; i = ++i) {
					addToAlbum(jQuery(slides[i]));
					if(slides[i] === elem[0]) {
						startIndex = i;
					}
				}
			}
			else {
				addToAlbum(elem);
			}

			// Prepare albums
			if(vars.album.length > 1) {
				// Show used elements
				jQuery(vars.prevElem).add(vars.nextElem).add(vars.thumbsElem).add(vars.counterElem).removeClass('hide');

				// Remove any previous thumbnails
				vars.thumbsElem.empty();

				// Add new thumbnails
				for(var index = 0; index < vars.album.length; index++) {
					var src = vars.album[index].thumb;
					// If no url provided, use a blank 1x1 gif
					if(!src) src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
					jQuery('<div class="thumb" data-lyqbox-index="' + index + '"><img src="' + src + '" /></div>').appendTo(vars.thumbsElem);
				}
			}
			// Prepare single lightboxes
			else {
				// Hide unused elements
				jQuery(vars.prevElem).add(vars.nextElem).add(vars.thumbsElem).add(vars.counterElem).addClass('hide');
			}

			// Hide zoom buttons (they will be shown again if the slide is an image)
			jQuery(vars.zoomInElem).add(vars.zoomOutElem).addClass('hide');

			// Open lyqbox
			vars.overlay.addClass('open');

			// Load content
			load(startIndex);
		};

		// change content, for now we have 3 types, image, iframe and HTML.
		var load = function(index) {
			lqx.log('Load slide ' + index);

			// Disable navigation
			vars.navEnabled = false;

			// Show loader
			vars.loadingElem.removeClass('hide');

			// process the new content
			switch (vars.album[index].type) {
				case 'image':
					updateContent('<img src="' + vars.album[index].link + '" />', index, vars.album[index].type);
					break;

				case 'video':
					updateContent('<iframe src="' + vars.album[index].link + '"></iframe>', index, vars.album[index].type);
					break;
				case 'pdf':
					updateContent('<embed src="' + vars.album[index].link + '" />', index, vars.album[index].type);
					break;

				case 'html':
				case 'alert':
					// Note that the html and alert lyqbox can grab content from a URL set on data-lyqbox-url
					// OR can grab the html content from string, put the string inside the data-lyqbox-html attribute
					// Priority is given to the data-lyqbox-url attribute first, if this is blank, then data-lyqbox-html will be processed instead.

					var type = vars.album[index].type;

					// Check if URL is not empty
					if(vars.album[index].link) {
						jQuery.ajax({
							dataType: 'text',
							error: function(xhr, stat, err){
								ajaxComplete(err, index, type);
							},
							success: function(data){
								ajaxComplete(data, index, type);
							},
							url: vars.album[index].link
						});
						updateContent('', index, type);
					}
					// No URL, assume html attribute was used
					else {
						updateContent(vars.album[index].html, index, type);
					}
					break;

				default:
					break;
			}

			// Send event for load
			if(opts.analytics.enabled && typeof ga !== 'undefined') {
			// Set the analytics event label
				var eventLabel = vars.album[index].type +
					(vars.album[index].albumId ? ':' + vars.album[index].albumId : '') +
					(vars.album[index].title ? ' [' + vars.album[index].title + ']' : '') +
					(vars.album[index].link ? ' (' + vars.album[index].link + ')' : '');

				ga('send', {
					'hitType': 'event',
					'eventCategory': 'LyqBox',
					'eventAction': 'Load Slide',
					'eventLabel': eventLabel,
					'nonInteraction': opts.analytics.nonInteraction
				});
			}
		};

		// Process content after ajax
		var ajaxComplete = function(content, index, type) {
			// Check if we are still in the same slide
			if(index == vars.currentIndex) {
				// Get alert dismiss button
				if(type == 'alert') {
					content += '<div class="dismiss"><button>' + vars.album[vars.currentIndex].dismiss + '</button></div>';
				}
				// Load content
				vars.containerActive.find('.' + type + '-container').html(content);
				// Hide loader
				vars.loadingElem.addClass('hide');
			}
		};

		var updateContent = function(content, index, type) {
			// Add onload event to hide loader for image and videos
			if(type == 'image' || type == 'video' || type == 'pdf') {
				content = jQuery(content);
				content.on('load', function(){
					// Hide loader
					vars.loadingElem.addClass('hide');
				});
				content = jQuery('<div class="' + type + '-container"></div>').append(content);
			}
			else {
				// Get alert dismiss button
				if(type == 'alert') {
					content += '<div class="dismiss"><button>' + vars.album[vars.currentIndex].dismiss + '</button></div>';
				}
				content = jQuery('<div class="' + type + '-container">' + content + '</div>');
				// Hide loader if we are not waiting for URL to load
				if(!vars.album[index].link) vars.loadingElem.addClass('hide');
			}

			// Get inactive container
			var containerInactive = vars.overlay.find('.content-wrapper').not('.active');

			// Make previous content inactive and remove video
			vars.containerActive.removeClass('active').find('.content.video iframe').remove();

			// Append new content to inactive container
			containerInactive.addClass('active').find('.content').removeClass().addClass('content ' + type).empty().append(content);

			// Update active container and index
			vars.containerActive = containerInactive;
			vars.currentIndex = index;

			// Update UI
			updateUI(type);

			// Enable navigation
			vars.navEnabled = true;

			// Add hash
			addHash();
		};

		// Display slide info, update counter, etc.
		var updateUI = function(type) {
			// For alerts hide everything except close and content
			if(type != 'alert' ) {
				var slide = vars.album[vars.currentIndex];
				// Update title, caption, credit
				vars.titleElem.html(slide.title);
				vars.captionElem.html(slide.caption);
				vars.creditElem.html(slide.credit);
				// If all info is empty, mark the info div as .blank
				if(!slide.title && !slide.caption && !slide.credit) {
					vars.containerActive.find('.info').addClass('blank');
				}
				else {
					vars.containerActive.find('.info').removeClass('blank');
				}
				// For galleries update counter and thumbnails
				if(vars.album.length > 1)  {
					vars.counterCurrElem.text(vars.currentIndex + 1);
					vars.counterTotalElem.text(vars.album.length);
					vars.thumbsElem.children().removeClass('active').eq(vars.currentIndex).addClass('active');
				}
				// Display zoom buttons only for images
				if(type == 'image') {
					jQuery(vars.zoomInElem).add(vars.zoomOutElem).removeClass('hide');
				}
				else {
					jQuery(vars.zoomInElem).add(vars.zoomOutElem).addClass('hide');
				}
			}
		};

		// Adds hash to location bar
		var addHash = function() {
			var slide = vars.album[vars.currentIndex];
			// Skip alerts
			if(slide.type != 'alert') {
				var hash = '#';
				// Prioritize album+alias, then alias, then album+id
				if(slide.albumId && slide.alias) {
					hash += slide.albumId + ':' + slide.alias;
				}
				else if(slide.alias) {
					hash += slide.alias;
				}
				else if(slide.albumId) {
					hash += slide.albumId + ':' + vars.currentIndex;
				}
				else {
					hash = '';
				}
				if(hash) window.history.replaceState(null, null, hash);
			}
		};

		var next = function() {
			if(vars.navEnabled) {
				if(vars.currentIndex == vars.album.length - 1) {
					load(0);
				}
				else {
					load(vars.currentIndex + 1);
				}
			}
		};

		var prev = function() {
			if(vars.navEnabled) {
				if(vars.currentIndex == 0) {
					load(vars.album.length - 1);
				}
				else {
					load(vars.currentIndex - 1);
				}
			}
		};

		// Closing time
		var end = function() {
			// Check if we are exiting from an alert, set cookie and show hash
			if(vars.album[vars.currentIndex].type == 'alert') {
				lqx.util.cookie('lyqbox-alert-' + vars.album[vars.currentIndex].albumId.slugify(), 1, {maxAge: parseInt(vars.album[vars.currentIndex].expire)});
				showHash(true);
				return;
			}

			// Disable navigation
			vars.navEnabled = false;

			// Remove content and thumbnails
			vars.overlay.find('.content').empty();
			vars.thumbsElem.empty();

			// Close lyqbox
			vars.overlay.removeClass('open');

			// Remove hash
			window.history.replaceState(null, null, '');

			lqx.log('Close LyqBox');

			// Send event for lightbox opened
			if(opts.analytics.enabled && typeof ga !== 'undefined') {
				ga('send', {
					'hitType': 'event',
					'eventCategory': 'LyqBox',
					'eventAction': 'Close',
					'nonInteraction': opts.analytics.nonInteraction
				});
			}
		};

		return {
			init: init
		};
	})();
	lqx.lyqbox.init();
}