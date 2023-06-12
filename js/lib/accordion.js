/**
 * accordion.js - Functionality to handle accordions
 *
 * @version     2.4.0
 * @package     wp_theme_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/wp_theme_lyquix
 */

if(lqx && !('accordion' in lqx)) {
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

			You can add scrolltop settings for a specific accordion or an accordion group
			by adding the attribute data-accordion-scrolltop with value a json string that is used
			to extend the global settings - global settings are extended by accordion
			group settings (if any) and then by accordion settings (if any)
		**/
		var opts = {
			/**
			 * scrollTop settings can be defined as a primitive (string, number, boolean) or as an object
			 * with keys for each screen size for example:
			 *
			 * scrollTop : {
			 *   enabled: true,
			 *   padding: '50px',
			 *   target: 'self',
			 *   duration: 500
			 * }
			 *
			 * or
			 *
			 * scrollTop: {
			 *   enabled: {
			 *     xs: false,
			 *     sm: false,
			 *     md: true,
			 *     lg: true,
			 *     xl: true
			 *   },
			 *   padding: {
			 *     xs: '50px',
			 *     sm: '50px',
			 *     md: '75px',
			 *     lg: '90px',
			 *     xl: '90px'
			 *   },
			 *   target: {
			 *     xs: 'self',
			 *     sm: 'self',
			 *     md: 'self',
			 *     lg: 'self',
			 *     xl: 'self'
			 *   }
			 *   duration: {
			 *     xs: 500,
			 *     sm: 500,
			 *     md: 500,
			 *     lg: 400,
			 *     xl: 400
			 *   }
			 * }
			 */
			accordionSelector: '.accordion',
			headerClass: 'accordion-header',
			groupSelector: '.accordion-group',
			scrollTop: {
				enabled: true,
				target: 'self', 	// To what element is the page scrolling: self (default), group, or CSS selector
				padding: '50px', 	// From top of the viewport, in px or %, per screen size
				duration: 500, 		// in ms
			},
			analytics: {
				enabled: true,
				nonInteraction: true,
				onClose: true 	// Sends event on accordion close
			}
		};

		var vars = [];

		var init = function(){
			// Copy default opts and vars
			jQuery.extend(true, lqx.opts.accordion, opts);
			opts = lqx.opts.accordion;
			jQuery.extend(true, lqx.vars.accordion, vars);
			vars = lqx.vars.accordion;

			// Initialize on lqxready
			lqx.vars.window.on('lqxready', function() {
				// Initialize only if enabled
				if(opts.enabled) {
					lqx.log('Initializing `accordion`');

					// Disable analytics if the analytics module is not enabled
					opts.analytics.enabled = lqx.opts.analytics.enabled ? opts.analytics.enabled : false;
					if(opts.analytics.enabled) lqx.log('Setting accordions tracking');

					// Trigger functions on document ready
					lqx.vars.document.ready(function() {
						// Setup accordions loaded initially on the page
						setup(jQuery(opts.accordionSelector));

						// Add listener for screen change and orientation change
						lqx.vars.window.on('load screensizechange orientationchange resizethrottle', function(){
							update();
						});

						// Add a mutation handler for accordions added to the DOM
						lqx.mutation.addHandler('addNode', opts.accordionSelector, setup);
					});
				}
			});

			// Run only once
			lqx.accordion.init = function(){
				lqx.warn('lqx.accordion.init already executed');
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
				lqx.log('Setting up ' + elems.length + ' accordions', elems);
				elems.forEach(function(elem){
					var a = {};
					a.elem = jQuery(elem);

					// Get header element: first child with class .accordion-header (if none, just pick the first child)
					a.header = a.elem.find('.' + opts.headerClass);
					if(a.header.length) {
						a.header = jQuery(a.header[0]);
					}
					else {
						a.header = jQuery(a.elem.children()[0]);
						a.header.addClass(opts.headerClass);
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
					a.header.on('click', function(){
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
			if(typeof id == 'undefined') id = null;
			id = parseInt(id);
			if(!isNaN(id) && id >= 0 && id < vars.length) {

				// Update accordion jst before opening
				update(id);
				// Get accordion data
				var a = vars[id];

				lqx.log('Opening accordion', a.elem);

				// Open the accordion
				a.elem.removeClass('closed').addClass('open');
				a.elem.css('height', a.openHeight);

				// Are we in an accordion group?
				var group = a.elem.parents(opts.groupSelector);

				// Get scrollTop settings
				var scrollTop = {
					global: Object.assign({}, opts.scrollTop),
					group: group.attr('data-accordion-scrolltop'),
					accordion: a.elem.attr('data-accordion-scrolltop')
				};

				if(typeof scrollTop.group != 'undefined') {
					scrollTop.group = JSON.parse(scrollTop.group);
					if(typeof scrollTop.group == 'object') jQuery.extend(true, scrollTop.global, scrollTop.group);
				}
				if(typeof scrollTop.accordion != 'undefined') {
					scrollTop.accordion = JSON.parse(scrollTop.accordion);
					if(typeof scrollTop.accordion == 'object') jQuery.extend(true, scrollTop.global, scrollTop.accordion);
				}

				scrollTop = scrollTop.global;

				// Scroll page to top of open accordion
				if(typeof scrollTop.enabled == 'object'? scrollTop.enabled[lqx.responsive.screen()] : scrollTop.enabled) {
					// Scroll position: start with top of current accordion
					var targetElem = 'self';
					if('target' in scrollTop) {
						targetElem = typeof scrollTop.target == 'object' ? targetElem[lqx.responsive.screen()] : scrollTop.target;
					}
					if(targetElem == 'self') targetElem = a.elem;
					else if (targetElem == 'group') targetElem = group;
					else targetElem = jQuery(targetElem).eq(0);
					var scrollPos = targetElem.offset().top;

					// Reduce scroll position of other accordions are open above the current accordion
					if(targetElem == a.elem && group.length) {
						group.eq(0).find(opts.accordionSelector + '.open').not(a.elem).each(function(id, sibling){
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
					var padding = typeof scrollTop.padding == 'object' ? scrollTop.padding[lqx.responsive.screen()] : scrollTop.padding;
					padding = padding.match(/^\s*([\d\.]+)\s*(|px|%)\s*$/);
					if(padding == null) padding = 0;
					else {
						if(padding[2] == 'px' || padding[2] == '') padding = parseFloat(padding[1]);
						else if(padding[2] == '%') padding = lqx.vars.window.height() *  parseFloat(padding[1]) / 100;
						else padding = 0;
					}
					scrollPos -= padding;
					jQuery('html, body').animate({scrollTop: scrollPos}, typeof scrollTop.duration == 'object' ? scrollTop.duration[lqx.responsive.screen()] : scrollTop.duration);
				}

				// Close the rest of the accordions in group
				if(group.length) {
					lqx.log('Closing all other open accordions in group', group[0]);

					// Do not close self
					group.eq(0).find(opts.accordionSelector + '.open').not(a.elem).each(function(id, elem){
						close(jQuery(elem).attr('data-accordion'));
					});
				}

				// Send event for accordion opened
				if(opts.analytics.enabled && typeof ga !== 'undefined') {
					ga('send', {
						'hitType': 'event',
						'eventCategory': 'Accordion',
						'eventAction': 'Open',
						'eventLabel': a.header.text(),
						'nonInteraction': opts.analytics.nonInteraction
					});
				}
			}
			else {
				lqx.warn('Invalid accordion id');
			}
		};

		var close = function(id) {
			if(typeof id == 'undefined') id = null;
			id = parseInt(id);
			if(!isNaN(id) && id >= 0 && id < vars.length) {
				// Get accordion data
				var a = vars[id];

				lqx.log('Closing accordion', a.elem);

				// Close the accordion
				a.elem.addClass('closed').removeClass('open');
				a.elem.css('height', a.closedHeight);

				// Send event for accordion closed
				if(opts.analytics.enabled && opts.analytics.onClose && typeof ga !== 'undefined') {
					ga('send', {
						'hitType': 'event',
						'eventCategory': 'Accordion',
						'eventAction': 'Close',
						'eventLabel': a.header.text(),
						'nonInteraction': opts.analytics.nonInteraction
					});
				}
			}
			else {
				lqx.warn('Invalid accordion id');
			}
		};

		var update = function(id){
			// Get the accordions to update
			var elems = [];
			if(typeof id == 'undefined') id = null;
			id = parseInt(id);
			if(!isNaN(id) && id >= 0 && id < vars.length) {
				elems[id] = vars[id];
			}
			else {
				elems = vars;
			}

			// Update the accordions
			elems.forEach(function(a){
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
				vars[a.elem.attr('data-accordion')] = a;
			});
		};

		return {
			init: init,
			open: open,
			close: close,
			setup: setup,
			update: update
		};
	})();
	lqx.accordion.init();
}
