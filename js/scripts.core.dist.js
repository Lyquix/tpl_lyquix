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
