/**
 * geolocate.js - geolocate functionality
 *
 * @version     2.2.2
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

if(lqx && !('geolocate' in lqx)) {
	lqx.geolocate = (function(){
		var opts = {
			gps: false
		};

		var vars = {
			location: {
				source: null,
				city: null,
				subdivision: null,
				country: null,
				continent: null,
				time_zone: null,
				lat: null,
				lon: null,
				radius: null,
				ip: null
			}
		};

		var init = function(){
			// Copy default opts and vars
			jQuery.extend(lqx.opts.geolocate, opts);
			opts = lqx.opts.geolocate;
			jQuery.extend(lqx.vars.geolocate, vars);
			vars = lqx.vars.geolocate;

			// Initialize on lqxready
			lqx.vars.window.on('lqxready', function() {
				// Initialize only if enabled
				if(opts.geolocate.enabled) {
					lqx.log('Initializing `geolocate`');

					geoLocate();
				}
			});

			return lqx.geolocate.init = true;
		};

		// Get current location
		var location = function() {
			return vars.location;
		};

		// geoLocate
		// attempts to locate position of user by means of gps or ip address
		var geoLocate = function() {
			lqx.log('Attempting IP geolocation');
			// ip2geo to get location info
			jQuery.ajax({
				async: true,
				cache: false,
				dataType: 'json',
				url: lqx.opts.tmplURL + '/php/ip2geo/',
				success: function(data, status, xhr){
					vars.location = data;
					vars.location.source = 'ip2geo';

					lqx.log('IP geolocation result', vars.location);

					// If GPS enabled, attempt to get lat/lon
					if(opts.gps && 'geolocation' in window.navigator) getGPS();
					else bodyGeoData();
				},
				error: function(xhr, status, error){
					lqx.error('Geolocate error ' + status + ' ' + error);
				}
			});
		};

		// Geolocation from GPS
		var getGPS = function() {
			if('geolocation' in window.navigator) {
				lqx.log('Attempting GPS geolocation');
				window.navigator.geolocation.getCurrentPosition(function(position) {
					vars.location.lat = position.coords.latitude;
					vars.location.lon = position.coords.longitude;
					vars.location.radius = position.coords.accuracy / 1000; // in km
					vars.location.source = 'gps';

					lqx.log('GPS geolocation result', {lat: vars.location.lat, lon: vars.location.lon});

					bodyGeoData();
				});
			}
		};

		// Save results to body attributes and trigger geolocateready event
		var bodyGeoData = function() {
			// Add location attributes to body tag
			for(var key in vars.location) {
				if(key == 'time_zone') {
					lqx.vars.body.attr('time-zone', vars.location.time_zone);
				}
				else if(['source', 'ip'].indexOf(key) == -1) {
					lqx.vars.body.attr(key, vars.location[key]);
				}
			}
			// Trigger custom event 'geolocateready'
			lqx.log('geolocateready event');
			jQuery(document).trigger('geolocateready');
		};

		var inCircle = function(test, center, radius) {
			/** Accepts:
			 * test: location to test, object with keys lat and lon
			 * center: circle center point, object with keys lat and lon
			 * radius: circle radius in kilometers
			 */
			var deg2rad = function(deg) {return deg * Math.PI / 180;};
			var dLat = deg2rad(test.lat - center.lat);
			var dLon = deg2rad(test.lon - center.lon);
			var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos(deg2rad(center.lat)) * Math.cos(deg2rad(test.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			var d = 6371 * c; // Distance in km
			return (d <= radius && true) || false;
		};

		var inSquare = function(test, corner1, corner2) {
			/** Accepts:
			 * test: location to test, object with keys lat and lon
			 * corner1: a corner of the square, object with keys lat and lon
			 * corner2: opposite corner of the square, object with keys lat and lon
			 * Known limitation: doesn't handle squares that cross the poles or the international date line
			 */
			return test.lat <= Math.max(corner1.lat, corner2.lat) &&
				test.lat >= Math.min(corner1.lat, corner2.lat) &&
				test.lon <= Math.max(corner1.lon, corner2.lon) &&
				test.lon >= Math.min(corner1.lon, corner2.lon);
		};

		var inPolygon = function(test, poly) {
			/** Accepts:
			 * test: location to test, object with keys lat and lon
			 * poly: defines the polygon, array of objects, each with keys lat and lon
			 * Based on http://alienryderflex.com/polygon/
			 * Known limitation: doesn't handle polygons that cross the poles or the international date line
			 */
			var i, j = poly.length - 1, oddNodes = false;

			for(i=0; i < poly.length; i++) {
				if(poly[i].lat < test.lat && poly[j].lat >= test.lat ||  poly[j].lat < test.lat && poly[i].lat >= test.lat) {
					if(poly[i].lon + (test.lat - poly[i].lat) / (poly[j].lat - poly[i].lat) * (poly[j].lon - poly[i].lon) < test.lon) {
						oddNodes =! oddNodes;
					}
				}
				j = i;
			}
			return oddNodes;
		};

		return {
			init: init,
			getGPS: getGPS,
			location: location,
			inCircle: inCircle,
			inSquare: inSquare,
			inPolygon: inPolygon
		};
	})();
	lqx.geolocate.init();
}
