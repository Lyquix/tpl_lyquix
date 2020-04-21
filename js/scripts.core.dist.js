/**
 * scripts.core.dist.js - Sample core file for custom project JavaScript code, copy to scripts.core.js
 *
 * @version     2.2.2
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

/* jshint browser: true, devel: true, esversion: 6, jquery: true, strict: true */
/* globals lqx, ga */

"use strict";

if(typeof $lqx !== 'undefined') {
	window.console.error('`$lqx` already exist!');
}
else if(typeof jQuery == 'undefined') {
	window.console.error('`jQuery` has not been loaded!');
}
else if(typeof lqx == 'undefined') {
	window.console.error('`lqx` has not been loaded!');
}
else {
	var $lqx = (function(){
		// Options for modules
		var opts = {
			// Modules
			module:   {enabled: true}
		};

		// Working data for modules
		var vars = {
			// Added to allow for lqx and $lqx to be used interchangeably
			window: lqx.vars.window,
			document: lqx.vars.document,
			html: lqx.vars.html,
			body: null, // Populated after the $lqxready event

			// Modules
			module:   {}
		};

		// Persistent storage
		var store = (function(){
			// Initialize $lqxStore
			if(window.localStorage.getItem('$lqxStore') === null) window.localStorage.setItem('$lqxStore', '{}');

			// Array of data to save on exit
			var saveOnExit = [];

			// Get a variable value
			var get = function(module, prop) {
				if(typeof module == 'undefined' || typeof prop == 'undefined') return undefined;

				// Get data from localStorage
				let $lqxStore = JSON.parse(window.localStorage.getItem('$lqxStore'));

				return $lqxStore[module][prop];
			};

			// Set a variable value
			var set = function(module, prop) {
				if(typeof module == 'undefined' || typeof prop == 'undefined') return undefined;

				// Get data from localStorage
				let $lqxStore = JSON.parse(window.localStorage.getItem('$lqxStore'));

				// Create module if not existing already
				if(!(module in $lqxStore)) $lqxStore[module] = {};
				if(!(prop in $lqxStore[module])) $lqxStore[module][prop] = {};
				$lqxStore[module][prop] = $lqx.vars[module][prop];

				// Save data
				$lqxStore = JSON.stringify($lqxStore);
				window.localStorage.setItem('$lqxStore', $lqxStore);

				// Verify data
				if($lqxStore !== window.localStorage.getItem('$lqxStore')) window.console.error('Error verifying saved data to localStorage');

				// Add module.prop to save on exit array
				if(saveOnExit.indexOf(module + '.' + prop) == -1) saveOnExit.push(module + '.' + prop);

				return true;
			};

			var unset = function(module, prop) {
				if(typeof module == 'undefined') return;

				// Get data from localStorage
				let $lqxStore = JSON.parse(window.localStorage.getItem('$lqxStore'));

				// Delete module/prop
				if(typeof prop != 'undefined' && prop != '') delete $lqxStore[module];
				else delete $lqxStore[module][prop];

				// Save updated data
				window.localStorage.setItem('$lqxStore', JSON.stringify($lqxStore));

				// Remove module.prop from save on exit array
				saveOnExit = saveOnExit.filter(e => e !== module + '.' + prop);

				return true;
			};

			// Add event listener
			window.addEventListener('beforeunload', function(){
				// Get data from localStorage
				var $lqxStore = JSON.parse(window.localStorage.getItem('$lqxStore'));

				// Save all recorded module.props
				saveOnExit.forEach(function(s) {
					s = s.split('.');
					$lqxStore[module][prop] = $lqx.vars[module][prop];
				});

				// Save data
				$lqxStore = JSON.stringify(lqxStore);
				window.localStorage.setItem('lqxStore', $lqxStore);

				// Verify data
				if($lqxStore !== window.localStorage.getItem('$lqxStore')) window.console.error('Error verifying saved data to localStorage');
			});

			return {
				get: get,
				set: set,
				unset: unset
			}
		})();

		// Init function
		var init = function(){

			/**
			 * Run any general initialization logic before initializing modules
			 */

			// Convert this function into a boolean to prevent execution
			return $lqx.init = true;
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
			if(typeof opts == 'object') $lqx.options(opts);

			// Overdide default and passed options with development options, if available
			if(window.location.hostname.match(/^dev\.|\.dev$|\.test$/) !== null && typeof window.$lqxDevOpts == 'object') $lqx.options(window.$lqxDevOpts);

			// Get the body tag object
			$lqx.vars.body = lqx.vars.body;

			// Trigger the $lqxready event
			$lqx.log('$lqxready event');
			$lqx.vars.window.trigger('$lqxready');

			return $lqx.ready = true;
		};

		// Added to allow for lqx and $lqx to be used interchangeably
		var log = lqx.log;
		var warn = lqx.warn;
		var error = lqx.error;

		return {
			opts: opts,
			vars: vars,
			store: store,
			init: init,
			options: options,
			ready: ready,
			log: log,
			warn: warn,
			error: error
		};
	})();
	$lqx.init();
}
