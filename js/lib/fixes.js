/**
 * fixes.js - Browser fixes
 *
 * @version     2.0.0
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

if(lqx && typeof lqx.fixes == 'undefined') {
	lqx.fixes = (function(){
		var init = function(){
			// Initialize on lqxready
			lqx.vars.window.on('lqxready', function() {
				// Initialize only if enabled
				if(lqx.opts.fixes.enabled) {
					lqx.log('Initializing `fixes`');

					// Trigger functions immediately
					switch(lqx.detect.browser().type) {
						case 'msie':
						case 'firefox':
							linkPreload();
							break;
					}

					// Trigger functions on document ready
					lqx.vars.document.ready(function() {
						switch(lqx.detect.browser().type) {
							case 'msie':
								imgWidthAttrib();
								fontFeatureopts();
								cssGrid();
								objectFit();
								break;
						}
					});

					// Trigger functions on screen changes (reside, rotation)
					lqx.vars.window.on('screensizechange orientationchange', function() {
						switch(lqx.detect.browser().type) {
							case 'msie':
								cssGrid();
								updateObjectFit();
								break;
						}
					});
				}
			});

			return lqx.fixes.init = true;
		};

		// Adds width attribute to img elements that don't have one
		var imgWidthAttrib = function() {
			// Check all images
			jQuery('img').each(function(){
				var img = jQuery(this);
				if(img.attr('width') === undefined) setImgWidth(img);
			});

			// Add a mututation observer to fix images added to the DOM
			lqx.mutation.addHandler('addNode', 'img', function(e){
				var img = jQuery(e);
				if(img.attr('width') === undefined) setImgWidth(img);
			});

			lqx.log('Image width attribute fix for IE');
		};

		var setImgWidth = function(img) {
			var newimg = new Image();
			newimg.onload = function() {
				img.attr('width', newimg.width);
			};
			newimg.src = img.attr('src');
		};

		// Fix for Google fonts not rendering in IE10/11
		var fontFeatureopts = function() {
			jQuery('<style>*, :before, :after {font-feature-opts: normal !important;}</style>').appendTo('head');
			lqx.log('Font feature opts property fix for IE10/11');
		};

		// Fix for CSS grid: add column/row position and span if not specified
		var cssGrid = function() {
			var gridElems = jQuery('*').filter(function() {
				if (jQuery(this).css('display') == '-ms-grid') {
					return true;
				}
			});

			if(gridElems.length) {
				gridElems.each(function(){
					var gridElem = jQuery(this);
					var colCount = gridElem.css('-ms-grid-columns').split(' ').length;
					var row = 1;
					var col = 1;
					gridElem.children().each(function(){
						jQuery(this).css({'-ms-grid-column': col, '-ms-grid-column-span': '1', '-ms-grid-row': row, '-ms-grid-row-span': '1'});
						col++;
						if (col > colCount) {
							row++;
							col = 1;
						}
					});
				});
			}

			lqx.log('CSS grid fix for IE');
		};

		// Fix for IE and Firefox not supporting onload event for link re=preload
		var linkPreload = function() {
			jQuery('link[rel=preload][as=style]').attr('onload', '').attr('rel', 'stylesheet');
			lqx.log('Fix for link onload not triggering');
		};

		// Object-fit polyfill for IE11 - sets image as background image
		// and obtains the object-fit and object-position properties from the value of the
		// CSS font-family property, e.g. font-family: 'object-fit: cover; object-position: right bottom;';
		// Supports only cover and contain
		var objectFit = function() {
			// Check all images
			jQuery('img').each(function(){
				fixObjectFit(this);
			});

			// Add a mututation observer to fix images added to the DOM
			lqx.mutation.addHandler('addNode', 'img', function(e){
				fixObjectFit(e);
			});

			lqx.log('object-fit fix for IE');
		};

		var parseObjectFitStyles = function(img) {
			var fontFamilyStr = jQuery(img).css('font-family');
			var styles = {};
			if(fontFamilyStr) {
				// Parse font-family property for object-fit and object-position
				var re = /(([\w-]+)\s*:\s*([\w\s-%#\/\(\)\.']+);*)/g;
				var styles = {};
				fontFamilyStr.replace(/(^"|"$)/g,'').replace(re, function(match, g1, property, value) {
					if(property == 'object-fit' && (value == 'cover' || value == 'contain')) {
						styles[property] = value;
					}
					if(property == 'object-position') {
						styles[property] = value;
					}
				});
			}
			return styles;
		};

		var setBackgroundStyles = function(img, styles) {
			var src = img.attr('data-src');

			// Replace image with transparent 1x1 gif
			img.attr('src', 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');

			// Assign image to backrgound, add styling
			img.css({
				'background-image': 'url(' + src +')',
				'background-repeat': 'no-repeat',
				'background-origin': 'content-box',
				'background-size': styles['object-fit'],
				'background-position': 'center'
			});

			// Assign object-position if available
			if('object-position' in styles) {
				img.css('background-position', styles['object-position']);
			}
		};

		var fixObjectFit = function(img) {
			img = jQuery(img);
			// Get and parse font-family computed style
			var styles = parseObjectFitStyles(img);

			if('object-fit' in styles) {
				// Copy original URL into data-object-fit (this will be used later for updates)
				var src = img.attr('src');
				img.attr('data-src', src);

				// Set image to background and add styling
				setBackgroundStyles(img, styles);

				// Add attribute for later updates
				img.attr('data-object-fit', true);
			}
		};

		var updateObjectFit = function() {
			jQuery('[data-object-fit]').each(function(){
				var img = jQuery(this);
				// Get and parse font-family computed style
				var styles = parseObjectFitStyles(img);

				if('object-fit' in styles) {
					setBackgroundStyles(img, styles);
				}
				else {
					// Revert image back
					img.attr('src', img.attr('data-src'));

					// Revert background image
					img.css({
						'background-image': 'none',
					});
				}

			});
		};

		return {
			init: init
		};
	})();
	lqx.fixes.init();
}
