/**
 * lyquix.mutation.js - Mutation observer and handler
 *
 * @version     2.0.0
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

if(lqx && typeof lqx.mutation == 'undefined') {
	lqx.mutation = (function(){
		var defaults = {
			vars: {
				observer: null,
				addNode: [],
				removeNode: [],
				modAttrib: []
			}
		};

		var init = function(){
			// Initialize only if enabled
			if(lqx.settings.mutation.enabled) {
				lqx.log('Initializing `mutation`');

				// Copy default settings and vars
				jQuery.extend(lqx.vars.mutation, defaults.vars);

				// Trigger functions on lqxready
				lqx.vars.window.on('lqxready', function() {
					// Create observer
					observer();
				});
			}

			return lqx.mutation.init = true;
		};

		// create a custom mutation observer that will trigger any needed functions
		var observer = function(){
			// handle videos that may be loaded dynamically
			var mo = window.MutationObserver || window.WebKitMutationObserver;

			// check for mutationObserver support , if exists, user the mutation observer object, if not use the listener method.
			if (typeof mo !== 'undefined'){
				lqx.vars.mutation.observer = new mo(handler);
				lqx.vars.mutation.observer.observe(document, {childList: true, subtree: true, attributes: true});
			}
			else {
				jQuery(document).on('DOMNodeInserted DOMNodeRemoved DOMAttrModified', function(e) {
					lqx.mutation.handler(e);
				});
			}
		};

		var addHandler = function(type, selector, callback) {
			// type can be addNode, removeNode, and modAttrib
			switch(type) {
				case 'addNode':
					lqx.vars.mutation.addNode.push({'selector': selector, 'callback': callback});
					break;
				case 'removeNode':
					lqx.vars.mutation.removeNode.push({'selector': selector, 'callback': callback});
					break;
				case 'modAttrib':
					lqx.vars.mutation.modAttrib.push({'selector': selector, 'callback': callback});
					break;
			}
		};

		// mutation observer handler
		var handler = function(mutRecs) {
			if(!(mutRecs instanceof Array)) {
				// Not an array, convert to an array
				mutRecs = [mutRecs];
			}
			mutRecs.forEach(function(mutRec){
				switch(mutRec.type) {
					case 'childList':
						// Handle nodes added
						if (mutRec.addedNodes.length > 0) {
							lqx.vars.mutation.addNode.forEach(function(handler){
								if(mutRec.target.matches(handler.selector)) handler.callback(mutRec.target);
							});
						}

						// Handle nodes removed
						if (mutRec.removedNodes.length > 0) {
							lqx.vars.mutation.removeNode.forEach(function(handler){
								if(mutRec.target.matches(handler.selector)) handler.callback(mutRec.target);
							});
						}
						break;

					case 'DOMNodeInserted':
						lqx.vars.mutation.addNode.forEach(function(handler){
							if(mutRec.target.matches(handler.selector)) handler.callback(mutRec.target);
						});
						break;

					case 'DOMNodeRemoved':
						lqx.vars.mutation.removeNode.forEach(function(handler){
							if(mutRec.target.matches(handler.selector)) handler.callback(mutRec.target);
						});
						break;

					case 'attributes':
					case 'DOMAttrModified':
						lqx.vars.mutation.modAttrib.forEach(function(handler){
							if(mutRec.target.matches(handler.selector)) handler.callback(mutRec.target);
						});
						break;
				}
			});
		};

		return {
			init: init,
			addHandler: addHandler
		};
	})();
	lqx.mutation.init();
}
