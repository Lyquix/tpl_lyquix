
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
				if(jQuery(this).attr('width') == undefined) {
					var img = new Image();
					img.src = jQuery(this).attr('src'); 
					jQuery(this).attr('width', img.width);
				}
			});
			// fix for google fonts not rendering in IE10/11
			if(lqx.getBrowser.version >= 10) {
				console.log('ie10/11');
				jQuery('html').css('font-feature-settings', 'normal');
			}
			// replaced svg imager for pngs in IE8
			if(lqx.getBrowser.version < 9) {
				console.log('ie8');
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

	},
	
	youtubePlayerReady : function(e, playerId){
		//console.log(playerId, e, lqx.vars.youtubePlayers[playerId], typeof lqx.vars.youtubePlayers[playerId].playerObj.getPlayerState);
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
		//console.log(playerId, e, lqx.vars.youtubePlayers[playerId], lqx.vars.youtubePlayers[playerId].playerObj.getPlayerState(), e.target.getPlayerState());
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
				lqx.videoTrackingEvent(playerId, label, lqx.vars.youtubePlayers[playerId].title);
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
				lqx.videoTrackingEvent(data.player_id, label, 'Title not available'); // vimeo doesn't provide a mechanism for getting the video title
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
	
	videoTrackingEvent : function(playerId, label, title) {
		ga('send', {
			'hitType': 'event', 
			'eventCategory' : 'Video',
			'eventAction' : 'Play',
			'eventLabel' : label,
			'eventValue': title + ' (' + jQuery('#' + playerId).attr('src').split('?')[0] + ')'
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
						console.log('img tracked');
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
					if (mutRec.removedNodes.length > 0) {
					}
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
