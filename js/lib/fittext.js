/**
 * fittext.js - Functionality to fit text to specific number of lines
 *
 * @version     2.4.0
 * @package     wp_theme_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/wp_theme_lyquix
 */

if(lqx && !('fittext' in lqx)) {
	lqx.fittext = (function(){
		/** Adds fittext functionality to any element
			with the .fittext class
		**/
		var opts = {
			/**
			 * Options can be set as a primitive (number, string) or as an object with keys
			 * for each screen size for example:
			 *
			 * opts = {
			 *   lines: 1,
			 *   minFontSize: 9,
			 *   maxFontSize: 72
			 * }
			 *
			 * or
			 *
			 * opts = {
			 *   lines: {
			 *     xs: 1,
			 *     sm: 1,
			 *     md: 2,
			 *     lg: 2,
			 *     xl: 2,
			 *   },
			 *   minFontSize: {
			 *     xs: 12,
			 *     sm: 12,
			 *     md: 10,
			 *     lg: 10,
			 *     xl: 8,
			 *   },
			 *   maxFontSize: {
			 *     xs: 36,
			 *     sm: 36,
			 *     md: 48,
			 *     lg: 48,
			 *     xl: 72,
			 *   }
			 * }
			 *
			 */
			fittextSelector: '.fittext',
			lines: 1,
			minFontSize: 8,
			maxFontSize: 72
		};

		var vars = [];

		var init = function(){
			// Copy default opts and vars
			jQuery.extend(true, lqx.opts.fittext, opts);
			opts = lqx.opts.fittext;
			jQuery.extend(true, lqx.vars.fittext, vars);
			vars = lqx.vars.fittext;

			// Initialize on lqxready
			lqx.vars.window.on('lqxready', function() {
				// Initialize only if enabled
				if(opts.enabled) {
					lqx.log('Initializing `fittext`');

					// Trigger functions on document ready
					lqx.vars.document.ready(function() {
						// Setup fittext loaded initially on the page
						setup(jQuery(opts.fittextSelector));

						// Add listener for screen change and orientation change
						lqx.vars.window.on('load screensizechange orientationchange resizethrottle', function(){
							resize();
						});

						// Add a mutation handler for fittext added to the DOM
						lqx.mutation.addHandler('addNode', opts.fittextSelector, setup);
					});
				}
			});

			// Run only once
			lqx.fittext.init = function(){
				lqx.warn('lqx.fittext.init already executed');
			};

			return true;
		};

		var setup = function(elems){
			if(elems instanceof Node) {
				// Not an array, convert to an array
				elems = [elems];
			}
			else if(elems instanceof jQuery) {
				// Convert jQuery to array
				elems = elems.toArray();
			}
			if(elems.length) {
				lqx.log('Setting up ' + elems.length + ' fittext', elems);
				elems.forEach(function(elem){
					var e = {};
					e.elem = jQuery(elem);

					// Save element index
					e.elem.attr('data-fittext', vars.length);

					// Save to vars
					vars.push(e);
				});
			}
		};

		var resize = function(id){
			// Get the fittext to resize
			var elems = [];
			if(typeof id == 'undefined') id = null;
			id = parseInt(id);
			if(!isNaN(id) && id >= 0 && id < vars.length) {
				elems[id] = vars[id];
			}
			else {
				elems = vars;
			}

			// resize the fittext
			elems.forEach(function(elem){
				elem = jQuery(elem);

				// Get options
				var elemOpts = elem.attr('data-fittext');
				if(typeof elemOpts != 'undefined') elemOpts = JSON.parse(elemOpts);
				if(typeof elemOpts != 'object') elemOpts = {};
				elemOpts = jQuery.extend(true, Object.assign({}, opts), elemOpts);
				Object.keys(elemOpts).forEach(function(key){
					if(typeof elemOpts[key] == 'object') elemOpts[key] = elemOpts[key][lqx.responsive.screen()];
				});

				// get original font size
				var origFontSize = parseFloat(elem.css('font-size'));

				// get original number of lines
				var origLines = countLines(elem);

				// first approximation of the font size: resize font and check if it fits in lines
				var testFitLines = elemOpts.lines;
				var testFontSize = origFontSize * testFitLines / origLines;
				elem.css('font-size', testFontSize + 'px');
				var testLines = countLines(elem);

				// Get start time and break if taking too long
				var startTime = new Date().getTime();

				// Fit to lines
				while(testLines != elemOpts.lines) {
					// Use testFitLines as the parameter that changes to adjust font
					testFitLines = testFontSize * origLines / origFontSize;
					if(testLines < elemOpts.lines) testFitLines += 0.05;
					else testFitLines -= 0.05;
					testFontSize = origFontSize * testFitLines / origLines;

					// Break if we exceed min or max font size
					if(testFontSize < elemOpts.minFontSize || testFontSize > elemOpts.maxFontSize) break;

					// Aply new font size and count lines
					elem.css('font-size', testFontSize + 'px');
					testLines = countLines(elem);

					// Break if this is taking too long
					if(new Date().getTime() - startTime > 1000) break;
				}

				// Increase font to fit to width
				while(testLines == elemOpts.lines) {
					testFontSize += 0.1;

					// Break if we exceed min or max font size
					if(testFontSize > elemOpts.maxFontSize) break;

					// Aply new font size and count lines
					elem.css('font-size', testFontSize + 'px');
					testLines = countLines(elem);

					// If we go over, go back the the previous font size and break
					if(testLines > elemOpts.lines) {
						elem.css('font-size', testFontSize - 0.1 + 'px');
						break;
					}

					// Break if this is taking too long
					if(new Date().getTime() - startTime > 1000) break;
				}
			});
		};

		var countLines = function(elem) {
			var content = elem.html();
			var probe = jQuery('<div id="fittext-probe" style="display: inline-block"><wbr></div>');
			elem.prepend(probe);
			var y0 = jQuery('#fittext-probe').position().top;
			probe.detach();
			elem.append(probe);
			var y1 = jQuery('#fittext-probe').position().top;
			var h = jQuery('#fittext-probe').height();
			probe.remove();
			return 1 + (y1 - y0) / h;
		};

		return {
			init: init,
			setup: setup,
			resize: resize
		};
	})();
	lqx.fittext.init();
}
