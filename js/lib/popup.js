/**
 * popup.js - Functionality to handle popups
 *
 * @version     2.4.0
 * @package     wp_theme_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/wp_theme_lyquix
 */

if(lqx && !('popup' in lqx)) {
	lqx.popup = (function(){
		/**
		 * Looks for elements with the class .popup and adds a class open when pop-up is to be
		 * displayed.
		 *
		 * Pop-up must have a unique identifier in attribute data-popup-id
		 * May have override options saved as json string in attribute data-popup-opts
		 *
		 * Controls automatically open and close the popup, as well as delays after closing and dismissing
		 *
		**/

		var opts = {
			popUpSelector: '.popup',     //
			closeSelector: '.close',     //
			dismissSelector: '.dismiss', //
			overlaySelector: '.overlay', //
			hashId: true,                // if not explicit id is provided, creates an id using a hash of the inner HTML string
			openDelay: 3,                // seconds before automatically open a pop-up
			reOpenInSession: true,       // reopen popup during same session if dismiss and close timeouts expire
			autoCloseDelay: 60,          // seconds after open to automatically close pop-up. Use `null` for never autoclose
			hideAfterClose: 60,          // minutes the pop-up will remain hidden after close action. Use `null` for never open again
			hideAfterDismiss: null,      // minutes the pop-up will remain hidden after dismiss action. Use `null` for never open again
			onLinkClick: 'close',        // action to take when content link is clicked: 'close', or 'dismiss' , other values are interpreted as no action
			onOverlayCick: 'close',      // action to take when clicking the overlay under the pop-up: 'close', or 'dismiss' , other values are interpreted as no action
			analytics: {
				enabled: true,
				nonInteraction: true,
				onOpen: false, // Sends event on popup open
				onClose: true, 	// Sends event on popup close
				onDismiss: true // Sends event on popup dismiss
			}
		};

		var vars = {
			elems: {}
		};

		var init = function(){
			// Copy default opts and vars
			jQuery.extend(true, lqx.opts.popup, opts);
			opts = lqx.opts.popup;
			jQuery.extend(true, lqx.vars.popup, vars);
			vars = lqx.vars.popup;

			// Initialize on lqxready
			lqx.vars.window.on('lqxready', function() {
				// Initialize only if enabled
				if(opts.enabled) {
					lqx.log('Initializing `popup`');

					// Trigger functions on document ready
					lqx.vars.document.ready(function() {
						// Get saved elems fom localStorage and setup auto-save on exit
						vars.elems = lqx.store.get('popup', 'elems');
						if(vars.elems == undefined) vars.elems = {};
						lqx.store.set('popup', 'elems');

						// Disable analytics if the analytics module is not enabled
						opts.analytics.enabled = lqx.opts.analytics.enabled ? opts.analytics.enabled : false;
						if(opts.analytics.enabled) lqx.log('Setting popups tracking');

						// Setup popups loaded initially on the page
						setup(jQuery(opts.popUpSelector));

						// Add a mutation handler for popups added to the DOM
						lqx.mutation.addHandler('addNode', opts.popUpSelector, setup);
					});
				}
			});

			// Run only once
			lqx.popup.init = function(){
				lqx.warn('lqx.popup.init already executed');
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
				lqx.log('Setting up ' + elems.length + ' popup', elems);
				elems.forEach(function(elem){
					// The popup element
					elem = jQuery(elem);

					// Get options - overrode global with optsion in attribute data-popup-opts
					var elemOpts = elem.attr('data-popup-opts');
					if(typeof elemOpts != 'undefined') elemOpts = JSON.parse(elemOpts);
					if(typeof elemOpts != 'object') elemOpts = {};
					elemOpts = jQuery.extend(true, Object.assign({}, opts), elemOpts);

					// Get popup id
					var elemId = elem.attr('data-popup-id');
					if(typeof elemId == 'undefined') {
						if(opts.hashId) {
							elemId = lqx.util.hash(elem.html());
							elem.attr('data-popup-id', elemId);
						}
						else {
							lqx.error('Unable to setup popup, no id found');
							return;
						}
					}

					// Get last state
					if(!(elemId in vars.elems)) vars.elems[elemId] = {
						opts: elemOpts,
						state: 'closed',
						lastClose: 0,
						lastDismiss: 0
					};
					vars.elems[elemId].elem = elem;
					var elemState = vars.elems[elemId];

					// Check if pop-up should be opened
					var now = (new Date()).getTime();

					// Check if popup should be opened now
					if(
						(elemState.lastClose > 0 && elemOpts.hideAfterClose === null) || // Closed before and reopen not allowed
						(elemState.lastDismiss > 0 && elemOpts.hideAfterDismiss === null) // Dismissed before and reopen not allowed
					);
					else if(
						(elemOpts.hideAfterClose !== null && (elemState.lastClose + elemOpts.hideAfterClose * 60000 > now)) || // Close timeout not expired
						(elemOpts.hideAfterDismiss !== null && (elemState.lastDismiss + elemOpts.hideAfterDismiss * 60000 > now)) // Dismiss timeout not expired
					){
						if(opts.reOpenInSession){
							// Find what time is further: close or dismiss
							var openTime = Math.max(elemState.lastClose + (elemOpts.hideAfterClose * 60000),  elemState.lastDismiss + (elemOpts.hideAfterDismiss * 60000));
							open(elemId, openTime + elemOpts.openDelay - now);
						}
					}
					else open(elemId, elemOpts.openDelay * 1000);

					// Close listener
					elem.find(elemOpts.closeSelector).on('click', function(){
						close(elemId);
					});

					// Dismiss listener
					elem.find(elemOpts.dismissSelector).on('click', function(){
						dismiss(elemId);
					});

					// Link listener
					if(elemOpts.onLinkClick == 'close') {
						elem.find(elemOpts.overlaySelector).on('click', function(e){
							e.preventDefault();
							close(elemId);
							window.location = jQuery(this).attr('href');
						});
					}
					if(elemOpts.onLinkClick == 'dismiss') {
						elem.find(elemOpts.overlaySelector).on('click', function(e){
							e.preventDefault();
							dismiss(elemId);
							window.location = jQuery(this).attr('href');
						});
					}

					// Overlay
					if(elemOpts.onOverlayCick == 'close') {
						elem.find(elemOpts.overlaySelector).on('click', function(){
							close(elemId);
						});
					}
					if(elemOpts.onOverlayCick == 'dismiss') {
						elem.find(elemOpts.overlaySelector).on('click', function(){
							dismiss(elemId);
						});
					}
				});
			}
		};

		var open = function(elemId, openDelay) {
			if(typeof openDelay == 'undefined') openDelay = 0;
			var elemState = vars.elems[elemId];
			setTimeout(function(){
				elemState.elem.addClass('open').removeClass('closed');
				elemState.state = 'open';

				// Auto-close after delay
				if(elemState.opts.autoCloseDelay !== null) {
					setTimeout(function(){
						close(elemId);
					}, elemState.opts.autoCloseDelay * 1000);
				}

				// Send event for accordion opened
				if(opts.analytics.enabled && elemState.opts.analytics.onOpen && typeof ga !== 'undefined') {
					ga('send', {
						'hitType': 'event',
						'eventCategory': 'Popup',
						'eventAction': 'Open',
						'eventLabel': elemId,
						'nonInteraction': opts.analytics.nonInteraction
					});
				}
			}, openDelay);
		};

		var close = function(elemId) {
			var elemState = vars.elems[elemId];
			elemState.elem.addClass('closed').removeClass('open');
			elemState.state = 'closed';
			elemState.lastClose = (new Date()).getTime();

			// Send event for accordion opened
			if(opts.analytics.enabled && elemState.opts.analytics.onClose && typeof ga !== 'undefined') {
				ga('send', {
					'hitType': 'event',
					'eventCategory': 'Popup',
					'eventAction': 'Close',
					'eventLabel': elemId,
					'nonInteraction': opts.analytics.nonInteraction
				});
			}
		};

		var dismiss = function(elemId) {
			var elemState = vars.elems[elemId];
			elemState.elem.addClass('closed').removeClass('open');
			elemState.state = 'closed';
			elemState.lastDismiss = (new Date()).getTime();

			// Send event for accordion opened
			if(opts.analytics.enabled && elemState.opts.analytics.onDismiss && typeof ga !== 'undefined') {
				ga('send', {
					'hitType': 'event',
					'eventCategory': 'Popup',
					'eventAction': 'Dismiss',
					'eventLabel': elemId,
					'nonInteraction': opts.analytics.nonInteraction
				});
			}
		};

		return {
			init: init,
			setup: setup,
			open: open,
			close: close
		};
	})();
	lqx.popup.init();
}
