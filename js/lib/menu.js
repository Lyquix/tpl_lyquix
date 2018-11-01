/**
 * menu.js - Menu functionality
 *
 * @version     2.0.0
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

if(lqx && !('menu' in lqx)) {
	lqx.menu = (function(){
		var opts = {
			screens: ['xs', 'sm', 'md', 'lg', 'xl']
		};

		var init = function(){
			// Copy default opts and vars
			jQuery.extend(lqx.opts.menu, opts);
			opts = lqx.opts.menu;

			// Initialize on lqxready
			lqx.vars.window.on('lqxready', function() {
				// Initialize only if enabled
				if(lqx.opts.menu.enabled) {
					lqx.log('Initializing `menu`');

					// Trigger setup on lqxready
					setup();

					// Trigger reset on screensizechange
					lqx.vars.window.on('screensizechange', function() {
						reset();
					});
				}
			});

			return lqx.menu.init = true;
		};

		var setup = function() {
			// Add listeners to <a> tags
			lqx.vars.body.on('click', '.horizontal a, .vertical a', function(e){
				e.preventDefault();
				click(this);
			});

			// Prevent propagation of clicks
			lqx.vars.body.on('click', '.horizontal, .vertical', function(e){
				// Do not propagate click events outside menus
				e.stopPropagation();
			});

			// Open/close slide-out menu
			lqx.vars.body.on('click', '.menu-control', function(){
				var menu = jQuery(this).sibblings('ul');
				if(jQuery(menu).hasClass('open')) {
					jQuery(menu).removeClass('open');
				}
				else {
					jQuery(menu).addClass('open');
				}
			});

			// When clicking outside the menus, hide the menus if visible and close the slide out menu if open
			lqx.vars.body.click(function() {
				jQuery('.horizontal, .vertical').find('.open').removeClass('open');
			});

		};

		var click = function(elem) {
			var li = jQuery(elem).parent();
			var url = elem.href;
			var target = (elem.target && !elem.target.match(/^_(self|parent|top)$/i)) ? elem.target : false;
			var go = function(){
				if(target){
					window.open(url, target);
				}
				else {
					window.location.href = url;
				}
			};

			// check if there is a sub menu
			if(jQuery.inArray(lqx.responsive.screen, opts.screens) != -1) {
				// Joomla adds class .deeper, WordPress adds class .menu-item-has-children
				if(jQuery(li).hasClass('deeper') || jQuery(li).hasClass('menu-item-has-children')) {
					if(jQuery(li).hasClass('open')) {
						// It's already open, follow the link
						go();
					}
					else {
						// close any siblings (and their children) and then open itself
						jQuery(li).siblings('.open').find('.open').removeClass('open');
						jQuery(li).siblings('.open').removeClass('open');
						jQuery(li).addClass('open');
					}
				}
				else {
					// There isn't a sub-menu, follow the link
					go();
				}
			}
			else {
				go();
			}
		};

		var reset = function() {
			if(jQuery.inArray(lqx.responsive.screen, opts.screens) == -1) {
				jQuery('.deeper.open, .menu-item-has-children.open').removeClass('open');
			}
		};

		return {
			init: init
		};
	})();
	lqx.menu.init();
}
