
// ***********************************
// BEGIN Lyquix global object
// Includes Lyquix common function library and default settings
var lqx = lqx || {
	
	// default settings
	settings : {
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
		},
		equalHeightRows: {
			refreshElems: false, // refreshed the list of elements on each run
			onlyVisible: true,   // ignores non visible elements
			checkPageLoad: true, // check if there was the page load event when waiting for images
		},
		lyqBox: {
			albumLabel: '%1 of %2',
	        alwaysShowNavOnTouchDevices: false,
	        fadeDuration: 500,
	        fitImagesInViewport: true,
	        maxWidth: 1920,
	        maxHeight: 1920,
	        positionFromTop: 50,
	        resizeDuration: 700,
	        showImageNumberLabel: true,
	        wrapAround: true,
	        disableScrolling: true
		}
	},
	
	// holds working data
	vars: {
		resizeThrottle: false,  // saves current status of resizeThrottle
		scrollThrottle: false,  // saves current status of scrollThrottle
		bodyScreenSize: {
			sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
		},
	},
	
	// setOptions
	// a function for setting options for lqx (instead of manually rewriting lqx.settings)
	setOptions : function(opts) {
		if(typeof opts == 'object') {
			jQuery.extend(true, lqx.settings, opts);
		}
		return lqx.settings;
	},
	
	// function logging
	initLogging: function() {
		if(lqx.settings.logger.enable) {
			for(var i in lqx.settings.logger.namespaces) {
				lqx.addLoggingToNamespace(lqx.settings.logger.namespaces[i]);
			}
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
		
		for(var name in namespaceObject){
			var potentialFunction = namespaceObject[name];
			
			if(Object.prototype.toString.call(potentialFunction) === '[object Function]'){
				namespaceObject[name] = lqx.getLoggableFunction(potentialFunction, name, nameSpace);
			}
		}
	},
	
	getLoggableFunction : function(func, name, nameSpace) {
		return function() {
			
			console.log('LOG: executing ' + nameSpace + '.' + name + ' with arguments:' );
			console.log(arguments);
			
			return func.apply(this, arguments);
		}
	},
	
	// bodyScreenSize
	// adds an attribute "screen" to the body tag that indicates the current size of the screen
	bodyScreenSize : function() {
		var w = jQuery(window).width();
		// xs:    0 -  640
		// sm:  640 -  960
		// md:  960 - 1280
		// lg: 1280 - 1600
		// xl: 1600 -
		if(w < lqx.settings.bodyScreenSize.breakPoints[1]) s = 0;
		if(w >= lqx.settings.bodyScreenSize.breakPoints[1]) s = 1;
		if(w >= lqx.settings.bodyScreenSize.breakPoints[2]) s = 2;
		if(w >= lqx.settings.bodyScreenSize.breakPoints[3]) s = 3;
		if(w >= lqx.settings.bodyScreenSize.breakPoints[4]) s = 4;
		if(lqx.vars.bodyScreenSize.sizes[s] != lqx.vars.lastScreenSize) {
			// adjust calculated size to min and max range
			if(s < lqx.settings.bodyScreenSize.min) s = lqx.settings.bodyScreenSize.min;
			if(s > lqx.settings.bodyScreenSize.max) s = lqx.settings.bodyScreenSize.max;
			// change the body screen attribute
			jQuery('body').attr('screen',lqx.vars.bodyScreenSize.sizes[s]);
			// hack to force IE8 to take the new screen size attribute
			document.getElementsByTagName('body')[0].className = document.getElementsByTagName('body')[0].className;
			// save last screen size
			lqx.vars.lastScreenSize = lqx.vars.bodyScreenSize.sizes[s];
			// trigger custom event 'screensizechange'
			jQuery(document).trigger('screensizechange');
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
	// NOTE: don't use this as a function, as it is converted to an object on the first execution
	// list of user agen strings: http://www.webapps-online.com/online-tools/user-agent-strings/dv
	getBrowser : function(){
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
	},

	// returns the os name, type and version, and sets body classes
	// detects major desktop and mobile os: Windows, Windows Phone, Mac, iOS, Android, Ubuntu, Fedora, ChromeOS
	// based on bowser: https://github.com/ded/bowser
	// NOTE: don't use this as a function, as it is converted to an object on the first execution
	// list of user agent strings: http://www.webapps-online.com/online-tools/user-agent-strings/dv
	getOS : function() {
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
	},
	
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
		
		// check if google analytics have been loaded
		// NOTE: make sure you are using Google Universal Analytics Code:
		/*
		<script>
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		ga('create', 'UA-XXXX-Y', 'auto');
		ga('send', 'pageview');
		</script>
		*/
		if(typeof window.ga !== 'undefined'){
			
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
				
				// add listener to link
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
		        var self = this;
		        this.album = [];
		        this.currentImageIndex = void 0;
		        this.enable();
		        this.build();

		        // lyquix addition,
		        // to handle alertbox and hash url at the same time, we prioritize the alertbox first.
		        // using promise, we make sure the alertbox shows first, and show the hash url content after the promise is done (alertbox is closed)
		        var alertPromise = this.alert(jQuery('[data-lyqbox-type=alert]'));

		        // check hash after promise is resolved/reject. Rejected is a valid return due to alerbox already shown before/cookie found.
		        alertPromise.always(function afterAlertCheck() {
		            //console.log('in promise done');
		            self.hash();
		        });
	    	} 
	    },

	    // show the hash url content
	    hash: function() {
	        if (window.location.hash.substr(1) != "") {
	            // get hash value and display the appropriate content
	            var contentData = window.location.hash.substr(1).split("_");

	            if (jQuery('[data-lyqbox=' + contentData[0] + '][data-lyqbox-alias=' + contentData[1] + ']').length){
	            	this.start(jQuery('[data-lyqbox=' + contentData[0] + '][data-lyqbox-alias=' + contentData[1] + ']'));
		            //console.log('hash found and initiated');
	            } else {
	            	//console.log('hash found in URL but cannot find item matching the hash, rendering normally');
	            }
	        } 
	    },

	    // show alertbox if found.
	    alert: function(alertbox) {
	        var self = this;
	        var deferred = jQuery.Deferred();
	        // assume that there is only one alertbox at any given time.
	        if (alertbox.length == 1) {
	            // check if a cookie for this alertbox exists, if so return deferred reject.
	            var cookieName = 'lyqbox-alert-' + alertbox.attr('data-lyqbox');
	            var alertCookieFound = localStorage.getItem(cookieName);
	            if (alertCookieFound) {
	                //console.log('cookie found, alertbox skipped ', cookieName);
	                deferred.reject();
	            }
	            // if no cookie found, show the alertbox
	            else {
	                // show the alertbox
	                self.start(alertbox);
	                //console.log('alert found, no cookie, and initiated');

	                // add listener to the close button to save the cookie and return deferred resolved
	                jQuery('#lyqbox-wrapper').find('.lyqbox-close-button').on('click', function alertBoxCloseButtonClicked() {
	                    var cookieName = 'lyqbox-alert-' + self.album[self.currentImageIndex].albumId;
	                    //console.log('cookie saved ', cookieName);
	                    localStorage.setItem(cookieName, 1);

	                    deferred.resolve();
	                    self.end();
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

	    imageCountLabel: function(currentImageNum, totalImages) {
	        return lqx.settings.lyqBox.albumLabel.replace(/%1/g, currentImageNum).replace(/%2/g, totalImages);
	    },

	    // Loop through anchors and areamaps looking for either data-lightbox attributes or rel attributes
	    // that contain 'lightbox'. When these are clicked, start lightbox.
	    enable: function() {
	        var self = this;

	        // lyquix addition, we initialize everything based on [data-lightbox]
	        jQuery('body').on('click', '[data-lyqbox]', function(event) {
	            self.start(jQuery(event.currentTarget));
	            return false;
	        });

	    },

	    build: function() {
	        var self = this;

	        // mostly different class/id names
	        jQuery('<div id="lyqbox-overlay" class="lyqbox-overlay"></div>' +
					'<div id="lyqbox-wrapper">' +
						'<div class="lyqbox-content-wrapper">' +
							'<div class="lyqbox-content">' +
							'</div>' +
							'<div class="lyqbox-extra-content">' +
								'<span class="title"></span>' +
								'<span class="caption"></span>' +
								'<span class="credit"></span>' +
							'</div>' +
							'<div class="lyqbox-buttons-and-counter">' +
								'<span class="lyqbox-button-prev"></span>' +
								'<span class="lyqbox-button-next"></span>' +
								'<span class="lyqbox-counter"></span>' +
							'</div>' +
							'<span class="lyqbox-close-button">x</span>' +
						'</div>' +
					'</div>').appendTo(jQuery('body'));

	        // Cache jQuery objects

	        // lyquix edits: change class/id names
	        this.$lightbox = jQuery('#lyqbox-wrapper');
	        this.$overlay = jQuery('#lyqbox-overlay');
	        this.$container = this.$lightbox.find('.lyqbox-content');
	        this.$outerContainer = this.$lightbox.find('.lyqbox-content-wrapper');

	        // Store css values for future lookup
	        this.containerTopPadding = parseInt(this.$container.css('padding-top'), 10);
	        this.containerRightPadding = parseInt(this.$container.css('padding-right'), 10);
	        this.containerBottomPadding = parseInt(this.$container.css('padding-bottom'), 10);
	        this.containerLeftPadding = parseInt(this.$container.css('padding-left'), 10);

	        // Attach event handlers to the newly minted DOM elements
	        this.$overlay.on('click', function() {
	            //console.log('overlay area clicked');
	            // if this is alert, do nothing
	            if (self.album[self.currentImageIndex].type == 'alert')
	                return false;

	            // else exit the lightbox
	            self.end();
	            return false;
	        });

	        this.$lightbox.hide().on('click', function(event) {
	            //console.log('lightbox area clicked');
	            // lyquix edit: change the target id per our html

	            // if this is alert, do nothing
	            if (self.album[self.currentImageIndex].type == 'alert')
	                return false;


	            // else if target is lyqbox-wrapper, exit the lightbox
	            if (jQuery(event.target).attr('id') === 'lyqbox-wrapper') {
	                self.end();
	                return false;
	            }

	        });

	        // lyquix edit: change the button class name
	        this.$lightbox.find('.lyqbox-button-prev').on('click', function() {
	            if (self.currentImageIndex === 0) {
	                self.changeContent(self.album.length - 1);
	            } else {
	                self.changeContent(self.currentImageIndex - 1);
	            }
	            return false;
	        });

	        // lyquix edit: change the button class name
	        this.$lightbox.find('.lyqbox-button-next').on('click', function() {
	            if (self.currentImageIndex === self.album.length - 1) {
	                self.changeContent(0);
	            } else {
	                self.changeContent(self.currentImageIndex + 1);
	            }
	            return false;
	        });

	        this.$lightbox.find('.lyqbox-close-button').on('click', function() {
	            // disable the close button for alertbox, this will be done on the deferred section on alert function to make sure in the case alert and hashurl found, 
	            // that the alert box is closed properly before showing a hash url content.
	            if (self.album[self.currentImageIndex].type == 'alert')
	                return false;

	            // else close the lightbox
	            self.end();
	            return false;
	        });

	    },

	    // Show overlay and lightbox. If the image is part of a set, add siblings to album array.
	    start: function($link) {
	        var self = this;
	        var $window = jQuery(window);

	        $window.on('resize', jQuery.proxy(this.sizeOverlay, this));

	        jQuery('select, object, embed').css({
	            visibility: 'hidden'
	        });

	        this.sizeOverlay();

	        this.album = [];
	        var imageNumber = 0;

	        function addToAlbum($link) {
	            self.album.push({
	                albumId: $link.attr('data-lyqbox'),
	                type: $link.attr('data-lyqbox-type'),
	                link: $link.attr('data-lyqbox-url'),
	                title: $link.attr('data-lyqbox-title'),
	                caption: $link.attr('data-lyqbox-caption'),
	                credit: $link.attr('data-lyqbox-credit'),
	                class: $link.attr('data-lyqbox-class'),
	                alias: $link.attr('data-lyqbox-alias'),
	                html: $link.attr('data-lyqbox-html'),
	            });
	        }
	        // Support both data-lightbox attribute and rel attribute implementations
	        var $links;

	        // lyquix addition 
	        var datalyqboxValue = $link.attr('data-lyqbox');
	        if (datalyqboxValue) {
	            $links = jQuery($link.prop('tagName') + '[data-lyqbox="' + datalyqboxValue + '"]');

	            for (var i = 0; i < $links.length; i = ++i) {
	                addToAlbum(jQuery($links[i]));
	                if ($links[i] === $link[0]) {
	                    imageNumber = i;
	                }
	            }
	        }

	        // show prev next button if this is a gallery
	        if (this.album.length > 1) {
	            this.$lightbox.find('.lyqbox-buttons-and-counter').removeClass('hide');
	        } else {
	            this.$lightbox.find('.lyqbox-buttons-and-counter').addClass('hide');
	        }

	        // Position Lightbox
	        var top = $window.scrollTop() + lqx.settings.lyqBox.positionFromTop;
	        var left = $window.scrollLeft();
	        this.$lightbox.css({
	            top: top + 'px',
	            left: left + 'px'
	        }).show();

	        // Disable scrolling of the page while open
	        if (lqx.settings.lyqBox.disableScrolling) {
	            jQuery('body').addClass('lb-disable-scrolling');
	        }
	        //lyquix addition
	        this.changeContent(imageNumber);
	    },

	    loadHTML: function(url) {
	        var self = this,
	            deferred = jQuery.Deferred();
	        /* we are using load so one can specify a target with: url.html #targetelement */
	        var $container = jQuery('<div></div>').load(url, function(response, status) {
	            if (status !== "error") {
	                deferred.resolve($container.contents());
	            }
	            deferred.fail();
	        });
	        return deferred.promise();
	    },

	    // lyquix addition/edit: add our own change image function becase we want to display not just images, but video, html and ajax as well.
	    changeContent: function(index) {
	        var self = this;

	        this.disableKeyboardNav();
	        var lyqboxContent = this.$lightbox.find('.lyqbox-content');
	        this.$overlay.removeClass("close").addClass("open");
	        this.$outerContainer.addClass('animating');

	        switch (this.album[index].type) {
	            case 'image':
	                lyqboxContent.html('<img />')
	                var $image = lyqboxContent.find('img');
	                // When image to show is preloaded, we send the width and height to sizeContainer()

	                var preloader = new Image();
	                preloader.src = self.album[index].link;
	                preloader.onload = function() {
						var $preloader;
						var imageHeight;
						var imageWidth;
						var maxImageHeight;
						var maxImageWidth;
						var windowHeight;
						var windowWidth;

						$image.attr('src', self.album[index].link);

						$preloader = jQuery(preloader);

						$image.width(preloader.width);
						$image.height(preloader.height);

						if (lqx.settings.lyqBox.fitImagesInViewport) {
							// Fit image inside the viewport.
							// Take into account the border around the image and an additional 10px gutter on each side.

							windowWidth = jQuery(window).width();
							windowHeight = jQuery(window).height();
							maxImageWidth = windowWidth - self.containerLeftPadding - self.containerRightPadding - 20;
							maxImageHeight = windowHeight - self.containerTopPadding - self.containerBottomPadding - 220;


							// Check if image size is larger then maxWidth|maxHeight in settings
							if (lqx.settings.lyqBox.maxWidth && lqx.settings.lyqBox.maxWidth < maxImageWidth) {
								maxImageWidth = lqx.settings.lyqBox.maxWidth;
							}
							if (lqx.settings.lyqBox.maxHeight && lqx.settings.lyqBox.maxHeight < maxImageHeight) {
								maxImageHeight = lqx.settings.lyqBox.maxHeight;
							}

							// Is there a fitting issue?
							if ((preloader.width > maxImageWidth) || (preloader.height > maxImageHeight)) {
								if ((preloader.width / maxImageWidth) > (preloader.height / maxImageHeight)) {
									imageWidth = maxImageWidth;
									imageHeight = parseInt(preloader.height / (preloader.width / imageWidth), 10);
									$image.width(imageWidth);
									$image.height(imageHeight);
								} else {
									imageHeight = maxImageHeight;
									imageWidth = parseInt(preloader.width / (preloader.height / imageHeight), 10);
									$image.width(imageWidth);
									$image.height(imageHeight);
								}
							}
						}
						self.$lightbox.find('.lyqbox-content-wrapper').width(preloader.width);
						self.sizeContainer($image.width(), $image.height());
					},

					self.currentImageIndex = index;
	                //console.log(self.album[self.currentImageIndex].albumId, self.album[self.currentImageIndex].alias);
	                window.location.hash = self.album[self.currentImageIndex].albumId + '_' + self.album[self.currentImageIndex].alias;
	                break;

	            case 'video':
	                lyqboxContent.html('<iframe></iframe>');
	                var $video = lyqboxContent.find('iframe');
	                $video.attr('src', self.album[index].link);

	                var maxVideoHeight;
	                var maxVideoWidth;
	                // resize the video size by using 16:9 ratio, width is the base for calculations, maxwidth is 80% of the current screen

	                if (lqx.settings.lyqBox.fitImagesInViewport) {
	                    windowWidth = jQuery(window).width();
	                    windowHeight = jQuery(window).height();
	                    maxVideoWidth = windowWidth * 70 / 100;
	                    maxVideoHeight = (maxVideoWidth / 16) * 9;
	                }

	                // Check if image size is larger then maxWidth|maxHeight in settings
	                if (lqx.settings.lyqBox.maxWidth && lqx.settings.lyqBox.maxWidth < maxVideoWidth) {
	                    maxVideoWidth = lqx.settings.lyqBox.maxWidth;
	                    maxVideoHeight = (maxVideoWidth / 16) * 9;
	                }

	                $video.attr('width', maxVideoWidth).attr('height', maxVideoHeight);

	                this.currentImageIndex = index; // this precede sizeContainer to make sure the counter text is correct 
	                self.sizeContainer(maxVideoWidth, maxVideoHeight);
	                //console.log(self.album[self.currentImageIndex].albumId, self.album[self.currentImageIndex].alias);
	                window.location.hash = self.album[self.currentImageIndex].albumId + '_' + self.album[self.currentImageIndex].alias;

	                break;

	            case 'alert':
	                // check if url is not empty
	                if (self.album[index].link != "") {
	                    var promise = loadHTML(self.album[index].link);

	                    promise.done(function htmlLoaded(htmlResult) {
	                        if (htmlResult != '') {
	                            lyqboxContent.html(htmlResult);
	                            self.currentImageIndex = index;
	                        }
	                    });
	                } else {
	                    lyqboxContent.html(self.album[index].html);
	                    self.currentImageIndex = index;
	                }
	                break;

	            default:
	                break;
	        }
	    },

	    // Stretch overlay to fit the viewport
	    sizeOverlay: function() {
	        this.$overlay
	            .width(jQuery(document).width())
	            .height(jQuery(document).height());
	    },

	    // Animate the size of the lightbox to fit the image we are showing
	    sizeContainer: function(imageWidth, imageHeight) {
	        var self = this;

	        var oldWidth = this.$outerContainer.outerWidth();
	        var oldHeight = this.$outerContainer.outerHeight();
	        var newWidth = imageWidth + this.containerLeftPadding + this.containerRightPadding;
	        var newHeight = imageHeight + this.containerTopPadding + this.containerBottomPadding;

	        function postResize() {
	            self.$lightbox.find('.lyqbox-content-wrapper').width(newWidth);
	            self.showImage();
	        }
	        postResize();
	    },

	    // Display the image and its details and begin preload neighboring images.
	    showImage: function() {
	        this.updateNav();
	        this.updateDetails();
	        //this.preloadNeighboringImages();
	        this.enableKeyboardNav();
	    },

	    // Display previous and next navigation if appropriate.
	    updateNav: function() {
	        // Check to see if the browser supports touch events. If so, we take the conservative approach
	        // and assume that mouse hover events are not supported and always show prev/next navigation
	        // arrows in image sets.
	        var alwaysShowNav = false;
	        try {
	            document.createEvent('TouchEvent');
	            alwaysShowNav = (lqx.settings.lyqBox.alwaysShowNavOnTouchDevices) ? true : false;
	        } catch (e) {}

	        if (this.album.length > 1) {
	            if (lqx.settings.lyqBox.wrapAround) {
	                if (alwaysShowNav) {
	                    this.$lightbox.find('.lyqbox-button-prev, .lyqbox-button-next').css('opacity', '1');
	                }
	                this.$lightbox.find('.lyqbox-button-prev, .lyqbox-button-next').removeClass('hide');
	            } else {

	                if (alwaysShowNav) {
	                    this.$lightbox.find('.lyqbox-button-prev, .lyqbox-button-next').css('opacity', '0');
	                }

	                this.$lightbox.find('.lyqbox-button-prev, .lyqbox-button-next').addClass('hide');

	                if (this.currentImageIndex != 0) {
	                    this.$lightbox.find('.lyqbox-button-prev').removeClass('hide');
	                    if (alwaysShowNav) {
	                        this.$lightbox.find('.lyqbox-button-prev').css('opacity', '1');
	                    }
	                }
	                if (this.currentImageIndex != this.album.length - 1) {
	                    this.$lightbox.find('.lyqbox-button-next').removeClass('hide');
	                    if (alwaysShowNav) {
	                        this.$lightbox.find('.lyqbox-button-next').css('opacity', '1');
	                    }
	                }
	            }
	        }
	    },

	    // Display caption, image number, and closing button.
	    updateDetails: function() {
	        var self = this;

	        // Enable anchor clicks in the injected caption html.
	        // Thanks Nate Wright for the fix. @https://github.com/NateWr
	        if (typeof this.album[this.currentImageIndex].title !== 'undefined' &&
	            this.album[this.currentImageIndex].title !== '') {
	            this.$lightbox.find('.lyqbox-extra-content .title')
	                .html(this.album[this.currentImageIndex].title);
	        }

	        if (typeof this.album[this.currentImageIndex].caption !== 'undefined' &&
	            this.album[this.currentImageIndex].caption !== '') {
	            this.$lightbox.find('.lyqbox-extra-content .caption')
	                .html(this.album[this.currentImageIndex].caption);
	        }

	        if (typeof this.album[this.currentImageIndex].credit !== 'undefined' &&
	            this.album[this.currentImageIndex].credit !== '') {
	            this.$lightbox.find('.lyqbox-extra-content .credit')
	                .html(this.album[this.currentImageIndex].credit);
	        }

	        if (this.album.length > 1 && lqx.settings.lyqBox.showImageNumberLabel) {
	            var labelText = this.imageCountLabel(this.currentImageIndex + 1, this.album.length);
	            this.$lightbox.find('.lyqbox-counter').text(labelText);
	        } else {
	            this.$lightbox.find('.lyqbox-counter').hide();
	        }

	    },

	    // Preload previous and next images in set.
	    preloadNeighboringImages: function() {
	        if (this.album.length > this.currentImageIndex + 1) {
	            var preloadNext = new Image();
	            preloadNext.src = this.album[this.currentImageIndex + 1].link;
	        }
	        if (this.currentImageIndex > 0) {
	            var preloadPrev = new Image();
	            preloadPrev.src = this.album[this.currentImageIndex - 1].link;
	        }
	    },

	    enableKeyboardNav: function() {
	        jQuery(document).on('keyup.keyboard', jQuery.proxy(this.keyboardAction, this));
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
	            this.end();
	        } else if (key === 'p' || keycode === KEYCODE_LEFTARROW) {
	            if (this.currentImageIndex !== 0) {
	                this.changeContent(this.currentImageIndex - 1);
	            } else if (lqx.settings.lyqBox.wrapAround && this.album.length > 1) {
	                this.changeContent(this.album.length - 1);
	            }
	        } else if (key === 'n' || keycode === KEYCODE_RIGHTARROW) {
	            if (this.currentImageIndex !== this.album.length - 1) {
	                this.changeContent(this.currentImageIndex + 1);
	            } else if (lqx.settings.lyqBox.wrapAround && this.album.length > 1) {
	                this.changeContent(0);
	            }
	        }
	    },

	    // Closing time. :-(
	    end: function() {
	        this.disableKeyboardNav();
	        jQuery(window).off('resize', this.sizeOverlay);
	        this.$lightbox.fadeOut(lqx.settings.lyqBox.fadeDuration);
	        this.$overlay.removeClass("open").addClass("close");
	        jQuery('select, object, embed').css({
	            visibility: 'visible'
	        });
	        if (lqx.settings.lyqBox.disableScrolling) {
	            jQuery('body').removeClass('lb-disable-scrolling');
	        }
	    },

	},	

};

// END Lyquix global object
// ***********************************


// Functions to execute when the DOM is ready
jQuery(document).ready(function(){
	
	// add image attributes for load error and load complete
	lqx.initImgLoadAttr();
	// get browser type - NOTE: this converts the function into a string
	lqx.getBrowser = lqx.getBrowser();
	// get os - NOTE: this converts the function into a string
	lqx.getOS = lqx.getOS();
	// execute some browser fixes
	lqx.browserFixes();
	// enable function logging
	lqx.initLogging();	
	// add tracking with google analytics
	lqx.initTracking();
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
});

// Functions to execute when the page has loaded
jQuery(window).load(function(){
	
	// check screen size once again (to deal with appearing scrollbar) 
	lqx.bodyScreenSize();
	// set punctuation marks to hanging
	lqx.hangingPunctuation();
	// set equal height rows
	lqx.equalHeightRows();
	
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
function onYouTubeIframeAPIReady(){
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
