/**
 * responsive.js - Enable responsiveness
 *
 * @version     2.3.0
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

if(lqx && !('responsive' in lqx)) {
	lqx.responsive = (function(){
		var opts = {
			sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
			breakPoints: [320, 640, 960, 1280, 1600],
			minIndex: 0,
			maxIndex: 4
		};

		var vars = {
			screen: null,
			orientation: null
		};

		var init = function(){
			// Copy default opts and vars
			jQuery.extend(true, lqx.opts.responsive, opts);
			opts = lqx.opts.responsive;
			jQuery.extend(true, lqx.vars.responsive, vars);
			vars = lqx.vars.responsive;

			// Initialize on lqxready
			lqx.vars.window.on('lqxready', function() {
				// Initialize only if enabled
				if(opts.enabled) {
					lqx.log('Initializing `responsive`');

					// Check screen size for the first time
					setScreen();

					// Listeners for setScreen
					lqx.vars.window.on('resizethrottle orientationchange', function() {
						// Check screen size
						setScreen();
					});

					if('orientation' in window.screen) {
						// Check screen orientation for the first time
						setOrientation();

						// Listeners for setOrientation
						lqx.vars.window.on('orientationchange', function() {
							// Update orientation attribute in body tag
							setOrientation();
						});
					}
				}
			});

			// Run only once
			lqx.responsive.init = function(){
				lqx.warn('lqx.responsive.init already executed');
			};

			return true;
		};

		// Get functions
		var screen = function() {
			return vars.screen;
		};
		var orientation = function() {
			return vars.orientation;
		};

		// Sets the attribute "screen" to the body tag that indicates the current size of the screen
		var setScreen = function() {
			// Get current screen width
			var w = lqx.vars.window.width();
			var s = null;

			// Find in what breakpoint are we
			if(w < opts.breakPoints[1]) s = 0;
			else if(w >= opts.breakPoints[1] && w < opts.breakPoints[2]) s = 1;
			else if(w >= opts.breakPoints[2] && w < opts.breakPoints[3]) s = 2;
			else if(w >= opts.breakPoints[3] && w < opts.breakPoints[4]) s = 3;
			else if(w >= opts.breakPoints[4]) s = 4;

			// Adjust calculated size to min and max range
			if(s < opts.minIndex) s = opts.minIndex;
			if(s > opts.maxIndex) s = opts.maxIndex;

			// If different from previous screen size
			if(opts.sizes[s] != vars.screen) {
				// Change the body screen attribute
				lqx.vars.body.attr('screen',opts.sizes[s]);

				// Save the current screen size
				vars.screen = opts.sizes[s];

				// Trigger custom event 'screensizechange'
				lqx.vars.document.trigger('screensizechange');
				lqx.log('Screen size changed', vars.screen);
			}

			return true;
		};

		// Sets the attribute "orientation" to the body tag that indicates the current orientation of the screen
		var setOrientation = function() {
			var o = window.screen.orientation.type;
			if(o.indexOf(vars.orientation) == -1) {
				switch (o) {
					case 'portrait-primary':
					case 'portrait-secondary':
						vars.orientation = 'portrait';
						lqx.vars.body.attr('orientation', 'portrait');
						break;

					case 'landscape-primary':
					case 'landscape-secondary':
						vars.orientation = 'landscape';
						lqx.vars.body.attr('orientation', 'landscape');
						break;
				}
				lqx.log('Screen orientation changed', vars.orientation);
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
