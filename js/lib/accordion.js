/**
 * accordion.js - Functionality to handle accordions
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
			scrollTop: {
				enabled: true,
				padding: 5, // percentage from top of screen
				duration: 500, // in ms
			}
		};

		var vars = [];

		var init = function(){
			// Copy default opts and vars
			jQuery.extend(lqx.opts.accordion, opts);
			opts = lqx.opts.accordion;
			vars = lqx.vars.accordion = [];

			// Initialize on lqxready
			lqx.vars.window.on('lqxready', function() {
				// Initialize only if enabled
				if(lqx.opts.accordion.enabled) {
					lqx.log('Initializing `accordion`');

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
			});

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
			if(elems.length) {
				lqx.log('Setting up ' + elems.length + ' accordions', elems);
				elems.forEach(function(elem){
					var a = {};
					a.elem = jQuery(elem);

					// Get header element: first child with class .accordion-header (if none, just pick the first child)
					a.header = a.elem.find('.accordion-header');
					if(a.header.length) {
						a.header = jQuery(a.header[0]);
					}
					else {
						a.header = jQuery(a.elem.children()[0]);
						a.header.addClass('accordion-header');
					}

					// Force remove all transitions
					a.elem.css('transition', 'none !important');

					// Get height of header element (the closed height)
					a.closedHeight = a.header.outerHeight(true);

					// Get inner and outer height of open accordion
					a.openHeight = a.elem.innerHeight();
					a.openOuterHeight = a.elem.outerHeight();

					// Close the accordion and get outer closed height
					a.elem.css('height', a.closedHeight).addClass('closed');
					a.closedOuterHeight = a.elem.outerHeight();

					// Allow transitions again
					a.elem.css('transition', '');

					// Add click listener
					a.header.click(function(){
						// Open accordion
						if(a.elem.hasClass('closed')) {
							open(a.elem.attr('data-accordion'));
						}
						// Close accordion
						else {
							close(a.elem.attr('data-accordion'));
						}
					});

					// Save accordion index
					a.elem.attr('data-accordion', vars.length);

					// Save on vars
					vars.push(a);
				});
			}
		};

		var open = function(id) {
			if(id.isInteger() && id >= 0 && id < vars.length) {
				lqx.log('Opening accordion', a.elem);
				// Get accordion data
				var a = vars[id];

				// Open the accordion
				a.elem.removeClass('closed').addClass('open');
				a.elem.css('height', a.openHeight);

				// Are we in an accordion group?
				var group = a.elem.parents('.accordion-group');

				// Scroll page to top of open accordion
				if(opts.scrollTop.enabled) {
					// Scroll position: start with top of current accordion
					var scrollPos = a.elem.offset().top;

					// Reduce scroll position if other accordions are open above the current accordion
					if(group.length) {
						group.eq(0).find('.accordion.open').not(a.elem).each(function(id, sibling){
							sibling = jQuery(sibling);
							if(sibling.offset().top < a.elem.offset().top) {
								// Get open outer height
								var siblingOpenHeight = vars[sibling.attr('data-accordion')].openOuterHeight;
								// Get closed outer height
								var siblingClosedHeight = vars[sibling.attr('data-accordion')].closedOuterHeight;
								scrollPos -= (siblingOpenHeight - siblingClosedHeight);
							}
						});
					}

					// Scroll position: add padding
					scrollPos -= lqx.vars.window.height() * opts.scrollTop.padding / 100;
					jQuery('html, body').animate({scrollTop: scrollPos}, opts.scrollTop.duration);
				}

				// Close the rest of the accordions in group
				if(group.length) {
					lqx.log('Closing all other open accordions in group', group[0]);

					// Do not close self
					group.eq(0).find('.accordion.open').not(a.elem).each(function(id, elem){
						close(vars[jQuery(elem).attr('data-accordion')]);
					});
				}
			}
			else {
				lqx.warn(id + ' is not a valid accordion id');
			}
		};

		var close = function(id) {
			if(id.isInteger() && id >= 0 && id < vars.length) {
				lqx.log('Closing accordion', a.elem);

				// Get accordion data
				var a = vars[id];

				// Close the accordion
				a.elem.addClass('closed').removeClass('open');
				a.elem.css('height', a.closedHeight);
			}
			else {
				lqx.warn(id + ' is not a valid accordion id');
			}
		};

		var update = function(id){
			// Get the accordions to update
			var elems = [];
			if(id.isInteger() && id >= 0 && id < vars.length) {
				elems[id] = vars[id];
			}
			else {
				elems = vars;
			}

			// Update the accordions
			elems.forEach(function(a, id){
				// Keep original state of the accordion
				var closed = a.elem.hasClass('closed');

				// Force remove all transitions
				a.elem.css('transition', 'none !important');

				// Set auto-height and open if closed
				a.elem.css('height', 'auto').removeClass('closed').addClass('open');

				// Get height of header element
				a.closedHeight = a.header.outerHeight(true);

				// Get inner and outer height of open accordion
				a.openHeight = a.elem.innerHeight();
				a.openOuterHeight = a.elem.outerHeight();

				// Close the accordion and update the outer closed height
				a.elem.css('height', a.closedHeight).removeClass('open').addClass('closed');
				a.closedOuterHeight = a.elem.outerHeight();

				// Reopen the accordion if it was originally open
				if(!closed) {
					a.elem.css('height', a.openHeight).removeClass('closed').addClass('open');
				}

				// Allow transitions again
				a.elem.css('transition', '');

				// Update vars
				vars[id] = a;
			});
		};

		return {
			init: init,
			open: open,
			close: close,
			update: update
		};
	})();
	lqx.accordion.init();
}
