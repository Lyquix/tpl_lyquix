/**
 * lyquix.analytics.js - Analytics functionality
 *
 * @version     2.0.0
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

if(lqx && typeof lqx.analytics == 'undefined') {
	lqx.analytics = (function(){
		var defaults = {
			settings: {
				downloads: true,
				outbound: true,
				scrollDepth: true,
				photoGallery: true,
				video: true,
				userActive: {
					enabled: true,
					idleTime: 5000,	// idle time (ms) before user is set to inactive
					throttle: 100,	// throttle period (ms)
					refresh: 250,	// refresh period (ms)
					maxTime: 1800000 // max time when tracking stops (ms)
				},
				// Google Analytics settings
				createParams: null,			// example: {default: {trackingId: 'UA-XXXXX-Y', cookieDomain: 'auto', fieldsObject: {}}}, where "default" is the tracker name
				setParams: null,			// example: {default: {dimension1: 'Age', metric1: 25}}
				requireParams: null,		// example: {default: {pluginName: 'displayFeatures', pluginOptions: {cookieName: 'mycookiename'}}}
				provideParams: null,		// example: {default: {pluginName: 'MyPlugin', pluginConstructor: myPluginFunc}}
				customParamsFuncs: null,	// example: {default: myCustomFunc}
				abTestName: null,			// Set a test name to activate A/B Testing Dimension
				abTestNameDimension: null,		// Set the Google Analytics dimension number to use for test name
				abTestGroupDimension: null,		// Set the Google Analytics dimension number to use for group
			},
			vars: {
				scrollDepthMax: null,
				youTubeIframeAPIReady: false,
				youtubePlayers: {},
				vimeoPlayers: {},
				userActive: null
			}
		};

		var init = function(){
			// Initialize only if enabled
			if(lqx.settings.analytics.enabled) {
				// Copy default settings and vars
				jQuery.extend(lqx.settings.analytics, defaults.settings);
				jQuery.extend(lqx.vars.analytics, defaults.vars);

				lqx.vars.window.on('lqxready', function() {
					if(lqx.settings.analytics.createParams && lqx.settings.analytics.createParams.default && lqx.settings.analytics.createParams.default.trackingId) {
						gaCode();
					}
				});
			}

			return lqx.analytics.init = true;
		};

		var gaCode = function() {
			jQuery('<script>' +
				"(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){" +
				"(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o)," +
				"m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)" +
				"})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');" +
				"ga(lqx.analytics.gaReady);" +
				"</script>").appendTo(jQuery('head'));
		};

		// Handles Google Analytics pageview, setting first custom parameters
		var gaReady = function(tracker) {
			// Execute functions to set custom parameters
			jQuery.Deferred().done(
				function(){
					// Create commands
					if(lqx.settings.analytics.createParams && typeof lqx.settings.analytics.createParams == 'object') {
						var params = lqx.settings.analytics.createParams;
						Object.keys(params).forEach(function(tracker){
							if(tracker == 'default') ga('create', params[tracker].trackingId, params[tracker].cookieDomain, params[tracker].fieldsObject);
							else ga('create', params[tracker].trackingId, params[tracker].cookieDomain, tracker, params[tracker].fieldsObject);
						});
					}
				},
				
				function(){
					var params;
					
					// Set commands
					if(lqx.settings.analytics.setParams && typeof lqx.settings.analytics.setParams == 'object') {
						params = lqx.settings.analytics.setParams;
						Object.keys(params).forEach(function(tracker){
							var cmd = 'set';
							if(tracker != 'default') cmd = tracker + '.set';
							Object.keys(params[tracker]).forEach(function(fieldName){
								ga(cmd, fieldName, params[tracker][fieldName]);
							});
						});
					}
					
					// Require commands
					if(lqx.settings.analytics.requireParams && typeof lqx.settings.analytics.requireParams == 'object') {
						params = lqx.settings.analytics.requireParams;
						Object.keys(params).forEach(function(tracker){
							var cmd = 'require';
							if(tracker != 'default') cmd = tracker + '.require';
							params[tracker].forEach(function(elem){
								ga(cmd, elem.pluginName, elem.pluginOptions);
							});
						});
					}
					
					// Provide commands
					if(lqx.settings.analytics.provideParams && typeof lqx.settings.analytics.provideParams == 'object') {
						params = lqx.settings.analytics.provideParams;
						Object.keys(params).forEach(function(tracker){
							var cmd = 'provide';
							if(tracker != 'default') cmd = tracker + '.provide';
							params[tracker].forEach(function(elem){
								ga(cmd, elem.pluginName, elem.pluginConstructor);
							});
						});
					}
					
					// A/B testing settings
					if(lqx.settings.analytics.abTestName !== null && lqx.settings.analytics.abTestNameDimension !== null && lqx.settings.analytics.abTestGroupDimension !== null) {
						// get a/b test group cookie
						var abTestGroup = lqx.utils.cookie('abTestGroup');
						if(abTestGroup === null) {
							// set a/b test group
							if(Math.random() < 0.5) abTestGroup = 'A';
							else abTestGroup = 'B';
							lqx.utils.cookie('abTestGroup', abTestGroup, {maxAge: 30*24*60*60, path: '/'});
						}
						// Set body attribute that can be used by css and js
						lqx.vars.body.attr('data-abtest', abTestGroup);
						
						// Set the GA dimensions
						ga('set', 'dimension' + lqx.settings.analytics.abTestNameDimension, lqx.settings.analytics.abTestName);
						ga('set', 'dimension' + lqx.settings.analytics.abTestGroupDimension, abTestGroup);
					}
				},
				
				function(){
					if(typeof lqx.settings.analytics.customParamsFuncs == 'function') {
						try {
							lqx.settings.analytics.customParamsFuncs();
						}
						catch(e) {
							lqx.error(e);
						}
					}
				},
				
				function(){
					// Send pageview
					ga('send', 'pageview');
					
					// Initialize tracking
					initTracking();
				}
			).resolve();
		};

		// initialize google analytics tracking
		var initTracking = function() {
			// track downloads and outbound links
			if(lqx.settings.analytics.outbound || lqx.settings.analytics.download){
				// find all a tags and cycle through them
				jQuery('a').each(function(){
					var elem = this;
					// check if it has an href attribute, otherwise it is just a page anchor
					if(elem.href) {

						// check if it is an outbound link, track as event
						if(lqx.settings.analytics.outbound && elem.host != location.host) {

							jQuery(elem).click(function(e){
								e.preventDefault();
								var url = elem.href;
								var label = url;
								if(jQuery(elem).attr('title')) {
									label = jQuery(elem).attr('title') + ' [' + url + ']';
								}
								ga('send', {
									'hitType': 'event',
									'eventCategory': 'Outbound Links',
									'eventAction': 'click',
									'eventLabel': label,
									'nonInteraction': true,
									'hitCallback': function(){ window.location.href = url; } // regarless of target value link will open in same window, otherwise it is blocked by browser
								});
							});
						}

						// check if it is a download link (not a webpage) and track as pageview
						else if(lqx.settings.analytics.downloads && elem.pathname.match(/\.(htm|html|php)$/i)[1] === null ) {
							jQuery(elem).click(function(e){
								e.preventDefault();
								var url = elem.href;
								var loc = elem.protocol + '//' + elem.hostname + elem.pathname + elem.search;
								var page = elem.pathname + elem.search;
								var title = 'Download: ' + page;
								if(jQuery(elem).attr('title')) {
									title = jQuery(elem).attr('title');
								}
								ga('send', {
									'hitType': 'pageview',
									'location': loc,
									'page': page,
									'title': title,
									'hitCallback': function(){ window.location.href = url; } // regarless of target value link will open in same window, otherwise it is blocked by browser
								});
							});
						}
					}
				});

			}


			// track scroll depth
			if(lqx.settings.analytics.scrolldepth){

				// get the initial scroll position
				lqx.vars.analytics.scrollDepthMax = Math.ceil(((lqx.vars.window.scrollTop() + lqx.vars.window.height()) / lqx.vars.document.height()) * 10) * 10;

				// add listener to scrollthrottle event
				lqx.vars.window.on('scrollthrottle', function(){
					// capture the hightest scroll point, stop calculating once reached 100
					if(lqx.vars.analytics.scrollDepthMax < 100) {
						lqx.vars.analytics.scrollDepthMax = Math.max(lqx.vars.analytics.scrollDepthMax, Math.ceil(((lqx.vars.window.scrollTop() + lqx.vars.window.height()) / lqx.vars.document.height()) * 10) * 10);
						if(lqx.vars.analytics.scrollDepthMax > 100) lqx.vars.analytics.scrollDepthMax = 100;
					}
				});

				// add listener to page unload
				lqx.vars.window.on('unload', function(){

					ga('send', {
						'hitType' : 'event',
						'eventCategory' : 'Scroll Depth',
						'eventAction' : lqx.vars.analytics.scrollDepthMax,
						'nonInteraction' : true
					});

				});

			}

			// track photo galleries
			if(lqx.settings.analytics.photogallery){
				lqx.vars.html.on('click', 'a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox]', function(){
					// send event for gallery opened
					ga('send', {
						'hitType': 'event',
						'eventCategory' : 'Photo Gallery',
						'eventAction' : 'Open'
					});

				});

				lqx.vars.html.on('load', 'img.lb-image', function(){
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
			if(lqx.settings.analytics.video){

				// load youtube iframe api
				var tag = document.createElement('script');
				tag.src = 'https://www.youtube.com/iframe_api';
				tag.onload = function(){lqx.vars.analytics.youTubeIframeAPIReady = true;};
				var firstScriptTag = document.getElementsByTagName('script')[0];
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

				// set listeners for vimeo videos
				if (window.addEventListener) {
					window.addEventListener('message', vimeoReceiveMessage, false);
				}
				else {
					window.attachEvent('onmessage', vimeoReceiveMessage, false);
				}

				// detect if there are any youtube or vimeo videos, activate js api and add id
				jQuery('iframe').each(function(){

					var elem = jQuery(this);
					// init js api for video player
					initVideoPlayerAPI(elem);

				});

			}

			// track active time
			if(lqx.settings.analytics.activetime) {
				// Add listener on page unload
				lqx.vars.window.on('unload', function(){

					ga('send', {
						'hitType' : 'event',
						'eventCategory' : 'User Active Time',
						'eventAction' : 'Percentage',
						'eventValue' : parseInt(100 * lqx.vars.analytics.userActive.activeTime / (lqx.vars.analytics.userActive.activeTime + lqx.vars.analytics.userActive.inactiveTime)),
						'nonInteraction' : true
					});

					ga('send', {
						'hitType' : 'event',
						'eventCategory' : 'User Active Time',
						'eventAction' : 'Active Time (ms)',
						'eventValue' : parseInt(lqx.vars.analytics.userActive.activeTime),
						'nonInteraction' : true
					});

					ga('send', {
						'hitType' : 'event',
						'eventCategory' : 'User Active Time',
						'eventAction' : 'Inactive Time (ms)',
						'eventValue' : parseInt(lqx.vars.analytics.userActive.inactiveTime),
						'nonInteraction' : true
					});

				});
			}

		};

		// handle video players added dynamically
		var videoPlayerMutationHandler = function(mutRec) {

			jQuery(mutRec.addedNodes).each(function(){

				var elem = jQuery(this);
				if (typeof elem.prop('tagName') !== 'undefined'){
					var tag = elem.prop('tagName').toLowerCase();
					if (tag == 'iframe') {
						// init js api for video player
						initVideoPlayerAPI(elem);
					}	    
				}
			});

		};

		// initialize the js api for youtube and vimeo players
		var initVideoPlayerAPI = function(elem) {

			var src = elem.attr('src');
			var playerId = elem.attr('id');
			var urlconn;

			if(typeof src != 'undefined') {
				// check youtube players
				if (src.indexOf('youtube.com/embed/') != -1) {
					// add id if it doesn't have one
					if (typeof playerId == 'undefined') {
						playerId = 'youtubePlayer' + (Object.keys(lqx.vars.analytics.youtubePlayers).length);
						elem.attr('id', playerId);
					}

					// reload with API support enabled
					if (src.indexOf('enablejsapi=1') == -1) {
						urlconn = '&';
						if (src.indexOf('?') == -1) {
							urlconn = '?';
						}
						elem.attr('src', src + urlconn + 'enablejsapi=1&version=3');
					}

					// add to list of players
					if(typeof lqx.vars.analytics.youtubePlayers[playerId] == 'undefined') {
						lqx.vars.analytics.youtubePlayers[playerId] = {};

						// add event callbacks to player
						onYouTubeIframeAPIReady();
					}
				}

				// check vimeo players
				if(src.indexOf('player.vimeo.com/video/') != -1) {
					// add id if it doesn't have one
					if (typeof playerId == 'undefined') {
						playerId = 'vimeoPlayer' + (Object.keys(lqx.vars.analytics.vimeoPlayers).length);
						elem.attr('id', playerId);
					}

					// reload with API support enabled
					if (src.indexOf('api=1') == -1) {
						urlconn = '&';
						if (src.indexOf('?') == -1) {
							urlconn = '?';
						}
						elem.attr('src', src + urlconn + 'api=1&player_id=' + playerId);
					}

					// add to list of players
					if(typeof lqx.vars.analytics.vimeoPlayers[playerId] == 'undefined') {
						lqx.vars.analytics.vimeoPlayers[playerId] = {};
					}

				}
			}
		};

		var youtubePlayerReady = function(e, playerId){
			// check if iframe still exists
			if(jQuery('#' + playerId).length) {
				if(typeof lqx.vars.analytics.youtubePlayers[playerId].playerObj.getPlayerState != 'function') {
					//setTimeout(function(){lqx.youtubePlayerReady(e, playerId)}, 100);
				}
				else {
					if(typeof lqx.vars.analytics.youtubePlayers[playerId].progress == 'undefined') {
						// set player object variables
						lqx.vars.analytics.youtubePlayers[playerId].progress = 0;
						lqx.vars.analytics.youtubePlayers[playerId].start = false;
						lqx.vars.analytics.youtubePlayers[playerId].complete = false;

						// get video data
						var videoData = lqx.vars.analytics.youtubePlayers[playerId].playerObj.getVideoData();
						lqx.vars.analytics.youtubePlayers[playerId].title = videoData.title;
						lqx.vars.analytics.youtubePlayers[playerId].duration = lqx.vars.analytics.youtubePlayers[playerId].playerObj.getDuration();

						if(!lqx.vars.analytics.youtubePlayers[playerId].start) youtubePlayerStateChange(e, playerId);
					}
				}
			}
			else {
				// iframe no longer exists, remove it from array
				delete lqx.vars.analytics.youtubePlayers[playerId];
			}
		};

		var youtubePlayerStateChange = function(e, playerId){
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
				if(lqx.vars.analytics.youtubePlayers[playerId].playerObj.getPlayerState() === 0 && !lqx.vars.analytics.youtubePlayers[playerId].complete) {
					label = 'Complete';
					lqx.vars.analytics.youtubePlayers[playerId].complete = true;
				}

				// video playing
				if(lqx.vars.analytics.youtubePlayers[playerId].playerObj.getPlayerState() == 1) {

					// recursively call this function in 1s to keep track of video progress
					lqx.vars.analytics.youtubePlayers[playerId].timer = setTimeout(function(){youtubePlayerStateChange(e, playerId);}, 1000);

					// if this is the first time we get the playing status, track it as start
					if(!lqx.vars.analytics.youtubePlayers[playerId].start){
						label = 'Start';
						lqx.vars.analytics.youtubePlayers[playerId].start = true;
					}

					else {

						var currentTime = lqx.vars.analytics.youtubePlayers[playerId].playerObj.getCurrentTime();

						if(Math.ceil( Math.ceil( (currentTime / lqx.vars.analytics.youtubePlayers[playerId].duration) * 100 ) / 10 ) - 1 > lqx.vars.analytics.youtubePlayers[playerId].progress){

							lqx.vars.analytics.youtubePlayers[playerId].progress = Math.ceil( Math.ceil( (currentTime / lqx.vars.analytics.youtubePlayers[playerId].duration) * 100 ) / 10 ) - 1;

							if(lqx.vars.analytics.youtubePlayers[playerId].progress != 10){
								label = (lqx.vars.analytics.youtubePlayers[playerId].progress * 10) + '%';
							}

							else {
								clearTimeout(lqx.vars.analytics.youtubePlayers[playerId].timer);
							}
						}
					}
				}

				// video buffering
				if(lqx.vars.analytics.youtubePlayers[playerId].playerObj.getPlayerState() == 3) {
					// recursively call this function in 1s to keep track of video progress
					lqx.vars.analytics.youtubePlayers[playerId].timer = setTimeout(function(){youtubePlayerStateChange(e, playerId);}, 1000);
				}

				// send event to GA if label was set
				if(label){
					videoTrackingEvent(playerId, label, lqx.vars.analytics.youtubePlayers[playerId].title, lqx.vars.analytics.youtubePlayers[playerId].progress * 10);
				}
			}
			else {
				// iframe no longer exists, remove it from array
				delete lqx.vars.analytics.youtubePlayers[playerId];
			}

		};

		var vimeoReceiveMessage = function(e){

			// check message is coming from vimeo
			if((/^https?:\/\/player.vimeo.com/).test(e.origin)) {
				// parse the data
				var data = JSON.parse(e.data);
				player = lqx.vars.analytics.vimeoPlayers[data.player_id];
				var label;

				switch (data.event) {

					case 'ready':
						// set player object variables
						player.progress = 0;
						player.start = false;
						player.complete = false;

						// set the listeners
						vimeoSendMessage(data.player_id, e.origin, 'addEventListener', 'play');
						vimeoSendMessage(data.player_id, e.origin, 'addEventListener', 'finish');
						vimeoSendMessage(data.player_id, e.origin, 'addEventListener', 'playProgress');

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
					videoTrackingEvent(data.player_id, label, 'No title', player.progress * 10); // vimeo doesn't provide a mechanism for getting the video title
				}

			}



		};

		var vimeoSendMessage = function(playerId, origin, action, value){

			var data = {
				method: action
			};

			if (value) {
				data.value = value;
			}

			document.getElementById(playerId).contentWindow.postMessage(JSON.stringify(data), origin);

		};

		var videoTrackingEvent = function(playerId, label, title, value) {
			ga('send', {
				'hitType': 'event',
				'eventCategory' : 'Video',
				'eventAction' : label,
				'eventLabel' : title + ' (' + jQuery('#' + playerId).attr('src').split('?')[0] + ')',
				'eventValue': value
			});

		};

		// trigger events for user active/inactive and count active time
		var initUserActive = function()	{

			// initialize the variables
			lqx.vars.analytics.userActive = {
				active: true,		// is user currently active
				timer: false,		// setTimeout timer
				throttle: false,	// is throttling currently active
				lastChangeTime: (new Date()).getTime(),
				activeTime: 0,
				inactiveTime: 0,
			};

			// add listener to common user action events
			lqx.vars.window.on('orientationchange resize focusin', function(){userActive();});
			lqx.vars.document.on('mousedown mousemove mouseup wheel keydown keypress keyup touchstart touchmove touchend', function(){userActive();});

			// add listener for window on focus out, become inactive immediately
			lqx.vars.window.on('focusout', function(){userInactive();});

			// refresh active and inactive time counters
			var timer = setInterval(function(){
				// Stop updating if maxTime is reached
				if(lqx.vars.analytics.userActive.activeTime + lqx.vars.analytics.userActive.inactiveTime >= lqx.vars.analytics.userActive.maxTime) clearInterval(timer);
				// Update counters
				else {
					if(lqx.vars.analytics.userActive.active) {
						// update active time
						lqx.vars.analytics.userActive.activeTime += (new Date()).getTime() - lqx.vars.analytics.userActive.lastChangeTime;
					}
					else {
						// update inactive time
						lqx.vars.analytics.userActive.inactiveTime += (new Date()).getTime() - lqx.vars.analytics.userActive.lastChangeTime;
					}
					// update last change time
					lqx.vars.analytics.userActive.lastChangeTime = (new Date()).getTime();
				}
			}, lqx.settings.userActive.refresh);

			// initialize active state
			lqx.userActive();

		};

		// function called to indicate user is currently active (heartbeat)
		var userActive = function() {
			// if no throttle
			if(!lqx.vars.analytics.userActive.throttle) {
				lqx.vars.analytics.userActive.throttle = true;
				setTimeout(function(){lqx.vars.analytics.userActive.throttle = false;}, lqx.settings.userActive.throttle);
				// when changing from being inactive
				if(!lqx.vars.analytics.userActive.active) {
					// set state to active
					lqx.vars.analytics.userActive.active = true;
					// update inactive time
					lqx.vars.analytics.userActive.inactiveTime += (new Date()).getTime() - lqx.vars.analytics.userActive.lastChangeTime;
					// update last change time
					lqx.vars.analytics.userActive.lastChangeTime = (new Date()).getTime();
				}

				// set state to active
				lqx.vars.analytics.userActive.active = true;

				// after idle time turn inactive
				clearTimeout(lqx.vars.analytics.userActive.timer);
				lqx.vars.analytics.userActive.timer = setTimeout(function(){userInactive();}, lqx.settings.userActive.idleTime);
			}
		};

		// function called to indicate the user is currently inactive
		var userInactive = function() {
			// set state to inactive
			lqx.vars.analytics.userActive.active = false;
			// clear timer
			clearTimeout(lqx.vars.analytics.userActive.timer);
			// add active time
			lqx.vars.analytics.userActive.activeTime += (new Date()).getTime() - lqx.vars.analytics.userActive.lastChangeTime;
			// update last change time
			lqx.vars.analytics.userActive.lastChangeTime = (new Date()).getTime();
		};

		return {
			init: init,
			gaReady: gaReady
		};
	})();
	lqx.analytics.init();
}

window.onYouTubeIframeAPIReady = function(){
	if(lqx.vars.analytics.youTubeIframeAPIReady && (typeof YT !== 'undefined') && YT && YT.Player) {
		Object.keys(lqx.vars.analytics.youtubePlayers).forEach(function(playerId) {
			if(typeof lqx.vars.analytics.youtubePlayers[playerId].playerObj == 'undefined') {
				lqx.vars.analytics.youtubePlayers[playerId].playerObj = new YT.Player(playerId, {
					events: {
						'onReady': function(e){lqx.youtubePlayerReady(e, playerId);},
						'onStateChange': function(e){lqx.youtubePlayerStateChange(e, playerId);}
					}
				});
			}
		});
	}
	else {
		// keep track how many time we have attempted, retry unless it has been more than 30secs
		lqx.vars.analytics.youTubeIframeAPIReadyAttempts++;
		if(lqx.vars.analytics.youTubeIframeAPIReadyAttempts < 120) setTimeout(function(){onYouTubeIframeAPIReady();},250);
	}
};
