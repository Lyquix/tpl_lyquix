/**
 * fixes.js - Browser fixes
 *
 * @version     2.0.0-beta-5
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

if(lqx && typeof lqx.fixes == 'undefined') {
	lqx.fixes = (function(){
		var init = function(){
			// Initialize only if enabled
			if(lqx.opts.fixes.enabled) {
				lqx.log('Initializing `fixes`');

				// IE fixes
				if(lqx.detect.browser.type == 'msie') {
					// Trigger functions on document ready
					lqx.vars.document.ready(function() {
						imgWidthAttrib();
						fontFeatureopts();
						cssGrid();
					});

					// Trigger functions on screen changes (reside, rotation)
					lqx.vars.window.on('screensizechange orientationchange', function() {
						cssGrid();
					});
				}
			}

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
			jQuery('<style>html, sup, sub, samp, td, th, h1, h2, h3, .font-monospace, .font-smallcaps, .font-uppercase {font-feature-opts: normal;}</style>').appendTo('head');
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

		return {
			init: init
		};
	})();
	lqx.fixes.init();
}
