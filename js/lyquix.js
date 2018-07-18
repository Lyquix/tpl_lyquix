/**
 * lyquix.core.js - Lyquix JavaScript library
 *
 * @version     2.0.0
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

'use strict';
if(typeof lqx !== 'undefined') {
	console.error('`lqx` already exist!');
}
else if(typeof jQuery == 'undefined') {
	console.error('`jQuery` has not been loaded!');
}
else {
	var lqx = (function(){
		// Default settings
		var settings = {
			debug: false,
			siteURL: null,
			tmplURL: null,
			// Modules
			analytics:  {enabled: true},
			detect:     {enabled: true},
			fixes:      {enabled: true},
			geolocate:  {enabled: true},
			lyqbox:     {enabled: true},
			menu:       {enabled: true},
			mutation:   {enabled: true},
			responsive: {enabled: true},
			util:       {enabled: true}
		};

		// Holds working data
		var vars = {
			// Modules
			analytics:  {},
			detect:     {},
			fixes:      {},
			geolocate:  {},
			lyqbox:     {},
			menu:       {},
			mutation:   {},
			responsive: {},
			util:       {},
			// jQuery objects
			document: jQuery(document),
			window: jQuery(window),
			html: jQuery(document.html),
			body: null, // Populated after the lqxready event
			// Other
			scrollThrottle: false,
			resizeThrottle: false
		};

		var init = function() {
			lqx.log('Initializing `lqx`');

			// scrollthrotle event
			lqx.log('Setup scrollthrottle event');
			lqx.vars.window.scroll(function() {
				if(!lqx.vars.scrollThrottle) {
					lqx.vars.document.trigger('scrollthrottle');
					lqx.vars.scrollThrottle = true;
					setTimeout(function() {
						lqx.vars.scrollThrottle = false;
						lqx.vars.document.trigger('scrollthrottle');
					}, 15);
				}
			});

			// resizethrottle event
			lqx.log('Setup resizethrottle event');
			lqx.vars.window.resize(function() {
				if(!lqx.vars.resizeThrottle) {
					lqx.vars.document.trigger('resizethrottle');
					lqx.vars.resizeThrottle = true;
					setTimeout(function () {
						lqx.vars.resizeThrottle = false;
						lqx.vars.document.trigger('resizethrottle');
					}, 15);
				}
			});

			// On document ready
			lqx.vars.document.ready(function(){
				comicfy();
				almost7();
			});

			return lqx.init = true;
		};

		// Extends/updates the settings object
		var options = function(opts) {
			if(typeof opts == 'object') {
				jQuery.extend(true, lqx.settings, opts);
				lqx.log('Options updated', opts);
			}
			return lqx.settings;
		};

		// Triggers custom event 'lqxready'
		var ready = function(opts) {
			if(typeof opts == 'object') lqx.options(opts);
			lqx.vars.body = jQuery(document.body);
			lqx.log('lqxready event');
			lqx.vars.window.trigger('lqxready');

			return lqx.ready = true;
		};

		// Internal console log/warn/error functions
		// Use instead of console.log(), console.warn() and console.error(), use lqx.settings.debug to enable/disable
		var log = function() {
			if(lqx.settings.debug) console.log(arguments);
		};

		var warn = function() {
			if(lqx.settings.debug) console.warn(arguments);
		};

		var error = function() {
			if(lqx.settings.debug) console.error(arguments);
		};

		// Changes all fonts to Comic Sans
		var comicfy = function() {
			if('detect' in lqx && 'comicfy' in lqx.detect.urlParams()) {
				lqx.log('Comicfy!');

				var link = document.createElement( 'link' );
				link.href = lqx.vars.tmplURL + '/fonts/comicneue/comicfy.css';
				link.type = 'text/css';
				link.rel = 'stylesheet';
				document.getElementsByTagName('head')[0].appendChild(link);
			}
		};

		// Changes all fonts to Still 6 but Almost 7
		var almost7 = function() {
			if('detect' in lqx && 'almost7' in lqx.detect.urlParams()) {
				lqx.log('I am still 6 but almost 7!');

				var link = document.createElement( 'link' );
				link.href = lqx.vars.tmplURL + '/fonts/still-6-but-almost-7/still-6-but-almost-7.css';
				link.type = 'text/css';
				link.rel = 'stylesheet';
				document.getElementsByTagName('head')[0].appendChild(link);
			}
		};

		return {
			settings: settings,
			vars: vars,
			init: init,
			options: options,
			ready: ready,
			log: log,
			warn: warn,
			error: error
		};
	})();
	lqx.init();
}
/**
 * lyquix.util.js - Utility functions
 *
 * @version     2.0.0
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

if(lqx && typeof lqx.util == 'undefined') {
	lqx.util = {
		// Function for handling cookies with ease
		// inspired by https://github.com/js-cookie/js-cookie and https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie/Simple_document.cookie_framework
		// lqx.util.cookie(name) to get value of cookie name
		// lqx.util.cookie(name, value) to set cookie name=value
		// lqx.util.cookie(name, value, attributes) to set cookie with additional attributes
		// returns false if no name is passed, returns null if cookie doesn't exist
		// attributes is an array with any of the following keys:
		// maxAge: an integer, number of seconds
		// expires: a Date object
		// path: string
		// domain: string
		// secure: any non-false value
		// httpOnly: any non-false value
		cookie: function(name, value, attributes) {
			if(arguments.length === 0 || !name) return false;

			// get cookie
			if(arguments.length == 1) {
				return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
			}
			// set cookie
			var c = encodeURIComponent(name) + '=' + encodeURIComponent(value);
			if(typeof attributes == 'object') {
				if('maxAge' in attributes) c += '; max-age=' + parseInt(attributes.maxAge);
				if('expires' in attributes && attributes.expires instanceof Date) c += '; expires=' + attributes.expires.toUTCString();
				if('path' in attributes) c += '; path=' + attributes.path;
				if('domain' in attributes) c += '; domain=' + attributes.domain;
				if('secure' in attributes) c += '; secure';
				if('httpOnly' in attributes) c += '; httponly';
			}
			// set cookie
			document.cookie = c;
			return true;
		},

		// add unique value to the query string of form's action URL, to avoid caching problem
		uniqueUrl: function(sel, attrib) {
			var elems = jQuery(sel);
			if(elems.length) {
				var d = new Date();
				var s = (d.getTime() * 1000 + d.getMilliseconds()).toString(36);

				elems.each(function(){
					var url = jQuery(this).attr(attrib);
					if(typeof url != 'undefined') {
						jQuery(this).attr(attrib, url + (url.indexOf('?') !== -1 ? '&' : '?') + s + parseInt(Math.random()*10e6).toString(36));
					}
				});
			}
		},

		// Enable swipe detection
		// sel - element selector
		// func - name of callback function, will receive selector and direction (up, dn, lt, rt)
		swipe: function(sel, callback) {
			var swp = {
				sX: 0,
				sY: 0,
				eX: 0,
				eY: 0,
				dir: ''
			};

			var opts = {
				minX: 30,
				maxX: 150,
				minY: 30,
				maxY: 150
			};

			var elem = jQuery(sel);
			elem.on('touchstart', function(e) {
				var t = e.originalEvent.touches[0];
				swp.sX = t.clientX;
				swp.sY = t.clientY;
			});
			elem.on('touchmove', function(e) {
				if (!e.is('.content-wrapper .content.html')) e.preventDefault();
				var t = e.originalEvent.touches[0];
				swp.eX = t.clientX;
				swp.eY = t.clientY;
			});
			elem.on('touchend', function(e) {
				// Horizontal swipe
				if (
					(Math.abs(swp.eX - swp.sX) > opts.minX) &&
					(Math.abs(swp.eY - swp.sY) < opts.maxY) &&
					(swp.eX > 0)
				) {
					if (swp.eX > swp.sX) swp.dir = 'rt';
					else swp.dir = 'lt';
				}
				// Vertical swipe
				else if (
					(Math.abs(swp.eY - swp.sY) > opts.minY) &&
					(Math.abs(swp.eX - swp.sX) < opts.maxX) &&
					(swp.eY > 0)
				) {
					if (swp.eY > swp.sY) swp.dir = 'dn';
					else swp.dir = 'up';
				}

				if (swp.dir && typeof callback == 'function') callback(sel, swp.dir);

				swp = {
					sX: 0,
					sY: 0,
					eX: 0,
					eY: 0,
					dir: ''
				};
			});
		}
	};
}
/**
 * lyquix.detect.js - Detection of device, browser and O/S
 *
 * @version     2.0.0
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

if(lqx && typeof lqx.detect == 'undefined') {
	lqx.detect = (function(){
		var defaults = {
			vars: {
				mobile: null,
				browser: null,
				os: null,
				urlParts: null,
				urlParams: null
			}
		};

		var init = function(){
			// Initialize only if enabled
			if(lqx.settings.detect.enabled) {
				lqx.log('Initializing `detect`');

				// Copy default settings and vars
				jQuery.extend(lqx.vars.detect, defaults.vars);

				// Trigger functions on lqxready
				lqx.vars.window.on('lqxready', function() {
					detectMobile();
					detectBrowser();
					detectOS();
					detectUrlParts();
					detectUrlParams();
				});
			}

			return lqx.detect.init = true;
		};

		// Get functions
		var mobile = function() {
			return lqx.vars.detect.mobile;
		};
		var browser = function() {
			return lqx.vars.detect.browser;
		};
		var os = function() {
			return lqx.vars.detect.os;
		};
		var urlParts = function() {
			return lqx.vars.detect.urlParts;
		};
		var urlParams = function() {
			return lqx.vars.detect.urlParams;
		};

		// Uses the mobile-detect.js library to detect if the browser is a mobile device
		// Adds the classes mobile, phone and tablet to the body tag if applicable
		var detectMobile = function() {
			if(typeof MobileDetect == 'function') {
				var md = new MobileDetect(window.navigator.userAgent);
				var r = {
					mobile: false,
					phone: false,
					tablet: false
				};
				if(md.mobile() !== null) {
					r.mobile = true;
					lqx.vars.body.addClass('mobile');
					if(md.phone() !== null){
						r.phone = true;
						lqx.vars.body.addClass('phone');
					}
					if(md.tablet() !== null){
						r.tablet = true;
						lqx.vars.body.addClass('tablet');
					}
				}
				lqx.log('Detect mobile', r);
				lqx.vars.detect.mobile = r;
				return true;
			}
			else {
				lqx.warn('MobileDetect library not loaded');
				return false;
			}
		};

		// Detects the browser name, type and version, and sets body classes
		// detects major browsers: IE, Edge, Firefox, Chrome, Safari, Opera, Android
		// based on: https://github.com/ded/bowser
		// list of user agen strings: http://www.webapps-online.com/online-tools/user-agent-strings/dv
		var detectBrowser = function(){
			var ua = navigator.userAgent, browser;

			// Helper functions to deal with common regex
			function getFirstMatch(regex) {
				var match = ua.match(regex);
				return (match && match.length > 1 && match[1]) || '';
			}

			function getSecondMatch(regex) {
				var match = ua.match(regex);
				return (match && match.length > 1 && match[2]) || '';
			}

			if (/opera|opr/i.test(ua)) {
				browser = {
					name: 'Opera',
					type: 'opera',
					version: getFirstMatch(/version\/(\d+(\.\d+)?)/i) || getFirstMatch(/(?:opera|opr)[\s\/](\d+(\.\d+)?)/i)
				};
			}  else if (/msie|trident/i.test(ua)) {
				browser = {
					name: 'Internet Explorer',
					type: 'msie',
					version: getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)
				};
			} else if (/chrome.+? edge/i.test(ua)) {
				browser = {
					name: 'Microsft Edge',
					type: 'msedge',
					version: getFirstMatch(/edge\/(\d+(\.\d+)?)/i)
				};
			} else if (/chrome|crios|crmo/i.test(ua)) {
				browser = {
					name: 'Google Chrome',
					type: 'chrome',
					version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
				};
			} else if (/firefox/i.test(ua)) {
				browser = {
					name: 'Firefox',
					type: 'firefox',
					version: getFirstMatch(/(?:firefox)[ \/](\d+(\.\d+)?)/i)
				};
			} else if (!(/like android/i.test(ua)) && /android/i.test(ua)) {
				browser = {
					name: 'Android',
					type: 'android',
					version: getFirstMatch(/version\/(\d+(\.\d+)?)/i)
				};
			} else if (/safari/i.test(ua)) {
				browser = {
					name: 'Safari',
					type: 'safari',
					version: getFirstMatch(/version\/(\d+(\.\d+)?)/i)
				};
			} else {
				browser = {
					name: getFirstMatch(/^(.*)\/(.*) /),
					version: getSecondMatch(/^(.*)\/(.*) /)
				};
				browser.type = browser.name.toLowerCase().replace(/\s/g, '');
			}

			// Add classes to body
			if(browser.type && browser.version){
				jQuery(document).ready(function(){
					// browser type
					lqx.vars.body.addClass(browser.type);
					// browser type and major version
					lqx.vars.body.addClass(browser.type + '-' + browser.version.split('.')[0]);
					// browser type and full version
					lqx.vars.body.addClass(browser.type + '-' + browser.version.replace(/\./g, '-'));
				});
			}

			lqx.log('Detect browser', browser);
			lqx.vars.detect.browser = browser;
			return true;
		};

		// Detects the O/S name, type and version, and sets body classes
		// Detects major desktop and mobile O/S: Windows, Windows Phone, Mac, iOS, Android, Ubuntu, Fedora, ChromeOS
		// Based on bowser: https://github.com/ded/bowser
		// List of user agent strings: http://www.webapps-online.com/online-tools/user-agent-strings/dv
		var detectOS = function() {
			var ua = navigator.userAgent, os;

			// Helper functions to deal with common regex
			function getFirstMatch(regex) {
				var match = ua.match(regex);
				return (match && match.length > 1 && match[1]) || '';
			}

			function getSecondMatch(regex) {
				var match = ua.match(regex);
				return (match && match.length > 1 && match[2]) || '';
			}

			if(/(ipod|iphone|ipad)/i.test(ua)) {
				os = {
					name: 'iOS',
					type: 'ios',
					version: getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i).replace(/[_\s]/g, '.')
				};
			} else if(/windows phone/i.test(ua)) {
				os = {
					name: 'Windows Phone',
					type: 'windowsphone',
					version: getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i)
				};
			} else if(!(/like android/i.test(ua)) && /android/i.test(ua)) {
				os = {
					name: 'Android',
					type: 'android',
					version: getFirstMatch(/android[ \/-](\d+(\.\d+)*)/i)
				};
			} else if(/windows nt/i.test(ua)) {
				os = {
					name: 'Windows',
					type: 'windows',
					version: getFirstMatch(/windows nt (\d+(\.\d+)*)/i)
				};
			} else if(/mac os x/i.test(ua)) {
				os = {
					name: 'Mac OS X',
					type: 'macosx',
					version: getFirstMatch(/mac os x (\d+([_\s]\d+)*)/i).replace(/[_\s]/g, '.')
				};
			} else if(/ubuntu/i.test(ua)) {
				os = {
					name: 'Ubuntu',
					type: 'ubuntu',
					version: getFirstMatch(/ubuntu\/(\d+(\.\d+)*)/i)
				};
			} else if(/fedora/i.test(ua)) {
				os = {
					name: 'Fedora',
					type: 'fedora',
					version: getFirstMatch(/fedora\/(\d+(\.\d+)*)/i)
				};
			} else if(/CrOS/.test(ua)) {
				os = {
					name: 'Chrome OS',
					type: 'chromeos',
					version: getSecondMatch(/cros (.+) (\d+(\.\d+)*)/i)
				};
			}

			// Add classes to body
			if(os.type && os.version) {
				jQuery(document).ready(function(){
					// os type
					lqx.vars.body.addClass(os.type);
					// os type and major version
					lqx.vars.body.addClass(os.type + '-' + os.version.split('.')[0]);
					// os type and full version
					lqx.vars.body.addClass(os.type + '-' + os.version.replace(/\./g, '-'));
				});
			}

			lqx.log('Detect O/S', os);
			lqx.vars.detect.os = os;
			return true;
		};

		// Detects URL domain, path and hash and sets them as attributes to the body tag
		var detectUrlParts = function() {
			lqx.vars.detect.urlParts = {};

			lqx.vars.body.attr('domain', window.location.hostname);
			lqx.vars.detect.urlParts.domain = window.location.hostname;

			lqx.vars.body.attr('path', window.location.pathname);
			lqx.vars.detect.urlParts.path = window.location.pathname;

			lqx.vars.body.attr('hash', window.location.hash.substring(1));
			lqx.vars.detect.urlParts.hash = window.location.hash.substring(1);

			lqx.vars.window.on('hashchange',function(){
				lqx.vars.body.attr('hash', window.location.hash.substring(1));
				lqx.vars.detect.urlParts.hash = window.location.hash.substring(1);
			});

			lqx.log('Detect URL parts');
		};

		// Parses URL parameters
		var detectUrlParams = function() {
			lqx.vars.detect.urlParams = {};

			var params = window.location.search.substr(1).split('&');
			if(params.length) {
				params.forEach(function(param){
					param = param.split('=', 2);
					if(param.length == 2) lqx.vars.detect.urlParams[param[0]] = decodeURIComponent(param[1].replace(/\+/g, ' '));
					else lqx.vars.detect.urlParams[param[0]] = null;
				});
			}

			lqx.log('Detect URL params');
		};

		return {
			init: init,
			mobile: mobile,
			os: os,
			browser: browser,
			urlParts: urlParts,
			urlParams: urlParams
		};
	})();
	lqx.detect.init();
}
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
		var defaults = {
			settings: {
				gps: false
			},
			vars: {
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
			}
		};

		var init = function(){
			// Initialize only if enabled
			if(lqx.settings.geolocate.enabled) {
				lqx.log('Initializing `geolocate`');

				// Copy default settings and vars
				jQuery.extend(lqx.settings.geolocate, defaults.settings);
				jQuery.extend(lqx.vars.geolocate, defaults.vars);

				// Trigger functions on lqxready
				lqx.vars.window.on('lqxready', function() {
					geoLocate();
				});
			}

			return lqx.geolocate.init = true;
		};

		// Get function
		var location = function() {
			return lqx.vars.geolocate.location;
		};

		// geoLocate
		// attempts to locate position of user by means of gps or ip address
		var geoLocate = function() {
			// ip2geo to get location info
			jQuery.ajax({
				async: true,
				cache: false,
				dataType: 'json',
				url: lqx.settings.tmplURL + '/php/ip2geo/',
				success: function(data, status, xhr){
					lqx.vars.geolocate.location = data;

					// If GPS enabled, attempt to get lat/lon
					if(lqx.settings.geolocate.gps && 'geolocate' in navigator) {
						navigator.geolocate.getCurrentPosition(function(position) {
							lqx.vars.geolocate.location.lat = position.coords.latitude;
							lqx.vars.geolocate.location.lon = position.coords.longitude;
							lqx.vars.geolocate.location.radius = 0;
						});
					}

					// Add location attributes to body tag
					for(var key in lqx.vars.geolocate.location) {
						if(key == 'time_zone') {
							lqx.vars.body.attr('time-zone', lqx.vars.geolocate.location[key]);
						}
						else {
							lqx.vars.body.attr(key, lqx.vars.geolocate.location[key]);
						}
					}

					lqx.log('geolocate', lqx.vars.geolocate.location);

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
/**
 * lyquix.mutation.js - Mutation observer and handler
 *
 * @version     2.0.0
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

if(lqx && typeof lqx.mutation == 'undefined') {
	lqx.mutation = (function(){
		var defaults = {
			vars: {
				observer: null,
				addNode: [],
				removeNode: [],
				modAttrib: []
			}
		};

		var init = function(){
			// Initialize only if enabled
			if(lqx.settings.mutation.enabled) {
				lqx.log('Initializing `mutation`');

				// Copy default settings and vars
				jQuery.extend(lqx.vars.mutation, defaults.vars);

				// Trigger functions on lqxready
				lqx.vars.window.on('lqxready', function() {
					// Create observer
					observer();
				});
			}

			return lqx.mutation.init = true;
		};

		// create a custom mutation observer that will trigger any needed functions
		var observer = function(){
			// handle videos that may be loaded dynamically
			var mo = window.MutationObserver || window.WebKitMutationObserver;

			// check for mutationObserver support , if exists, user the mutation observer object, if not use the listener method.
			if (typeof mo !== 'undefined'){
				lqx.vars.mutation.observer = new mo(handler);
				lqx.vars.mutation.observer.observe(document, {childList: true, subtree: true, attributes: true});
			}
			else {
				jQuery(document).on('DOMNodeInserted DOMNodeRemoved DOMAttrModified', function(e) {
					lqx.mutation.handler(e);
				});
			}
		};

		var addHandler = function(type, selector, callback) {
			// type can be addNode, removeNode, and modAttrib
			switch(type) {
				case 'addNode':
					lqx.vars.mutation.addNode.push({'selector': selector, 'callback': callback});
					break;
				case 'removeNode':
					lqx.vars.mutation.removeNode.push({'selector': selector, 'callback': callback});
					break;
				case 'modAttrib':
					lqx.vars.mutation.modAttrib.push({'selector': selector, 'callback': callback});
					break;
			}
		};

		// mutation observer handler
		var handler = function(mutRecs) {
			if(!(mutRecs instanceof Array)) {
				// Not an array, convert to an array
				mutRecs = [mutRecs];
			}
			mutRecs.forEach(function(mutRec){
				switch(mutRec.type) {
					case 'childList':
						// Handle nodes added
						if (mutRec.addedNodes.length > 0) {
							lqx.vars.mutation.addNode.forEach(function(handler){
								if(mutRec.target.matches(handler.selector)) handler.callback(mutRec.target);
							});
						}

						// Handle nodes removed
						if (mutRec.removedNodes.length > 0) {
							lqx.vars.mutation.removeNode.forEach(function(handler){
								if(mutRec.target.matches(handler.selector)) handler.callback(mutRec.target);
							});
						}
						break;

					case 'DOMNodeInserted':
						lqx.vars.mutation.addNode.forEach(function(handler){
							if(mutRec.target.matches(handler.selector)) handler.callback(mutRec.target);
						});
						break;

					case 'DOMNodeRemoved':
						lqx.vars.mutation.removeNode.forEach(function(handler){
							if(mutRec.target.matches(handler.selector)) handler.callback(mutRec.target);
						});
						break;

					case 'attributes':
					case 'DOMAttrModified':
						lqx.vars.mutation.modAttrib.forEach(function(handler){
							if(mutRec.target.matches(handler.selector)) handler.callback(mutRec.target);
						});
						break;
				}
			});
		};

		return {
			init: init,
			addHandler: addHandler
		};
	})();
	lqx.mutation.init();
}
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
/**
 * lyquix.fixes.js - Browser fixes
 *
 * @version     2.0.0
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

if(lqx && typeof lqx.fixes == 'undefined') {
	lqx.fixes = (function(){
		var init = function(){
			// Initialize only if enabled
			if(lqx.settings.fixes.enabled) {
				lqx.log('Initializing `fixes`');

				if(lqx.detect.browser.type == 'msie') {
					// Trigger functions on document ready
					lqx.vars.document.ready(function() {
						imgWidthAttrib();
						fontFeatureSettings();
						cssGrid();
					});

					// Trigger functions on screen changes (reside, rotation)
					lqx.vars.window.on('screensizechange orientationchange', function() {
						cssGrid();
					});
				}

				matchesPolyfill();
			}

			return lqx.fixes.init = true;
		};

		// Adds width attribute to img elements that don't have one
		var imgWidthAttrib = function() {
			// Check all images
			jQuery('img').each(function(){
				var img = jQuery(this);
				if(img.attr('width') === undefined) setImgWidth(img);
			});

			// Add a mututation observer to fix images added to the DOM
			lqx.mutation.addHandler('addNode', 'img', function(e){
				var img = jQuery(e.target);
				if(img.attr('width') === undefined) setImgWidth(img);
			});

			lqx.log('Image width attribute fix for IE');
		};

		var setImgWidth = function(img) {
			var newimg = new Image();
			newimg.onload = function() {
				img.attr('width', newimg.width);
			};
			newimg.src = img.attr('src');
		};

		// Fix for Google fonts not rendering in IE10/11
		var fontFeatureSettings = function() {
			jQuery('<style>html, sup, sub, samp, td, th, h1, h2, h3, .font-monospace, .font-smallcaps, .font-uppercase {font-feature-settings: normal;}</style>').appendTo('head');
			lqx.log('Font feature settings property fix for IE10/11');
		};

		// Fix for CSS grid: add column/row position and span if not specified
		var cssGrid = function() {
			var gridElems = jQuery('*').filter(function() {
				if (jQuery(this).css('display') == '-ms-grid') {
					return true;
				}
			});

			if(gridElems.length) {
				gridElems.each(function(){
					var colCount = jQuery(this).css('-ms-grid-columns').split(' ').length;
					var row = 1;
					var col = 1;
					gridElem.children().each(function(){
						jQuery(this).css({'-ms-grid-column': col, '-ms-grid-column-span': '1', '-ms-grid-row': row, '-ms-grid-row-span': '1'});
						col++;
						if (col > colCount) {
							row++;
							col = 1;
						}
					});
				});
			}
		};

		var matchesPolyfill = function() {
			if (!Element.prototype.matches) {
				Element.prototype.matches = 
					Element.prototype.matchesSelector || 
					Element.prototype.mozMatchesSelector ||
					Element.prototype.msMatchesSelector || 
					Element.prototype.oMatchesSelector || 
					Element.prototype.webkitMatchesSelector ||
					function(s) {
						var matches = (this.document || this.ownerDocument).querySelectorAll(s), 
							i = matches.length;
						while (--i >= 0 && matches.item(i) !== this) {}
						return i > -1;
					};
			}
		}

		return {
			init: init
		};
	})();
	lqx.fixes.init();
}
/**
 * lyquix.menu.js - Menu functionality
 *
 * @version     2.0.0
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

if(lqx && typeof lqx.menu == 'undefined') {
	lqx.menu = (function(){
		var defaults = {
			settings: {
				screens: ['sm','xs']
			}
		};

		var init = function(){
			// Initialize only if enabled
			if(lqx.settings.menu.enabled) {
				lqx.log('Initializing `menu`');

				// Copy default settings and vars
				jQuery.extend(lqx.settings.menu, defaults.settings);

				// Trigger setup on lqxready
				lqx.vars.window.on('lqxready', function() {
					setup();
				});

				// Trigger reset on screensizechange
				lqx.vars.window.on('screensizechange', function() {
					reset();
				});
			}

			return lqx.menu.init = true;
		};

		var setup = function() {
			// Add listeners to A tags in mobile menu
			lqx.vars.body.on('click', '.horizontal a, .vertical a, .slide-out a', function(e){
				// prevent links to work until we
				e.preventDefault();
				click(this);
			});

			// Prevent propagation of clicks
			lqx.vars.body.on('click', '.horizontal, .vertical, .slide-out', function(e){
				// Do not propagate click events outside menus
				e.stopPropagation();
			});

			// Open/close slide-out menu
			lqx.vars.body.on('click', '.slide-out .menu-control', function(){
				var elem = jQuery(this).parent();
				if(jQuery(elem).hasClass('open')) {
					jQuery(elem).removeClass('open');
				}
				else {
					jQuery(elem).addClass('open');
				}
			});

			// When clicking outside the menus, hide the menus if visible and close the slide out menu if open
			lqx.vars.body.click(function() {
				jQuery('.horizontal, .vertical, .slide-out').find('.open').removeClass('open');
				jQuery('.slide-out.open').removeClass('open');
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
			if(jQuery.inArray(lqx.responsive.screen, lqx.settings.menu.screens) != -1) {
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
			}	else {

				go();
			}
		};

		var reset = function() {
			if(jQuery.inArray(lqx.responsive.screen, lqx.settings.menu.screens) == -1) {
				jQuery('.deeper.open, .menu-item-has-children.open').removeClass('open');
			}
		};

		return {
			init: init
		};
	})();
	lqx.menu.init();
}
/**
 * lyquix.lyqbox.js - LyqBox - Lyquix lightbox functionality
 *
 * @version     2.0.0
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

if(lqx && typeof lqx.lyqbox == 'undefined') {
	lqx.lyqbox = (function(){
		var defaults = {
			settings: {
				html: 
					'<div class="lyqbox">' +
						'<div class="content-wrapper">' +
							'<div class="content"></div>' +
							'<div class="info">' +
								'<div class="title"></div>' +
								'<div class="caption"></div>' +
								'<div class="credit"></div>' +
							'</div>' +
						'</div>' +
						'<div class="content-wrapper">' +
							'<div class="content"></div>' +
							'<div class="info">' +
								'<div class="title"></div>' +
								'<div class="caption"></div>' +
								'<div class="credit"></div>' +
							'</div>' +
						'</div>' +
						'<div class="close"></div>' +
						'<div class="prev"></div>' +
						'<div class="next"></div>' +
						'<div class="counter">' +
							'<span class="current"></span>' +
							' of <span class="total"></span>' +
						'</div>' +
					'</div>'
			},
			vars: {
				album: [],
				currentImageIndex: 0,
				initialized: false
			}
		};

		var init = function(){
			// Initialize only if enabled
			if(lqx.settings.lyqbox.enabled) {
				lqx.log('Initializing `lyqbox`');

				// Copy default settings and vars
				jQuery.extend(lqx.vars.lyqbox, defaults.vars);

				// Trigger functions on lqxready
				lqx.vars.window.on('lqxready', function() {
					// Add a mututation observer to run setup if lyqbox is added after document ready
					lqx.mutation.addHandler('addNode', '[data-lyqbox]', function(e){
						setup();
					});
				});

				// Initialize on document ready
				lqx.vars.window.ready(function() {
					if(jQuery('[data-lyqbox]').length) {
						setup();
					}
				});
			}

			return lqx.lyqbox.init = true;
		};

		var setup = function() {
			if(!lqx.vars.lyqbox.initialized) {
				enable();
				build();

				// to handle alertbox and hash url at the same time, we prioritize the alertbox first.
				// using promise, we make sure the alertbox shows first, and show the hash url content after the promise is done (alertbox is closed)
				var alertPromise = alert(jQuery('[data-lyqbox-type=alert]'));

				// check hash after promise is resolved/reject. Rejected is a valid return due to alerbox already shown before/cookie found.
				alertPromise.always(function afterAlertCheck() {
					hash();
				});

				lqx.vars.lyqbox.initialized = true;
			}
		};

		// show the hash url content
		var hash = function() {
			if (window.location.hash.substr(1) !== '') {
				// get hash value and display the appropriate content
				var contentData = window.location.hash.substr(1).split('_');

				if (jQuery('[data-lyqbox=' + contentData[0] + '][data-lyqbox-alias=' + contentData[1] + ']').length){
					start(jQuery('[data-lyqbox=' + contentData[0] + '][data-lyqbox-alias=' + contentData[1] + ']'));
				}
			}
		};

		// show alertbox if found.
		var alert = function(alertbox) {
			var deferred = jQuery.Deferred();
			// assume that there is only one alertbox at any given time.
			if (alertbox.length == 1) {
				// check if a cookie for this alertbox exists, if so return deferred reject.
				var cookieName = 'lyqbox-alert-' + alertbox.attr('data-lyqbox');
				var alertCookieFound = localStorage.getItem(cookieName);
				if (alertCookieFound) {
					deferred.reject();
				}
				// if no cookie found, show the alertbox
				else {
					// show the alertbox
					start(alertbox);

					// add listener to the close button to save the cookie and return deferred resolved
					jQuery('.lyqbox .close').on('click', function alertBoxCloseButtonClicked() {
						var cookieName = 'lyqbox-alert-' + lqx.vars.lyqbox.album[lqx.vars.lyqbox.currentImageIndex].albumId;
						localStorage.setItem(cookieName, 1);

						deferred.resolve();
						end();
						return false;
					});
				}
			}
			// if no alertbox is found, return deferred reject to make way to display content for hash url if any found
			else {
				deferred.reject();
			}
			return deferred.promise();
		};

		// Loop through anchors and areamaps looking for either data-lightbox attributes or rel attributes
		// that contain 'lightbox'. When these are clicked, start lightbox.
		var enable = function() {
			// we initialize everything
			lqx.vars.body.on('click', '[data-lyqbox]', function(event) {
				jQuery('.lyqbox').addClass('open');
				start(jQuery(event.currentTarget));
				return false;
			});

		};

		var build = function() {
			// append html structure
			jQuery(lqx.settings.lyqbox.html).appendTo(lqx.vars.body);

			// assign the html container class to namespace variable
			lqx.vars.lyqbox.overlay = jQuery('.lyqbox');

			// assign active content container to the first .content box
			lqx.vars.lyqbox.containerActive = lqx.vars.lyqbox.overlay.find('.content-wrapper').first().addClass('active');

			// Add swipe event handler
			lqx.util.swipe('.lyqbox .content-wrapper', swipeHandler);

			// prev button click handling
			lqx.vars.lyqbox.overlay.find('.prev').on('click', function() {
				if (lqx.vars.lyqbox.currentImageIndex === 0) {
					changeContent(lqx.vars.lyqbox.album.length - 1);
				} else {
					changeContent(lqx.vars.lyqbox.currentImageIndex - 1);
				}
				return false;
			});

			// next button click handling
			lqx.vars.lyqbox.overlay.find('.next').on('click', function() {
				if (lqx.vars.lyqbox.currentImageIndex === lqx.vars.lyqbox.album.length - 1) {
					changeContent(0);
				} else {
					changeContent(lqx.vars.lyqbox.currentImageIndex + 1);
				}
				return false;
			});

			// close button click handling
			lqx.vars.lyqbox.overlay.find('.close').on('click', function() {
				// disable the close button for alertbox, cookie save handling to prevent the alert box to reappear will be done on the deferred section on alert function to make sure in the case alert and hashurl found,
				// that the alert box is closed properly before showing a hash url content.
				if (lqx.vars.lyqbox.album[lqx.vars.lyqbox.currentImageIndex].type == 'alert')
					return false;

				// else close the lightbox
				end();
				return false;
			});

		};

        // special function remove video iframe from DOM, otherwise it will still play in the background
        var stopVideo = function(type) {
            if (type == 'video') {
                lqx.vars.lyqbox.containerActive.find('.content.video .video-container iframe').remove();
            }
        };

        
		// Show overlay and lightbox. If the image is part of a set, add siblings to album array.
		var start = function(data) {
			lqx.vars.lyqbox.album = [];
			var currentIndex = 0;

			function addToAlbum(data) {
				lqx.vars.lyqbox.album.push({
					albumId: data.attr('data-lyqbox'),
					type: data.attr('data-lyqbox-type'),
					link: data.attr('data-lyqbox-url'),
					title: data.attr('data-lyqbox-title'),
					caption: data.attr('data-lyqbox-caption'),
					credit: data.attr('data-lyqbox-credit'),
					class: data.attr('data-lyqbox-class'),
					alias: data.attr('data-lyqbox-alias'),
					html: data.attr('data-lyqbox-html'),
				});
			}

			var items;

			// build the album, the object which contains all values passed from the attribute
			var datalyqboxValue = data.attr('data-lyqbox');
			if (datalyqboxValue) {
				items = jQuery(data.prop('tagName') + '[data-lyqbox="' + datalyqboxValue + '"]');

				for (var i = 0; i < items.length; i = ++i) {
					addToAlbum(jQuery(items[i]));
					//
					if (items[i] === data[0]) {
						currentIndex = i;
					}
				}
			}

			// change the content to item at index
			changeContent(currentIndex);
		};

		var loadHTML = function(url) {
			var deferred = jQuery.Deferred();
			// we are using load so one can specify a target with: url.html #targetelement
			var $container = jQuery('<div></div>').load(url, function(response, status) {
				if (status !== 'error') {
					deferred.resolve($container.contents());
				}
				deferred.fail();
			});
			return deferred.promise();
		};

		var addHash = function() {
			if (lqx.vars.lyqbox.album[lqx.vars.lyqbox.currentImageIndex].alias)
				window.location.hash = lqx.vars.lyqbox.album[lqx.vars.lyqbox.currentImageIndex].albumId + '_' + lqx.vars.lyqbox.album[lqx.vars.lyqbox.currentImageIndex].alias;
		};

		// change content, for now we have 3 types, image, iframe and HTML.
		var changeContent = function(index) {
			disableKeyboardNav();
			lqx.vars.lyqbox.overlay.addClass('open');

			// deferred var to be used on alert type lyqbox only, just in case it's loading HTML content from a file
			var promise = jQuery.Deferred();

			// process the new content
			switch (lqx.vars.lyqbox.album[index].type) {
				case 'image':
					var image = jQuery('<img />');
					var preloader = new Image();
					preloader.src = lqx.vars.lyqbox.album[index].link;
					preloader.onload = function() {
						var preloaderObject;
						image.attr('src', lqx.vars.lyqbox.album[index].link);

						preloaderObject = jQuery(preloader);

						updateContent(image, index, lqx.vars.lyqbox.album[index].type);
						addHash();

						// important line of code to make sure opacity is computed and applied as a starting value to the element so that the css transition works.
						window.getComputedStyle(image[0]).opacity();
					};

					break;

				case 'video':
					var video = jQuery('<iframe></iframe>');
					video.attr('src', lqx.vars.lyqbox.album[index].link);

					updateContent('<div class="video-container">' + video.prop('outerHTML') + '</div>', index, lqx.vars.lyqbox.album[index].type);
					addHash();
					break;

				case 'html':
				case 'alert':
					// note that the alert lyqbox can grab html content from a file, put the file URL inside the data-lyqbox-url attribute
					// OR can grab the html content from string, put the string inside the data-lyqbox-html attribute
					// the priority is given to the data-lyqbox-url attribute first, if this is blank, then data-lyqbox-html will be processed instead.

					// check if url is not empty
					if (lqx.vars.lyqbox.album[index].link !== '' && typeof lqx.vars.lyqbox.album[index].link !== 'undefined' ) {
						promise = loadHTML(lqx.vars.lyqbox.album[index].link);

						promise.done(function htmlLoaded(htmlResult) {
							if (htmlResult !== '')
								updateContent(htmlResult, index, lqx.vars.lyqbox.album[index].type);
						});
					} else {
						updateContent(lqx.vars.lyqbox.album[index].html, index, lqx.vars.lyqbox.album[index].type);
					}
					break;

				default:
					break;
			}
		};

		var updateContent = function(content, index, type) {
            stopVideo(type);
			lqx.vars.lyqbox.overlay.find('.content-wrapper').not('.active').addClass('active').find('.content').removeClass().addClass('content ' + type).empty().append(content);
			lqx.vars.lyqbox.containerActive.removeClass('active');
			lqx.vars.lyqbox.containerActive = lqx.vars.lyqbox.overlay.find('.content-wrapper.active');
			lqx.vars.lyqbox.currentImageIndex = index;
			updateUIandKeyboard();
		};

		// Display the image and its details and begin preload neighboring images.
		var updateUIandKeyboard = function() {
			updateUI();
			enableKeyboardNav();
		};

		// Display caption, image number, and closing button.
		var updateUI = function() {

			// alert type will hide title, caption and credit????
			if(lqx.vars.lyqbox.album[lqx.vars.lyqbox.currentImageIndex].type != 'alert' ) {
				// display title
				if (typeof lqx.vars.lyqbox.album[lqx.vars.lyqbox.currentImageIndex].title !== 'undefined' &&
					lqx.vars.lyqbox.album[lqx.vars.lyqbox.currentImageIndex].title !== '') {
					lqx.vars.lyqbox.overlay.find('.title')
						.html(lqx.vars.lyqbox.album[lqx.vars.lyqbox.currentImageIndex].title);
				} else  {
					lqx.vars.lyqbox.overlay.find('.title').html('');
				}
				// display caption
				if (typeof lqx.vars.lyqbox.album[lqx.vars.lyqbox.currentImageIndex].caption !== 'undefined' &&
					lqx.vars.lyqbox.album[lqx.vars.lyqbox.currentImageIndex].caption !== '') {
					lqx.vars.lyqbox.overlay.find('.caption')
						.html(lqx.vars.lyqbox.album[lqx.vars.lyqbox.currentImageIndex].caption);
				} else  {
					lqx.vars.lyqbox.overlay.find('.caption').html('');
				}
				// display credit
				if (typeof lqx.vars.lyqbox.album[lqx.vars.lyqbox.currentImageIndex].credit !== 'undefined' &&
					lqx.vars.lyqbox.album[lqx.vars.lyqbox.currentImageIndex].credit !== '') {
					lqx.vars.lyqbox.overlay.find('.credit')
						.html(lqx.vars.lyqbox.album[lqx.vars.lyqbox.currentImageIndex].credit);
				} else  {
					lqx.vars.lyqbox.overlay.find('.credit').html('');
				}

				// display counter (current and total) and nav only if gallery
				if (lqx.vars.lyqbox.album.length > 1)  {
					lqx.vars.lyqbox.overlay.find('.current').text(lqx.vars.lyqbox.currentImageIndex + 1);
					lqx.vars.lyqbox.overlay.find('.total').text(lqx.vars.lyqbox.album.length);
				} else  {
					lqx.vars.lyqbox.overlay.find('.prev,.next').addClass('hide');
					lqx.vars.lyqbox.overlay.find('.counter').addClass('hide');
				}
			} else {
				lqx.vars.lyqbox.overlay.find('.prev,.next').addClass('hide');
				lqx.vars.lyqbox.overlay.find('.counter').addClass('hide');
			}
		};

		var enableKeyboardNav = function() {
			lqx.vars.document.on('keyup.keyboard', jQuery.proxy(keyboardAction, lqx.lyqbox));
		};

		var disableKeyboardNav = function() {
			lqx.vars.document.off('.keyboard');
		};

		var swipeHandler = function(sel, dir) {
			console.log(sel, dir);
			if(dir == 'lt') keyboardAction({keyCode: 39}); // swipe to the left equals right arrow
			if(dir == 'rt') keyboardAction({keyCode: 37}); // swipe to the right equals left arrow
		};

		var keyboardAction = function(event) {
			var KEYCODE_ESC = 27;
			var KEYCODE_LEFTARROW = 37;
			var KEYCODE_RIGHTARROW = 39;

			var keycode = event.keyCode;
			var key = String.fromCharCode(keycode).toLowerCase();
			if (keycode === KEYCODE_ESC || key.match(/x|o|c/)) {
				end();
			} else if (keycode === KEYCODE_LEFTARROW) {
				if (lqx.vars.lyqbox.currentImageIndex === 0) {
					changeContent(lqx.vars.lyqbox.album.length - 1);
				} else {
					changeContent(lqx.vars.lyqbox.currentImageIndex - 1);
				}
			} else if (keycode === KEYCODE_RIGHTARROW) {
				if (lqx.vars.lyqbox.currentImageIndex === lqx.vars.lyqbox.album.length - 1) {
					changeContent(0);
				} else {
					changeContent(lqx.vars.lyqbox.currentImageIndex + 1);
				}
			}
		};

		// This only works in Chrome 9, Firefox 4, Safari 5, Opera 11.50 and in IE 10
		var removeHash = function() {
			var scrollV, scrollH, loc = window.location;
			if ('pushState' in history)
				history.pushState('', document.title, loc.pathname + loc.search);
			else {
				// Prevent scrolling by storing the page's current scroll offset
				scrollV = document.body.scrollTop;
				scrollH = document.body.scrollLeft;

				loc.hash = '';

				// Restore the scroll offset, should be flicker free
				document.body.scrollTop = scrollV;
				document.body.scrollLeft = scrollH;
			}
		};

		// Closing time
		var end = function() {
			disableKeyboardNav();
			lqx.vars.lyqbox.overlay.removeClass('open');
			stopVideo(lqx.vars.lyqbox.album[lqx.vars.lyqbox.currentImageIndex].type);
			removeHash();
		};

		return {
			init: init
		};
	})();
	lqx.lyqbox.init();
}
/**
 * lyquix.analytics.js - Analytics functionality
 *
 * @version     2.0.0
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

if(lqx && typeof lqx.analytics == 'undefined') {
	lqx.analytics = (function(){
		var defaults = {
			settings: {
				downloads: true,
				outbound: true,
				scrollDepth: true,
				photoGallery: true,
				video: true,
				userActive: {
					enabled: true,
					idleTime: 5000,	// idle time (ms) before user is set to inactive
					throttle: 100,	// throttle period (ms)
					refresh: 250,	// refresh period (ms)
					maxTime: 1800000 // max time when tracking stops (ms)
				},
				// Google Analytics settings
				createParams: null,			// example: {default: {trackingId: 'UA-XXXXX-Y', cookieDomain: 'auto', fieldsObject: {}}}, where "default" is the tracker name
				setParams: null,			// example: {default: {dimension1: 'Age', metric1: 25}}
				requireParams: null,		// example: {default: {pluginName: 'displayFeatures', pluginOptions: {cookieName: 'mycookiename'}}}
				provideParams: null,		// example: {default: {pluginName: 'MyPlugin', pluginConstructor: myPluginFunc}}
				customParamsFuncs: null,	// example: {default: myCustomFunc}
				abTestName: null,			// Set a test name to activate A/B Testing Dimension
				abTestNameDimension: null,		// Set the Google Analytics dimension number to use for test name
				abTestGroupDimension: null,		// Set the Google Analytics dimension number to use for group
			},
			vars: {
				scrollDepthMax: null,
				youTubeIframeAPIReady: false,
				youtubePlayers: {},
				vimeoPlayers: {},
				userActive: null
			}
		};

		var init = function(){
			// Initialize only if enabled
			if(lqx.settings.analytics.enabled) {
				// Copy default settings and vars
				jQuery.extend(lqx.settings.analytics, defaults.settings);
				jQuery.extend(lqx.vars.analytics, defaults.vars);

				lqx.vars.window.on('lqxready', function() {
					if(lqx.settings.analytics.createParams && lqx.settings.analytics.createParams.default && lqx.settings.analytics.createParams.default.trackingId) {
						gaCode();
					}
				});
			}

			return lqx.analytics.init = true;
		};

		var gaCode = function() {
			jQuery('<script>' +
				"(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){" +
				"(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o)," +
				"m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)" +
				"})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');" +
				"ga(lqx.analytics.gaReady);" +
				"</script>").appendTo(jQuery('head'));
		};

		// Handles Google Analytics pageview, setting first custom parameters
		var gaReady = function(tracker) {
			// Execute functions to set custom parameters
			jQuery.Deferred().done(
				function(){
					// Create commands
					if(lqx.settings.analytics.createParams && typeof lqx.settings.analytics.createParams == 'object') {
						var params = lqx.settings.analytics.createParams;
						Object.keys(params).forEach(function(tracker){
							if(tracker == 'default') ga('create', params[tracker].trackingId, params[tracker].cookieDomain, params[tracker].fieldsObject);
							else ga('create', params[tracker].trackingId, params[tracker].cookieDomain, tracker, params[tracker].fieldsObject);
						});
					}
				},
				
				function(){
					var params;
					
					// Set commands
					if(lqx.settings.analytics.setParams && typeof lqx.settings.analytics.setParams == 'object') {
						params = lqx.settings.analytics.setParams;
						Object.keys(params).forEach(function(tracker){
							var cmd = 'set';
							if(tracker != 'default') cmd = tracker + '.set';
							Object.keys(params[tracker]).forEach(function(fieldName){
								ga(cmd, fieldName, params[tracker][fieldName]);
							});
						});
					}
					
					// Require commands
					if(lqx.settings.analytics.requireParams && typeof lqx.settings.analytics.requireParams == 'object') {
						params = lqx.settings.analytics.requireParams;
						Object.keys(params).forEach(function(tracker){
							var cmd = 'require';
							if(tracker != 'default') cmd = tracker + '.require';
							params[tracker].forEach(function(elem){
								ga(cmd, elem.pluginName, elem.pluginOptions);
							});
						});
					}
					
					// Provide commands
					if(lqx.settings.analytics.provideParams && typeof lqx.settings.analytics.provideParams == 'object') {
						params = lqx.settings.analytics.provideParams;
						Object.keys(params).forEach(function(tracker){
							var cmd = 'provide';
							if(tracker != 'default') cmd = tracker + '.provide';
							params[tracker].forEach(function(elem){
								ga(cmd, elem.pluginName, elem.pluginConstructor);
							});
						});
					}
					
					// A/B testing settings
					if(lqx.settings.analytics.abTestName !== null && lqx.settings.analytics.abTestNameDimension !== null && lqx.settings.analytics.abTestGroupDimension !== null) {
						// get a/b test group cookie
						var abTestGroup = lqx.utils.cookie('abTestGroup');
						if(abTestGroup === null) {
							// set a/b test group
							if(Math.random() < 0.5) abTestGroup = 'A';
							else abTestGroup = 'B';
							lqx.utils.cookie('abTestGroup', abTestGroup, {maxAge: 30*24*60*60, path: '/'});
						}
						// Set body attribute that can be used by css and js
						lqx.vars.body.attr('data-abtest', abTestGroup);
						
						// Set the GA dimensions
						ga('set', 'dimension' + lqx.settings.analytics.abTestNameDimension, lqx.settings.analytics.abTestName);
						ga('set', 'dimension' + lqx.settings.analytics.abTestGroupDimension, abTestGroup);
					}
				},
				
				function(){
					if(typeof lqx.settings.analytics.customParamsFuncs == 'function') {
						try {
							lqx.settings.analytics.customParamsFuncs();
						}
						catch(e) {
							lqx.error(e);
						}
					}
				},
				
				function(){
					// Send pageview
					ga('send', 'pageview');
					
					// Initialize tracking
					initTracking();
				}
			).resolve();
		};

		// initialize google analytics tracking
		var initTracking = function() {
			// track downloads and outbound links
			if(lqx.settings.analytics.outbound || lqx.settings.analytics.download){
				// find all a tags and cycle through them
				jQuery('a').each(function(){
					var elem = this;
					// check if it has an href attribute, otherwise it is just a page anchor
					if(elem.href) {

						// check if it is an outbound link, track as event
						if(lqx.settings.analytics.outbound && elem.host != location.host) {

							jQuery(elem).click(function(e){
								e.preventDefault();
								var url = elem.href;
								var label = url;
								if(jQuery(elem).attr('title')) {
									label = jQuery(elem).attr('title') + ' [' + url + ']';
								}
								ga('send', {
									'hitType': 'event',
									'eventCategory': 'Outbound Links',
									'eventAction': 'click',
									'eventLabel': label,
									'nonInteraction': true,
									'hitCallback': function(){ window.location.href = url; } // regarless of target value link will open in same window, otherwise it is blocked by browser
								});
							});
						}

						// check if it is a download link (not a webpage) and track as pageview
						else if(lqx.settings.analytics.downloads && elem.pathname.match(/\.(htm|html|php)$/i)[1] === null ) {
							jQuery(elem).click(function(e){
								e.preventDefault();
								var url = elem.href;
								var loc = elem.protocol + '//' + elem.hostname + elem.pathname + elem.search;
								var page = elem.pathname + elem.search;
								var title = 'Download: ' + page;
								if(jQuery(elem).attr('title')) {
									title = jQuery(elem).attr('title');
								}
								ga('send', {
									'hitType': 'pageview',
									'location': loc,
									'page': page,
									'title': title,
									'hitCallback': function(){ window.location.href = url; } // regarless of target value link will open in same window, otherwise it is blocked by browser
								});
							});
						}
					}
				});

			}


			// track scroll depth
			if(lqx.settings.analytics.scrolldepth){

				// get the initial scroll position
				lqx.vars.analytics.scrollDepthMax = Math.ceil(((lqx.vars.window.scrollTop() + lqx.vars.window.height()) / lqx.vars.document.height()) * 10) * 10;

				// add listener to scrollthrottle event
				lqx.vars.window.on('scrollthrottle', function(){
					// capture the hightest scroll point, stop calculating once reached 100
					if(lqx.vars.analytics.scrollDepthMax < 100) {
						lqx.vars.analytics.scrollDepthMax = Math.max(lqx.vars.analytics.scrollDepthMax, Math.ceil(((lqx.vars.window.scrollTop() + lqx.vars.window.height()) / lqx.vars.document.height()) * 10) * 10);
						if(lqx.vars.analytics.scrollDepthMax > 100) lqx.vars.analytics.scrollDepthMax = 100;
					}
				});

				// add listener to page unload
				lqx.vars.window.on('unload', function(){

					ga('send', {
						'hitType' : 'event',
						'eventCategory' : 'Scroll Depth',
						'eventAction' : lqx.vars.analytics.scrollDepthMax,
						'nonInteraction' : true
					});

				});

			}

			// track photo galleries
			if(lqx.settings.analytics.photogallery){
				lqx.vars.html.on('click', 'a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox]', function(){
					// send event for gallery opened
					ga('send', {
						'hitType': 'event',
						'eventCategory' : 'Photo Gallery',
						'eventAction' : 'Open'
					});

				});

				lqx.vars.html.on('load', 'img.lb-image', function(){
					// send event for image displayed
					ga('send', {
						'hitType': 'event',
						'eventCategory' : 'Photo Gallery',
						'eventAction' : 'Display',
						'eventLabel' : jQuery(this).attr('src')
					});

				});

			}

			// track video
			if(lqx.settings.analytics.video){

				// load youtube iframe api
				var tag = document.createElement('script');
				tag.src = 'https://www.youtube.com/iframe_api';
				tag.onload = function(){lqx.vars.analytics.youTubeIframeAPIReady = true;};
				var firstScriptTag = document.getElementsByTagName('script')[0];
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

				// set listeners for vimeo videos
				if (window.addEventListener) {
					window.addEventListener('message', vimeoReceiveMessage, false);
				}
				else {
					window.attachEvent('onmessage', vimeoReceiveMessage, false);
				}

				// detect if there are any youtube or vimeo videos, activate js api and add id
				jQuery('iframe').each(function(){

					var elem = jQuery(this);
					// init js api for video player
					initVideoPlayerAPI(elem);

				});

			}

			// track active time
			if(lqx.settings.analytics.activetime) {
				// Add listener on page unload
				lqx.vars.window.on('unload', function(){

					ga('send', {
						'hitType' : 'event',
						'eventCategory' : 'User Active Time',
						'eventAction' : 'Percentage',
						'eventValue' : parseInt(100 * lqx.vars.analytics.userActive.activeTime / (lqx.vars.analytics.userActive.activeTime + lqx.vars.analytics.userActive.inactiveTime)),
						'nonInteraction' : true
					});

					ga('send', {
						'hitType' : 'event',
						'eventCategory' : 'User Active Time',
						'eventAction' : 'Active Time (ms)',
						'eventValue' : parseInt(lqx.vars.analytics.userActive.activeTime),
						'nonInteraction' : true
					});

					ga('send', {
						'hitType' : 'event',
						'eventCategory' : 'User Active Time',
						'eventAction' : 'Inactive Time (ms)',
						'eventValue' : parseInt(lqx.vars.analytics.userActive.inactiveTime),
						'nonInteraction' : true
					});

				});
			}

		};

		// handle video players added dynamically
		var videoPlayerMutationHandler = function(mutRec) {

			jQuery(mutRec.addedNodes).each(function(){

				var elem = jQuery(this);
				if (typeof elem.prop('tagName') !== 'undefined'){
					var tag = elem.prop('tagName').toLowerCase();
					if (tag == 'iframe') {
						// init js api for video player
						initVideoPlayerAPI(elem);
					}	    
				}
			});

		};

		// initialize the js api for youtube and vimeo players
		var initVideoPlayerAPI = function(elem) {

			var src = elem.attr('src');
			var playerId = elem.attr('id');
			var urlconn;

			if(typeof src != 'undefined') {
				// check youtube players
				if (src.indexOf('youtube.com/embed/') != -1) {
					// add id if it doesn't have one
					if (typeof playerId == 'undefined') {
						playerId = 'youtubePlayer' + (Object.keys(lqx.vars.analytics.youtubePlayers).length);
						elem.attr('id', playerId);
					}

					// reload with API support enabled
					if (src.indexOf('enablejsapi=1') == -1) {
						urlconn = '&';
						if (src.indexOf('?') == -1) {
							urlconn = '?';
						}
						elem.attr('src', src + urlconn + 'enablejsapi=1&version=3');
					}

					// add to list of players
					if(typeof lqx.vars.analytics.youtubePlayers[playerId] == 'undefined') {
						lqx.vars.analytics.youtubePlayers[playerId] = {};

						// add event callbacks to player
						onYouTubeIframeAPIReady();
					}
				}

				// check vimeo players
				if(src.indexOf('player.vimeo.com/video/') != -1) {
					// add id if it doesn't have one
					if (typeof playerId == 'undefined') {
						playerId = 'vimeoPlayer' + (Object.keys(lqx.vars.analytics.vimeoPlayers).length);
						elem.attr('id', playerId);
					}

					// reload with API support enabled
					if (src.indexOf('api=1') == -1) {
						urlconn = '&';
						if (src.indexOf('?') == -1) {
							urlconn = '?';
						}
						elem.attr('src', src + urlconn + 'api=1&player_id=' + playerId);
					}

					// add to list of players
					if(typeof lqx.vars.analytics.vimeoPlayers[playerId] == 'undefined') {
						lqx.vars.analytics.vimeoPlayers[playerId] = {};
					}

				}
			}
		};

		var youtubePlayerReady = function(e, playerId){
			// check if iframe still exists
			if(jQuery('#' + playerId).length) {
				if(typeof lqx.vars.analytics.youtubePlayers[playerId].playerObj.getPlayerState != 'function') {
					//setTimeout(function(){lqx.youtubePlayerReady(e, playerId)}, 100);
				}
				else {
					if(typeof lqx.vars.analytics.youtubePlayers[playerId].progress == 'undefined') {
						// set player object variables
						lqx.vars.analytics.youtubePlayers[playerId].progress = 0;
						lqx.vars.analytics.youtubePlayers[playerId].start = false;
						lqx.vars.analytics.youtubePlayers[playerId].complete = false;

						// get video data
						var videoData = lqx.vars.analytics.youtubePlayers[playerId].playerObj.getVideoData();
						lqx.vars.analytics.youtubePlayers[playerId].title = videoData.title;
						lqx.vars.analytics.youtubePlayers[playerId].duration = lqx.vars.analytics.youtubePlayers[playerId].playerObj.getDuration();

						if(!lqx.vars.analytics.youtubePlayers[playerId].start) youtubePlayerStateChange(e, playerId);
					}
				}
			}
			else {
				// iframe no longer exists, remove it from array
				delete lqx.vars.analytics.youtubePlayers[playerId];
			}
		};

		var youtubePlayerStateChange = function(e, playerId){
			// check if iframe still exists
			if(jQuery('#' + playerId).length) {
				// player events:
				// -1 (unstarted, player ready)
				// 0 (ended)
				// 1 (playing)
				// 2 (paused)
				// 3 (buffering)
				// 5 (video cued / video ready)
				var label;

				// video ended, make sure we track the complete event just once
				if(lqx.vars.analytics.youtubePlayers[playerId].playerObj.getPlayerState() === 0 && !lqx.vars.analytics.youtubePlayers[playerId].complete) {
					label = 'Complete';
					lqx.vars.analytics.youtubePlayers[playerId].complete = true;
				}

				// video playing
				if(lqx.vars.analytics.youtubePlayers[playerId].playerObj.getPlayerState() == 1) {

					// recursively call this function in 1s to keep track of video progress
					lqx.vars.analytics.youtubePlayers[playerId].timer = setTimeout(function(){youtubePlayerStateChange(e, playerId);}, 1000);

					// if this is the first time we get the playing status, track it as start
					if(!lqx.vars.analytics.youtubePlayers[playerId].start){
						label = 'Start';
						lqx.vars.analytics.youtubePlayers[playerId].start = true;
					}

					else {

						var currentTime = lqx.vars.analytics.youtubePlayers[playerId].playerObj.getCurrentTime();

						if(Math.ceil( Math.ceil( (currentTime / lqx.vars.analytics.youtubePlayers[playerId].duration) * 100 ) / 10 ) - 1 > lqx.vars.analytics.youtubePlayers[playerId].progress){

							lqx.vars.analytics.youtubePlayers[playerId].progress = Math.ceil( Math.ceil( (currentTime / lqx.vars.analytics.youtubePlayers[playerId].duration) * 100 ) / 10 ) - 1;

							if(lqx.vars.analytics.youtubePlayers[playerId].progress != 10){
								label = (lqx.vars.analytics.youtubePlayers[playerId].progress * 10) + '%';
							}

							else {
								clearTimeout(lqx.vars.analytics.youtubePlayers[playerId].timer);
							}
						}
					}
				}

				// video buffering
				if(lqx.vars.analytics.youtubePlayers[playerId].playerObj.getPlayerState() == 3) {
					// recursively call this function in 1s to keep track of video progress
					lqx.vars.analytics.youtubePlayers[playerId].timer = setTimeout(function(){youtubePlayerStateChange(e, playerId);}, 1000);
				}

				// send event to GA if label was set
				if(label){
					videoTrackingEvent(playerId, label, lqx.vars.analytics.youtubePlayers[playerId].title, lqx.vars.analytics.youtubePlayers[playerId].progress * 10);
				}
			}
			else {
				// iframe no longer exists, remove it from array
				delete lqx.vars.analytics.youtubePlayers[playerId];
			}

		};

		var vimeoReceiveMessage = function(e){

			// check message is coming from vimeo
			if((/^https?:\/\/player.vimeo.com/).test(e.origin)) {
				// parse the data
				var data = JSON.parse(e.data);
				player = lqx.vars.analytics.vimeoPlayers[data.player_id];
				var label;

				switch (data.event) {

					case 'ready':
						// set player object variables
						player.progress = 0;
						player.start = false;
						player.complete = false;

						// set the listeners
						vimeoSendMessage(data.player_id, e.origin, 'addEventListener', 'play');
						vimeoSendMessage(data.player_id, e.origin, 'addEventListener', 'finish');
						vimeoSendMessage(data.player_id, e.origin, 'addEventListener', 'playProgress');

						break;

					case 'play':
						// if this is the first time we get the playing status, track it as start
						if(!player.start){
							label = 'Start';
							player.start = true;
						}

						break;

					case 'playProgress':

						if(Math.ceil( Math.ceil( (data.data.percent) * 100 ) / 10 ) - 1 > player.progress) {

							player.progress = Math.ceil( Math.ceil( (data.data.percent) * 100 ) / 10 ) - 1;

							if(player.progress != 10){
								label = (player.progress * 10) + '%';
							}

						}

						break;

					case 'finish':
						// make sure we capture finish event just once
						if(!player.complete) {
							label = 'Complete';
							player.complete = true;
						}

				}

				if(label){
					videoTrackingEvent(data.player_id, label, 'No title', player.progress * 10); // vimeo doesn't provide a mechanism for getting the video title
				}

			}



		};

		var vimeoSendMessage = function(playerId, origin, action, value){

			var data = {
				method: action
			};

			if (value) {
				data.value = value;
			}

			document.getElementById(playerId).contentWindow.postMessage(JSON.stringify(data), origin);

		};

		var videoTrackingEvent = function(playerId, label, title, value) {
			ga('send', {
				'hitType': 'event',
				'eventCategory' : 'Video',
				'eventAction' : label,
				'eventLabel' : title + ' (' + jQuery('#' + playerId).attr('src').split('?')[0] + ')',
				'eventValue': value
			});

		};

		// trigger events for user active/inactive and count active time
		var initUserActive = function()	{

			// initialize the variables
			lqx.vars.analytics.userActive = {
				active: true,		// is user currently active
				timer: false,		// setTimeout timer
				throttle: false,	// is throttling currently active
				lastChangeTime: (new Date()).getTime(),
				activeTime: 0,
				inactiveTime: 0,
			};

			// add listener to common user action events
			lqx.vars.window.on('orientationchange resize focusin', function(){userActive();});
			lqx.vars.document.on('mousedown mousemove mouseup wheel keydown keypress keyup touchstart touchmove touchend', function(){userActive();});

			// add listener for window on focus out, become inactive immediately
			lqx.vars.window.on('focusout', function(){userInactive();});

			// refresh active and inactive time counters
			var timer = setInterval(function(){
				// Stop updating if maxTime is reached
				if(lqx.vars.analytics.userActive.activeTime + lqx.vars.analytics.userActive.inactiveTime >= lqx.vars.analytics.userActive.maxTime) clearInterval(timer);
				// Update counters
				else {
					if(lqx.vars.analytics.userActive.active) {
						// update active time
						lqx.vars.analytics.userActive.activeTime += (new Date()).getTime() - lqx.vars.analytics.userActive.lastChangeTime;
					}
					else {
						// update inactive time
						lqx.vars.analytics.userActive.inactiveTime += (new Date()).getTime() - lqx.vars.analytics.userActive.lastChangeTime;
					}
					// update last change time
					lqx.vars.analytics.userActive.lastChangeTime = (new Date()).getTime();
				}
			}, lqx.settings.userActive.refresh);

			// initialize active state
			lqx.userActive();

		};

		// function called to indicate user is currently active (heartbeat)
		var userActive = function() {
			// if no throttle
			if(!lqx.vars.analytics.userActive.throttle) {
				lqx.vars.analytics.userActive.throttle = true;
				setTimeout(function(){lqx.vars.analytics.userActive.throttle = false;}, lqx.settings.userActive.throttle);
				// when changing from being inactive
				if(!lqx.vars.analytics.userActive.active) {
					// set state to active
					lqx.vars.analytics.userActive.active = true;
					// update inactive time
					lqx.vars.analytics.userActive.inactiveTime += (new Date()).getTime() - lqx.vars.analytics.userActive.lastChangeTime;
					// update last change time
					lqx.vars.analytics.userActive.lastChangeTime = (new Date()).getTime();
				}

				// set state to active
				lqx.vars.analytics.userActive.active = true;

				// after idle time turn inactive
				clearTimeout(lqx.vars.analytics.userActive.timer);
				lqx.vars.analytics.userActive.timer = setTimeout(function(){userInactive();}, lqx.settings.userActive.idleTime);
			}
		};

		// function called to indicate the user is currently inactive
		var userInactive = function() {
			// set state to inactive
			lqx.vars.analytics.userActive.active = false;
			// clear timer
			clearTimeout(lqx.vars.analytics.userActive.timer);
			// add active time
			lqx.vars.analytics.userActive.activeTime += (new Date()).getTime() - lqx.vars.analytics.userActive.lastChangeTime;
			// update last change time
			lqx.vars.analytics.userActive.lastChangeTime = (new Date()).getTime();
		};

		return {
			init: init,
			gaReady: gaReady
		};
	})();
	lqx.analytics.init();
}

window.onYouTubeIframeAPIReady = function(){
	if(lqx.vars.analytics.youTubeIframeAPIReady && (typeof YT !== 'undefined') && YT && YT.Player) {
		Object.keys(lqx.vars.analytics.youtubePlayers).forEach(function(playerId) {
			if(typeof lqx.vars.analytics.youtubePlayers[playerId].playerObj == 'undefined') {
				lqx.vars.analytics.youtubePlayers[playerId].playerObj = new YT.Player(playerId, {
					events: {
						'onReady': function(e){lqx.youtubePlayerReady(e, playerId);},
						'onStateChange': function(e){lqx.youtubePlayerStateChange(e, playerId);}
					}
				});
			}
		});
	}
	else {
		// keep track how many time we have attempted, retry unless it has been more than 30secs
		lqx.vars.analytics.youTubeIframeAPIReadyAttempts++;
		if(lqx.vars.analytics.youTubeIframeAPIReadyAttempts < 120) setTimeout(function(){onYouTubeIframeAPIReady();},250);
	}
};
