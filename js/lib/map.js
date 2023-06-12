/**
 * map.js - Functionality to handle maps
 *
 * @version     2.4.0
 * @package     wp_theme_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/wp_theme_lyquix
 */

if(lqx && !('map' in lqx)) {
	lqx.map = (function(){
		var opts = {
			selector: '.map',
			map: {
				type: 'roadmap',
				center: { // Default: Philadelphia City Hall
					lat: 39.9519378,
					lon: -75.1653731
				},
				autoAddPins: true, // add pins immediately after loading map
				autoFitMap: true, // pans and zooms maps automatically after pins are added, shown, or hidden
				icon: {}, // optional, default marker settings
			},
			vendor: {
				name: 'google', // google, esri, openmap
				urlParams: {
					key: ''
					/**
					 * each key-value pair is added to the library URL
					 *
					 * key: // API key
					 * libraries: // List of additional libraries to load
					 */
				},
				ready: false // Scripts loaded
			},
			analytics: {
				enabled: true,
				nonInteraction: false
			}
		};

		var vars = {
			elems: []
			/**
			 * Array of map elements each including the following keys:
			 * {
			 *   elem: // DOM element containing the map
			 *   id: // optional, unique id for the map
			 *   title: // optional, for analytics purposes
			 *
			 *   type: // For Google Maps: roadmap, satellite, hybrid and terrain
			 *   center: {
			 *     lat:
			 *     lon:
			 *   }
			 *   autoAddPins:
			 *   autoFitMap:
			 *   icon: { // optional default marker settings for the map
			 *     url: // optional icon url
			 *     width:
			 *     height:
			 *   }
			 *
			 *   items: { // array of map items, each with the following keys
			 *     id: // optional, unique ID for marker
			 *     title: // optional, for analytics identification purpose
			 *     lat:
			 *     lon:
			 *     html: // optional, info window content
			 *     label: { // optional, pin label and color
			 *       text:
			 *       color:
			 *     }
			 *     icon: // optional, url of custom icon for marker
			 *   }
			 *
			 *   zoom:
			 *
			 *   mapObj: // map object
			 *   bounds: // bounds object
			 *   markers: // markers objects
			 *   infoWindows: // infowindows objects
			 * }
			 */
		};

		var init = function(){
			// Copy default opts and vars
			jQuery.extend(true, lqx.opts.map, opts);
			opts = lqx.opts.map;
			jQuery.extend(true, lqx.vars.map, vars);
			vars = lqx.vars.map;

			// Initialize on lqxready
			lqx.vars.window.on('lqxready', function() {
				// Initialize only if enabled
				if(opts.enabled) {
					lqx.log('Initializing `map`');

					// Trigger functions on document ready
					lqx.vars.document.ready(function() {
						// Disable analytics if the analytics module is not enabled
						opts.analytics.enabled = lqx.opts.analytics.enabled ? opts.analytics.enabled : false;
						if(opts.analytics.enabled) lqx.log('Setting maps tracking');

						// Load vendor library
						switch(opts.vendor.name) {
							case 'google':
								if(!(jQuery('script[src*="//maps.googleapis.com/maps/api/js"]').length)) {
									lqx.log('Loading Google Maps library');
									var src = '//maps.googleapis.com/maps/api/js';
									Object.keys(opts.vendor.urlParams).forEach(function(key){
										src += (src.indexOf('?') == -1 ? '?' : '&') +
										encodeURIComponent(key) + '=' + encodeURIComponent(opts.vendor.urlParams[key]);
									});
									var scriptElem = document.createElement('script');
									scriptElem.setAttribute('src', src);
									scriptElem.onload = function() {
										lqx.log('Google Maps library loaded');
										ready();
									};
									scriptElem.src = src;
									document.head.appendChild(scriptElem);
								}
								else {
									lqx.log('Google Maps library already loaded, skipping');
								}
								ready();
								break;

							/**
							 * case: 'esri'
							 */
						}
					});
				}
			});

			// Run only once
			lqx.map.init = function(){
				lqx.warn('lqx.map.init already executed');
			};

			return true;
		};

		var ready = function() {
			// Setup maps loaded initially on the page
			setup(jQuery(opts.mapSelector));

			// Add a mutation handler for maps added to the DOM
			lqx.mutation.addHandler('addNode', opts.selector, setup);
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
				lqx.log('Setting up ' + elems.length + ' map', elems);
				elems.forEach(function(elem){
					elem = jQuery(elem);

					lqx.log('Setting up new map', elem);

					// Get the map options
					var map = JSON.parse(elem.attr('data-map-options'));
					if(typeof map != 'object') map = {};
					map = jQuery.extend(true, {}, opts.map, map);

					// Get the map items
					var items = JSON.parse(elem.attr('data-map-items'));
					if(!(items instanceof Array)) {
						lqx.log('data-map-items does not contain a valid JSON array', elem);
						items = [];
					}
					if(!items.length) lqx.warn('data-map-items does not contain any items');

					map.elem = elem;
					map.items = items;
					map.markers = [];
					map.infoWindows = [];
					// if no custom id is provided, use the maps array index
					if(!('id' in map)) map.id = vars.elems.length;

					vars.elems.push(map);

					loadMap(map);

				});
			}
		};

		// Initial setup of a map, automatically adds pins, run once per map
		var loadMap = function(map){
			switch(opts.vendor.name) {
				case 'google':
					map.bounds = new google.maps.LatLngBounds();
					map.mapObj = new google.maps.Map(map.elem[0], {
						center: {lat: map.center.lat, lng: map.center.lon},
						mapTypeId: google.maps.MapTypeId[map.type]
					});

					if(map.autoFitMap) {
						google.maps.event.addListenerOnce(map.mapObj, 'bounds_changed', function(event) {
							map.mapObj.fitBounds(map.bounds);
							map.mapObj.panToBounds(map.bounds);
						});

						lqx.vars.window.on('screensizechange orientationchange', function() {
							map.mapObj.fitBounds(map.bounds);
							map.mapObj.panToBounds(map.bounds);
						});
					}

					// add map analytics
					if(opts.analytics.enabled) {
						var label = map.id;
						if(typeof map.title != 'undefined') label = map.title;
						map.mapObj.addListener('drag_start maptypeid_changed projection_changed', function(e) {
							ga('send', 'event', 'Map', e.type, label);
						});
					}

					break;

				/**
				 * case 'esri':
				 */

				default:
					lqx.error('No map vendor specified for map', map);
					return;
			}

			if(map.autoAddPins) {
				addPins(map);
			}
		};

		// Add pins for each map item
		var addPins = function(map){
			lqx.log('Adding pins to map', map);
			switch(opts.vendor.name) {
				case 'google':
					Object.keys(map.items).forEach(function(i){
						var mapItem = map.items[i];
						// if no unique id is included, use the array index as id
						if(!('id' in mapItem)) mapItem.id = i;
						if('lat' in mapItem && 'lon' in mapItem) {
							// Create marker
							var markerParams = {
								position: {lat: mapItem.lat, lng: mapItem.lon},
								map: map.mapObj,
							};

							var icon = jQuery.extend(true, {}, map.icon, mapItem.icon);
							if(Object.keys(icon).length) {
								if('width' in icon && 'height' in icon) {
									icon.scaledSize = new google.maps.Size(icon.width, icon.height);
									delete icon.width;
									delete icon.height;
								}
								markerParams.icon = icon;
							}
							lqx.log(markerParams);

							map.markers[mapItem.id] = new google.maps.Marker(markerParams);

							// add marker analytics
							if(opts.analytics.enabled) {
								map.markers[mapItem.id].addListener('click', function() {
									var label = mapItem.id;
									if(typeof mapItem.title != 'undefined') label = mapItem.title;
									ga('send', 'event', 'Map', 'pinClick', label);
								});
							}

							if(mapItem.html && !(mapItem.id in map.infoWindows)) {
								// Create info window
								map.infoWindows[mapItem.id] = new google.maps.InfoWindow({
									content: mapItem.html
								});

								// Add click listener for marker
								google.maps.event.addListener(map.markers[mapItem.id], 'click', function() {
									map.infoWindows[mapItem.id].open(map.mapObj, this);
								});
							}

							// Extend map bounds
							map.bounds.extend({lat: mapItem.lat, lng: mapItem.lon});

						}
					});
					break;

				/**
				 * case 'esri':
				 */
			}

			lqx.log(map.markers.length + ' pins added to map', map);

			if(map.autoFitMap) {
				fitMap(map);
			}
		};

		var fitMap = function(map){
			lqx.log('Fitting map', map);
			switch(opts.vendor.name) {
				case 'google':
					map.mapObj.fitBounds(map.bounds);
					map.mapObj.panToBounds(map.bounds);
					break;

				/**
				 * case 'esri':
				 */
			}
		};

		var centerMap = function(map, center){
			lqx.log('Centering map', map, center);
			switch(opts.vendor.name) {
				case 'google':
					map.mapObj.setCenter({lat: center.lat, lng: center.lon});
					break;

				/**
				 * case 'esri':
				 */
			}
		};

		var zoomMap = function(map, zoom){
			lqx.log('Zooming map', map, zoom);
			switch(opts.vendor.name) {
				case 'google':
					map.mapObj.setZoom(zoom);
					break;

				/**
				 * case 'esri':
				 */
			}
		};

		// show or hide markers
		/**
		 * markerIds is an object where the keys match the marker ids and the boolean value is used to
		 * set the marker visibility
		 *
		 * markerIds: {
		 *    1: true,
		 *    5: false
		 * }
		 */
		var filterPins = function(map, markerIds){
			lqx.log('Filtering pins', map, markerIds);
			switch(opts.vendor.name) {
				case 'google':
					// Show/hide pins according to markerIds object (key = id, value = true/false)
					Object.keys(markerIds).forEach(function(id){
						map.markers[id].setVisible(markerIds[id]);
					});

					// Reset map bounds
					map.bounds = new google.maps.LatLngBounds();
					Object.keys(map.markers).forEach(function(id){
						if(map.markers[id].getVisible()) map.bounds.extend(map.markers[id].getPosition());
					});

					break;

				/**
				 * case 'esri':
				 */
			}
		};

		return {
			init: init,
			setup: setup,
			loadMap: loadMap,
			addPins: addPins,
			centerMap: centerMap,
			zoomMap: zoomMap,
			fitMap: fitMap,
			filterPins: filterPins
		};
	})();
	lqx.map.init();
}
