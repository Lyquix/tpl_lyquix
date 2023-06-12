/**
 * store.js - Persistent data storage using localStorage
 *
 * @version     2.4.0
 * @package     wp_theme_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/wp_theme_lyquix
 */

if(lqx && !('store' in lqx)) {
	lqx.store = (function(){
		/**
		 *
		**/

		var opts = {
			itemName: 'lqxStore',
			updateInterval: 15, // in seconds
		};

		var vars = {
			tracked: []
		};

		var init = function(){
			// Copy default opts and vars
			jQuery.extend(true, lqx.opts.store, opts);
			opts = lqx.opts.store;
			jQuery.extend(true, lqx.vars.store, vars);
			vars = lqx.vars.store;

			// Initialize on lqxready
			lqx.vars.window.on('lqxready', function() {
				// Initialize only if enabled
				if(opts.enabled) {
					lqx.log('Initializing `store`');

					// Initialize item in localStorage
					if(window.localStorage.getItem(opts.itemName) === null) window.localStorage.setItem(opts.itemName, '{}');

					// Add event listener
					window.addEventListener('beforeunload', update);

					// Add periodic update every 15 seconds
					window.setInterval(update, opts.updateInterval * 1000);
				}
			});

			// Run only once
			lqx.store.init = function(){
				lqx.warn('lqx.store.init already executed');
			};

			return true;
		};

		// Get a variable value
		var get = function(module, prop) {
			if(typeof module == 'undefined' || typeof prop == 'undefined') return undefined;

			// Get data from localStorage
			let lqxStore = JSON.parse(window.localStorage.getItem(opts.itemName));

			if(typeof lqxStore[module] == 'undefined') return undefined;
			if(typeof lqxStore[module][prop] == 'undefined') return undefined;

			return lqxStore[module][prop];
		};

		// Set a variable value
		var set = function(module, prop) {
			if(typeof module == 'undefined' || module == 'store' || typeof prop == 'undefined') return undefined;

			// Get data from localStorage
			let lqxStore = JSON.parse(window.localStorage.getItem(opts.itemName));

			// Create module if not existing already
			if(!(module in lqxStore)) lqxStore[module] = {};
			if(!(prop in lqxStore[module])) lqxStore[module][prop] = {};
			lqxStore[module][prop] = lqx.vars[module][prop];

			// Save data
			lqxStore = JSON.stringify(lqxStore);
			window.localStorage.setItem(opts.itemName, lqxStore);

			// Verify data
			if(lqxStore !== window.localStorage.getItem(opts.itemName)) {
				lqx.console.error('Error verifying saved data to localStorage');
				return false;
			}

			// Add module.prop to save on exit array
			if(vars.tracked.indexOf(module + '.' + prop) == -1) vars.tracked.push(module + '.' + prop);

			return true;
		};

		var unset = function(module, prop) {
			if(typeof module == 'undefined') return;

			// Get data from localStorage
			let lqxStore = JSON.parse(window.localStorage.getItem(opts.itemName));

			// Delete module/prop
			if(typeof prop != 'undefined' && prop != '') delete lqxStore[module];
			else delete lqxStore[module][prop];

			// Save updated data
			window.localStorage.setItem(opts.itemName, JSON.stringify(lqxStore));

			// Remove module.prop from save on exit array
			vars.tracked = vars.tracked.filter(e => e !== module + '.' + prop);

			return true;
		};

		var update = function() {
			// Get data from localStorage
			var lqxStore = JSON.parse(window.localStorage.getItem(opts.itemName));

			// Save all recorded module.props
			vars.tracked.forEach(function(s) {
				s = s.split('.');
				lqxStore[s[0]][s[1]] = lqx.vars[s[0]][s[1]];
			});

			// Save data
			lqxStore = JSON.stringify(lqxStore);
			window.localStorage.setItem(opts.itemName, lqxStore);

			// Verify data
			if(lqxStore !== window.localStorage.getItem(opts.itemName)) {
				lqx.console.error('Error verifying saved data to localStorage');
			}
		};

		return {
			init: init,
			get: get,
			set: set,
			unset: unset,
			update: update
		};
	})();
	lqx.store.init();
}
