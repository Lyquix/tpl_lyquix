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
			duration: 13,  // in miliseconds 
		},
		bodyScreenSize: {
			// defines the minimum and maximum screen sizes, 
			// use 0 through 4 to represent xs to xl screen sizes
			min: 0,
			max: 4
		},
	},
	
	// holds working data
	vars: {
		resizeThrottle: false,  // saves current status of resizeThrottle
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
		var sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
		// xs:    0 -  640
		// sm:  640 -  960
		// md:  960 - 1280
		// lg: 1280 - 1600
		// xl: 1600 -
		if(w < 640) s = 0;
		if(w >= 640) s = 1;
		if(w >= 960) s = 2;
		if(w >= 1280) s = 3;
		if(w >= 1600) s = 4;
		if(sizes[s] != lqx.vars.lastScreenSize) {
			// adjust calculated size to min and max range
			if(s < lqx.settings.bodyScreenSize.min) s = lqx.settings.bodyScreenSize.min;
			if(s > lqx.settings.bodyScreenSize.max) s = lqx.settings.bodyScreenSize.max;
			// change the body screen attribute
			jQuery('body').attr('screen',sizes[s]);
			// hack to force IE8 to take the new screen size attribute
			document.getElementsByTagName('body')[0].className = document.getElementsByTagName('body')[0].className;
			// trigger custom event 'screensizechange'
			jQuery(document).trigger('screensizechange');
			// save last screen size
			lqx.vars.lastScreenSize = sizes[s];
		}
	},
	
	// getBrowser
	// returns the browser name and version
	// NOTE: don't use this as a function, as it is converted to string on page ready
	getBrowser : function(){
		var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
		if(/trident/i.test(M[1])){
			tem =  /\brv[ :]+(\d+)/g.exec(ua) || [];
			return 'IE ' + (tem[1] || '');
		}
		if(M[1] === 'Chrome'){
			tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
			if(tem != null){
				return tem.slice(1).join(' ').replace('OPR', 'Opera');
			}
		}
		M = M[2] ? [M[1] , M[2]] : [navigator.appName, navigator.appVersion, '-?'];
		if((tem = ua.match(/version\/(\d+)/i))!= null) {
			M.splice(1, 1, tem[1]);
		}
		return M.join(' ');
	},
	
	// browserFixes
	// implements some general browser fixes
	browserFixes : function(){
		switch(lqx.getBrowser) {
			
			// fix for google fonts not rendering in IE10/11
			case 'MSIE 10':
			case 'MSIE 11':
			case 'IE 10':
			case 'IE 11':
				jQuery('html').css('font-feature-settings', 'normal');
				break;
				
		}
	},
	
	// equalHeightRows
	// makes all elements in a row to be the same height
	equalHeightRows : function() {
		var currentTallest = 0,
			currentRowStart = 0,
			rowDivs = new Array(),
			el,
			topPosition = 0,
			loadComplete = true;
		
		jQuery('.equalheightrow').each(function(){
			
			el = jQuery(this);
			
			// there may be images waiting to load, in that case wait a little and try again
			jQuery(el).find('img').each(function(){
				if(this.complete != true || this.naturalWidth == 0) {
					// the image is not loaded yet or there was an error
					if(typeof jQuery(this).attr('error') == 'undefined'){
						// if there isn't an error, means the image has not completed loading
						loadComplete = false;
					}
				}
			}).promise().done(function(){
				// if all images completed or on error
				if(loadComplete){
					el.height('auto')
					topPostion = el.position().top;
					
					if (currentRowStart != topPostion) {
						for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
							rowDivs[currentDiv].height(currentTallest);
						}
						rowDivs.length = 0; // empty the array
						currentRowStart = topPostion;
						currentTallest = el.height();
						rowDivs.push(el);
					} else {
						rowDivs.push(el);
						currentTallest = (currentTallest < el.height()) ? (el.height()) : (currentTallest);
					}
					for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
						rowDivs[currentDiv].height(currentTallest);
					}
				}
			});
			
		}).promise().done(function(){
			// still waiting for some images to load, try again in 0.25secs
			if(!loadComplete) {
				setTimeout(function(){lqx.equalHeightRows()}, 250);
			}	
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
						
						// check if it is an outbound link, track as event
						if(elem.href.indexOf(location.host) == -1 && lqx.settings.tracking.outbound) {
							jQuery(elem).click(function(e){
								// prevent default
								e.preventDefault ? e.preventDefault() : e.returnValue = !1;
								var url = elem.href;
								var target = (elem.target && !elem.target.match(/^_(self|parent|top)$/i)) ? elem.target : false;
								ga('send', {
									'hitType': 'event', 
									'eventCategory' : 'Outbound Links',
									'eventAction' : 'click',
									'eventLabel' : url,
									'nonInteraction' : true,
									'hitCallback' : function(){ target ? window.open(url, target) : window.location.href = url; }
								});
							});
						}
						
						// check if it is a download link, track as pageview
						else if(elem.href.match(/\.(gif|png|jpg|jpeg|tif|tiff|svg|webp|bmp|zip|rar|gzip|7z|tar|exe|msi|dmg|txt|pdf|rtf|doc|docx|dot|dotx|xls|xlsx|xlt|xltx|ppt|pptx|pot|potx|mp3|wav|mp4|ogg|webm|wma|mov|avi|wmv|flv|swf|xml|js|json|css|less|sass)$/i) && lqx.settings.tracking.download) {
							jQuery(elem).click(function(e){
								// prevent default
								e.preventDefault ? e.preventDefault() : e.returnValue = !1;
								var url = elem.href;
								var target = (elem.target && !elem.target.match(/^_(self|parent|top)$/i)) ? elem.target : false;
								var loc = elem.protocol + '//' + elem.hostname + elem.pathname + elem.search;
								var page = elem.pathname + elem.search;
								ga('send', {
									'hitType': 'pageview', 
									'location' : loc,
									'page' : page,
									'title' : 'Download: ' + page,
									'hitCallback' : function(){ target ? window.open(url, target) : window.location.href = url; }
								});
							});
						}
						
					}
				});
				
			}
			
		
			// track scroll depth
			if(lqx.settings.tracking.scrolldepth){
				
				// get the initial scroll position
				lqx.vars.scrollDepthMax = Math.ceil(((jQuery(window).scrollTop() + jQuery(window).height()) / jQuery(document).height()) * 10) * 10;
				
				// add listener to scroll event
				jQuery(window).scroll(function(){
					// capture the hightest scroll point, stop calculating once reached 100
					if(lqx.vars.scrollDepthMax < 100) {
						lqx.vars.scrollDepthMax = Math.max(lqx.vars.scrollDepthMax, Math.ceil(((jQuery(window).scrollTop() + jQuery(window).height()) / jQuery(document).height()) * 10) * 10);					
					}
				});
				
				// add listener to link
				jQuery(window).on('unload', function(){
					
					ga('send', {
						'hitType': 'event', 
						'eventCategory' : 'Scroll Depth',
						'eventAction' : lqx.vars.scrollDepthMax,
						'nonInteraction' : true
					});				
					
				});					
				
			}
			
			// track photo galleries
			if(lqx.settings.tracking.photogallery){
				jQuery('a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox]').click(function(){
					// send event for gallery opened
					ga('send', {
						'hitType': 'event', 
						'eventCategory' : 'Photo Gallery',
						'eventAction' : 'Open'
					});
				
				});
				
				jQuery('img.lb-image').on('load', function(){
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
				lqx.vars.youtubePlayers = {};
				lqx.vars.vimeoPlayers = {};
				// detect if there are any youtube or vimeo videos, activate js api and add id
				jQuery('iframe').each(function(idx,elem){
					if(typeof jQuery(elem).attr('src') != 'undefined'){
						// check youtube players
						if(jQuery(elem).attr('src').indexOf('youtube.com/embed/') != -1) {
							if(jQuery(this).attr('src').indexOf('enablejsapi=1') == -1){
								var urlconn = '&';
								if(jQuery(this).attr('src').indexOf('?') == -1) {
									urlconn = '?';
								}
								jQuery(elem).attr('src', jQuery(elem).attr('src') + urlconn + 'enablejsapi=1&version=3');
							}
							if(typeof jQuery(elem).attr('id') == 'undefined'){
								jQuery(elem).attr('id','youtubePlayer'+idx)
							}
							lqx.vars.youtubePlayers[jQuery(elem).attr('id')] = { };
						}
						// check vimeo players
						if(jQuery(elem).attr('src').indexOf('player.vimeo.com/video/') != -1) {
							if(jQuery(this).attr('src').indexOf('api=1') == -1){
								if(jQuery(this).attr('src').indexOf('?') == -1) {
									urlconn = '?';
								}
								jQuery(elem).attr('src', jQuery(elem).attr('src') + urlconn + 'api=1&player_id=vimeoPlayer' + idx);
							}
							if(typeof jQuery(elem).attr('id') == 'undefined'){
								jQuery(elem).attr('id','vimeoPlayer'+idx)
							}
							lqx.vars.vimeoPlayers[jQuery(elem).attr('id')] = { };
						}
					}
												 
				}).promise().done(function(){
					// if there are any youtube players
					if(Object.keys(lqx.vars.youtubePlayers).length > 0){
						// youtube players available, load youtube api library
						var tag = document.createElement('script');
						tag.src = "https://www.youtube.com/iframe_api";
						var firstScriptTag = document.getElementsByTagName('script')[0];
						firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
					}
					// if there are any vimeo players
					
					if(Object.keys(lqx.vars.vimeoPlayers).length > 0){
						
						if (window.addEventListener) {
							window.addEventListener('message', lqx.vimeoReceiveMessage, false);
						} 
						else {
							window.attachEvent('onmessage', lqx.vimeoReceiveMessage, false);
						}
					}
					
					
				});
			}
		}

	},
	
	youtubePlayerCallback : function(e, playerId){
		
		player = lqx.vars.youtubePlayers[playerId];
		videoTitle = e.target.B.videoData.title;
		videoUrl = e.target.B.videoUrl;
		duration = e.target.getDuration();
		currentTime = e.target.getCurrentTime();
		
		// capture the onready event
		if(e.data == null){
			// set player object variables
			player.progress = 0;
			player.start = false;
			player.complete = false;
		}
		
		else {
			// player events:
			// -1 (unstarted, player ready)
			// 0 (ended)
			// 1 (playing)
			// 2 (paused)
			// 3 (buffering)
			// 5 (video cued / video ready)
			var label;
			
			// making sure we track the complete event just once
			if(e.target.getPlayerState() == 0 && !player.complete) {
				label = 'Complete';
				player.complete = true;
			}
			
			if(e.target.getPlayerState() == 1) {
				
				// recursively call this function in 250ms to keep track of video progress
				player.timer = setTimeout(function(){lqx.youtubePlayerCallback(e, playerId)}, 250);
				
				// if this is the first time we get the playing status, track it as start
				if(!player.start){
					label = 'Start';
					player.start = true;
				}
				
				else {
					
					if(Math.ceil( Math.ceil( (currentTime / duration) * 100 ) / 10 ) - 1 > player.progress){
						
						player.progress = Math.ceil( Math.ceil( (currentTime / duration) * 100 ) / 10 ) - 1;
						
						if(player.progress != 10){
							label = (player.progress * 10) + '%';
						}
						
						else {
							clearTimeout(lqx.vars.youtubePlayers[playerId].timer);
						}
					}
				}
			}
			
			if(label){
				lqx.videoTrackingEvent(playerId, label, videoTitle);
			}
			
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
		
		console.log(playerId + ':' + label);
		ga('send', {
			'hitType': 'event', 
			'eventCategory' : 'Video',
			'eventAction' : 'Play',
			'eventLabel' : label,
			'eventValue': title + ' (' + jQuery('#' + playerId).attr('src').split('?')[0] + ')'
		});

	},
	
	// adds a width value to img elements
	ieImgSizeFix : function() {
		if(lqx.getBrowser.indexOf('IE ') != -1) {
			jQuery('img').each(function(){
				if(jQuery(this).attr('width') == undefined) {
					jQuery(this).attr('width', '100%');
				}
			});
		}
	},
	
	// replaces svg images for png in IE8
	ie8SVGFallback : function() {
		if(lqx.getBrowser.indexOf('IE 8') != -1) {
			jQuery('img').each(function(){
				src = jQuery(this).attr('src');
				if(/\.svg$/i.test (src)) {
					jQuery(this).attr('src', src.replace('.svg', '.png')); 
				}
			});
		}
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
		var go = function(){target ? window.open(url, target) : window.location.href = url;};
		
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
	
};

// END Lyquix global object
// ***********************************


// Functions to execute when the DOM is ready
jQuery(document).ready(function(){
	
	// get browser type - NOTE: this converts the function into a string
	lqx.getBrowser = lqx.getBrowser();
	// execute some browser fixes
	lqx.browserFixes();
	// enable function logging
	lqx.initLogging();	
	// add tracking with google analytics
	lqx.initTracking();
	// set equal height rows
	lqx.equalHeightRows();
	// adds image captions using alt property
	lqx.imageCaption();
	// shows a line break symbol before br elements
	lqx.lineBreakSymbol();
	// ie fix for imeges when no size is provided
	lqx.ieImgSizeFix();
	// ie8 fix for fallback to png when svg images are used 
	lqx.ie8SVGFallback();
	
	// Trigger on window resize
	jQuery(window).resize(function() {

		// throttling?
		if(!lqx.vars.resizeThrottle) {

			// execute bodyscreenresize function
			lqx.bodyScreenSize();
			// throttling is now on
			lqx.vars.resizeThrottle = true;
			// set time out to turn throttling on and check screen size once more
			setTimeout(function () { 
				lqx.vars.resizeThrottle = false; 
				lqx.bodyScreenSize();
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
	
	// add listeners for mobile menu logic
	jQuery('body.mobile .horizontal, body.mobile .vertical, body.mobile .slide-out').on('click', 'ul.menu a', function(e){
		// prevent links to work until we 
		e.preventDefault();
		lqx.mobileMenu(this);
	});
	jQuery('body.mobile .horizontal, body.mobile .vertical, .slide-out').click(function(e){
	    // do not propagate click events outside menus
	    e.stopPropagation();
	});
	jQuery('.slide-out .menu-control').click(function(){
		// open/close slide-out menu
		var elem = jQuery(this).parent();
		if(jQuery(elem).hasClass('open')) {
			jQuery(elem).removeClass('open');
		}
		else {
			jQuery(elem).addClass('open')
		}
	});
	jQuery('body').click(function() {
		// hide the menus if visible
		jQuery('body.mobile .horizontal, body.mobile .vertical, body.mobile .slide-out').find('ul.menu li.open').removeClass('open');
		// close the slide out menu if open
		jQuery('.slide-out.open').removeClass('open');
	});
	
	
});


// Functions to execute when the page has loaded
jQuery(window).load(function(){
	
	// set punctuation marks to hanging
	lqx.hangingPunctuation();
	
});


// Other global functions, callbacks
// ***********************************

// onYouTubeIframeAPIReady
// callback function called by iframe youtube players when they are ready
function onYouTubeIframeAPIReady(){
	for(var playerId in lqx.vars.youtubePlayers) {
		lqx.vars.youtubePlayers[playerId].playerObj = new YT.Player(playerId, { 
			events: { 
				'onReady': function(e){ lqx.youtubePlayerCallback(e, playerId) }, 
				'onStateChange': function(e){ lqx.youtubePlayerCallback(e, playerId) } 
			}
		});
	}
}
