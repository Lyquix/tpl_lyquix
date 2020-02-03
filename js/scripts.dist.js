/**
 * scripts.dist.js - Sample custom project JavaScript code, copy to scripts.js
 *
 * @version     2.2.0
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

if(typeof $ !== 'undefined') {
	console.error('`$` already exist! Try using jQuery.noConflict();');
}
else if(typeof jQuery == 'undefined') {
	console.error('`jQuery` has not been loaded!');
}
else if(typeof lqx == 'undefined') {
	console.error('`lqx` has not been loaded!');
}
else {
	var $ = (function(){
		// Options
		var opts = {
			/** Add settings here

			banner : {
				delay: 15,
				fade: 400,
			},

			**/
		};

		// Working data
		var vars = {
			window: jQuery(window),
			document: jQuery(document),
			html: jQuery(document.html),
			body: jQuery(document.body)

			/** Add vars for holding working data

			bannerTimer : false,
			currentSize : 300,
			filterHash : 'market-education',

			**/
		};

		var init = function(){

			/** Initialization

			*** Add event listeners ***

			Custom lqx events: ( Usage: vars.window.on('eventname', function(){}); )
			lqxready - triggered when lqx library is initialized
			geolocatereay - triggered when the IP geolocation is complete and location info is available
			screensizechange - triggered on changes of screen size
			orientationchange - triggered on changed on rotation of the screen
			scrollthrottle - throttles the scroll event, triggers every 15ms
			resizethrottle - throttles the resize event, triggers every 15ms

			Standard events:
			vars.document.ready
			vars.window.load
			vars.window.scroll
			vars.window.resize
			vars.window.unload

			*** Add mutation handlers ***
			lqx.mutation.addHandler(type, selector, callback);
			type: addNode, removeNode, modAttrib
			selector: send callbacks for mutations targets that match selector
			callback: function to execute when mutation occurs

			**/

			// Convert this function into a boolean to prevent execution
			return $.init = true;

		};

		/** Add custom functions for your project here

		var myFunc = function() {

		};

		**/

		return {
			opts: opts,
			vars: vars,
			init: init
			/** Add functions you would like to expose

			myFunc: myFunc,

			**/
		};
	})();
	$.init();
}
