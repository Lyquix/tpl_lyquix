/**
 * lyquix.logger.js - Advanced logging functionality
 *
 * @version     2.0.0
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */
'use strict';
if(lqx && typeof lqx.logger == 'undefined') {
	lqx.logger = {
		defaults: {
			settings: {
				namespaces : ['window', 'jQuery', 'lqx'] // array of namespaces to be included when logging
			}			
		},

		init: (function(){
			// Initialize only if enabled
			if(lqx.settings.logger.enabled) {
				lqx.log('Initializing `logger`');
				
				// Copy default settings and vars
				jQuery.extend(true, lqx.settings.logger, lqx.logger.defaults.settings);
				
				lqx.vars.window.on('bodyready', function() {
					// Add namespaces
					lqx.settings.logger.namespaces.forEach(function(namespace){
						lqx.logger.addNamespace(namespace);
					});
				});
			}

			return true;
		})(),
		
		// Adds function logging to a namespace (for global functions use "window")
		addNamespace: function(namespace){
			var namespaceObject = window;

			if(namespace != 'window') {
				namespaceObject = window[namespace];
			}
			
			Object.keys(namespaceObject).forEach(function(funcObj, funcName){
				if(Object.prototype.toString.call(funcObj) === '[object Function]'){
					namespaceObject[funcName] = lqx.logger.getFunction(funcObj, funcName, nameSpace);
				}
			});
		},
		
		getFunction: function(func, name, nameSpace) {
			return function() {
				console.log('Log for ' + nameSpace + '.' + name + ':');
				console.log(arguments);
				return func.apply(this, arguments);
			};
		}
	};
}