/**
 * lyquix.geolocate.js - geolocate functionality
 *
 * @version     2.0.0
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */
'use strict';
if(lqx && typeof lqx.geolocate == 'undefined') {
	lqx.geolocate = (function(){
		var opts = {
			gps: false
		};

		var vars = {
			location: {
				city: null,
				subdivision: null,
				country: null,
				continent: null,
				time_zone: null,
				lat: null,
				lon: null,
				radius: null
			}
		};

		var init = function(){
			// Initialize only if enabled
			if(lqx.opts.geolocate.enabled) {
				lqx.log('Initializing `geolocate`');

				// Copy default opts and vars
				jQuery.extend(lqx.opts.geolocate, opts);
				opts = lqx.opts.geolocate;
				jQuery.extend(lqx.vars.geolocate, vars);
				vars = lqx.vars.geolocate;

				// Trigger functions on lqxready
				lqx.vars.window.on('lqxready', function() {
					geoLocate();
				});
			}

			return lqx.geolocate.init = true;
		};

		// Get function
		var location = function() {
			return vars.location;
		};

		// geoLocate
		// attempts to locate position of user by means of gps or ip address
		var geoLocate = function() {
			// ip2geo to get location info
			jQuery.ajax({
				async: true,
				cache: false,
				dataType: 'json',
				url: lqx.opts.tmplURL + '/php/ip2geo/',
				success: function(data, status, xhr){
					vars.location = data;

					// If GPS enabled, attempt to get lat/lon
					if(opts.gps && 'geolocate' in navigator) {
						navigator.geolocate.getCurrentPosition(function(position) {
							vars.location.lat = position.coords.latitude;
							vars.location.lon = position.coords.longitude;
							vars.location.radius = 0;
						});
					}

					// Add location attributes to body tag
					for(var key in vars.location) {
						if(key == 'time_zone') {
							lqx.vars.body.attr('time-zone', vars.location[key]);
						}
						else {
							lqx.vars.body.attr(key, vars.location[key]);
						}
					}

					lqx.log('geolocate', vars.location);

					// Trigger custom event 'geolocateready'
					lqx.log('geolocate event');
					jQuery(document).trigger('geolocateready');
				},
				error: function(xhr, status, error){
					lqx.error('Geolocate error ' + status + ' ' + error);
				}
			});
		};

		return {
			init: init,
			location: location
		};
	})();
	lqx.geolocate.init();
}
