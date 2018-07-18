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
