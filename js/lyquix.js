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
			video: true
		},
		shadeColorPercent: {
			lighter: 20,
			light: 10,
			dark: -10,
			darker: -20
		}
	},
	
	// holds working data
	vars: {},
	
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
		w = jQuery(window).width();
		// xs:    0 -  640
		// sm:  640 -  960
		// md:  960 - 1280
		// lg: 1280 - 1600
		// xl: 1600 -
		if(w < 640) s = 'xs';
		if(w >= 640) s = 'sm';
		if(w >= 960) s = 'md';
		if(w >= 1280) s = 'lg';
		if(w >= 1600) s = 'xl';
		if(s != lqx.vars.lastScreenSize) {
			// change the body screen attribute
			jQuery('body').attr('screen',s);
			// hack to force IE8 to take the new screen size attribute
			document.getElementsByTagName('body')[0].className = document.getElementsByTagName('body')[0].className;
			// trigger custom event 'screensizechange'
			jQuery(document).trigger('screensizechange');
			// save last screen size
			lqx.vars.lastScreenSize = s;
		}
	},
	
	// getBrowser
	// returns the browser name and version
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
						else if(elem.href.match(/\.(gif|png|jpg|jpeg|tif|tiff|svg|webp|bmp|zip|rar|gzip|7z|tar|exe|msi|dmg|txt|pdf|rtf|doc.*|xls.*|ppt.*|mp3|wav|mp4|ogg|webm|wma|mov|avi|wmv|flv|swf|xml|js|json|css|less|sass)$/i) && lqx.settings.tracking.download) {
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
						lqx.vars.youtubePlayers[jQuery(elem).attr('id')] = {};
					}
					/*
					// vimeo is still work in progress
					if(jQuery(elem).attr('src').indexOf('player.vimeo.com/video/') != -1) {
						if(jQuery(this).attr('src').indexOf('api=1') == -1){
							if(jQuery(this).attr('src').indexOf('?') == -1) {
								urlconn = '?';
							}
							jQuery(elem).attr('src', jQuery(elem).attr('src') + urlconn + 'api=1');
						}
						if(typeof jQuery(elem).attr('id') == 'undefined'){
							jQuery(elem).attr('id','vimeoPlayer'+idx)
						}
						lqx.vars.vimeoPlayers[jQuery(elem).attr('id')] = { playerObj: elem };
					}
					*/
				}
											 
			}).promise().done(function(){
				if(Object.keys(lqx.vars.youtubePlayers).length > 0){
					// youtube players available, load youtube api library
					var tag = document.createElement('script');
					tag.src = "https://www.youtube.com/iframe_api";
					var firstScriptTag = document.getElementsByTagName('script')[0];
					firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
				}
				/*
				if(Object.keys(lqx.vars.vimeoPlayers).length > 0){
					// add a listener for iframe messages
					if (window.addEventListener) {
					    // if the player is Vimeo
					    if (vobj.length > 0) {
						   window.addEventListener('message', lqx.vimeoRecvMessage, false);
					    }
					} else {
					    // if the player is Vimeo
					    if (vobj.length > 0) {
						   window.attachEvent('onmessage', lqx.vimeoRecvMessage, false);
					    }
					}
				}
				*/
			});
		}

	},
	
	youtubePlayerCallback : function(e){
		// playerId : e.target.d.id
		// videoTitle : e.target.B.videoData.title
		// videoId : e.target.B.videoData.video_id
		// duration : e.target.getDuration()
		// currentTime : e.target.getCurrentTime() 
		if(e.data == null){
			// player ready, set progress to 0
			lqx.vars.youtubePlayers[e.target.d.id].progress = 0;
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
			if(e.target.getPlayerState() == 0) {
				label = 'Complete';
			}
			
			if(e.target.getPlayerState() == 1) {
				var label;
				currentTime = e.target.getCurrentTime();
				lqx.vars.youtubePlayers[e.target.d.id].timer = setTimeout(function(){lqx.youtubePlayerCallback(e)}, 250);
				if(currentTime == 0){
					label = 'Start';
				}
				else {
					duration = e.target.getDuration();
					if(Math.ceil( Math.ceil( (currentTime / duration) * 100 ) / 10 ) - 1 > lqx.vars.youtubePlayers[e.target.d.id].progress){
						lqx.vars.youtubePlayers[e.target.d.id].progress = Math.ceil( Math.ceil( (currentTime / duration) * 100 ) / 10 ) - 1;
						if(lqx.vars.youtubePlayers[e.target.d.id].progress != 10){
							label = (lqx.vars.youtubePlayers[e.target.d.id].progress * 10) + '%';
						}
						else {
							clearTimeout(lqx.vars.youtubePlayers[e.target.d.id].timer);
						}
					}
				}
			}
			
			if(label){
				ga('send', {
					'hitType': 'event', 
					'eventCategory' : 'Video',
					'eventAction' : 'Play',
					'eventLabel' : label,
					'eventValue': e.target.B.videoData.title + ' (http://youtube.com/v/' + e.target.B.videoData.video_id + ')'
				});
			}
			
		}
	},
	
	/*
	vimeoRecvMessage : function(e){
		e = e.originalEvent;
		console.log(e);
		if (e.origin == "http://player.vimeo.com") {
			var data = JSON.parse(e.data);
			switch (data.event) {
				case 'ready':
					onVimeoReady();
					break;
				
				case 'playProgress':
					vimeoSeconds = data.data.seconds;
					vimeoPercent = data.data.percent;
					vimeoDuration = data.data.duration;
					l = vimeoDuration || 0;
					n = vimeoTitle || 'undefined';
					p = 'Vimeo';
					t = vimeoSeconds;
					// if this is the first time we're seeing play (vimeoBegin == true) then fire a play event
					// this is done here because playProgress offers the duration value
					if (vimeoBegin) {
						// force the time to 0
						t = 0;
						// once we hear the initial play event we don't want to do it again. all future play events will be be handled by case 'play'
						vimeoBegin = false;
						// Site Catalyst
						s.Media.open(n, l, p);
						s.Media.play(n, t);
					}
					break;
				
				case 'play':
					if (!vimeoBegin) {
						// Site Catalyst
						s.Media.play(n, t);
					}
					break;
				
				case 'pause':
					// Site Catalyst
					s.Media.stop(n, t);
					break;
				
				case 'finish':
					// Site Catalyst
					s.Media.stop(n, t);
					s.Media.close(n);
					break;
				
				default:
					vimeoData[data.method] = data.value;
					break;
				
			}
		}
	},
	
	vimeoSendMessage : function(player,action,value){
		var data = {
			method: action
		};
		if (value) {
			data.value = value;
		}
		player.contentWindow.postMessage(JSON.stringify(data), vurl);
	},
	*/
};

