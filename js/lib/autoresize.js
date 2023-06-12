/**
 * autoresize.js - Automatically resize form elements to show contents
 *
 * @version     2.4.0
 * @package     wp_theme_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/wp_theme_lyquix
 */

if(lqx && !('autoresize' in lqx)) {
	lqx.autoresize = (function(){
		/**
		 * Makes textarea, input and select elements to resize automatically
		 * to display its complete value.
		 *
		 * To activate just add the class .autoresize to the form fields you want
		 * to resize.
		 *
		 * textarea elements are stretched vertically, while input and select are
		 * stretched horizontally.
		 *
		 * Remember to include max-width and max-height styles to prevent form
		 * fields stretching from breaking your page.
		 *
		 * Demo: http://jsfiddle.net/lyquix/4m67ud9k/
		 */

		var opts = {
			autoresizeSelector: '.autoresize',
			sel: [
				'textarea',
				'input[type=text]',
				'input[type=email]',
				'input[type=number]',
				'select:not([size])'
			]
		};

		var vars = {
			sel: ''
		};

		var init = function(){
			// Copy default opts and vars
			jQuery.extend(true, lqx.opts.autoresize, opts);
			opts = lqx.opts.autoresize;
			jQuery.extend(true, lqx.vars.autoresize, vars);
			vars = lqx.vars.autoresize;

			// Initialize on lqxready
			lqx.vars.window.on('lqxready', function() {
				// Initialize only if enabled
				if(opts.enabled) {
					lqx.log('Initializing `autoresize`');

					// Add the .autoresize class
					opts.sel.forEach(function(sel, idx){
						opts.sel[idx] = sel + opts.autoresizeSelector;
					});
					// Process the sel option into a selector string
					vars.sel = opts.sel.join(', ');

					// Trigger functions on document ready
					lqx.vars.document.ready(function() {
						// Setup accordions loaded initially on the page
						setup(jQuery(vars.sel));

						// Add a mutation handler for accordions added to the DOM
						lqx.mutation.addHandler('addNode', opts.sel.join(','), setup);
					});
				}
			});

			// Run only once
			lqx.autoresize.init = function(){
				lqx.warn('lqx.autoresize.init already executed');
			};

			return true;
		};

		var setup = function(elems) {
			if(elems instanceof Node) {
				// Not an array, convert to an array
				elems = [elems];
			}
			else if(elems instanceof jQuery) {
				// Convert jQuery to array
				elems = elems.toArray();
			}
			if(elems.length) {
				lqx.log('Setting up ' + elems.length + ' autoresize fields', elems);
				elems.forEach(function(elem){
					jQuery(elem).on('input', function(){resize(elem);});
					resize(elem);
				});
			}
		};

		var resize = function(elem) {
			elem = jQuery(elem);
			var overflow = elem.css('overflow');
			switch(elem.prop('nodeName').toLowerCase()) {
				case 'textarea':
					elem.height(0).css('overflow', 'hidden');
					if(elem.css('box-sizing') == 'content-box') {
						elem.height(elem.prop('scrollHeight') - elem.innerHeight());
					}
					else {
						elem.height(elem.prop('scrollHeight') - parseInt(elem.css('padding-top')) - parseInt(elem.css('padding-bottom')));
					}
					elem.css('overflow', overflow);
					break;

				case 'input':
					elem.width(0).css('overflow', 'hidden');
					if(elem.css('box-sizing') == 'content-box') {
						elem.width(elem.prop('scrollWidth') - elem.innerWidth());
					}
					else {
						elem.width(elem.prop('scrollWidth') - parseInt(elem.css('padding-left')) - parseInt(elem.css('padding-right')));
					}
					elem.css('overflow', overflow);
					break;

				case 'select':
					elem.width('auto');
					// Get index of selected option
					var idx = elem.prop('selectedIndex');
					// Temporarily remove all other options
					var opts = elem.find('option').not(':selected').detach();
					// Get the width of select
					var w = elem.width();
					// Reattach options
					opts.appendTo(elem);
					// Get complete list of options
					opts = elem.find('option');
					// Move the first option to its original position
					opts.eq(0).insertAfter(opts.eq(idx));
					// Set new width
					elem.width(w);
					break;
			}
		};

		return {
			init: init,
			setup: setup
		};
	})();
	lqx.autoresize.init();
}
