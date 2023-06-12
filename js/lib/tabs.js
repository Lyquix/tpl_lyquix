/**
 * tabs.js - Functionality to handle tabs
 *
 * @version     2.4.0
 * @package     wp_theme_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/wp_theme_lyquix
 */

if(lqx && !('tabs' in lqx)) {
	lqx.tabs = (function(){
		/** Looks for elements with the class .tab and .tab-panel, wrapped in a .tab-group element
		 *
		 * In .tab elements looks for the attribute data-tab, and in .panels looks for a matching data-tab attribute
		 * For the tab/panel selected it adds the class .open, otherwise adds the class .closed
		 *
		 * Moves the .tab elements to a group .tab-nav, and moves the .tab-panel elements to a group .tab-content
		 *
		**/

		var opts = {
			tabSelector: '.tab',
			tabGroupSelector: '.tab-group',
			tabPanelSelector: '.tab-panel',
			tabContentClass: 'tab-content',
			tabNavClass: 'tab-nav',
			analytics: {
				enabled: true,
				nonInteraction: true
			}
		};

		var vars = [];

		var init = function(){
			// Copy default opts
			jQuery.extend(true, lqx.opts.tabs, opts);
			opts = lqx.opts.tabs;
			jQuery.extend(true, lqx.vars.tabs, vars);
			vars = lqx.vars.tabs;

			// Initialize on lqxready
			lqx.vars.window.on('lqxready', function() {
				// Initialize only if enabled
				if(opts.enabled) {
					lqx.log('Initializing `tabs`');

					// Disable analytics if the analytics module is not enabled
					opts.analytics.enabled = lqx.opts.analytics.enabled ? opts.analytics.enabled : false;
					if(opts.analytics.enabled) lqx.log('Setting tabs tracking');

					// Trigger functions on document ready
					lqx.vars.document.ready(function() {
						// Setup tabss loaded initially on the page
						setup(jQuery(opts.tabSelector));

						// Add a mutation handler for tabss added to the DOM
						lqx.mutation.addHandler('addNode', opts.tabSelector, setup);
					});
				}
			});

			// Run only once
			lqx.tabs.init = function(){
				lqx.warn('lqx.tabs.init already executed');
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
				lqx.log('Setting up ' + elems.length + ' tabs', elems);
				elems.forEach(function(elem){
					// The tab element
					var tab = jQuery(elem);

					// Check if tab is already initialized
					if(tab.attr('ready') === undefined) {
						// Check if this .tab is part of .tab-group
						var group = tab.parents(opts.tabGroupSelector);
						if(group.length) {
							// Check if it has a data-tab attribute
							var tabName = tab.attr('data-tab');
							if(tabName) {
								// Check if there is a matching panel element
								var panel = group.find(opts.tabPanelSelector + '[data-tab="' + tabName + '"]');
								if(panel.length) {
									// Add the "ready" attribute
									tab.attr('ready', '');

									// Check if .tab-content exists, otherwise create it
									var content = group.find('.' + opts.tabContentClass);
									if(!content.length) {
										content = jQuery('<div class="' + opts.tabContentClass + '"></div>');
										content.prependTo(group);
									}

									// Move panel to .tab-content
									panel.appendTo(content);

									// Check if .tab-nav exists, otherwise create it
									var nav = group.find('.' + opts.tabNavClass);
									if(!nav.length) {
										nav = jQuery('<div class="' + opts.tabNavClass + '"></div>');
										nav.prependTo(group);
									}

									// Move tab to .tab-nav
									tab.appendTo(nav);

									// If first tab in nav, mark it as open
									if(nav.find(opts.tabSelector).index(tab) == 0) {
										tab.addClass('open');
										panel.addClass('open');
									}
									else {
										tab.addClass('closed');
										panel.addClass('closed');
									}

									// Listener for click on tab
									tab.on('click', function(){
										// Open clicked tab and matching panel
										tab.removeClass('closed').addClass('open');
										panel.removeClass('closed').addClass('open');

										// Close all other tabs and panels in the group
										nav.find(opts.tabSelector).not(tab).removeClass('open').addClass('closed');
										content.find(opts.tabPanelSelector).not(panel).removeClass('open').addClass('closed');

										// Send event for tab clicked
										if(opts.analytics.enabled && typeof ga !== 'undefined') {
											ga('send', {
												'hitType': 'event',
												'eventCategory': 'Tab',
												'eventAction': 'Click',
												'eventLabel': tab.text(),
												'nonInteraction': opts.analytics.nonInteraction
											});
										}
									});
								}
								// No matching panel found
								else {
									lqx.error('No matching panel found for tab ' + tabName);
								}
							}
							// Element has no data-tab attribute
							else {
								lqx.error('No data-tab attribute for .tab element');
							}
						}
						// There is no tab group
						else {
							lqx.error('No parent .tab-group found for .tab element');
						}
					}
				});
			}
		};

		return {
			init: init,
			setup: setup
		};
	})();
	lqx.tabs.init();
}
