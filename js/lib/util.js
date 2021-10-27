/**
 * util.js - Utility functions
 *
 * @version     2.3.2
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

/* jshint browser: true, devel: true, jquery: true, strict: true */
/* globals lqx, ga, MobileDetect, YT, google */

if(lqx && !('util' in lqx)) {
	lqx.util = (function(){
		'use strict';
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

		// Simple hash function
		var hash = function(str) {
			for(var i = 0, h = 4641154056; i < str.length; i++) h = Math.imul(h + str.charCodeAt(i) | 0, 2654435761);
			h = (h ^ h >>> 17) >>> 0;
			return h.toString(36);
		};

		// Super simple XOR encrypt function
		// Not secure!
		// Based on https://gist.github.com/sukima/5613286
		var encrypt = function(key, plaintext) {
			var cyphertext = [];
			// Convert to hex to properly handle UTF8
			plaintext = Array.from(plaintext).map(function(c) {
				if(c.charCodeAt(0) < 128) return c.charCodeAt(0).toString(16).padStart(2, '0');
				else return encodeURIComponent(c).replace(/\%/g,'').toLowerCase();
			}).join('');
			// Convert each hex to decimal
			plaintext = plaintext.match(/.{1,2}/g).map(function(x) {parseInt(x, 16);});
			// Perform xor operation
			for (var i = 0; i < plaintext.length; i++) {
				cyphertext.push(plaintext[i] ^ key.charCodeAt(Math.floor(i % key.length)));
			}
			// Convert to hex
			cyphertext = cyphertext.map(function(x) {
				return x.toString(16).padStart(2, '0');
			});
			return cyphertext.join('');
		};

		// Super simple XOR decrypt function
		// Not secure!
		// Based on https://gist.github.com/sukima/5613286
		var decrypt = function(key, cyphertext) {
			try {
				cyphertext = cyphertext.match(/.{1,2}/g).map(function(x) {parseInt(x, 16);});
				var plaintext = [];
				for (var i = 0; i < cyphertext.length; i++) {
					plaintext.push((cyphertext[i] ^ key.charCodeAt(Math.floor(i % key.length))).toString(16).padStart(2, '0'));
				}
				return decodeURIComponent('%' + plaintext.join('').match(/.{1,2}/g).join('%'));
			}
			catch(e) {
				return false;
			}
		};

		// Generates an encryption key fromm a password
		// Not secure!
		var passwordDerivedKey = function(password, salt, iterations, len) {
			if(!password) password = randomStr();
			if(!salt) salt = '80ymb4oZ';
			if(!iterations) iterations = 16;
			if(!len) len = 256;
			len = Math.ceil(len / 8);
			var key = '';

			while(key.length < len) {
				var i = 0;
				var intSalt = salt;
				var intKey = '';
				while(i < iterations) {
					intKey = hash(password + intSalt);
					var newSalt = '';
					for(var j = 0; j < intSalt.length; j++) {
						newSalt += (intSalt.charCodeAt(j) ^ intKey.charCodeAt(Math.floor(j % intKey.length))).toString(36);
					}
					intSalt = newSalt;
					i++;
				}
				key = intKey + key;
			}
			return key.substring(0, len);
		};

		// Generates a random string of the specificed length
		var randomStr = function(len) {
			var str = parseInt(Math.random()*10e16).toString(36);
			if(typeof len == 'undefined') return str;
			else {
				while(str.length < len) str += parseInt(Math.random()*10e16).toString(36);
				return str.substring(0, len);
			}
		};

		// Creates a pseudo-unique string using current time and random number
		var uniqueStr = function() {
			var d = new Date();
			var dd = new Date(d.getFullYear() - 3,0,1);
			return ((d.getTime() - dd.getTime()) * 1000 + d.getMilliseconds()).toString(36) + randomStr(3);
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

		// Porting of sprintf function
		// Returns a formatted string using provided format and data
		// From https://github.com/kvz/locutus/blob/master/src/php/strings/sprintf.js
		// Docs http://php.net/manual/en/function.sprintf.php
		var sprintf = function() {
			var regex = /%%|%(?:(\d+)\$)?((?:[-+#0 ]|'[\s\S])*)(\d+)?(?:\.(\d*))?([\s\S])/g;
			var args = arguments;
			var i = 0;
			var format = args[i++];

			var _pad = function (str, len, chr, leftJustify) {
				if (!chr) {
					chr = ' ';
				}
				var padding = (str.length >= len) ? '' : new Array(1 + len - str.length >>> 0).join(chr);
				return leftJustify ? str + padding : padding + str;
			};

			var justify = function (value, prefix, leftJustify, minWidth, padChar) {
				var diff = minWidth - value.length;
				if (diff > 0) {
					// when padding with zeros
					// on the left side
					// keep sign (+ or -) in front
					if (!leftJustify && padChar === '0') {
						value = [
							value.slice(0, prefix.length),
							_pad('', diff, '0', true),
							value.slice(prefix.length)
						].join('');
					}
					else {
						value = _pad(value, minWidth, padChar, leftJustify);
					}
				}
				return value;
			};

			var _formatBaseX = function (value, base, leftJustify, minWidth, precision, padChar) {
				// Note: casts negative numbers to positive ones
				var number = value >>> 0;
				value = _pad(number.toString(base), precision || 0, '0', false);
				return justify(value, '', leftJustify, minWidth, padChar);
			};

			// _formatString()
			var _formatString = function (value, leftJustify, minWidth, precision, customPadChar) {
				if (precision !== null && precision !== undefined) {
					value = value.slice(0, precision);
				}
				return justify(value, '', leftJustify, minWidth, customPadChar);
			};

			// doFormat()
			var doFormat = function (substring, argIndex, modifiers, minWidth, precision, specifier) {
				var number, prefix, method, textTransform, value;

				if (substring === '%%') {
					return '%';
				}

				// parse modifiers
				var padChar = ' '; // pad with spaces by default
				var leftJustify = false;
				var positiveNumberPrefix = '';
				var j, l;

				for (j = 0, l = modifiers.length; j < l; j++) {
					switch (modifiers.charAt(j)) {
						case ' ':
						case '0':
							padChar = modifiers.charAt(j);
							break;
						case '+':
							positiveNumberPrefix = '+';
							break;
						case '-':
							leftJustify = true;
							break;
						case "'":
							if (j + 1 < l) {
								padChar = modifiers.charAt(j + 1);
								j++;
							}
							break;
					}
				}

				if (!minWidth) {
					minWidth = 0;
				}
				else {
					minWidth = +minWidth;
				}

				if (!isFinite(minWidth)) {
					throw new Error('Width must be finite');
				}

				if (!precision) {
					precision = (specifier === 'd') ? 0 : 'fFeE'.indexOf(specifier) > -1 ? 6 : undefined;
				}
				else {
					precision = +precision;
				}

				if (argIndex && +argIndex === 0) {
					throw new Error('Argument number must be greater than zero');
				}

				if (argIndex && +argIndex >= args.length) {
					throw new Error('Too few arguments');
				}

				value = argIndex ? args[+argIndex] : args[i++];

				switch (specifier) {
					case '%':
						return '%';
					case 's':
						return _formatString(value + '', leftJustify, minWidth, precision, padChar);
					case 'c':
						return _formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, padChar);
					case 'b':
						return _formatBaseX(value, 2, leftJustify, minWidth, precision, padChar);
					case 'o':
						return _formatBaseX(value, 8, leftJustify, minWidth, precision, padChar);
					case 'x':
						return _formatBaseX(value, 16, leftJustify, minWidth, precision, padChar);
					case 'X':
						return _formatBaseX(value, 16, leftJustify, minWidth, precision, padChar).toUpperCase();
					case 'u':
						return _formatBaseX(value, 10, leftJustify, minWidth, precision, padChar);
					case 'i':
					case 'd':
						number = +value || 0;
						// Plain Math.round doesn't just truncate
						number = Math.round(number - number % 1);
						prefix = number < 0 ? '-' : positiveNumberPrefix;
						value = prefix + _pad(String(Math.abs(number)), precision, '0', false);

						if (leftJustify && padChar === '0') {
							// can't right-pad 0s on integers
							padChar = ' ';
						}
						return justify(value, prefix, leftJustify, minWidth, padChar);
					case 'e':
					case 'E':
					case 'f': // @todo: Should handle locales (as per setlocale)
					case 'F':
					case 'g':
					case 'G':
						number = +value;
						prefix = number < 0 ? '-' : positiveNumberPrefix;
						method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(specifier.toLowerCase())];
						textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(specifier) % 2];
						value = prefix + Math.abs(number)[method](precision);
						return justify(value, prefix, leftJustify, minWidth, padChar)[textTransform]();
					default:
						// unknown specifier, consume that char and return empty
						return '';
				}
			};

			try {
				return format.replace(regex, doFormat);
			}
			catch (err) {
				return false;
			}
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
			encrypt: encrypt,
			decrypt: decrypt,
			hash: hash,
			passwordDerivedKey: passwordDerivedKey,
			randomStr: randomStr,
			uniqueStr: uniqueStr,
			uniqueUrl: uniqueUrl,
			swipe: swipe,
			sprintf: sprintf,
			versionCompare: versionCompare
		};
	})();
	lqx.util.init();
}
