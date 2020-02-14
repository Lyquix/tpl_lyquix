/**
 * core.js - Lyquix JavaScript library
 *
 * @version     2.2.1
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

if(typeof lqx !== 'undefined') {
	console.error('`lqx` already exist!');
}
else if(typeof jQuery == 'undefined') {
	console.error('`jQuery` has not been loaded!');
}
else {
	var lqx = (function(){
		// Default opts
		var opts = {
			debug: false,
			siteURL: null,
			tmplURL: null,
			// Modules
			accordion:  {enabled: true},
			analytics:  {enabled: true},
			autoresize: {enabled: true},
			detect:     {enabled: true},
			fixes:      {enabled: true},
			geolocate:  {enabled: true},
			lyqbox:     {enabled: true},
			menu:       {enabled: true},
			mutation:   {enabled: true},
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
			fixes:      {},
			geolocate:  {},
			lyqbox:     {},
			menu:       {},
			mutation:   {},
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
			screenWidth: 0
		};

		var init = function() {
			lqx.log('Initializing `lqx`');

			// scrollthrotle event
			lqx.log('Setup scrollthrottle event');
			lqx.vars.window.scroll(function() {
				// Get current screen width
				var w = lqx.vars.window.width();
				// Trigger only for width resize
				if(!lqx.vars.resizeThrottle && w == lqx.vars.screenWidth) {
					lqx.vars.document.trigger('scrollthrottle');
					lqx.vars.scrollThrottle = true;
					setTimeout(function() {
						lqx.vars.scrollThrottle = false;
						lqx.vars.document.trigger('scrollthrottle');
					}, 15);
				}
				lqx.vars.screenWidth = w;
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
			if(typeof opts == 'object') lqx.options(opts);
			lqx.vars.body = jQuery(document.body);
			lqx.log('lqxready event');
			lqx.vars.window.trigger('lqxready');

			return lqx.ready = true;
		};

		// Internal console log/warn/error functions
		// Use instead of console.log(), console.warn() and console.error(), use lqx.opts.debug to enable/disable
		var log = function() {
			if(opts.debug) {
				for (var i = 0; i < arguments.length; i++) {
					console.log(arguments[i]);
				}
			}
		};

		var warn = function() {
			if(opts.debug) {
				for (var i = 0; i < arguments.length; i++) {
					console.warn(arguments[i]);
				}
			}
		};

		var error = function() {
			if(opts.debug) {
				for (var i = 0; i < arguments.length; i++) {
					console.error(arguments[i]);
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
