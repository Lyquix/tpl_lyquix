/**
 * util.js - Utility functions
 *
 * @version     2.4.0
 * @package     wp_theme_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/wp_theme_lyquix
 */

if(lqx && !('util' in lqx)) {
	lqx.util = (function(){
		var opts = {};

		var vars = {};

		var init = function(){
			// Copy default opts
			jQuery.extend(true, lqx.opts.util, opts);
			opts = lqx.opts.util;
			jQuery.extend(true, lqx.vars.util, vars);
			vars = lqx.vars.util;

			// Initialize on lqxready
			lqx.vars.window.on('lqxready', function() {
				// Initialize only if enabled
				if(opts.enabled) {
					lqx.log('Initializing `util`');
				}
			});

			// Run only once
			lqx.util.init = function(){
				lqx.warn('lqx.util.init already executed');
			};

			return true;
		};

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
		var cookie = function(name, value, attributes) {
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
		};

		// A simple hashing function based on FNV-1a (Fowler-Noll-Vo) algorithm
		var hash = function(str) {
			const FNV_PRIME = 0x01000193;
			let hashLow = 0x811c9dc5;
			let hashHigh = 0;

			for (let i = 0; i < str.length; i++) {
				hashLow ^= str.charCodeAt(i);
				hashLow *= FNV_PRIME;
				hashHigh ^= hashLow;
				hashHigh *= FNV_PRIME;
			}

			return (hashHigh >>> 0).toString(36) + (hashLow >>> 0).toString(36);
		};

		// Generates a random string of the specificed length
		var randomStr = function(len) {
			var str = parseInt((Math.random() * 10e16).toString()).toString(36);
			if (typeof len == 'number') {
				while (str.length < len) str += parseInt((Math.random() * 10e16).toString()).toString(36);
				return str.substring(0, len);
			}
			return str;
		};

		// Creates a string using current time - milliseconds
		let timeStr = () => {
			return (new Date()).getTime().toString(36);
		};

		// Creates a pseudo-unique string using current time and random number
		var uniqueStr = function(len) {
			return timeStr() + randomStr(len);
		};

		// add unique value to the query string of form's action URL, to avoid caching problem
		var uniqueUrl = function(sel, attrib) {
			var elems = jQuery(sel);
			if(elems.length) {
				lqx.log('Setting unique URLs in ' + attrib + ' for ' + sel + ' ' + elems.length + ' elements');
				elems.each(function(){
					var url = jQuery(this).attr(attrib);
					if(typeof url != 'undefined') {
						jQuery(this).attr(attrib, url + (url.indexOf('?') !== -1 ? '&' : '?') + uniqueStr());
					}
				});
			}
		};

		// Enable swipe detection
		// sel - element selector
		// func - name of callback function, will receive selector and direction (up, dn, lt, rt)
		var swipe = function(sel, callback, options) {
			lqx.log('Setting up swipe detection for ' + sel);

			var swp = {};

			var opts = {
				minX: 30,
				minY: 30,
				maxT: 1500,
				disableScroll: false,
				detectV: true,
				detectH: true
			};

			if(typeof options == 'object') {
				jQuery.extend(true, opts, options);
			}

			lqx.vars.body.on('touchstart', sel, function(e) {
				var t = e.originalEvent.touches[0];
				var startTime = new Date();
				swp = {
					sel: sel,
					startX: t.clientX,
					startY: t.clientY,
					startTime: startTime.getTime() + startTime.getMilliseconds() / 1000,
					endX: 0,
					endY: 0,
					endTime: 0,
					dir: [],
					elem: e.currentTarget
				};
			});
			jQuery(sel).each(function(){
				this.addEventListener('touchmove', function(e) {
					if(opts.disableScroll) e.preventDefault();
					var t = e.touches[0];
					swp.endX = t.clientX;
					swp.endY = t.clientY;
					var endTime = new Date();
					swp.endTime = endTime.getTime() + endTime.getMilliseconds()/1000;
				}, opts.disableScroll && lqx.detect.features().passiveEventListeners ? {passive: false} : '');
			});
			lqx.vars.body.on('touchend', sel, function(e) {
				// Only handle swipes that are no longer than opts.maxT
				if(swp.endTime > 0 && swp.endTime - swp.startTime <= opts.maxT) {
					// Horizontal swipe
					if(opts.detectH && Math.abs(swp.endX - swp.startX) > opts.minX && swp.endX > 0) {
						if (swp.endX > swp.startX) swp.dir.push('r'); // right
						else swp.dir.push('l'); // left
					}
					// Vertical swipe
					if(opts.detectV && Math.abs(swp.endY - swp.startY) > opts.minY && swp.endY > 0) {
						if (swp.endY > swp.startY) swp.dir.push('d'); // down
						else swp.dir.push('u'); // up
					}
					swp.dir = swp.dir.join();
					// Swipe detected?
					if (swp.dir != '') {
						lqx.log('Detected swipe ' + swp.dir + ' for ' + sel);
						if(typeof callback == 'function') callback(swp);
						else lqx.warn(callback + ' is not a function');
					}
				}
			});
		};

		// Compares version strings
		// Returns:
		// 0: equal
		// 1: a > b
		// -1: a < b
		var versionCompare = function(a, b) {
			// If they are equal
			if(a === b) return 0;

			// Split into arrays and get the length of the shortest
			a = String(a).split(".");
			b = String(b).split(".");
			var len = Math.min(a.length, b.length);

			// Loop while the components are equal
			for(var i = 0; i < len; i++) {
				// A bigger than B
				if(parseInt(a[i]) > parseInt(b[i])) return 1;
				// B bigger than A
				if (parseInt(a[i]) < parseInt(b[i])) return -1;
			}

			// If they are still the same, the longer one is greater.
			if(a.length > b.length) return 1;
			if (a.length < b.length) return -1;

			// Otherwise they are the same.
			return 0;
		};

		return {
			init: init,
			cookie: cookie,
			hash: hash,
			randomStr: randomStr,
			uniqueStr: uniqueStr,
			uniqueUrl: uniqueUrl,
			swipe: swipe,
			versionCompare: versionCompare
		};
	})();
	lqx.util.init();
}
