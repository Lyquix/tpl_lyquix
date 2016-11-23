
// ***********************************
// BEGIN Lyquix global object
// Includes Lyquix common function library and default settings
var lqx = lqx || {
	
	// default settings
	settings : {
		debug: false,
		logger: {
			enable : false, // set to true to enable console logging
			namespaces : ['window', 'jQuery', 'lqx'] // array of namespaces to be included when logging
		},
		tracking: {
			downloads: true,
			outbound: true,
			scrolldepth: true,
			photogallery: true,
			video: true,
			activetime: true,
		},
		shadeColorPercent: {
			lighter: 20,
			light: 10,
			dark: -10,
			darker: -20,
		},
		resizeThrottle: {
			duration: 15,  // in miliseconds 
		},
		scrollThrottle: {
			duration: 15,  // in miliseconds 
		},
		bodyScreenSize: {
			// defines the minimum and maximum screen sizes, 
			// use 0 through 4 to represent xs to xl screen sizes
			min: 0,
			max: 4,
			breakPoints: [320, 640, 960, 1280, 1600],
			sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
		},
		equalHeightRows: {
			refreshElems: false, // refreshed the list of elements on each run
			onlyVisible: true,   // ignores non visible elements
			checkPageLoad: true, // check if there was the page load event when waiting for images
		},
		lyqBox: {
			lyqboxHTMLContent: 	'<div class="lyqbox">' +
									'<div class="content-wrapper">' +
										'<div class="content"></div>' +
										'<div class="info">' +
											'<div class="title"></div>' +
											'<div class="caption"></div>' +
											'<div class="credit"></div>' +
										'</div>' +
									'</div>' +
									'<div class="content-wrapper">' +
										'<div class="content"></div>' +
										'<div class="info">' +
											'<div class="title"></div>' +
											'<div class="caption"></div>' +
											'<div class="credit"></div>' +
										'</div>' +
									'</div>' +
									'<div class="close"></div>' +
									'<div class="prev"></div>' +
									'<div class="next"></div>' +
									'<div class="counter">' + 
										'<span class="current"></span>' +
										' of <span class="total"></span>' +
									'</div>' +
								'</div>',	        		
		},
		userActive: {
			idleTime: 5000,	// idle time (ms) before user is set to inactive
			throttle: 100,	// throttle period (ms)
			refresh: 250,	// refresh period (ms)
			maxTime: 1800000 // max time when tracking stops (ms)
		},
		ga: {
			createParams: null,			// example: {default: {trackingId: 'UA-XXXXX-Y', cookieDomain: 'auto', fieldsObject: {}}}, where "default" is the tracker name
			setParams: null,			// example: {default: {dimension1: 'Age', metric1: 25}}
			requireParams: null,		// example: {default: {pluginName: 'displayFeatures', pluginOptions: {cookieName: 'mycookiename'}}}
			provideParams: null,		// example: {default: {pluginName: 'MyPlugin', pluginConstructor: myPluginFunc}}
			customParamsFuncs: null,	// example: {default: myCustomFunc}
			abTestName: null,			// Set a test name to activate A/B Testing Dimension
			abTestNameDimension: null,		// Set the Google Analytics dimension number to use for test name
			abTestGroupDimension: null,		// Set the Google Analytics dimension number to use for group
		},
		geoLocation: {
			enable: false,	// perform geolocation
			gps: false,		// request gps data for precise lat/lon
		}
	},
	
	// holds working data
	vars: {
		resizeThrottle: false,  // saves current status of resizeThrottle
		scrollThrottle: false,  // saves current status of scrollThrottle
		youTubeIframeAPIReady: false,
		youTubeIframeAPIReadyAttempts: 0,
	},
	
	// setOptions
	// a function for setting options for lqx (instead of manually rewriting lqx.settings)
	setOptions : function(opts) {
		if(typeof opts == 'object') {
			jQuery.extend(true, lqx.settings, opts);
		}
		return lqx.settings;
	},
	
	// internal console log function
	// use instead of console.log, and control with lqx.settings.debug
	log : function() {
		if(lqx.settings.debug) console.log(arguments);
	},

	// function logging
	initLogging: function() {
		if(lqx.settings.logger.enable) {
			lqx.settings.logger.namespaces.forEach(function(namespace){
				lqx.addLoggingToNamespace(namespace);
			});
		}
	},
	
	// addLoggingToNamespace: adds function logging to a namespace (for global functions use "window")
	addLoggingToNamespace : function(nameSpace){
		
		if(nameSpace == 'window') {
			namespaceObject = window;
		}
		else {
			namespaceObject = window[nameSpace];
		}
		
		Object.keys(namespaceObject).forEach(function(potentialFunction, name){
			if(Object.prototype.toString.call(potentialFunction) === '[object Function]'){
				namespaceObject[name] = lqx.getLoggableFunction(potentialFunction, name, nameSpace);
			}
		});
	},
	
	getLoggableFunction : function(func, name, nameSpace) {
		return function() {
			
			console.log('LOG: executing ' + nameSpace + '.' + name + ' with arguments:' );
			console.log(arguments);
			
			return func.apply(this, arguments);
		}
	},

	// cookie 
	// function for handling cookies with ease
	// inspired by https://github.com/js-cookie/js-cookie and https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie/Simple_document.cookie_framework
	// lqx.cookie(name) to get value of cookie name
	// lqx.cookie(name, value) to set cookie name=value
	// lqx.cookie(name, value, attributes) to set cookie with additional attributes
	// returns false if no name is passed, returns null if cookie doesn't exist
	// attributes is an array with any of the following keys:
	// maxAge: an integer, number of seconds
	// expires: a Date object
	// path: string
	// domain: string
	// secure: any non-false value
	// httpOnly: any non-false value
	cookie: function(name, value, attributes) {
		var result;
		if(arguments.length == 0 || !name) return false;

		// get cookie
		if(arguments.length == 1) {
			return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
		}
		// set cookie
		var c = encodeURIComponent(name) + "=" + encodeURIComponent(value);
		if(typeof attributes == 'object') {
			if('maxAge' in attributes) c += '; max-age=' + parseInt(attributes.maxAge);
			if('expires' in attributes && attributes.expires instanceof Date) c += '; expires=' + attributes.expires.toUTCString();
			if('path' in attributes) c += '; path=' + attributes.path;
			if('domain' in attributes) c += '; domain=' + attributes.domain;
			if('secure' in attributes) c += '; secure';
			if('httpOnly' in attributes) c += '; httponly';
		}
		// set cookie
		document.cookie = c;
		return true;
	},
	
	// bodyScreenSize
	// adds an attribute "screen" to the body tag that indicates the current size of the screen
	bodyScreenSize : function() {
		var w = jQuery(window).width();
		if(w < lqx.settings.bodyScreenSize.breakPoints[1]) s = 0;
		if(w >= lqx.settings.bodyScreenSize.breakPoints[1]) s = 1;
		if(w >= lqx.settings.bodyScreenSize.breakPoints[2]) s = 2;
		if(w >= lqx.settings.bodyScreenSize.breakPoints[3]) s = 3;
		if(w >= lqx.settings.bodyScreenSize.breakPoints[4]) s = 4;
		// adjust calculated size to min and max range
		if(s < lqx.settings.bodyScreenSize.min) s = lqx.settings.bodyScreenSize.min;
		if(s > lqx.settings.bodyScreenSize.max) s = lqx.settings.bodyScreenSize.max;
		if(lqx.settings.bodyScreenSize.sizes[s] != lqx.vars.lastScreenSize) {
			// change the body screen attribute
			jQuery('body').attr('screen',lqx.settings.bodyScreenSize.sizes[s]);
			// save last screen size
			lqx.vars.lastScreenSize = lqx.settings.bodyScreenSize.sizes[s];
			// trigger custom event 'screensizechange'
			jQuery(document).trigger('screensizechange');
		}
	},

	// bodyScreenOrientation
	// adds an attribute "orientation" to the body tag that indicates the current orientation of the screen
	bodyScreenOrientation : function() {
		if('orientation' in window.screen) {
			switch (window.screen.orientation.type ) {
				case 'portrait-primary' :
				case 'portrait-secondary' :
					lqx.vars.lastScreenOrientation = 'portrait';
					jQuery('body').attr('orientation', 'portrait');
					break;

				case 'landscape-primary' :
				case 'landscape-secondary' :
					lqx.vars.lastScreenOrientation = 'landscape';
					jQuery('body').attr('orientation', 'landscape');
					break;
			}
		}
	},

	// geoLocate
	// attempts to locate position of user by means of gps or ip address
	geoLocate : function() {
		if(lqx.settings.geoLocation.enable) {
			// ip2geo to get location info
			jQuery.ajax({
				cache: false,
				complete: function(xhr, status){
					// if gps enabled, attempt to get lat/lon
					if(lqx.settings.geoLocation.gps && 'geolocation' in navigator) {
						navigator.geolocation.getCurrentPosition(function(position) {
							lqx.vars.geoLocation.lat = position.coords.latitude;
							lqx.vars.geoLocation.lon = position.coords.longitude;
							lqx.vars.geoLocation.radius = 0;
						});
					}
					// add location attributes to body tag
					if(lqx.vars.geoLocation.city) jQuery('body').attr('city', lqx.vars.geoLocation.city);
					if(lqx.vars.geoLocation.subdivision) jQuery('body').attr('subdivision', lqx.vars.geoLocation.subdivision);
					if(lqx.vars.geoLocation.country) jQuery('body').attr('country', lqx.vars.geoLocation.country);
					if(lqx.vars.geoLocation.continent) jQuery('body').attr('continent', lqx.vars.geoLocation.continent);
					if(lqx.vars.geoLocation.time_zone) jQuery('body').attr('time-zone', lqx.vars.geoLocation.time_zone);
				},
				dataType: 'json',
				error: function(){
					lqx.vars.geoLocation = {
						city: null,
						subdivision: null,
						country: null,
						continent: null,
						time_zone: null,
						lat: null,
						lon: null,
						radius: null
					}
				},
				success: function(data, status, xhr){
					lqx.vars.geoLocation = data;
				},
				url: lqx.vars.tmplURL + '/php/ip2geo/',
			});
		}
	},
	
	// uses the mobile-detect.js library to detect if the browser is a mobile device
	// add the classes mobile, phone and tablet to the body tag if applicable
	mobileDetect : function() {
		var md = new MobileDetect(window.navigator.userAgent);
		var r = {mobile: false, phone: false, tablet: false};
		if(md.mobile() != null) {
			r.mobile = true;
			jQuery('body').addClass('mobile');
			if(md.phone() != null){
				r.phone = true;
				jQuery('body').addClass('phone');
			}
			if(md.tablet() != null){
				r.tablet = true;
				jQuery('body').addClass('tablet');
			}
		}
		return r;
	},
	
	// returns the browser name, type and version, and sets body classes
	// detects major browsers: IE, Edge, Firefox, Chrome, Safari, Opera, Android
	// based on: https://github.com/ded/bowser
	// list of user agen strings: http://www.webapps-online.com/online-tools/user-agent-strings/dv
	getBrowser : (function(){
		var ua = navigator.userAgent, browser;

		// helper functions to deal with common regex
		function getFirstMatch(regex) {
			var match = ua.match(regex);
			return (match && match.length > 1 && match[1]) || '';
		}

		function getSecondMatch(regex) {
			var match = ua.match(regex);
			return (match && match.length > 1 && match[2]) || '';
		}

		// start detecting
		if (/opera|opr/i.test(ua)) {
			browser = {
				name: 'Opera',
				type: 'opera',
				version: getFirstMatch(/version\/(\d+(\.\d+)?)/i) || getFirstMatch(/(?:opera|opr)[\s\/](\d+(\.\d+)?)/i)
			}
		}  else if (/msie|trident/i.test(ua)) {
			browser = {
				name: 'Internet Explorer',
				type: 'msie',
				version: getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)
			}
		} else if (/chrome.+? edge/i.test(ua)) {
			browser = {
				name: 'Microsft Edge',
				type: 'msedge',
				version: getFirstMatch(/edge\/(\d+(\.\d+)?)/i)
			}
		} else if (/chrome|crios|crmo/i.test(ua)) {
			browser = {
				name: 'Google Chrome',
				type: 'chrome',
				version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
			}
		} else if (/firefox/i.test(ua)) {
			browser = {
				name: 'Firefox',
				type: 'firefox',
				version: getFirstMatch(/(?:firefox)[ \/](\d+(\.\d+)?)/i)
			}
		} else if (!(/like android/i.test(ua)) && /android/i.test(ua)) {
			browser = {
				name: 'Android',
				type: 'android',
				version: getFirstMatch(/version\/(\d+(\.\d+)?)/i)
			}
		} else if (/safari/i.test(ua)) {
			browser = {
				name: 'Safari',
				type: 'safari',
				version: getFirstMatch(/version\/(\d+(\.\d+)?)/i)
			}
		} else {
			browser = {
				name: getFirstMatch(/^(.*)\/(.*) /),
				version: getSecondMatch(/^(.*)\/(.*) /)
			}
			browser.type = browser.name.toLowerCase().replace(/\s/g, '');
		}
		// add classes to body
		// browser type
		jQuery('body').addClass(browser.type);
		// browser type and major version
		jQuery('body').addClass(browser.type + '-' + browser.version.split('.')[0]);
		// browser type and full version
		jQuery('body').addClass(browser.type + '-' + browser.version.replace(/\./g, '-'));

		return browser;
	}()),

	// returns the os name, type and version, and sets body classes
	// detects major desktop and mobile os: Windows, Windows Phone, Mac, iOS, Android, Ubuntu, Fedora, ChromeOS
	// based on bowser: https://github.com/ded/bowser
	// list of user agent strings: http://www.webapps-online.com/online-tools/user-agent-strings/dv
	getOS : (function() {
		var ua = navigator.userAgent, os;

		// helper functions to deal with common regex
		function getFirstMatch(regex) {
			var match = ua.match(regex);
			return (match && match.length > 1 && match[1]) || '';
		}

		function getSecondMatch(regex) {
			var match = ua.match(regex);
			return (match && match.length > 1 && match[2]) || '';
		}

		if(/(ipod|iphone|ipad)/i.test(ua)) {
			os = {
				name: 'iOS',
				type: 'ios',
				version: getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i).replace(/[_\s]/g, '.')
			}
		} else if(/windows phone/i.test(ua)) {
			os = {
				name: 'Windows Phone',
				type: 'windowsphone',
				version: getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i)
			}
		} else if(!(/like android/i.test(ua)) && /android/i.test(ua)) {
			os = {
				name: 'Android',
				type: 'android',
				version: getFirstMatch(/android[ \/-](\d+(\.\d+)*)/i)
			}
		} else if(/windows nt/i.test(ua)) {
			os = {
				name: 'Windows',
				type: 'windows',
				version: getFirstMatch(/windows nt (\d+(\.\d+)*)/i)
			}
		} else if(/mac os x/i.test(ua)) {
			os = {
				name: 'Mac OS X',
				type: 'macosx',
				version: getFirstMatch(/mac os x (\d+([_\s]\d+)*)/i).replace(/[_\s]/g, '.')
			}
		} else if(/ubuntu/i.test(ua)) {
			os = {
				name: 'Ubuntu',
				type: 'ubuntu',
				version: getFirstMatch(/ubuntu\/(\d+(\.\d+)*)/i)
			}
		} else if(/fedora/i.test(ua)) {
			os = {
				name: 'Fedora',
				type: 'fedora',
				version: getFirstMatch(/fedora\/(\d+(\.\d+)*)/i)
			}
		} else if(/CrOS/.test(ua)) {
			os = {
				name: 'Chrome OS',
				type: 'chromeos',
				version: getSecondMatch(/cros (.+) (\d+(\.\d+)*)/i)
			}
		}

		// add classes to body
		if(os.type && os.version) {
			// os type
			jQuery('body').addClass(os.type);
			// os type and major version
			jQuery('body').addClass(os.type + '-' + os.version.split('.')[0]);
			// os type and full version
			jQuery('body').addClass(os.type + '-' + os.version.replace(/\./g, '-'));
		}

		return os;
	}()),
	
	// browserFixes
	// implements some general browser fixes
	browserFixes : function(){
		if(lqx.getBrowser.type == 'msie') {
			// adds width value to img elements that don't have one
			jQuery('img').each(function(){
				var img = jQuery(this);
				if(img.attr('width') == undefined) {
					var newimg = new Image();
					newimg.onload = function() {
						img.attr('width', newimg.width);
					}
					newimg.src = img.attr('src'); 
				}
			});
			// fix for google fonts not rendering in IE10/11
			if(lqx.getBrowser.version >= 10) {
				jQuery('html').css('font-feature-settings', 'normal');
			}
			// replaced svg imager for pngs in IE 8 and older
			if(lqx.getBrowser.version <= 8) {
				jQuery('img').each(function(){
					src = jQuery(this).attr('src');
					if(/\.svg$/i.test (src)) {
						jQuery(this).attr('src', src.replace('.svg', '.png')); 
					}
				});
			}
		}
	},
	
	// init equalHeightRows
	// add an "loaderror" attribute to images that fail to load
	initEqualHeightRows : function() {
		// get elements, check if we will ignore not visible elements
		if(lqx.settings.equalHeightRows.onlyVisible) {
			lqx.vars.equalHeightRowElems = jQuery('.equalheightrow:visible'); 
		}
		else {
			lqx.vars.equalHeightRowElems = jQuery('.equalheightrow');
		}
		// get images inside equal height rows elements
		lqx.vars.equalHeightRowImgs = lqx.vars.equalHeightRowElems.find('img');
		// add listener on page load
		lqx.vars.equalHeightRowPageLoaded = false;
		jQuery(window).load(function(){
			lqx.vars.equalHeightRowPageLoaded = true;
		});
		// run equal height rows
		lqx.equalHeightRows();
	},
	
	// equalHeightRows
	// makes all elements in a row to be the same height
	equalHeightRows : function(opts) {
		
		// get default settings and override with custom opts
		var s = lqx.settings.equalHeightRows;
		if(typeof opts == 'object') jQuery.extend(true, s, opts);
		
		if(s.refreshElems || typeof lqx.vars.equalHeightRowElems == 'undefined') {
			if(lqx.settings.equalHeightRows.onlyVisible) {
				lqx.vars.equalHeightRowElems = jQuery('.equalheightrow:visible'); 
			}
			else {
				lqx.vars.equalHeightRowElems = jQuery('.equalheightrow');
			}
			lqx.vars.equalHeightRowImgs = lqx.vars.equalHeightRowElems.find('img');
		}
		
		var elemsCount = lqx.vars.equalHeightRowElems.length;
		
		// first, revert all elements to auto height
		lqx.vars.equalHeightRowElems.height('auto').promise().done(function(){
			// reset some vars
			var currElem,
				currElemTop = 0,
				currElemHeight = 0,
				currRowElems = new Array(),
				currRowTop = 0,
				currRowHeight = 0;
			
			// update heights per row
			lqx.vars.equalHeightRowElems.each(function(i){
				
				// current element and its top
				currElem = jQuery(this);
				currElemTop = currElem.offset().top;
				currElemHeight = currElem.height();
				
				if(currElemTop != currRowTop) {
					// new row has started, set the height for the previous row if it has more than one element
					if(currRowElems.length > 1) {
						for(var j = 0; j < currRowElems.length; j++) {
							currRowElems[j].height(currRowHeight);
						}
					}
					// wipe out array of current row elems, start with current element
					currRowElems = new Array(currElem);
					// set the top of current row (gets again position of elem after adjusting previous row)
					currRowTop = currElem.offset().top;;
					// set the current tallest
					currRowHeight = currElemHeight;
				}
				else {
					// element in same row, add to array of elements
					currRowElems.push(currElem);
					// update the row height if new element is taller
					currRowHeight = (currElemHeight > currRowHeight) ? currElemHeight : currRowHeight;
					// if this is the last element in the set, update the last row elements height
					if(i == elemsCount - 1) {
						if(currRowElems.length > 1) {
							for(var j = 0; j < currRowElems.length; j++) {
								currRowElems[j].height(currRowHeight);
							}
						}
					}
				}
				
			}).promise().done(function(){
				// there may be images waiting to load, in that case wait a little and try again
				if(!(lqx.settings.equalHeightRows.checkPageLoad && lqx.vars.equalHeightRowPageLoaded)) {
					lqx.vars.equalHeightRowImgs.each(function(){
						// is the image still loading? (this.complete works only in IE)
						if(this.complete != true || (typeof this.naturalWidth !== "undefined" && this.naturalWidth === 0)) {
							// seems to still be loading
							// if there wasn't an error, run equalheightrows again in 0.25 secs
							if(typeof jQuery(this).attr('loaderror') != 'undefined'){
								// there isn't an error, it means the image has not completed loading yet
								setTimeout(function(){lqx.equalHeightRows(opts)}, 250);
								
							}
						}
					});
				}
			});
		});
	},
	
	// hangingPunctuation
	// fixes punctuation marks that are the beggining or end of paragraphs
	hangingPunctuation : function(){
		
		lqx.vars.hangingMarks = {
			'\u201c': 'medium',     // � - ldquo - left smart double quote
			'\u2018': 'small',      // � - lsquo - left smart single quote
			'\u0022': 'medium',     // " - ldquo - left dumb double quote
			'\u0027': 'small',      // ' - lsquo - left dumb single quote
			'\u00AB': 'large',      // � - laquo - left double angle quote
			'\u2039': 'medium',     // � - lsaquo - left single angle quote
			'\u201E': 'medium',     // � - bdquo - left smart double low quote
			'\u201A': 'small',      // � - sbquo - left smart single low quote
		};
		
		// lops over the P descendants of the elements with class hanging-punctuation
		jQuery('.hanging-punctuation').find('p').each(function(idx, elem){
			lqx.hangPunctuation(elem);
		});
		
	},
	
	hangPunctuation : function(elem){
		
		var plaintext = elem.innerText || elem.textContent;
		
		for(var mark in lqx.vars.hangingMarks) {
			if(plaintext.indexOf(mark) === 0 ){
				// we found one of the marks at the beginning of the paragraph
				// insert a faux mark at the end to measure its width
				jQuery(elem).append('<span id="hangingMark">' + mark + '</span>');
				var w = jQuery('#hangingMark').outerWidth();
				jQuery(elem).css('text-indent','-' + w + 'px');
				jQuery('#hangingMark').remove();
			}
		}
		
	},
	
	// adds a text caption using image alt property
	imageCaption : function(){
		jQuery('.image.caption img').each(function(idx,elem){
			var caption = jQuery(elem).attr('alt');
			if(caption) {
				jQuery(elem).after('<div class="caption">' + caption + '</div>');
			}
		});
	},
	
	// shows a line break symbol before br elements
	lineBreakSymbol : function(){
		jQuery('.show-line-break p br').each(function(idx,elem){
			jQuery(elem).before(String.fromCharCode(0x21B2));
		});
	},
	
	shadeColor : function(){
		
		// cycle through the various properties
		for (var i in ['color', 'bg', 'border']) {
			
			// cycle through the various shades
			for (var j in ['lighter', 'light', 'dark', 'darker']) {
				
				// set the correct css property name
				var prop;
				switch(i) {
					case 'color':
						prop = 'color';
						break;
					case 'bg':
						prop = 'background-color';
						break;
					case 'border':
						prop = 'border-color';
						break;
				}
				
				// set the correct css class
				var c = '.' + i + '-' + j;
				
				// cycle through all elements
				jQuery(c).each(function(idx, elem){ 
					// get the color for the element
					var color = jQuery(elem).css(prop);
					
					// if color is in hex use shadeHex, otherwise use shadeRGB
					if(color.charAt(0) == '#'){
						color = shadeHex(color, lqx.settings.shadeColorPercent[j]);
					}
					else {
						color = shadeRGB(color, lqx.settings.shadeColorPercent[j]);
					}
					
					// update color for element
					jQuery(elem).css(prop, color);
				});
				
			}
			
		}
		
		
	},
	
	// returns a HEX color lighter or darker by percentage
	shadeHex : function(color, percent) {
		var 	num = parseInt(color.slice(1),16), 
			amt = Math.round(2.55 * percent), 
			R = (num >> 16) + amt, 
			G = (num >> 8 & 0x00FF) + amt, 
			B = (num & 0x0000FF) + amt;
		return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + ( G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
	},
	
	// returns a RBG color lighter or darker by percentage
	shadeRGB : function(color, percent) {
		var 	f = color.split(","), 
			t = percent < 0 ? 0 : 255, 
			p = percent < 0 ? percent * -1 : percent, 
			R = parseInt(f[0].slice(4)), 
			G = parseInt(f[1]), 
			B = parseInt(f[2]);
		return "rgb(" + (Math.round((t - R) * p) + R) + "," + (Math.round((t - G) * p ) + G) + "," + (Math.round((t - B) * p) + B) + ")";
	},
	 
	// initialize google analytics tracking
	initTracking : function() {
		
		// NOTE: this function is triggered by lqx.gaReady
			
		// track downloads and outbound links
		if(lqx.settings.tracking.outbound || lqx.settings.tracking.download){
			// find all a tags and cycle through them
			jQuery('a').each(function(){
				var elem = this;
				// check if it has an href attribute, otherwise it is just a page anchor
				if(elem.href) {
					
					// skip featherlight video and gallery, video is already handled below, and gallery will be handled by tracking.photogallery
					if (typeof jQuery(this).attr('data-featherlight') === 'undefined' && typeof jQuery(this).parent().attr('data-featherlight-gallery') === 'undefined'){

						// check if it is an outbound link, track as event
						if(elem.href.indexOf(location.host) == -1 && lqx.settings.tracking.outbound) {

							jQuery(elem).click(function(e){
								// prevent default
								e.preventDefault ? e.preventDefault() : e.returnValue = !1;
								var url = elem.href;
								var label = url;
								if(jQuery(elem).attr('title')) {
									label = jQuery(elem).attr('title') + ' [' + url + ']';
								}
								ga('send', {
									'hitType' : 'event', 
									'eventCategory' : 'Outbound Links',
									'eventAction' : 'click',
									'eventLabel' : label,
									'nonInteraction' : true,
									'hitCallback' : function(){ window.location.href = url; } // regarless of target value link will open in same link, otherwise it is blocked by browser
								});
							});
						}
						
						// check if it is a download link, track as pageview
						else if(elem.href.match(/\.(gif|png|jpg|jpeg|tif|tiff|svg|webp|bmp|zip|rar|gzip|7z|tar|exe|msi|dmg|txt|pdf|rtf|doc|docx|dot|dotx|xls|xlsx|xlt|xltx|ppt|pptx|pot|potx|mp3|wav|mp4|ogg|webm|wma|mov|avi|wmv|flv|swf|xml|js|json|css|less|sass)$/i) && lqx.settings.tracking.downloads) {
							jQuery(elem).click(function(e){
								// prevent default
								e.preventDefault ? e.preventDefault() : e.returnValue = !1;
								var url = elem.href;
								var loc = elem.protocol + '//' + elem.hostname + elem.pathname + elem.search;
								var page = elem.pathname + elem.search;
								var title = 'Download: ' + page;
								if(jQuery(elem).attr('title')) {
									title = jQuery(elem).attr('title');
								}
								ga('send', {
									'hitType': 'pageview', 
									'location' : loc,
									'page' : page,
									'title' : title,
									'hitCallback' : function(){ window.location.href = url; } // regarless of target value link will open in same link, otherwise it is blocked by browser
								});
							});
						}
					}
				
				}
			});
			
		}
		
	
		// track scroll depth
		if(lqx.settings.tracking.scrolldepth){
			
			// get the initial scroll position
			lqx.vars.scrollDepthMax = Math.ceil(((jQuery(window).scrollTop() + jQuery(window).height()) / jQuery(document).height()) * 10) * 10;
			
			// add listener to scrollthrottle event
			jQuery(window).on('scrollthrottle', function(){
				// capture the hightest scroll point, stop calculating once reached 100
				if(lqx.vars.scrollDepthMax < 100) {
					lqx.vars.scrollDepthMax = Math.max(lqx.vars.scrollDepthMax, Math.ceil(((jQuery(window).scrollTop() + jQuery(window).height()) / jQuery(document).height()) * 10) * 10);
					if(lqx.vars.scrollDepthMax > 100) lqx.vars.scrollDepthMax = 100;
				}
			});
			
			// add listener to page unload
			jQuery(window).on('unload', function(){
				
				ga('send', {
					'hitType' : 'event', 
					'eventCategory' : 'Scroll Depth',
					'eventAction' : lqx.vars.scrollDepthMax,
					'nonInteraction' : true
				});				
				
			});					
			
		}
		
		// track photo galleries
		if(lqx.settings.tracking.photogallery){
			jQuery('html').on('click', 'a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox], a[data-featherlight-image]', function(){
				// send event for gallery opened
				ga('send', {
					'hitType': 'event', 
					'eventCategory' : 'Photo Gallery',
					'eventAction' : 'Open'
				});
			
			});
			
			jQuery('html').on('load', 'img.lb-image', function(){
				// send event for image displayed
				ga('send', {
					'hitType': 'event', 
					'eventCategory' : 'Photo Gallery',
					'eventAction' : 'Display',
					'eventLabel' : jQuery(this).attr('src')
				});
			
			});

		}
		
		// track video
		if(lqx.settings.tracking.video){
			
			// load youtube iframe api
			var tag = document.createElement('script');
			tag.src = "https://www.youtube.com/iframe_api";
			tag.onload = function(){lqx.vars.youTubeIframeAPIReady = true;};
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			
			// set listeners for vimeo videos
			if (window.addEventListener) {
				window.addEventListener('message', lqx.vimeoReceiveMessage, false);
			} 
			else {
				window.attachEvent('onmessage', lqx.vimeoReceiveMessage, false);
			}
			
			// initialize lqx players objects
			lqx.vars.youtubePlayers = {};
			lqx.vars.vimeoPlayers = {};
			
			// detect if there are any youtube or vimeo videos, activate js api and add id
			jQuery('iframe').each(function(){
				
				var elem = jQuery(this);
				// init js api for video player
				lqx.initVideoPlayerAPI(elem);
											 
			});

		}

		// track active time
		if(lqx.settings.tracking.activetime) {
			// add listener to page unload
			jQuery(window).on('unload', function(){
				
				ga('send', {
					'hitType' : 'event', 
					'eventCategory' : 'User Active Time',
					'eventAction' : 'Percentage',
					'eventValue' : parseInt(100 * lqx.vars.userActive.activeTime / (lqx.vars.userActive.activeTime + lqx.vars.userActive.inactiveTime)),
					'nonInteraction' : true
				});
				
				ga('send', {
					'hitType' : 'event', 
					'eventCategory' : 'User Active Time',
					'eventAction' : 'Active Time (ms)',
					'eventValue' : parseInt(lqx.vars.userActive.activeTime),
					'nonInteraction' : true
				});
				
				ga('send', {
					'hitType' : 'event', 
					'eventCategory' : 'User Active Time',
					'eventAction' : 'Inactive Time (ms)',
					'eventValue' : parseInt(lqx.vars.userActive.inactiveTime),
					'nonInteraction' : true
				});
				
			});
		}

	},

	// handle mutation for featherlight gallery, and send the ga data if a new image is loaded by detecting new added image and pass on the src attribute value
	featherlightMutationHandler: function(mutRec) {
		jQuery(mutRec.addedNodes).each(function(){
			var elem = jQuery(this);
			var src = elem.attr('src');

			if (typeof elem.prop('tagName') !== 'undefined' && elem.hasClass('featherlight-image')){
				var tag = elem.prop('tagName').toLowerCase();

				if (tag == 'img' && typeof src != 'undefined'){
					// send event for image displayed
					ga('send', {
						'hitType': 'event', 
						'eventCategory' : 'Photo Gallery',
						'eventAction' : 'Display',
						'eventLabel' : jQuery(this).attr('src')
					});
				}
			}
		});
	},

	// handle video players added dynamically
	videoPlayerMutationHandler : function(mutRec) {
		
		jQuery(mutRec.addedNodes).each(function(){
			
			var elem = jQuery(this);
			if (typeof elem.prop('tagName') !== 'undefined'){
				var tag = elem.prop('tagName').toLowerCase();
				if (tag == 'iframe') {
					// init js api for video player
					lqx.initVideoPlayerAPI(elem);
				}	    		
			}
		});
		
	},

	// initialize the js api for youtube and vimeo players
	initVideoPlayerAPI : function(elem) {

		var src = elem.attr('src');
		var playerId = elem.attr('id');
		
		if(typeof src != 'undefined') {
			// check youtube players
			if (src.indexOf('youtube.com/embed/') != -1) {
				// add id if it doesn't have one
				if (typeof playerId == 'undefined') {
					playerId = 'youtubePlayer' + (Object.keys(lqx.vars.youtubePlayers).length);
					elem.attr('id', playerId);
				}
				
				// reload with API support enabled
				if (src.indexOf('enablejsapi=1') == -1) {
					var urlconn = '&';
					if (src.indexOf('?') == -1) {
						urlconn = '?';
					}
					elem.attr('src', src + urlconn + 'enablejsapi=1&version=3');
				}

				// add to list of players
				if(typeof lqx.vars.youtubePlayers[playerId] == 'undefined') {
					lqx.vars.youtubePlayers[playerId] = {};
					
					// add event callbacks to player
					onYouTubeIframeAPIReady();
				}
			}
			
			// check vimeo players
			if(src.indexOf('player.vimeo.com/video/') != -1) {
				// add id if it doesn't have one
				if (typeof playerId == 'undefined') {
					playerId = 'vimeoPlayer' + (Object.keys(lqx.vars.vimeoPlayers).length);
					elem.attr('id', playerId);
				}
				
				// reload with API support enabled
				if (src.indexOf('api=1') == -1) {
					var urlconn = '&';
					if (src.indexOf('?') == -1) {
						urlconn = '?';
					}
					elem.attr('src', src + urlconn + 'api=1&player_id=' + playerId);
				}

				// add to list of players
				if(typeof lqx.vars.vimeoPlayers[playerId] == 'undefined') {
					lqx.vars.vimeoPlayers[playerId] = {};
				}
				
			}
		}
	},
	
	youtubePlayerReady : function(e, playerId){
		// check if iframe still exists
		if(jQuery('#' + playerId).length) {
			if(typeof lqx.vars.youtubePlayers[playerId].playerObj.getPlayerState != 'function') {
				//setTimeout(function(){lqx.youtubePlayerReady(e, playerId)}, 100);
			}
			else {
				if(typeof lqx.vars.youtubePlayers[playerId].progress == 'undefined') {
					// set player object variables
					lqx.vars.youtubePlayers[playerId].progress = 0;
					lqx.vars.youtubePlayers[playerId].start = false;
					lqx.vars.youtubePlayers[playerId].complete = false;

					// get video data
					var videoData = lqx.vars.youtubePlayers[playerId].playerObj.getVideoData();
					lqx.vars.youtubePlayers[playerId].title = videoData['title'];
					lqx.vars.youtubePlayers[playerId].duration = lqx.vars.youtubePlayers[playerId].playerObj.getDuration();

					if(!lqx.vars.youtubePlayers[playerId].start) lqx.youtubePlayerStateChange(e, playerId);
				}
			}
		}
		else {
			// iframe no longer exists, remove it from array
			delete lqx.vars.youtubePlayers[playerId];
		}
	},

	youtubePlayerStateChange : function(e, playerId){
		// check if iframe still exists
		if(jQuery('#' + playerId).length) {
			// player events:
			// -1 (unstarted, player ready)
			// 0 (ended)
			// 1 (playing)
			// 2 (paused)
			// 3 (buffering)
			// 5 (video cued / video ready)
			var label;
			
			// video ended, make sure we track the complete event just once
			if(lqx.vars.youtubePlayers[playerId].playerObj.getPlayerState() == 0 && !lqx.vars.youtubePlayers[playerId].complete) {
				label = 'Complete';
				lqx.vars.youtubePlayers[playerId].complete = true;
			}
			
			// video playing
			if(lqx.vars.youtubePlayers[playerId].playerObj.getPlayerState() == 1) {
				
				// recursively call this function in 1s to keep track of video progress
				lqx.vars.youtubePlayers[playerId].timer = setTimeout(function(){lqx.youtubePlayerStateChange(e, playerId)}, 1000);
				
				// if this is the first time we get the playing status, track it as start
				if(!lqx.vars.youtubePlayers[playerId].start){
					label = 'Start';
					lqx.vars.youtubePlayers[playerId].start = true;
				}
				
				else {
					
					currentTime = lqx.vars.youtubePlayers[playerId].playerObj.getCurrentTime();

					if(Math.ceil( Math.ceil( (currentTime / lqx.vars.youtubePlayers[playerId].duration) * 100 ) / 10 ) - 1 > lqx.vars.youtubePlayers[playerId].progress){
						
						lqx.vars.youtubePlayers[playerId].progress = Math.ceil( Math.ceil( (currentTime / lqx.vars.youtubePlayers[playerId].duration) * 100 ) / 10 ) - 1;
						
						if(lqx.vars.youtubePlayers[playerId].progress != 10){
							label = (lqx.vars.youtubePlayers[playerId].progress * 10) + '%';
						}
						
						else {
							clearTimeout(lqx.vars.youtubePlayers[playerId].timer);
						}
					}
				}
			}

			// video buffering
			if(lqx.vars.youtubePlayers[playerId].playerObj.getPlayerState() == 3) {
				// recursively call this function in 1s to keep track of video progress
				lqx.vars.youtubePlayers[playerId].timer = setTimeout(function(){lqx.youtubePlayerStateChange(e, playerId)}, 1000);
			}
			
			// send event to GA if label was set
			if(label){
				lqx.videoTrackingEvent(playerId, label, lqx.vars.youtubePlayers[playerId].title, lqx.vars.youtubePlayers[playerId].progress * 10);
			}
		}
		else {
			// iframe no longer exists, remove it from array
			delete lqx.vars.youtubePlayers[playerId];
		}

	},
	
	vimeoReceiveMessage : function(e){
		
		// check message is coming from vimeo
		if((/^https?:\/\/player.vimeo.com/).test(e.origin)) {
			// parse the data
			var data = JSON.parse(e.data);
			player = lqx.vars.vimeoPlayers[data.player_id];
			var label;
			
			switch (data.event) {
				
				case 'ready':
					// set player object variables
					player.progress = 0;
					player.start = false;
					player.complete = false;
					
					// set the listeners
					lqx.vimeoSendMessage(data.player_id, e.origin, 'addEventListener', 'play');
					lqx.vimeoSendMessage(data.player_id, e.origin, 'addEventListener', 'finish');
					lqx.vimeoSendMessage(data.player_id, e.origin, 'addEventListener', 'playProgress');
					
					break;
				
				case 'play':
					// if this is the first time we get the playing status, track it as start
					if(!player.start){
						label = 'Start';
						player.start = true;
					}
					
					break;
					
				case 'playProgress':
					
					if(Math.ceil( Math.ceil( (data.data.percent) * 100 ) / 10 ) - 1 > player.progress) {
						
						player.progress = Math.ceil( Math.ceil( (data.data.percent) * 100 ) / 10 ) - 1;
						
						if(player.progress != 10){
							label = (player.progress * 10) + '%';
						}
						 
					}
					
					break;
					
				case 'finish':
					// make sure we capture finish event just once
					if(!player.complete) {
						label = 'Complete';
						player.complete = true;
					}
					
			}
			
			if(label){
				lqx.videoTrackingEvent(data.player_id, label, 'No title', player.progress * 10); // vimeo doesn't provide a mechanism for getting the video title
			}
			
		}
		
		
		
	},
	
	vimeoSendMessage : function(playerId, origin, action, value){
		
		var data = {
			method: action
		};

		if (value) {
			data.value = value;
		}

		document.getElementById(playerId).contentWindow.postMessage(JSON.stringify(data), origin);
		
	},
	
	videoTrackingEvent : function(playerId, label, title, value) {
		ga('send', {
			'hitType': 'event', 
			'eventCategory' : 'Video',
			'eventAction' : label,
			'eventLabel' : title + ' (' + jQuery('#' + playerId).attr('src').split('?')[0] + ')',
			'eventValue': value
		});

	},

	initMobileMenu : function() {
		
		// add listeners to A tags in mobile menu
		jQuery('body').on('click', '.horizontal ul.menu a, .vertical ul.menu a, .slide-out ul.menu a', function(e){
			// prevent links to work until we 
			e.preventDefault();
			lqx.mobileMenu(this);
		});

		// prevent propagation of clicks
		jQuery('body').on('click', '.horizontal, .vertical, .slide-out', function(e){
			// do not propagate click events outside menus
			e.stopPropagation();
		});

		// open/close slide-out menu
		jQuery('body').on('click', '.slide-out .menu-control', function(){
			var elem = jQuery(this).parent();
			if(jQuery(elem).hasClass('open')) {
				jQuery(elem).removeClass('open');
			}
			else {
				jQuery(elem).addClass('open')
			}
		});

		// when clicking outside the menus, hide the menus if visible and close the slide out menu if open
		jQuery('body').click(function() {
			jQuery('.horizontal, .vertical, .slide-out').find('ul.menu li.open').removeClass('open');
			jQuery('.slide-out.open').removeClass('open');
		});

	},
	
	mobileMenu : function(elem) {
		/*
		 * keep in mind the various joomla classes for menu items:
		 * 
		 * .parent  - is applied when the menu item is parent to other menu items
		 * .deeper  - is applied when a sub-menu was rendered in the html
		 * .active  - is applied to the whole pathway of active menu items
		 * .current - is applied only to the specific menu item of the current page
		 * 
		 */
		
		var li = jQuery(elem).parent();
		var url = elem.href;
		var target = (elem.target && !elem.target.match(/^_(self|parent|top)$/i)) ? elem.target : false;
		var go = function(){ target ? window.open(url, target) : window.location.href = url; };
		
		// check if there is a deeper menu
		if(jQuery(li).hasClass('deeper')) {
			if(jQuery(li).hasClass('open')) {
				// it is already open, follow the link
				go();
			}
			else {
				// close any siblings (and their children) and then open itself
				jQuery(li).siblings('li.open').find('li.open').removeClass('open');
				jQuery(li).siblings('li.open').removeClass('open');
				jQuery(li).addClass('open');
			}
		}
		else {
			// there isn't a sub-menu, follow the link
			go();
		}
	},
	
	// create a custom mutation observer that will trigger any needed functions
	initMutationObserver : function(){
		// handle videos that may be loaded dynamically
		var mo = window.MutationObserver || window.WebKitMutationObserver;
		
		// check for mutationObserver support , if exists, user the mutation observer object, if not use the listener method.
		if (typeof mo !== 'undefined'){
			lqx.mutationObserver = new mo(lqx.mutationHandler);
			lqx.mutationObserver.observe(jQuery('html')[0], { childList: true, characterData: true, attributes: true, subtree: true });
		} else {

			// video listener
			if(lqx.settings.tracking.video){
				jQuery('html').on('DOMNodeInserted', 'iframe', function(e) {
					lqx.initVideoPlayerAPI(jQuery(e.currentTarget));
				});
			}

			// photogallery listener
			if(lqx.settings.tracking.photogallery){			
				jQuery('html').on('DOMNodeInserted', 'img.featherlight-image', function(e) {
					var src = jQuery(e.currentTarget).attr('src');
					if (typeof src != 'undefined'){
						// send event for image displayed
						ga('send', {
							'hitType': 'event', 
							'eventCategory' : 'Photo Gallery',
							'eventAction' : 'Display',
							'eventLabel' : src
						});
					}
				});
			}

		}
	},
	
	// mutation observer handler
	mutationHandler : function(mutRecs) {
		mutRecs.forEach(function(mutRec){
			
			// handle type of mutation
			switch(mutRec.type) {
				
				case 'childList':
					// handle addedNodes
					if (mutRec.addedNodes.length > 0) {
						// send mutation record to individual handlers
						lqx.videoPlayerMutationHandler(mutRec);
						lqx.featherlightMutationHandler (mutRec);
					}
					
					// handle removedNodes
					/*if (mutRec.removedNodes.length > 0) {
					}*/
					break;
					
				case 'attributes':
					
					break;
				
				case 'characterData':
					
					break;
			}
			
		});
	},
	
	// image load error and complete attributes
	initImgLoadAttr : function() {
		jQuery('body').on('load', 'img', function(){
			jQuery(this).attr('loadcomplete','');
		});
		jQuery('body').on('error', 'img', function(){
			jQuery(this).attr('loaderror','');
		});
	},

	// lyqbox: functionality for lightbox, galleries, and alerts
	lyqBox : {

		init: function() {
			if (jQuery('[data-lyqbox]').length) {
				//console.log('in promise');
				lqx.lyqBox.album = [];
				lqx.lyqBox.currentImageIndex = void 0;
				lqx.lyqBox.enable();
				lqx.lyqBox.build();

				// to handle alertbox and hash url at the same time, we prioritize the alertbox first.
				// using promise, we make sure the alertbox shows first, and show the hash url content after the promise is done (alertbox is closed)
				var alertPromise = lqx.lyqBox.alert(jQuery('[data-lyqbox-type=alert]'));

				// check hash after promise is resolved/reject. Rejected is a valid return due to alerbox already shown before/cookie found.
				alertPromise.always(function afterAlertCheck() {
					lqx.lyqBox.hash();
				});
			} 
		},

		// show the hash url content
		hash: function() {
			if (window.location.hash.substr(1) != "") {
				// get hash value and display the appropriate content
				var contentData = window.location.hash.substr(1).split("_");

				if (jQuery('[data-lyqbox=' + contentData[0] + '][data-lyqbox-alias=' + contentData[1] + ']').length){
					lqx.lyqBox.start(jQuery('[data-lyqbox=' + contentData[0] + '][data-lyqbox-alias=' + contentData[1] + ']'));
				}
			} 
		},

		// show alertbox if found.
		alert: function(alertbox) {
			var deferred = jQuery.Deferred();
			// assume that there is only one alertbox at any given time.
			if (alertbox.length == 1) {
				// check if a cookie for this alertbox exists, if so return deferred reject.
				var cookieName = 'lyqbox-alert-' + alertbox.attr('data-lyqbox');
				var alertCookieFound = localStorage.getItem(cookieName);
				if (alertCookieFound) {
					deferred.reject();
				}
				// if no cookie found, show the alertbox
				else {
					// show the alertbox
					lqx.lyqBox.start(alertbox);

					// add listener to the close button to save the cookie and return deferred resolved
					jQuery('.lyqbox .close').on('click', function alertBoxCloseButtonClicked() {
						var cookieName = 'lyqbox-alert-' + lqx.lyqBox.album[lqx.lyqBox.currentImageIndex].albumId;
						localStorage.setItem(cookieName, 1);

						deferred.resolve();
						lqx.lyqBox.end();
						return false;
					});
				}
			}
			// if no alertbox is found, return deferred reject to make way to display content for hash url if any found
			else {
				deferred.reject();
			}
			return deferred.promise();
		},

		// Loop through anchors and areamaps looking for either data-lightbox attributes or rel attributes
		// that contain 'lightbox'. When these are clicked, start lightbox.
		enable: function() {
			// we initialize everything
			jQuery('body').on('click', '[data-lyqbox]', function(event) {
				jQuery('.lyqbox').addClass('open');
				lqx.lyqBox.start(jQuery(event.currentTarget));
				return false;
			});

		},

		build: function() {
			// append html structure
			jQuery(lqx.settings.lyqBox.lyqboxHTMLContent).appendTo(jQuery('body'));

			// assign the html container class to namespace variable
			lqx.lyqBox.overlay = jQuery('.lyqbox');
			
			// assign active content container to the first .content box
			lqx.lyqBox.containerActive = lqx.lyqBox.overlay.find('.content-wrapper').first().addClass('active');

			// disable click on content by default
			lqx.lyqBox.overlay.find('.content').on('click', function() {
				return false;
			});	        

			// Attach event handlers to the newly minted DOM elements
			lqx.lyqBox.overlay.on('click', function() {
				// if this is alert, do nothing, we only want alert to go away on the close box/button.
				if (lqx.lyqBox.album[lqx.lyqBox.currentImageIndex].type == 'alert')
					return false;

				// else exit the lightbox
				lqx.lyqBox.end();
				return false;
			});

			// prev button click handling
			lqx.lyqBox.overlay.find('.prev').on('click', function() {
				if (lqx.lyqBox.currentImageIndex === 0) {
					lqx.lyqBox.changeContent(lqx.lyqBox.album.length - 1);
				} else {
					lqx.lyqBox.changeContent(lqx.lyqBox.currentImageIndex - 1);
				}
				return false;
			});

			// next button click handling
			lqx.lyqBox.overlay.find('.next').on('click', function() {
				if (lqx.lyqBox.currentImageIndex === lqx.lyqBox.album.length - 1) {
					lqx.lyqBox.changeContent(0);
				} else {
					lqx.lyqBox.changeContent(lqx.lyqBox.currentImageIndex + 1);
				}
				return false;
			});

			// close button click handling
			lqx.lyqBox.overlay.find('.close').on('click', function() {
				// disable the close button for alertbox, cookie save handling to prevent the alert box to reappear will be done on the deferred section on alert function to make sure in the case alert and hashurl found, 
				// that the alert box is closed properly before showing a hash url content.
				if (lqx.lyqBox.album[lqx.lyqBox.currentImageIndex].type == 'alert')
					return false;

                lqx.lyqBox.stopVideo(lqx.lyqBox.album[lqx.lyqBox.currentImageIndex].type);

				// else close the lightbox
				lqx.lyqBox.end();
				return false;
			});

		},

        // special function remove video iframe from DOM, otherwise it will still play in the background
        stopVideo: function(type) {
            if (type == 'video') {
                lqx.lyqBox.containerActive.find('.content.video .video-container iframe').remove();
            }
        },        



		// Show overlay and lightbox. If the image is part of a set, add siblings to album array.
		start: function(data) {
			lqx.lyqBox.album = [];
			var currentIndex = 0;

			function addToAlbum(data) {
				lqx.lyqBox.album.push({
					albumId: data.attr('data-lyqbox'),
					type: data.attr('data-lyqbox-type'),
					link: data.attr('data-lyqbox-url'),
					title: data.attr('data-lyqbox-title'),
					caption: data.attr('data-lyqbox-caption'),
					credit: data.attr('data-lyqbox-credit'),
					class: data.attr('data-lyqbox-class'),
					alias: data.attr('data-lyqbox-alias'),
					html: data.attr('data-lyqbox-html'),
				});
			}

			var items;

			// build the album, the object which contains all values passed from the attribute 
			var datalyqboxValue = data.attr('data-lyqbox');
			if (datalyqboxValue) {
				items = jQuery(data.prop('tagName') + '[data-lyqbox="' + datalyqboxValue + '"]');

				for (var i = 0; i < items.length; i = ++i) {
					addToAlbum(jQuery(items[i]));
					// 
					if (items[i] === data[0]) {
						currentIndex = i;
					}
				}
			}

			// change the content to item at index
			lqx.lyqBox.changeContent(currentIndex);
		},

		loadHTML: function(url) {
			var deferred = jQuery.Deferred();
			// we are using load so one can specify a target with: url.html #targetelement
			var $container = jQuery('<div></div>').load(url, function(response, status) {
				if (status !== "error") {
					deferred.resolve($container.contents());
				}
				deferred.fail();
			});
			return deferred.promise();
		},

		// change content, for now we have 3 types, image, iframe and HTML.
		changeContent: function(index) {
			lqx.lyqBox.disableKeyboardNav();
			lqx.lyqBox.overlay.addClass("open");

			// deferred var to be used on alert type lyqbox only, just in case it's loading HTML content from a file
			var promise = jQuery.Deferred();

			// process the new content
			switch (lqx.lyqBox.album[index].type) {
				case 'image':
					var image = jQuery('<img />');
					var preloader = new Image();
					preloader.src = lqx.lyqBox.album[index].link;
					preloader.onload = function() {
						var preloaderObject;
						image.attr('src', lqx.lyqBox.album[index].link);

						preloaderObject = jQuery(preloader);

						lqx.lyqBox.updateContent(image, index, lqx.lyqBox.album[index].type);
						window.location.hash = lqx.lyqBox.album[lqx.lyqBox.currentImageIndex].albumId + '_' + lqx.lyqBox.album[lqx.lyqBox.currentImageIndex].alias;

						// important line of code to make sure opacity is computed and applied as a starting value to the element so that the css transition works.
						window.getComputedStyle(image[0]).opacity;
					}

					break;

				case 'video':
					var video = jQuery('<iframe></iframe>');
					video.attr('src', lqx.lyqBox.album[index].link);

					lqx.lyqBox.updateContent('<div class="video-container">' + video.prop('outerHTML') + '</div>', index, lqx.lyqBox.album[index].type);

					window.location.hash = lqx.lyqBox.album[lqx.lyqBox.currentImageIndex].albumId + '_' + lqx.lyqBox.album[lqx.lyqBox.currentImageIndex].alias;
					break;

				case 'html':
				case 'alert':
					// note that the alert lyqbox can grab html content from a file, put the file URL inside the data-lyqbox-url attribute
					// OR can grab the html content from string, put the string inside the data-lyqbox-html attribute
					// the priority is given to the data-lyqbox-url attribute first, if this is blank, then data-lyqbox-html will be processed instead.

					// check if url is not empty
					if (lqx.lyqBox.album[index].link != "" && typeof lqx.lyqBox.album[index].link !== 'undefined' ) {
						promise = lqx.lyqBox.loadHTML(lqx.lyqBox.album[index].link);

						promise.done(function htmlLoaded(htmlResult) {
							if (htmlResult != '') 
								lqx.lyqBox.updateContent(htmlResult, index, lqx.lyqBox.album[index].type);
						});
					} else {
						lqx.lyqBox.updateContent(lqx.lyqBox.album[index].html, index, lqx.lyqBox.album[index].type);
					}
					break;

				default:
					break;
			}
		},

		updateContent: function(content, index, type) {
            lqx.lyqBox.stopVideo(type);
			lqx.lyqBox.overlay.find('.content-wrapper').not('.active').addClass('active').find('.content').removeClass().addClass('content ' + type).empty().append(content);
			lqx.lyqBox.containerActive.removeClass('active');
			lqx.lyqBox.containerActive = lqx.lyqBox.overlay.find('.content-wrapper.active');
			lqx.lyqBox.currentImageIndex = index;
			lqx.lyqBox.updateUIandKeyboard();
		},

		// Display the image and its details and begin preload neighboring images.
		updateUIandKeyboard: function() {
			lqx.lyqBox.updateUI();
			lqx.lyqBox.enableKeyboardNav();
		},

		// Display caption, image number, and closing button.
		updateUI: function() {

			// alert type will hide title, caption and credit????
			if(lqx.lyqBox.album[lqx.lyqBox.currentImageIndex].type != 'alert' ) {
				// display title
				if (typeof lqx.lyqBox.album[lqx.lyqBox.currentImageIndex].title !== 'undefined' &&
					lqx.lyqBox.album[lqx.lyqBox.currentImageIndex].title !== '') {
					lqx.lyqBox.overlay.find('.title')
						.html(lqx.lyqBox.album[lqx.lyqBox.currentImageIndex].title);
				} else  {
					lqx.lyqBox.overlay.find('.title').html('');
				}
				// display caption
				if (typeof lqx.lyqBox.album[lqx.lyqBox.currentImageIndex].caption !== 'undefined' &&
					lqx.lyqBox.album[lqx.lyqBox.currentImageIndex].caption !== '') {
					lqx.lyqBox.overlay.find('.caption')
						.html(lqx.lyqBox.album[lqx.lyqBox.currentImageIndex].caption);
				} else  {
					lqx.lyqBox.overlay.find('.caption').html('');
				}
				// display credit
				if (typeof lqx.lyqBox.album[lqx.lyqBox.currentImageIndex].credit !== 'undefined' &&
					lqx.lyqBox.album[lqx.lyqBox.currentImageIndex].credit !== '') {
					lqx.lyqBox.overlay.find('.credit')
						.html(lqx.lyqBox.album[lqx.lyqBox.currentImageIndex].credit);
				} else  {
					lqx.lyqBox.overlay.find('.credit').html('');
				}

				// display counter (current and total) and nav only if gallery
				if (lqx.lyqBox.album.length > 1)  {
					lqx.lyqBox.overlay.find('.current').text(lqx.lyqBox.currentImageIndex + 1);
					lqx.lyqBox.overlay.find('.total').text(lqx.lyqBox.album.length);
				} else  {
					lqx.lyqBox.overlay.find('.prev,.next').addClass('hide');
					lqx.lyqBox.overlay.find('.counter').addClass('hide');
				}
			} else {
				lqx.lyqBox.overlay.find('.prev,.next').addClass('hide');
				lqx.lyqBox.overlay.find('.counter').addClass('hide');
			}
		},

		enableKeyboardNav: function() {
			jQuery(document).on('keyup.keyboard', jQuery.proxy(lqx.lyqBox.keyboardAction, lqx.lyqBox));
		},

		disableKeyboardNav: function() {
			jQuery(document).off('.keyboard');
		},

		keyboardAction: function(event) {
			var KEYCODE_ESC = 27;
			var KEYCODE_LEFTARROW = 37;
			var KEYCODE_RIGHTARROW = 39;

			var keycode = event.keyCode;
			var key = String.fromCharCode(keycode).toLowerCase();
			if (keycode === KEYCODE_ESC || key.match(/x|o|c/)) {
				lqx.lyqBox.end();
			} else if (keycode === KEYCODE_LEFTARROW) {
				if (lqx.lyqBox.currentImageIndex === 0) {
					lqx.lyqBox.changeContent(lqx.lyqBox.album.length - 1);
				} else {
					lqx.lyqBox.changeContent(lqx.lyqBox.currentImageIndex - 1);
				}
			} else if (keycode === KEYCODE_RIGHTARROW) {
				if (lqx.lyqBox.currentImageIndex === lqx.lyqBox.album.length - 1) {
					lqx.lyqBox.changeContent(0);
				} else {
					lqx.lyqBox.changeContent(lqx.lyqBox.currentImageIndex + 1);
				}
			}
		},

		// This only works in Chrome 9, Firefox 4, Safari 5, Opera 11.50 and in IE 10
		removeHash: function() { 
			var scrollV, scrollH, loc = window.location;
			if ("pushState" in history)
				history.pushState("", document.title, loc.pathname + loc.search);
			else {
				// Prevent scrolling by storing the page's current scroll offset
				scrollV = document.body.scrollTop;
				scrollH = document.body.scrollLeft;

				loc.hash = "";

				// Restore the scroll offset, should be flicker free
				document.body.scrollTop = scrollV;
				document.body.scrollLeft = scrollH;
			}
		},

		// Closing time. :-(
		end: function() {
			lqx.lyqBox.disableKeyboardNav();
			lqx.lyqBox.overlay.removeClass("open");
			lqx.lyqBox.removeHash();
		},

	},

	// trigger events for user active/inactive and count active time
	initUserActive : function()	{

		// initialize the variables
		lqx.vars.userActive = {
			active: true,		// is user currently active
			timer: false,		// setTimeout timer
			throttle: false,	// is throttling currently active
			lastChangeTime: (new Date()).getTime(),
			activeTime: 0,
			inactiveTime: 0,
		};

		// add listener to common user action events
		jQuery(window).on('orientationchange resize focusin', function(){lqx.userActive();});
		jQuery(document).on('mousedown mousemove mouseup wheel keydown keypress keyup touchstart touchmove touchend', function(){lqx.userActive();});
		
		// add listener for window on focus out, become inactive immediately
		jQuery(window).on('focusout', function(){lqx.userInactive();});

		// refresh active and inactive time counters
		var timer = setInterval(function(){
			// Stop updating if maxTime is reached
			if(lqx.vars.userActive.activeTime + lqx.vars.userActive.inactiveTime >= lqx.vars.userActive.maxTime) clearInterval(timer);
			// Update counters
			else {
				if(lqx.vars.userActive.active) {
					// update active time
					lqx.vars.userActive.activeTime += (new Date()).getTime() - lqx.vars.userActive.lastChangeTime;
				}
				else {
					// update inactive time
					lqx.vars.userActive.inactiveTime += (new Date()).getTime() - lqx.vars.userActive.lastChangeTime;
				}
				// update last change time
				lqx.vars.userActive.lastChangeTime = (new Date()).getTime();
			}
		}, lqx.settings.userActive.refresh);
		
		// initialize active state
		lqx.userActive();

	},

	// function called to indicate user is currently active (heartbeat)
	userActive : function() {
		// if no throttle
		if(!lqx.vars.userActive.throttle) {
			lqx.vars.userActive.throttle = true;
			setTimeout(function(){lqx.vars.userActive.throttle = false;}, lqx.settings.userActive.throttle);
			// when changing from being inactive
			if(!lqx.vars.userActive.active) {
				// set state to active
				lqx.vars.userActive.active = true;
				// update inactive time
				lqx.vars.userActive.inactiveTime += (new Date()).getTime() - lqx.vars.userActive.lastChangeTime;
				// update last change time
				lqx.vars.userActive.lastChangeTime = (new Date()).getTime();
			}

			// set state to active
			lqx.vars.userActive.active = true;

			// after idle time turn inactive
			clearTimeout(lqx.vars.userActive.timer);
			lqx.vars.userActive.timer = setTimeout(function(){lqx.userInactive();}, lqx.settings.userActive.idleTime);
		}
	},

	// function called to indicate the user is currently inactive
	userInactive : function() {
		// set state to inactive
		lqx.vars.userActive.active = false;
		// clear timer
		clearTimeout(lqx.vars.userActive.timer);
		// add active time
		lqx.vars.userActive.activeTime += (new Date()).getTime() - lqx.vars.userActive.lastChangeTime;
		// update last change time
		lqx.vars.userActive.lastChangeTime = (new Date()).getTime();
	},

	// handles the google analytics page view event, setting first custom parameters
	gaReady : function(tracker) {
		// execute functions to set custom parameters
		jQuery.Deferred().done(
			function(){
				// create commands
				if(lqx.settings.ga.createParams && typeof lqx.settings.ga.createParams == 'object') {
					var params = lqx.settings.ga.createParams;
					Object.keys(params).forEach(function(tracker){
						if(tracker == 'default') ga('create', params[tracker].trackingId, params[tracker].cookieDomain, params[tracker].fieldsObject);
						else ga('create', params[tracker].trackingId, params[tracker].cookieDomain, tracker, params[tracker].fieldsObject);
					});
				}
			},
			function(){
				// set commands
				if(lqx.settings.ga.setParams && typeof lqx.settings.ga.setParams == 'object') {
					var params = lqx.settings.ga.setParams;
					Object.keys(params).forEach(function(tracker){
						var cmd = 'set';
						if(tracker != 'default') cmd = tracker + '.set';
						Object.keys(params[tracker]).forEach(function(fieldName){
							ga(cmd, fieldName, params[tracker][fieldName]);
						});
					});
				}
				// require commands
				if(lqx.settings.ga.requireParams && typeof lqx.settings.ga.requireParams == 'object') {
					var params = lqx.settings.ga.requireParams;
					Object.keys(params).forEach(function(tracker){
						var cmd = 'require';
						if(tracker != 'default') cmd = tracker + '.require';
						params[tracker].forEach(function(elem){
							ga(cmd, elem.pluginName, elem.pluginOptions);
						});
					});
				}
				// provide commands
				if(lqx.settings.ga.provideParams && typeof lqx.settings.ga.provideParams == 'object') {
					var params = lqx.settings.ga.provideParams;
					Object.keys(params).forEach(function(tracker){
						var cmd = 'provide';
						if(tracker != 'default') cmd = tracker + '.provide';
						params[tracker].forEach(function(elem){
							ga(cmd, elem.pluginName, elem.pluginConstructor);
						});
					});
				}
				// a/b testing settings
				if(lqx.settings.ga.abTestName != null && lqx.settings.ga.abTestNameDimension != null && lqx.settings.ga.abTestGroupDimension != null) {
					// get a/b test group cookie
					var abTestGroup = lqx.cookie('abTestGroup');
					console.log(abTestGroup);
					if(abTestGroup == null) {
						// set a/b test group
						if(Math.random() < 0.5) abTestGroup = 'A';
						else abTestGroup = 'B';
						lqx.cookie('abTestGroup', abTestGroup, {maxAge: 30*24*60*60, path: '/'});
					}
					// set body attribute that can be used by css and js
					jQuery('body').attr('data-abtest', abTestGroup);
					// set the GA dimensions
					ga('set', 'dimension' + lqx.settings.ga.abTestNameDimension, lqx.settings.ga.abTestName);
					ga('set', 'dimension' + lqx.settings.ga.abTestGroupDimension, abTestGroup);
				}
			},
			function(){
				if(typeof lqx.settings.ga.customParamsFuncs == 'function') {
					try {
						lqx.settings.ga.customParamsFuncs();
					}
					catch(e) {
						console.log(e);
					}
				}
			},
			function(){
				// send pageview
				ga('send', 'pageview');
				// initialize analytics tracking
				lqx.initTracking();
			}
		).resolve();
	},

	// parses URL parameters into lqx.vars.urlParams
	parseURLParams: function() {
		lqx.vars.urlParams = {};
		var params = window.location.search.substr(1).split('&');
		if(params.length) {
			params.forEach(function(param){
				param = param.split('=', 2);
				if(param.length == 2) lqx.vars.urlParams[param[0]] = decodeURIComponent(param[1].replace(/\+/g, " "));
				else lqx.vars.urlParams[param[0]] = null;
			});
		}
	},

	// changes all fonts to Comic Sans
	comicfyFonts: function() {
		if(typeof lqx.vars.urlParams.comicfy != 'undefined') {
			var link = document.createElement( "link" );
			link.href = lqx.vars.tmplURL + "/fonts/comicneue/comicfy.css";
			link.type = "text/css";
			link.rel = "stylesheet";
			document.getElementsByTagName('head')[0].appendChild(link);
		}
	},

	// self initialization function
	init : (function(){
		// Functions to execute when the DOM is ready
		jQuery(document).ready(function(){
			// check screen size 
			lqx.bodyScreenSize();
			// update orientation attribute in body tag
			lqx.bodyScreenOrientation();
			// geo locate
			lqx.geoLocate();
			// add image attributes for load error and load complete
			lqx.initImgLoadAttr();
			// execute some browser fixes
			lqx.browserFixes();
			// enable function logging
			lqx.initLogging();	
			// initialize mobile menu functionality
			lqx.initMobileMenu();
			// set equal height rows
			lqx.initEqualHeightRows();
			// adds image captions using alt property
			lqx.imageCaption();
			// shows a line break symbol before br elements
			lqx.lineBreakSymbol();
			// add listener to dynamically added content to the DOM
			lqx.initMutationObserver();
			// enable lyqbox;
			lqx.lyqBox.init();
			// initialize user active time tracking
			lqx.initUserActive();
			// parse URL parameters
			lqx.parseURLParams();
		});

		// Functions to execute when the page has loaded
		jQuery(window).load(function(){
			// check screen size to deal with appearing scrollbar
			lqx.bodyScreenSize();
			// set punctuation marks to hanging
			lqx.hangingPunctuation();
			// set equal height rows
			lqx.equalHeightRows();
			// Easter Egg: add ?comicfy to URL to change all fonts to Comic Sans
			lqx.comicfyFonts();
		});

		// Trigger on window scroll
		jQuery(window).scroll(function() {
			// throttling?
			if(!lqx.vars.scrollThrottle) {
				// trigger custom event 'scrollthrottle'
				jQuery(document).trigger('scrollthrottle');

				// throttling is now on
				lqx.vars.scrollThrottle = true;
				
				// set time out to turn throttling on and check screen size once more
				setTimeout(function () { 
					// trigger custom event 'scrollthrottle'
					jQuery(document).trigger('scrollthrottle');

					// throttling is now off
					lqx.vars.scrollThrottle = false; 
				}, lqx.settings.scrollThrottle.duration);
			}
		});

		// Trigger on window resize
		jQuery(window).resize(function() {
			// throttling?
			if(!lqx.vars.resizeThrottle) {
				// trigger custom event 'resizethrottle'
				jQuery(document).trigger('resizethrottle');

				// throttling is now on
				lqx.vars.resizeThrottle = true;
				
				// set time out to turn throttling on and check screen size once more
				setTimeout(function () { 
					// trigger custom event 'resizethrottle'
					jQuery(document).trigger('resizethrottle');

					// throttling is now off
					lqx.vars.resizeThrottle = false; 
				}, lqx.settings.resizeThrottle.duration);
			}
		});

		// Trigger on screen orientation change
		jQuery(window).on('orientationchange', function() {
			// check screen size and trigger 'screensizechange' event 
			lqx.bodyScreenSize();
			// update orientation attribute in body tag
			lqx.bodyScreenOrientation();
		});

		// Trigger on custom event screen size change
		jQuery(window).on('screensizechange', function() {
			// set equal height rows
			lqx.equalHeightRows();
			// set punctuation marks to hanging
			lqx.hangingPunctuation();
		});

		// Trigger on custom event scrollthrottle
		jQuery(window).on('scrollthrottle', function() {
			
		});

		// Trigger on custom event resizethrottle
		jQuery(window).on('resizethrottle', function() {
			// check screen size
			lqx.bodyScreenSize();
		});


		// Other global functions, callbacks
		// ***********************************

		// onYouTubeIframeAPIReady
		// callback function called by iframe youtube players when they are ready
		window.onYouTubeIframeAPIReady = function(){
			if(lqx.vars.youTubeIframeAPIReady && (typeof YT !== "undefined") && YT && YT.Player) {
				for(var playerId in lqx.vars.youtubePlayers) {
					if(typeof lqx.vars.youtubePlayers[playerId].playerObj == 'undefined') {
						lqx.vars.youtubePlayers[playerId].playerObj = new YT.Player(playerId, { 
							events: { 
								'onReady': function(e){ lqx.youtubePlayerReady(e, playerId) }, 
								'onStateChange': function(e){ lqx.youtubePlayerStateChange(e, playerId) } 
							}
						});
					}
				}
			} 
			else {
				// keep track how many time we have attempted, retry unless it has been more than 30secs
				lqx.vars.youTubeIframeAPIReadyAttempts++;
				if(lqx.vars.youTubeIframeAPIReadyAttempts < 120) setTimeout("onYouTubeIframeAPIReady()",250);
			}
		}

		return true;

	}())

};

// END Lyquix global object
// ***********************************
