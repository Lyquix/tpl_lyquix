/**
 * fixes.js - Browser fixes
 *
 * @package     wp_theme_lyquix
 * @version     2.4.0
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/wp_theme_lyquix
 */

if(lqx && !('fixes' in lqx)) {
	lqx.fixes = (function(){
		var opts = {
			// Control what specific fixes to apply
			imgWidthAttrib: {
				enabled: true,
				method: 'include',
				matches: [
					{
						browser: {
							type: 'msie'
						}
					}
				]
			},
			fontFeatureOpts: {
				enabled: true,
				method: 'include',
				matches: [
					{
						browser: {
							type: 'msie'
						}
					}
				]
			},
			cssGrid: {
				enabled: true,
				method: 'include',
				matches: [
					{
						browser: {
							type: 'msie'
						}
					}
				]
			},
			linkPreload: {
				enabled: true,
				method: 'include',
				matches: [
					{
						os: {
							type: 'ios',
							version: [null, '11.2']
						}
					},
					{
						browser: {
							type: 'msie'
						}
					},
					{
						browser: {
							type: 'firefox'
						}
					},
					{
						browser: {
							type: 'safari',
							version: [null, '11.2']
						}
					},
					{
						browser: {
							type: 'msedge',
							version: [null, 16]
						}
					}
				]
			},
			objectFit: {
				enabled: true,
				method: 'include',
				matches: [
					{
						browser: {
							type: 'msie'
						}
					}
				]
			},
		};

		var vars = {
		};

		var init = function(){
			// Copy default opts and vars
			jQuery.extend(true, lqx.opts.fixes, opts);
			opts = lqx.opts.fixes;
			jQuery.extend(true, lqx.vars.fixes, vars);
			vars = lqx.vars.fixes;

			// Initialize on lqxready
			lqx.vars.window.on('lqxready', function() {
				// Initialize only if enabled
				if(opts.enabled) {
					lqx.log('Initializing `fixes`');

					// Trigger functions immediately
					matchFix('linkPreload');

					// Trigger functions on document ready
					lqx.vars.document.ready(function() {
						matchFix('imgWidthAttrib');
						matchFix('fontFeatureOpts');
						matchFix('cssGrid');
					});

					// Trigger functions on document loaded
					lqx.vars.window.on('load', function() {
						matchFix('objectFit');
					});

					// Trigger functions on screen changes (reside, rotation)
					lqx.vars.window.on('screensizechange orientationchange', function() {
						matchFix('cssGrid');
					});
				}
			});

			// Run only once
			lqx.fixes.init = function(){
				lqx.warn('lqx.fixes.init already executed');
			};

			return true;
		};

		// Runs fix code if browser, os, and device type match configuration
		var matchFix = function(fix) {
			if(opts[fix].enabled) {
				var fixMatches = false;
				opts[fix].matches.forEach(function(match) {
					lqx.log('Matching fix ' + fix + ' to matching rules:', match);
					['os', 'browser'].forEach(function(type) {
						if(type in match) {
							if('version' in match[type]) {
								if(match[type].version[0] != null && match[type].version[1] == null) {
									if(match[type].type == lqx.detect[type]().type &&
									lqx.util.versionCompare(lqx.detect[type]().version, match[type].version[0]) !== -1) fixMatches = true;
								}
								else if(match[type].version[0] == null && match[type].version[1] != null) {
									if(match[type].type == lqx.detect[type]().type &&
									lqx.util.versionCompare(lqx.detect[type]().version, match[type].version[1]) !== 1) fixMatches = true;
								}
								else if(match[type].version[0] != null && match[type].version[1] != null) {
									if(match[type].type == lqx.detect[type]().type &&
									lqx.util.versionCompare(lqx.detect[type]().version, match[type].version[0]) !== -1 &&
									lqx.util.versionCompare(lqx.detect[type]().version, match[type].version[1]) !== 1) fixMatches = true;
								}
							}
							else {
								if(match[type].type == lqx.detect[type]().type) fixMatches = true;
							}
						}
						if(fixMatches) lqx.log('Match found for fix ' + fix, match);
					});
				});
				if((fixMatches && opts[fix].method == 'include') || (!fixMatches && opts[fix].method == 'exclude')) {
					eval(fix + '();');
				}
			}
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
		var fontFeatureOpts = function() {
			jQuery('<style>*, :before, :after {font-feature-settings: normal !important;}</style>').appendTo('body');
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
				fontFamilyStr.replace(/(^"|"$)/g,'').replace(re, function(match, g1, property, value) {
					if((property == 'object-fit' && (value == 'cover' || value == 'contain')) || property == 'object-position'){
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
				if (img.attr('data-object-fit') !== 'true') img.attr('data-src', src);

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
					img.css('background-image', 'none');
				}

			});
		};

		return {
			init: init
		};
	})();
	lqx.fixes.init();
}
