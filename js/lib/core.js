/**
 * core.js - Lyquix JavaScript library
 *
 * @version     2.2.2
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

/* jshint browser: true, devel: true, esversion: 6, jquery: true, strict: true */
/* globals ga, MobileDetect, YT */

"use strict";

if(typeof lqx !== 'undefined') {
	window.console.error('`lqx` already exist!');
}
else if(typeof jQuery == 'undefined') {
	window.console.error('`jQuery` has not been loaded!');
}
else {
	var lqx = (function(){
		// Default opts
		var opts = {
			debug: false,
			siteURL: window.location.protocol + '//' + window.location.hostname,
			tmplURL: (function(){
				let a = document.createElement("a");
				a.href = jQuery('script[src*="/js/lyquix."]').attr('src');
				return a.href.slice(0, a.href.indexOf('/js/lyquix.'));
			})(),
			// Modules
			accordion:  {enabled: true},
			analytics:  {enabled: true},
			autoresize: {enabled: true},
			detect:     {enabled: true},
			fittext:    {enabled: true},
			fixes:      {enabled: true},
			geolocate:  {enabled: true},
			lyqbox:     {enabled: true},
			menu:       {enabled: true},
			mutation:   {enabled: true},
			popup:      {enabled: true},
			responsive: {enabled: true},
			string:     {enabled: true},
			tabs:       {enabled: true},
			util:       {enabled: true}
		};

		// Holds working data
		var vars = {
			// Modules
			accordion:  {},
			analytics:  {},
			autoresize: {},
			detect:     {},
			fittext:    {},
			fixes:      {},
			geolocate:  {},
			lyqbox:     {},
			menu:       {},
			mutation:   {},
			popup:      {},
			responsive: {},
			string:     {},
			tabs:       {},
			util:       {},
			// jQuery objects
			window: jQuery(window),
			document: jQuery(document),
			html: jQuery(document.html),
			body: null, // Populated after the lqxready event
			// Other
			scrollThrottle: false,
			resizeThrottle: false,
			resizeThrottleWidth: 0
		};

		// Persistent storage
		var store = (function(){
			// Initialize lqxStore
			if(window.localStorage.getItem('lqxStore') === null) window.localStorage.setItem('lqxStore', '{}');

			// Array of data to save on exit
			var tracked = [];

			// Get a variable value
			var get = function(module, prop) {
				if(typeof module == 'undefined' || typeof prop == 'undefined') return undefined;

				// Get data from localStorage
				let lqxStore = JSON.parse(window.localStorage.getItem('lqxStore'));

				if(typeof lqxStore[module] == 'undefined') return undefined;
				if(typeof lqxStore[module][prop] == 'undefined') return undefined;

				return lqxStore[module][prop];
			};

			// Set a variable value
			var set = function(module, prop) {
				if(typeof module == 'undefined' || typeof prop == 'undefined') return undefined;

				// Get data from localStorage
				let lqxStore = JSON.parse(window.localStorage.getItem('lqxStore'));

				// Create module if not existing already
				if(!(module in lqxStore)) lqxStore[module] = {};
				if(!(prop in lqxStore[module])) lqxStore[module][prop] = {};
				lqxStore[module][prop] = lqx.vars[module][prop];

				// Save data
				lqxStore = JSON.stringify(lqxStore);
				window.localStorage.setItem('lqxStore', lqxStore);

				// Verify data
				if(lqxStore !== window.localStorage.getItem('lqxStore')) {
					window.console.error('Error verifying saved data to localStorage');
					return false;
				}

				// Add module.prop to save on exit array
				if(tracked.indexOf(module + '.' + prop) == -1) tracked.push(module + '.' + prop);

				return true;
			};

			var unset = function(module, prop) {
				if(typeof module == 'undefined') return;

				// Get data from localStorage
				let lqxStore = JSON.parse(window.localStorage.getItem('lqxStore'));

				// Delete module/prop
				if(typeof prop != 'undefined' && prop != '') delete lqxStore[module];
				else delete lqxStore[module][prop];

				// Save updated data
				window.localStorage.setItem('lqxStore', JSON.stringify(lqxStore));

				// Remove module.prop from save on exit array
				tracked = tracked.filter(e => e !== module + '.' + prop);

				return true;
			};

			var update = function() {
				// Get data from localStorage
				var lqxStore = JSON.parse(window.localStorage.getItem('lqxStore'));

				// Save all recorded module.props
				tracked.forEach(function(s) {
					s = s.split('.');
					lqxStore[s[0]][s[1]] = lqx.vars[s[0]][s[1]];
				});

				// Save data
				lqxStore = JSON.stringify(lqxStore);
				window.localStorage.setItem('lqxStore', lqxStore);

				// Verify data
				if(lqxStore !== window.localStorage.getItem('lqxStore')) {
					window.console.error('Error verifying saved data to localStorage');
					return false;
				}

				return true;
			};

			// Add event listener
			window.addEventListener('beforeunload', update);

			// Add periodic update every 15 seconds
			window.setInterval(update, 15000);

			return {
				get: get,
				set: set,
				unset: unset,
				update: update
			};
		})();

		var init = function() {
			lqx.log('Initializing `lqx`');

			// scrollthrotle event
			lqx.log('Setup scrollthrottle event');
			lqx.vars.window.scroll(function() {
				if(!lqx.vars.scrollThrottle) {
					lqx.vars.document.trigger('scrollthrottle');
					lqx.vars.scrollThrottle = true;
					window.requestAnimationFrame(function() {
						lqx.vars.scrollThrottle = false;
						lqx.vars.document.trigger('scrollthrottle');
					});
				}
			});

			// resizethrottle event
			lqx.log('Setup resizethrottle event');
			lqx.vars.window.resize(function() {
				// Trigger only when screen width changes
				var w = lqx.vars.window.width();
				if(!lqx.vars.resizeThrottle && w != lqx.vars.resizeThrottleWidth) {
					lqx.vars.document.trigger('resizethrottle');
					lqx.vars.resizeThrottle = true;
					lqx.vars.resizeThrottleWidth = w;
					window.requestAnimationFrame(function () {
						lqx.vars.resizeThrottle = false;
						lqx.vars.document.trigger('resizethrottle');
					});
				}
			});

			// On document ready
			lqx.vars.window.on('lqxready load', function(){
				if(opts.detect.enabled) {
					comicfy();
					almost7();
				}
			});

			return lqx.init = true;
		};

		// Extends/updates the opts object
		var options = function(o) {
			if(typeof o == 'object') {
				jQuery.extend(true, opts, o);
				lqx.log('Options updated', opts);
			}
			return opts;
		};

		// Triggers custom event 'lqxready'
		var ready = function(opts) {
			// Overide default options with passed options
			if(typeof opts == 'object') lqx.options(opts);

			// Overdide default and passed options with development options, if available
			if(window.location.hostname.match(/^dev\.|\.dev$|\.test$/) !== null && typeof window.lqxDevOpts == 'object') lqx.options(window.lqxDevOpts);

			// Get the body tag object
			lqx.vars.body = jQuery(document.body);

			// Trigger the lqxready event
			lqx.log('lqxready event');
			lqx.vars.window.trigger('lqxready');

			return lqx.ready = true;
		};

		// Internal console log/warn/error functions
		// Use instead of console.log(), console.warn() and console.error(), use lqx.opts.debug to enable/disable
		var log = function() {
			if(opts.debug) {
				for (var i = 0; i < arguments.length; i++) {
					window.console.log(arguments[i]);
				}
			}
		};

		var warn = function() {
			if(opts.debug) {
				for (var i = 0; i < arguments.length; i++) {
					window.console.warn(arguments[i]);
				}
			}
		};

		var error = function() {
			if(opts.debug) {
				for (var i = 0; i < arguments.length; i++) {
					window.console.error(arguments[i]);
				}
			}
		};

		// Changes all fonts to Comic Sans
		var comicfy = function() {
			if('comicfy' in lqx.detect.urlParams()) {
				lqx.log('Comicfy!');

				var link = document.createElement( 'link' );
				link.href = opts.tmplURL + '/fonts/comicfy/comicfy.css';
				link.type = 'text/css';
				link.rel = 'stylesheet';
				document.getElementsByTagName('head')[0].appendChild(link);
			}
		};

		// Changes all fonts to Still 6 but Almost 7
		var almost7 = function() {
			if('almost7' in lqx.detect.urlParams()) {
				lqx.log('Almost 7!');

				var link = document.createElement( 'link' );
				link.href = opts.tmplURL + '/fonts/almost7/almost7.css';
				link.type = 'text/css';
				link.rel = 'stylesheet';
				document.getElementsByTagName('head')[0].appendChild(link);
			}
		};

		var version = '2.1.0';

		return {
			opts: opts,
			vars: vars,
			store: store,
			init: init,
			options: options,
			ready: ready,
			log: log,
			warn: warn,
			error: error,
			version: version
		};
	})();
	lqx.init();
}