// END Lyquix global object
// ***********************************


// Functions to execute when the DOM is ready
jQuery(document).ready(function(){
	
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
	
	// Trigger on window resize
	jQuery(window).resize(function() {
		
		// check screen size and trigger 'screensizechange' event 
		lqx.bodyScreenSize();
		
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
	
	// Open-close collapsed mobile menu
	jQuery('ul.menu').click(function(){
		if(jQuery(this).hasClass('collapse') || (jQuery(this).hasClass('collapse-xs') && jQuery('body').attr('screen') == 'xs') || (jQuery(this).hasClass('collapse-sm') && jQuery('body').attr('screen') == 'sm')) {
			if(jQuery(this).hasClass('expand')){
				jQuery(this).removeClass('expand');
			}
			else {
				jQuery(this).addClass('expand');
			}
		}
	});
	jQuery('ul.menu > li.parent').click(function(e){
		e.stopPropagation();
		if(jQuery(this).parent().hasClass('collapse') || (jQuery(this).parent().hasClass('collapse-xs') && jQuery('body').attr('screen') == 'xs') || (jQuery(this).parent().hasClass('collapse-sm') && jQuery('body').attr('screen') == 'sm')) {
			if(jQuery(this).hasClass('expand')){
				jQuery(this).removeClass('expand');
			}
			else {
				jQuery(this).addClass('expand');
			}
		}
	});
	
	// END listeners and triggers
	// ***********************************
	
	
	
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
				'onReady': 'lqx.youtubePlayerCallback', 
				'onStateChange': 'lqx.youtubePlayerCallback' 
			}
		});
	}					
}
