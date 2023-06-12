/**
 * geolocate.js - geolocate functionality
 *
 * @version     2.4.0
 * @package     wp_theme_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/wp_theme_lyquix
 */

if(lqx && !('geolocate' in lqx)) {
	lqx.geolocate = (function(){
		var opts = {
			gps: false,
			useCookies: false,
			cookieExpirationIP: 300, // 5 minutes
			cookieExpirationGPS: 900, // 15 minutes
			regionDisplaySelectors: '[data-region-display], [class*="region-name-"]', // Do not change
			handleNoRegionMatch: true, // Set to false if we don't want unmatched elements to be forcefully shown/hidden
			removeNoRegionMatch: true // Set to false to hide (display: none) unmatched elements, instead of removing them
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
			regions: {},
			cookies: {
				ip: null,
				gps: null
			},
			status: {
				ip: null,
				gps: null
			}
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

					// Trigger functions on document ready
					lqx.vars.document.ready(function() {
						// Add a mutation handler for accordions added to the DOM
						lqx.mutation.addHandler('addNode', opts.regionDisplaySelectors, regionDisplay);
					});
				}
			});

			// Run only once
			lqx.geolocate.init = function(){
				lqx.warn('lqx.geolocate.init already executed');
			};

			return true;
		};

		// Get current location
		var location = function() {
			return vars.location;
		};

		// geoLocate
		// attempts to locate position of user by means of gps or ip address
		var geoLocate = function() {
			if(opts.useCookies) {
				lqx.log('Attempting to geolocate from cookies');

				// Get data from cookies
				vars.cookies.ip = lqx.util.cookie('lqx.geolocate.cookies.ip');
				if(vars.cookies.ip !== null) vars.cookies.ip = JSON.parse(vars.cookies.ip);

				if(vars.cookies.ip !== null) {
					vars.location = Object.assign({}, vars.cookies.ip);
					vars.location.source = 'ip2geo-cookie';
					vars.status.ip = 'done';
				}
				else getIP();

				vars.cookies.gps = lqx.util.cookie('lqx.geolocate.cookies.gps');
				if(vars.cookies.gps !== null) vars.cookies.gps = JSON.parse(vars.cookies.gps);

				if(opts.gps && 'geolocation' in window.navigator) {
					if(vars.cookies.gps !== null) {
						vars.location = Object.assign({}, vars.cookies.gps);
						vars.location.source = 'gps-cookie';
						vars.status.gps = 'done';
					}
					else getGPS();
				}
				else vars.status.gps = 'done';

				bodyGeoData();
			}
			else {
				getIP();
				if(opts.gps && 'geolocation' in window.navigator) getGPS();
			}
		};

		var getIP = function() {
			lqx.log('Attempting IP geolocation');
			vars.status.ip = 'waiting';
			// ip2geo to get location info
			jQuery.ajax({
				async: true,
				cache: false,
				dataType: 'json',
				url: lqx.opts.tmplURL + '/php/ip2geo/',
				success: function(data, status, xhr){
					vars.location = data;
					vars.location.source = 'ip2geo';
					vars.status.ip = 'done';

					lqx.log('IP geolocation result', vars.location);

					// Save cookie
					if(opts.useCookies) lqx.util.cookie('lqx.geolocate.locationIP', JSON.stringify(vars.location), {maxAge: opts.cookieExpirationIP, path: '/', secure: true});

					bodyGeoData();
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
				vars.status.gps = 'waiting';
				window.navigator.geolocation.getCurrentPosition(function(position) {
					vars.location.lat = position.coords.latitude;
					vars.location.lon = position.coords.longitude;
					vars.location.radius = position.coords.accuracy / 1000; // in km
					vars.location.source = 'gps';
					vars.status.gps = 'done';

					lqx.log('GPS geolocation result', vars.location);

					// Save cookie
					if(opts.useCookies) lqx.util.cookie('lqx.geolocate.locationGPS', JSON.stringify(vars.location), {maxAge: opts.cookieExpirationGPS, path: '/', secure: true});

					bodyGeoData();
				});
			}
			else vars.status.gps = 'done';
		};

		// Save results to body attributes and trigger geolocateready event
		var bodyGeoData = function() {
			if(vars.status.ip == 'done' && vars.status.gps == 'done') {
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
			}
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
		var setRegions = function(regions, outsideRegionName, callRegionDisplay) {
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
			 *
			 * outsideRegionName: set to a string to be used as name of region when no regions match
			 * callRegionDisplay: set to false to prevent regionDiscplay to be called automatically
			 */

			if(typeof outsideRegionName == 'undefined') outsideRegionName = '';
			if(typeof blockRegionDisplay == 'undefined') callRegionDisplay = true;

			// Get current lat / lon
			var here = {
				lat: vars.location.lat,
				lon: vars.location.lon
			};

			// Check what regions match
			Object.keys(regions).forEach(function(region){
				vars.regions[region] = false;
				// Check circles
				if('circles' in regions[region]) {
					regions[region].circles.forEach(function(x){
						if(inCircle(here, {lat: x.lat, lon: x.lon}, x.radius)) vars.regions[region] = true;
					});
				}

				// Check squares
				if('squares' in regions[region]) {
					regions[region].squares.forEach(function(x){
						if(inSquare(here, {lat: x.corner1.lat, lon: x.corner1.lon}, {lat: x.corner2.lat, lon: x.corner2.lon})) vars.regions[region] = true;
					});
				}

				// Check polygons
				if('polygons' in regions[region]) {
					regions[region].polygons.forEach(function(x){
						if(inPolygon(here, x)) vars.regions[region] = true;
					});
				}

				// Remove if not matching
				if(!vars.regions[region]) delete vars.regions[region];
			});
			vars.regions = Object.keys(vars.regions);

			if(vars.regions.length == 0 && outsideRegionName != '') vars.regions = [outsideRegionName];

			// Set body tag attribute
			lqx.vars.body.attr('regions', vars.regions.join(','));

			// Trigger regionready event
			lqx.log('regionready event');
			jQuery(document).trigger('regionready');

			// Setup elements with attribute data-region-display, or class names that start with region-show- or region-hide-
			if(callRegionDisplay) regionDisplay(jQuery(opts.regionDisplaySelectors));

			// Run only once
			lqx.geolocate.setRegions = function(){
				lqx.warn('lqx.geolocate.setRegions already executed');
			};

			return true;
		};

		// Get array of current matching regions
		var getRegions = function() {
			return vars.regions;
		};

		// Show/hide element based on region
		var regionDisplay = function(elems) {
			/**
			 *
			 * Checks for elements with attribute data-region-display,or class names that start with region-
			 * region-alias
			 * region-action-show, region-action-hide
			 * region-display-block, region-display-inline, region-display-flex
			 * and shows/hides elements as needed
			 *
			 * [data-region-display] attribute includes a JSON string with the following structure:
			 *
			 * {
			 * 	regions: [			//  a string or an array of region ids (names or numbers) as provided via setRegions function
			 * 		'nyc',
			 * 		'philly'
			 * 	],
			 * 	action: 'show',	// optional, defaults to 'show', set to 'hide' to hide matching elements instead of showing them
			 *  display: 'block' // optional, defaults to 'block', set to the desired CSS display type e.g. inline, flex, etc.
			 * }
			 *
			 * NOTE:
			 *  - if conflicting rules are found, only the first rule found will be applied
			 *  - rules are processed in this order: data-region-display rules, region-show- classes, region-hide- classes
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

					var elemOpts = {regions: []};
					var elemRegionMatch = false;

					// Get attribute options first
					var elemAttribOpts = elem.attr('data-region-display');
					if(typeof elemAttribOpts != 'undefined') {
						elemAttribOpts = JSON.parse(elemAttribOpts);
						if(typeof elemAttribOpts == 'object') {
							elemOpts = elemAttribOpts;
							if(typeof elemOpts.regions == 'string') elemOpts.regions = [elemOpts.regions];
							elemOpts.regions.forEach(function(region){
								if(vars.regions.indexOf(region) != -1) elemRegionMatch = true;
							});
						}
					}

					// Get classes
					var elemClasses = elem.attr('class').split(/\s+/);
					elemClasses.forEach(function(elemClass){
						if(elemClass.indexOf('region-action-') == 0) elemOpts.action = elemClass.replace('region-action-','');
						else if(elemClass.indexOf('region-display-') == 0) elemOpts.display = elemClass.replace('region-display-','');
						else if(elemClass.indexOf('region-name-') == 0) elemOpts.regions.push(elemClass.replace('region-name-',''));
					});
					elemOpts.regions.forEach(function(region){
						if(vars.regions.indexOf(region) != -1) elemRegionMatch = true;
					});

					// Show/hide element
					if(!('action' in elemOpts)) elemOpts.action = 'show';
					if(!('display' in elemOpts)) elemOpts.display = 'block';
					if(elemRegionMatch) {
						if(elemOpts.action == 'show') elem.css('display', elemOpts.display);
						else if(elemOpts.action == 'hide') {
							if(opts.removeNoRegionMatch) elem.remove();
							else elem.css('display', 'none');
						}
					}
					else if(!elemRegionMatch && opts.handleNoRegionMatch) {
						if(elemOpts.action == 'show') {
							if(opts.removeNoRegionMatch) elem.remove();
							elem.css('display', 'none');
						}
						else if(elemOpts.action == 'hide') elem.css('display', elemOpts.display);
					}
				});

				// Trigger regiondisplayready event
				lqx.log('regiondisplayready event');
				jQuery(document).trigger('regiondisplayready');
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