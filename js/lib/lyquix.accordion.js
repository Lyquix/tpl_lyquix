/**
 * lyquix.accordion.js - Functionality to handle accordions
 *
 * @version     2.0.0
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

if(lqx && typeof lqx.accordion == 'undefined') {
	lqx.accordion = (function(){
		/** Adds accordion functionality to any element
			with the .accordion class

			It automatically uses the first child as header element
			unless you specificy an element with class
			.accordion-header

			The minimum CSS you need for this to work is have the
			accordion element to have overflow:hidden

			The code adds a class .closed or .open, and sets the accordion height
			as inline style

			The height of the accordion when open and closed is
			recalculated on resize, screen change, and orientation change

			If the accordion is a child of an .accordion-group parent, when one accordion
			is opened the rest are closed.
		**/
		var opts = {
			scrollTopPadding: 15, // percentage from top of screen
			scrollTopDuration: 500 // in ms
		};

		var init = function(){
			// Initialize only if enabled
			if(lqx.opts.accordion.enabled) {
				lqx.log('Initializing `accordion`');

				// Copy default opts and vars
				jQuery.extend(lqx.opts.accordion, opts);
				opts = lqx.opts.accordion;
				vars = lqx.vars.accordion = [];

				// Trigger functions on document ready
				lqx.vars.document.ready(function() {
					// Setup accordions loaded initially on the page
					setup(jQuery('.accordion'));

					// Add listener for screen change and orientation change
					lqx.vars.window.on('load screensizechange orientationchange resizethrottle', function(){
						update();
					});

					// Add a mutation handler for accordions added to the DOM
					lqx.mutation.addHandler('addNode', '.accordion', setup);
				});
			}

			return lqx.accordion.init = true;
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
			elems.forEach(function(elem){
				var a = {};
				a.elem = jQuery(elem);

				// Get header element: first child with class .accordion-header (if none, just pick the first child)
				a.header = a.elem.children('accordion-header');
				if(a.header.length) {
					a.header = jQuery(a.header[0]);
				}
				else {
					a.header = jQuery(a.elem.children()[0]);
					a.header.addClass('accordion-header');
				}

				// Force remove all transitions
				a.elem.css('transition', 'none !important');

				// Get height of header element
				a.closedHeight = a.header.outerHeight(true);

				// Get height of whole accordion
				a.openHeight = a.elem.innerHeight();

				// Close the accordion
				a.elem.css('height', a.closedHeight).addClass('closed');

				// Allow transitions again
				a.elem.css('transition', '');

				// Add click listener
				a.header.click(function(){
					// Open accordion
					if(a.elem.hasClass('closed')) {
						a.elem.removeClass('closed').addClass('open');
						a.elem.css('height', a.openHeight);
						jQuery('html, body').animate({
							scrollTop: (a.elem.offset().top - lqx.vars.window.height() * opts.scrollTopPadding / 100)
						}, opts.scrollTopDuration);
						// Close all other accordions in group
						var group = a.elem.parents('.accordion-group');
						if(group.length) {
							jQuery(group[0]).find('.accordion.open').not(a.elem).find('.accordion-header').trigger('click');
						}
					}
					// Close accordion
					else {
						a.elem.addClass('closed').removeClass('open');
						a.elem.css('height', a.closedHeight);
					}
				});

				// Save on vars
				vars.push(a);
			});
		};

		var update = function(){
			vars.forEach(function(a){
				// Keep original state of the accordion
				var closed = a.elem.hasClass('closed');

				// Force remove all transitions
				a.elem.css('transition', 'none !important');

				// Open the accordion
				a.elem.css('height', 'auto').removeClass('closed');

				// Get height of header element
				a.closedHeight = a.header.outerHeight(true);

				// Get height of whole accordion
				a.openHeight = a.elem.innerHeight();

				// Close the accordion again, or set the open height
				if(closed) {
					a.elem.css('height', a.closedHeight).addClass('closed');
				}
				else {
					a.elem.css('height', a.openHeight);
				}

				// Allow transitions again
				a.elem.css('transition', '');
			});
		};

		return {
			init: init
		};
	})();
	lqx.accordion.init();
}
