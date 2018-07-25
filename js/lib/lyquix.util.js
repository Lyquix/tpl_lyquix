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
