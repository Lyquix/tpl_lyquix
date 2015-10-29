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
	
	
	
};


// on dom ready
jQuery(document).ready(function(){
	
	/* add custom code for your project here */
	
	
	// on change of screen size: xs, sm, md, lg, xl, as well as rotation
	jQuery(window).on('screensizechange', function() {

		/* add custom code that needs to run on screen changes */

	});
	
});

// on page load
jQuery(window).load(function(){

	/* add custom code that needs to run when the page finishes loading */
	
});

