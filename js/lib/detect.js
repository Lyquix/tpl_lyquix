/**
 * detect.js - Detection of device, browser and O/S
 *
 * @version     2.4.0
 * @package     wp_theme_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/wp_theme_lyquix
 */

if(lqx && !('detect' in lqx)) {
	lqx.detect = (function(){
		var opts = {
			// Control what specific detections to enable
			mobile: true,
			browser: true,
			os: true,
			urlParts: true,
			urlParams: true,
			features: true
		};

		var vars = {
			mobile: null,
			browser: null,
			os: null,
			urlParts: {},
			urlParams: {},
			features: {
				passiveEventListeners: false
			}
		};

		var init = function(){
			// Copy default opts and vars
			jQuery.extend(true, lqx.opts.detect, opts);
			opts = lqx.opts.detect;
			jQuery.extend(true, lqx.vars.detect, vars);
			vars = lqx.vars.detect;

			// Initialize on lqxready
			lqx.vars.window.on('lqxready', function() {
				// Initialize only if enabled
				if(opts.enabled) {
					lqx.log('Initializing `detect`');

					if(opts.mobile) detectMobile();
					if(opts.browser) detectBrowser();
					if(opts.os) detectOS();
					if(opts.urlParts) detectUrlParts();
					if(opts.urlParams) detectUrlParams();
					if(opts.features) detectFeatures();
				}
			});

			// Run only once
			lqx.detect.init = function(){
				lqx.warn('lqx.detect.init already executed');
			};

			return true;
		};

		// Get functions
		var mobile = function() {
			return vars.mobile;
		};
		var browser = function() {
			return vars.browser;
		};
		var os = function() {
			return vars.os;
		};
		var urlParts = function() {
			return vars.urlParts;
		};
		var urlParams = function() {
			return vars.urlParams;
		};
		var features = function() {
			return vars.features;
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
				vars.mobile = r;
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
			var ua = window.navigator.userAgent, browser;

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
			vars.browser = browser;
			return true;
		};

		// Detects the O/S name, type and version, and sets body classes
		// Detects major desktop and mobile O/S: Windows, Windows Phone, Mac, iOS, Android, Ubuntu, Fedora, ChromeOS
		// Based on bowser: https://github.com/ded/bowser
		// List of user agent strings: http://www.webapps-online.com/online-tools/user-agent-strings/dv
		var detectOS = function() {
			var ua = window.navigator.userAgent, os;

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
			vars.os = os;
			return true;
		};

		// Detects URL domain, path and hash and sets them as attributes to the body tag
		var detectUrlParts = function() {
			lqx.vars.body.attr('domain', window.location.hostname);
			vars.urlParts.domain = window.location.hostname;

			lqx.vars.body.attr('path', window.location.pathname);
			vars.urlParts.path = window.location.pathname;

			lqx.vars.body.attr('hash', window.location.hash.substring(1));
			vars.urlParts.hash = window.location.hash.substring(1);

			lqx.vars.window.on('hashchange',function(){
				lqx.vars.body.attr('hash', window.location.hash.substring(1));
				vars.urlParts.hash = window.location.hash.substring(1);
			});

			lqx.log('Detect URL parts', vars.urlParts);
		};

		// Parses URL parameters
		var detectUrlParams = function() {
			var params = window.location.search.substr(1);
			if(params != '') {
				params = params.split('&');
				if(params.length) {
					params.forEach(function(param){
						param = param.split('=', 2);
						if(param.length == 2) vars.urlParams[param[0]] = decodeURIComponent(param[1].replace(/\+/g, ' '));
						else vars.urlParams[param[0]] = null;
					});
				}
			}

			lqx.log('Detect URL params', vars.urlParams);
		};

		// Detects various browser features
		var detectFeatures = function() {
			// Passive event listeners
			vars.features.passiveEventListeners = false;
			try {
			  var opts = Object.defineProperty({}, 'passive', {
				get: function() {
					vars.features.passiveEventListeners = true;
				}
			  });
			  window.addEventListener('test', null, opts);
			}
			catch(e) {}
		};

		return {
			init: init,
			mobile: mobile,
			os: os,
			browser: browser,
			urlParts: urlParts,
			urlParams: urlParams,
			features: features
		};
	})();
	lqx.detect.init();
}
