/**
 * responsive.js - Enable responsiveness
 *
 * @version     2.4.0
 * @package     wp_theme_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/wp_theme_lyquix
 */

/* jshint browser: true, devel: true, jquery: true, strict: true */
/* globals lqx, ga, MobileDetect, YT, google */

if(lqx && !('responsive' in lqx)) {
	lqx.responsive = (function(){
		'use strict';
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

					// Set listeners for each screen size
					opts.breakPoints.forEach(function(breakPoint, s) {
						var cssQuery = '';
						if(s == 0) cssQuery = '(max-width: ' + (opts.breakPoints[s + 1] - 1) + 'px)';
						else if(s == opts.breakPoints.length - 1) cssQuery = '(min-width: ' + opts.breakPoints[s] + 'px)';
						else cssQuery = '(min-width: ' + opts.breakPoints[s] + 'px) and (max-width: ' + (opts.breakPoints[s + 1] - 1) + 'px)';

						// Add listener
						var mm = window.matchMedia(cssQuery);
						mm.addEventListener('change', function(e) {
							if(e.matches) setScreen(s);
						});

						// Check screen size for the first time
						if(mm.matches) setScreen(s);
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
		var setScreen = function(s) {
			if(opts.sizes[s] != vars.screen) {
				// Adjust calculated size to min and max range
				if(s < opts.minIndex) s = opts.minIndex;
				if(s > opts.maxIndex) s = opts.maxIndex;

				// Change the body screen attribute
				lqx.vars.body.attr('screen', opts.sizes[s]);

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
