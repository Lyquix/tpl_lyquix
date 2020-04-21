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
			},
			regions: {}
		};

		var init = function(){
			// Copy default opts and vars
			jQuery.extend(true, lqx.opts.geolocate, opts);
			opts = lqx.opts.geolocate;
			jQuery.extend(true, lqx.vars.geolocate, vars);
			vars = lqx.vars.geolocate;

			// Initialize on lqxready
			lqx.vars.window.on('lqxready', function() {
				// Initialize only if enabled
				if(opts.enabled) {
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

		// Process region data
		var setRegions = function(regions) {
			/**
			 * Receives the regions definition as an object in the format below
			 * and then calls regionDisplay()
			 * Should be called after geolocateready event
			 *
			 * {
			 *		region1: {
			 * 	 		circles: [
			 * 				{lat: centerLat, lon: centerLon, radius: circleTadius},
			 * 				...
			 * 				{lat: centerLat, lon: centerLon, radius: circleTadius}
			 * 			],
			 * 			squares: [
			 * 				{corner1: {lat: corner1Lat, lon: corner1Lon}, corner2: {lat: corner2Lat, lon: corner2Lon}},
			 * 				...
			 * 				{corner1: {lat: corner1Lat, lon: corner1Lon}, corner2: {lat: corner2Lat, lon: corner2Lon}}
			 * 			],
			 * 			polygons: [
			 * 				[{lat: point1Lat, lon: point1Lon},..., {lat: pointNLat, lon: pointNLon}].
			 * 				...
			 * 				[{lat: point1Lat, lon: point1Lon},..., {lat: pointNLat, lon: pointNLon}]
			 * 			]
			 * 		}
			 * }
			 */
			// Get current lat / lon
			var here = {
				lat: vars.location.lat,
				lon: vars.location.lon
			};

			// Check what regions match
			Object.key(regions).forEach(function(region){
				vars.regions[region] = false;
				// Check circles
				if('circles' in regions[region]) {
					regions[region].circles.forEach(function(x){
						if(inCircle(here, {lat: x.lat, lon: x.lon}, x.radius)) vars.regions[region] = true;
					})
				}

				// Check squares
				if('squares' in regions[region]) {
					regions[region].squares.forEach(function(x){
						if(inSquare(here, {lat: x.corner1.lat, lon: x.corner1.lon}, {lat: x.corner2.lat, lon: x.corner2.lon})) vars.regions[region] = true;
					})
				}

				// Check polygons
				if('polygons' in regions[region]) {
					regions[region].polygons.forEach(function(x){
						if(inPolygon(here, x)) vars.regions[region] = true;
					})
				}

				// Remove if not matching
				if(!vars.regions[region]) delete vars.regions[region];
			});
			vars.regions = Object.keys(vars.regions);

			// Set body tag attribute
			lqx.vars.body.attr('regions', vars.regions.join(','));

			// Setup elements with attribute data-region-display
			regionDisplay(jQuery('[data-region-display]'));
		};

		// Get array of current matching regions
		var getRegions = function() {
			return vars.regions;
		};

		// Show/hide element based on region
		var regionDisplay = function(elems) {
			/**
			 *
			 * Checks for elements with attribute data-region-display and shows/hides elements as needed
			 *
			 * Attribute includes a JSON string with the following structure:
			 *
			 * {
			 * 	regions: [			//  an array of region ids (names or numbers) as provided via setRegions function
			 * 		'nyc',
			 * 		'philly'
			 * 	],
			 * 	action: 'show'	// optional, defaults to 'show', set to 'hide' to hide matching elements instead of showing them
			 * }
			 *
			 */
			if(elems instanceof Node) {
				// Not an array, convert to an array
				elems = [elems];
			}
			else if(elems instanceof jQuery) {
				// Convert jQuery to array
				elems = elems.toArray();
			}
			if(elems.length) {
				elems.forEach(function(elem){
					elem = jQuery(elem);

					// Get options
					var elemOpts = JSON.parse(elem.attr('data-region-display'));
					if(typeof elemOpts != 'object') {
						lqx.error('Unable to process region display, data-region-display is not a JSON object');
						return;
					}
					if(typeof elemOpts.regions == 'string') elemOpts.regions = [elemOpts.regions];
					if(!('action' in elemOpts)) elemOpts.action = true;
					else if(elemOpts.action == 'show') elemOpts.action = true;
					else if(elemOpts.action == 'hide') elemOpts.action = false;
					elemOpts.match = false;

					elemOpts.regions.forEach(function(region){
						if(vars.regions.indexOf(region) != -1) elemOpts.match = true;
					});

					// Hide the element if action=show and no-match, or if action=hide and match
					if((elemOpts.action && !elemOpts.match) || (!elemOpts.action && elemOpts.match)) elem.hide();
					else elem.show();
				});
			}
		};

		return {
			init: init,
			getGPS: getGPS,
			location: location,
			inCircle: inCircle,
			inSquare: inSquare,
			inPolygon: inPolygon,
			setRegions: setRegions,
			getRegions: getRegions,
			regionDisplay: regionDisplay
		};
	})();
	lqx.geolocate.init();
}
