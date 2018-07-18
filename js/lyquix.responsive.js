/**
 * lyquix.responsive.js - Enable responsiveness
 *
 * @version     2.0.0
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

if(lqx && typeof lqx.responsive == 'undefined') {
	lqx.responsive = (function(){
		var defaults = {
			settings: {
				sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
				breakPoints: [320, 640, 960, 1280, 1600],
				minIndex: 0,
				maxIndex: 4
			},
			vars: {
				screen: null,
				orientation: null
			}
		};

		var init = function(){
			// Initialize only if enabled
			if(lqx.settings.responsive.enabled) {
				lqx.log('Initializing `responsive`');

				// Copy default settings and vars
				jQuery.extend(lqx.settings.responsive, defaults.settings);
				jQuery.extend(lqx.vars.responsive, defaults.vars);

				// Trigger setScreen
				lqx.vars.window.on('lqxready resizethrottle orientationchange', function() {
					// check screen size
					setScreen();
				});

				// Trigger setOrientation only if property is available
				if('orientation' in window.screen) {
					lqx.vars.window.on('lqxready orientationchange', function() {
						// Update orientation attribute in body tag
						setOrientation();
					});
				}
			}

			return lqx.responsive.init = true;
		};

		// Get functions
		var screen = function() {
			return lqx.vars.responsive.screen;
		};
		var orientation = function() {
			return lqx.vars.responsive.orientation;
		};

		// Sets the attribute "screen" to the body tag that indicates the current size of the screen
		var setScreen = function() {
			// Get current screen width
			var w = lqx.vars.window.width();
			var s = null;

			// Find in what breakpoint are we
			if(w < lqx.settings.responsive.breakPoints[1]) s = 0;
			if(w >= lqx.settings.responsive.breakPoints[1]) s = 1;
			if(w >= lqx.settings.responsive.breakPoints[2]) s = 2;
			if(w >= lqx.settings.responsive.breakPoints[3]) s = 3;
			if(w >= lqx.settings.responsive.breakPoints[4]) s = 4;

			// Adjust calculated size to min and max range
			if(s < lqx.settings.responsive.minIndex) s = lqx.settings.responsive.minIndex;
			if(s > lqx.settings.responsive.maxIndex) s = lqx.settings.responsive.maxIndex;

			// If different from previous screen size
			if(lqx.settings.responsive.sizes[s] != lqx.vars.responsive.screen) {
				// Change the body screen attribute
				lqx.vars.body.attr('screen',lqx.settings.responsive.sizes[s]);

				// Save the current screen size
				lqx.vars.responsive.screen = lqx.settings.responsive.sizes[s];

				// Trigger custom event 'screensizechange'
				lqx.vars.document.trigger('screensizechange');
				lqx.log('Screen size changed', lqx.vars.responsive.screen);
			}

			return true;
		};

		// Sets the attribute "orientation" to the body tag that indicates the current orientation of the screen
		var setOrientation = function() {
			var o = window.screen.orientation.type;
			if(o.indexOf(lqx.vars.responsive.orientation) != -1) {
				switch (o) {
					case 'portrait-primary':
					case 'portrait-secondary':
						lqx.vars.responsive.orientation = 'portrait';
						lqx.vars.body.attr('orientation', 'portrait');
						break;

					case 'landscape-primary':
					case 'landscape-secondary':
						lqx.vars.responsive.orientation = 'landscape';
						lqx.vars.body.attr('orientation', 'landscape');
						break;
				}
				lqx.log('Screen orientation changed', lqx.vars.responsive.orientation);
			}
			return true;
		};

		return {
			init: init,
			screen: screen,
			orientation: orientation
		};
	})();
	lqx.responsive.init();
}
