/**
 * scripts.dist.js - Sample custom project JavaScript code, copy to scripts.js
 *
 * @version     1.0.10
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2017 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

// Custom project scripts
// ============================================================


// custom namespace to hold your functions and variables
var changeme = changeme || {  // custom project namespace, change to the client or site name

	// default settings
	settings : {
		/*
		 * add custom settings here, we recommend a structure of groups and settings
		 * for example:
		 *
		 * 		banner : {
		 * 			delay: 15,
		 * 			fade: 400,
		 * 		},
		 *
		 */
	},

	// holds working data
	vars: {
		/*
		 * add custom vars for holding working data
		 *
		 * 		bannerTimer : false,
		 * 		currentSize : 300,
		 * 		filterHash : 'market-education',
		 *
		 */
	},

	/*
	 *
	 *
	 *
	 * add custom functions for your project here
	 *
	 *
	 *
	 *
	*/

	// init: self invoking function that executes listeners once
	init: (function(){

		// on dom ready
		jQuery(document).ready(function(){

			/* add custom code to run on document ready e.g. init functions */


		});

		// on page load
		jQuery(window).load(function(){

			/* add handlers to run when the page finishes loading */

		});

		// on screen orientation change
		jQuery(window).on('orientationchange', function() {

			/* add handlers to run on screen orientation change */

		});

		// on change of screen size: xs, sm, md, lg, xl, as well as rotation
		jQuery(window).on('screensizechange', function() {

			/* add handlers to run on screen changes */

		});

		// on custom event scrollthrottle
		jQuery(window).on('scrollthrottle', function() {

			/* add handlers to run when page is scrolled */

		});

		// on scroll events
		jQuery(window).scroll(function() {

			/* add handlers to run when page is scrolled */

		});

		// on custom event resizethrottle
		jQuery(window).on('resizethrottle', function() {

			/* add handlers to run when window is resized */

		});

		// on window resize events
		jQuery(window).resize(function() {

			/* add handlers to run when window is resized */

		});

		// on custom event geolocateready
		jQuery(window).on('geolocateready', function() {

			/* add handlers to run when page geolocation is ready */

		});

	}())

};
