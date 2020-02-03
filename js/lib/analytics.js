/**
 * analytics.js - Analytics functionality
 *
 * @version     2.2.0
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

if(lqx && !('analytics' in lqx)) {
	lqx.analytics = (function(){
		var opts = {
			downloads: true,
			errors: {
				enabled: true,
				maxErrors: 100
			},
			outbound: true,
			scrollDepth: true,
			lyqBox: true,
			video: true,
			userActive: {
				enabled: true,
				idleTime: 5000,	// idle time (ms) before user is set to inactive
				throttle: 100,	// throttle period (ms)
				refresh: 250,	// refresh period (ms)
				maxTime: 1800000 // max time when tracking stops (ms)
			},
			// Google Analytics opts
			createParams: null,			// example: {default: {trackingId: 'UA-XXXXX-Y', cookieDomain: 'auto', fieldsObject: {}}}, where "default" is the tracker name
			setParams: null,			// example: {default: {dimension1: 'Age', metric1: 25}}
			requireParams: null,		// example: {default: {pluginName: 'displayFeatures', pluginOptions: {cookieName: 'mycookiename'}}}
			provideParams: null,		// example: {default: {pluginName: 'MyPlugin', pluginConstructor: myPluginFunc}}
			customParamsFuncs: null,	// example: myFunctionName
			abTestName: null,			// Set a test name to activate A/B Testing Dimension
			abTestNameDimension: null,		// Set the Google Analytics dimension number to use for test name
			abTestGroupDimension: null,		// Set the Google Analytics dimension number to use for group
		};

		var vars = {
			scrollDepthMax: null,
			youTubeIframeAPIReady: false,
			youTubeIframeAPIReadyAttempts: 0,
			youtubePlayers: {},
			vimeoPlayers: {},
			userActive: null,
			errorHashes: []
		};

		var init = function(){
			// Copy default opts and vars
			jQuery.extend(lqx.opts.analytics, opts);
			opts = lqx.opts.analytics;
			jQuery.extend(lqx.vars.analytics, vars);
			vars = lqx.vars.analytics;

			// Initialize on lqxready
			lqx.vars.window.on('lqxready', function() {
				// Initialize only if enabled
				if(lqx.opts.analytics.enabled) {
					lqx.log('Initializing `analytics`');

					// Load Google Analytics
					if(opts.createParams && opts.createParams.default && opts.createParams.default.trackingId) {
						gaCode();
					}

					// Set YouTube API callback function
					window.onYouTubeIframeAPIReady = function(){
						onYouTubeIframeAPIReady();
					};
				}
			});

			return lqx.analytics.init = true;
		};

		var gaCode = function() {
			lqx.log('Loading Google Analytics code');
			(function (i, s, o, g, r, a, m) {
				i.GoogleAnalyticsObject = r;
				i[r] = i[r] || function() {
					(i[r].q = i[r].q || []).push(arguments);
				};
				i[r].l = 1 * new Date();
				a = s.createElement(o);
				m = s.getElementsByTagName(o)[0];
				a.async = 1;
				a.src = g;
				m.parentNode.insertBefore(a, m);
			})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

			// Create commands
			var params = opts.createParams;
			lqx.log('createParams', params);
			ga('create', params.default.trackingId, params.default.cookieDomain, params.default.fieldsObject);
			Object.keys(params).forEach(function(tracker){
				if(tracker != 'default') {
					ga('create', params[tracker].trackingId, params[tracker].cookieDomain, tracker, params[tracker].fieldsObject);
				}
			});
			ga(gaReady);
		};

		// Handles Google Analytics pageview, setting first custom parameters
		var gaReady = function(tracker) {
			var trackers = ['default'];
			ga.getAll().forEach(function(tracker){
				if(tracker.get('name') != 't0') {
					trackers.push(tracker.get('name'));
				}
			});
			lqx.log('Executing gaReady', trackers);
			// Execute functions to set custom parameters
			jQuery.Deferred().done(
				function(){
					var params;
					// Set commands
					if(opts.setParams && typeof opts.setParams == 'object') {
						lqx.log('setParams', opts.setParams);
						params = opts.setParams;
						Object.keys(params).forEach(function(tracker){
							if(trackers.indexOf(tracker) > -1) {
								var cmd = 'set';
								if(tracker != 'default') cmd = tracker + '.set';
								Object.keys(params[tracker]).forEach(function(fieldName){
									ga(cmd, fieldName, params[tracker][fieldName]);
								});
							}
						});
					}

					// Require commands
					if(opts.requireParams && typeof opts.requireParams == 'object') {
						lqx.log('requireParams', opts.requireParams);
						params = opts.requireParams;
						Object.keys(params).forEach(function(tracker){
							if(trackers.indexOf(tracker) > -1) {
								var cmd = 'require';
								if(tracker != 'default') cmd = tracker + '.require';
								params[tracker].forEach(function(elem){
									ga(cmd, elem.pluginName, elem.pluginOptions);
								});
							}
						});
					}

					// Provide commands
					if(opts.provideParams && typeof opts.provideParams == 'object') {
						lqx.log('provideParams', opts.provideParams);
						params = opts.provideParams;
						Object.keys(params).forEach(function(tracker){
							if(trackers.indexOf(tracker) > -1) {
								var cmd = 'provide';
								if(tracker != 'default') cmd = tracker + '.provide';
								params[tracker].forEach(function(elem){
									ga(cmd, elem.pluginName, elem.pluginConstructor);
								});
							}
						});
					}

					// A/B testing opts
					if(opts.abTestName !== null && opts.abTestNameDimension !== null && opts.abTestGroupDimension !== null) {
						lqx.log('abTest params', {abTestName: opts.abTestName, abTestNameDimension: opts.abTestNameDimension, abTestGroupDimension: opts.abTestGroupDimension});
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
						ga('set', 'dimension' + opts.abTestNameDimension, opts.abTestName);
						ga('set', 'dimension' + opts.abTestGroupDimension, abTestGroup);
					}
				},

				function(){
					if(opts.customParamsFuncs) {
						lqx.log('customParamsFuncs', opts.customParamsFuncs);
						try {
							opts.customParamsFuncs();
						}
						catch(e) {
							lqx.error(e);
						}
					}
				},

				function(){
					lqx.log('Sending pageview event');
					// Send pageview
					ga('send', 'pageview');
					// Initialize tracking
					initTracking();
				}
			).resolve();
		};

		// Initialize tracking
		var initTracking = function() {
			// Track downloads and outbound links
			if(opts.outbound || opts.download) {
				lqx.log('Setting up outbound/download links tracking');

				function setup(elem) {
					elem = jQuery(elem);
					// check if it has an href attribute, otherwise it is just a page anchor
					if(elem.href) {
						// check if it is an outbound link, track as event
						if(opts.outbound && elem.host != location.host) {
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
									'hitCallback': function(){ window.location.href = url; } // Regarless of target value link will open in same window, otherwise it is blocked by browser
								});
							});
						}

						// check if it is a download link (not a webpage) and track as pageview
						else if(opts.downloads && (
							elem.href.match(/\.(gif|png|jpg|jpeg|tif|tiff|svg|webp|bmp)$/i) !== null ||
							elem.href.match(/\.(zip|rar|gzip|gz|7z|tar)$/i) !== null ||
							elem.href.match(/\.(exe|msi|dmg)$/i) !== null ||
							elem.href.match(/\.(txt|pdf|rtf|doc|docx|dot|dotx|xls|xlsx|xlt|xltx|ppt|pptx|pot|potx)$/i) !== null ||
							elem.href.match(/\.(aac|aiff|mp3|mp4|m4a|m4p|wav|wma)$/i) !== null ||
							elem.href.match(/\.(3gp|3g2|mkv|vob|ogv|ogg|webm|wma|m2v|m4v|mpg|mp2|mpeg|mpe|mpv|mov|avi|wmv|flv|f4v|swf|qt)$/i) !== null ||
							elem.href.match(/\.(xml|js|json|css|less|sass)$/i) !== null
						)) {
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
									'hitCallback': function(){ window.location.href = url; } // Regarless of target value link will open in same window, otherwise it is blocked by browser
								});
							});
						}
					}
				}
				// Find all a tags and cycle through them
				var elems = jQuery('a');

				elems.each(function(){
					var elem = this;
					setup(elem);
				});

				// Add a mutation handler for links added to the DOM
				lqx.mutation.addHandler('addNode', 'a', setup);
			}

			// Track errors
			if(opts.errors) {
				// Add listener to window element for javascript errors
				window.addEventListener('error', function(e) {
					var errStr = e.message + ' [' + e.error + '] ' + e.filename + ':' + e.lineno + ':' + e.colno;
					var errHash = lqx.util.hash(errStr);
					if(vars.errorHashes.indexOf(errHash) == -1 && vars.errorHashes.length < opts.errors.maxErrors) {
						vars.errorHashes.push(errHash);
						ga('send', {
							'hitType' : 'event',
							'eventCategory' : 'JavaScript Errors',
							'eventAction' : 'error',
							'eventLabel' : errStr,
							'nonInteraction' : true
						});
					}
					return false;
				});
			}

			// Track scroll depth
			if(opts.scrolldepth) {
				lqx.log('Setting up scroll depth tracking');

				// get the initial scroll position
				vars.scrollDepthMax = Math.ceil(((lqx.vars.window.scrollTop() + lqx.vars.window.height()) / lqx.vars.document.height()) * 10) * 10;
				// add listener to scrollthrottle event
				lqx.vars.window.on('scrollthrottle', function(){
					// capture the hightest scroll point, stop calculating once reached 100
					if(vars.scrollDepthMax < 100) {
						vars.scrollDepthMax = Math.max(vars.scrollDepthMax, Math.ceil(((lqx.vars.window.scrollTop() + lqx.vars.window.height()) / lqx.vars.document.height()) * 10) * 10);
						if(vars.scrollDepthMax > 100) vars.scrollDepthMax = 100;
					}
				});

				// add listener to page unload
				lqx.vars.window.on('beforeunload', function(){
					ga('send', {
						'hitType' : 'event',
						'eventCategory' : 'Scroll Depth',
						'eventAction' : vars.scrollDepthMax,
						'nonInteraction' : true
					});
				});
			}

			// Track LyqBox
			if(opts.lyqBox){
				// Do nothing here, all analytics will be handled in lyqbox.js
			}

			// Track video
			if(opts.video){
				lqx.log('Setting video tracking');

				// Load YouTube iframe API
				var tag = jQuery('<script src="https://www.youtube.com/iframe_api"></script>');
				tag.load(function(){
					vars.youTubeIframeAPIReady = true;
				});
				tag.appendTo('head');

				// Set listeners for Vimeo videos
				if (window.addEventListener) {
					window.addEventListener('message', vimeoReceiveMessage, false);
				}
				else {
					window.attachEvent('onmessage', vimeoReceiveMessage, false);
				}

				// Initialize YouTube or Vimeo videos
				jQuery('iframe[src*="youtube.com/embed/"], iframe[src*="player.vimeo.com/video/"]').each(function(){
					initVideoPlayerAPI(jQuery(this));
				});

				// Add a mututation observer to handle new videos added to the DOM
				lqx.mutation.addHandler('addNode', 'iframe[src*="youtube.com/embed/"], iframe[src*="player.vimeo.com/video/"]', function(e){
					initVideoPlayerAPI(jQuery(e));
				});
			}

			// Track active time
			if(opts.activetime) {
				lqx.log('Setting active time tracking');
				initUserActive();

				// Add listener on page unload
				lqx.vars.window.on('beforeunload', function(){
					ga('send', {
						'hitType' : 'event',
						'eventCategory' : 'User Active Time',
						'eventAction' : 'Percentage',
						'eventValue' : parseInt(100 * vars.userActive.activeTime / (vars.userActive.activeTime + vars.userActive.inactiveTime)),
						'nonInteraction' : true
					});

					ga('send', {
						'hitType' : 'event',
						'eventCategory' : 'User Active Time',
						'eventAction' : 'Active Time (ms)',
						'eventValue' : parseInt(vars.userActive.activeTime),
						'nonInteraction' : true
					});

					ga('send', {
						'hitType' : 'event',
						'eventCategory' : 'User Active Time',
						'eventAction' : 'Inactive Time (ms)',
						'eventValue' : parseInt(vars.userActive.inactiveTime),
						'nonInteraction' : true
					});
				});
			}
		};

		// initialize the js api for youtube and vimeo players
		var initVideoPlayerAPI = function(elem) {
			var src = elem.attr('src');
			var playerId = elem.attr('id');
			var urlconn;

			if(typeof src != 'undefined') {
				// Check youtube players
				if (src.indexOf('youtube.com/embed/') != -1) {
					// Add id if it doesn't have one
					if (typeof playerId == 'undefined') {
						playerId = 'youtubePlayer' + (Object.keys(vars.youtubePlayers).length);
						elem.attr('id', playerId);
					}

					// Reload with API support enabled
					if (src.indexOf('enablejsapi=1') == -1) {
						urlconn = '&';
						if (src.indexOf('?') == -1) {
							urlconn = '?';
						}
						elem.attr('src', src + urlconn + 'enablejsapi=1&version=3');
					}

					// Add to list of players
					if(!(playerId in vars.youtubePlayers)) {
						vars.youtubePlayers[playerId] = {};

						// add event callbacks to player
						onYouTubeIframeAPIReady();
					}
				}

				// Check vimeo players
				if(src.indexOf('player.vimeo.com/video/') != -1) {
					// Add id if it doesn't have one
					if (typeof playerId == 'undefined') {
						playerId = 'vimeoPlayer' + (Object.keys(vars.vimeoPlayers).length);
						elem.attr('id', playerId);
					}

					// Reload with API support enabled
					if (src.indexOf('api=1') == -1) {
						urlconn = '&';
						if (src.indexOf('?') == -1) {
							urlconn = '?';
						}
						elem.attr('src', src + urlconn + 'api=1&player_id=' + playerId);
					}

					// Add to list of players
					if(!(playerId in vars.vimeoPlayers)) {
						vars.vimeoPlayers[playerId] = {};
					}
				}
			}
		};

		var onYouTubeIframeAPIReady = function(){
			if(vars.youTubeIframeAPIReady && (typeof YT !== 'undefined') && YT && ('Player' in YT)) {
				Object.keys(vars.youtubePlayers).forEach(function(playerId) {
					if(!('playerObj' in vars.youtubePlayers[playerId])) {
						vars.youtubePlayers[playerId].playerObj = new YT.Player(playerId, {
							events: {
								'onReady': function(e){
									youtubePlayerReady(e, playerId);
								},
								'onStateChange': function(e){
									youtubePlayerStateChange(e, playerId);
								}
							}
						});
					}
				});
			}
			else {
				// keep track how many time we have attempted, retry unless it has been more than 30secs
				vars.youTubeIframeAPIReadyAttempts++;
				if(vars.youTubeIframeAPIReadyAttempts < 120) setTimeout(function(){
					onYouTubeIframeAPIReady();
				}, 250);
			}
		};

		var youtubePlayerReady = function(e, playerId){
			// check if iframe still exists
			if(jQuery('#' + playerId).length) {
				if(typeof vars.youtubePlayers[playerId].playerObj.getPlayerState != 'function') {
					//setTimeout(function(){lqx.youtubePlayerReady(e, playerId)}, 100);
				}
				else {
					if(!('progress' in vars.youtubePlayers[playerId])) {
						// set player object variables
						vars.youtubePlayers[playerId].progress = 0;
						vars.youtubePlayers[playerId].start = false;
						vars.youtubePlayers[playerId].complete = false;

						// get video data
						var videoData = vars.youtubePlayers[playerId].playerObj.getVideoData();
						vars.youtubePlayers[playerId].title = videoData.title;
						vars.youtubePlayers[playerId].duration = vars.youtubePlayers[playerId].playerObj.getDuration();

						if(!vars.youtubePlayers[playerId].start) youtubePlayerStateChange(e, playerId);
					}
				}
			}
			else {
				// iframe no longer exists, remove it from array
				delete vars.youtubePlayers[playerId];
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
				if(vars.youtubePlayers[playerId].playerObj.getPlayerState() === 0 && !vars.youtubePlayers[playerId].complete) {
					label = 'Complete';
					vars.youtubePlayers[playerId].complete = true;
				}

				// video playing
				if(vars.youtubePlayers[playerId].playerObj.getPlayerState() == 1) {
					// recursively call this function in 1s to keep track of video progress
					vars.youtubePlayers[playerId].timer = setTimeout(function(){youtubePlayerStateChange(e, playerId);}, 1000);

					// if this is the first time we get the playing status, track it as start
					if(!vars.youtubePlayers[playerId].start){
						label = 'Start';
						vars.youtubePlayers[playerId].start = true;
					}

					else {
						var currentTime = vars.youtubePlayers[playerId].playerObj.getCurrentTime();

						if(Math.ceil( Math.ceil( (currentTime / vars.youtubePlayers[playerId].duration) * 100 ) / 10 ) - 1 > vars.youtubePlayers[playerId].progress){
							vars.youtubePlayers[playerId].progress = Math.ceil( Math.ceil( (currentTime / vars.youtubePlayers[playerId].duration) * 100 ) / 10 ) - 1;

							if(vars.youtubePlayers[playerId].progress != 10){
								label = (vars.youtubePlayers[playerId].progress * 10) + '%';
							}

							else {
								clearTimeout(vars.youtubePlayers[playerId].timer);
							}
						}
					}
				}

				// video buffering
				if(vars.youtubePlayers[playerId].playerObj.getPlayerState() == 3) {
					// recursively call this function in 1s to keep track of video progress
					vars.youtubePlayers[playerId].timer = setTimeout(function(){youtubePlayerStateChange(e, playerId);}, 1000);
				}

				// send event to GA if label was set
				if(label){
					videoTrackingEvent(playerId, label, vars.youtubePlayers[playerId].title, vars.youtubePlayers[playerId].progress * 10);
				}
			}
			else {
				// iframe no longer exists, remove it from array
				delete vars.youtubePlayers[playerId];
			}

		};

		var vimeoReceiveMessage = function(e){

			// check message is coming from vimeo
			if((/^https?:\/\/player.vimeo.com/).test(e.origin)) {
				// parse the data
				var data = JSON.parse(e.data);
				player = vars.vimeoPlayers[data.player_id];
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
			vars.userActive = {
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
				if(vars.userActive.activeTime + vars.userActive.inactiveTime >= opts.userActive.maxTime) clearInterval(timer);
				// Update counters
				else {
					if(vars.userActive.active) {
						// update active time
						vars.userActive.activeTime += (new Date()).getTime() - vars.userActive.lastChangeTime;
					}
					else {
						// update inactive time
						vars.userActive.inactiveTime += (new Date()).getTime() - vars.userActive.lastChangeTime;
					}
					// update last change time
					vars.userActive.lastChangeTime = (new Date()).getTime();
				}
			}, opts.userActive.refresh);

			// initialize active state
			userActive();
		};

		// function called to indicate user is currently active (heartbeat)
		var userActive = function() {
			// if no throttle
			if(!vars.userActive.throttle) {
				vars.userActive.throttle = true;
				setTimeout(function(){vars.userActive.throttle = false;}, opts.userActive.throttle);
				// when changing from being inactive
				if(!vars.userActive.active) {
					// set state to active
					vars.userActive.active = true;
					// update inactive time
					vars.userActive.inactiveTime += (new Date()).getTime() - vars.userActive.lastChangeTime;
					// update last change time
					vars.userActive.lastChangeTime = (new Date()).getTime();
				}

				// set state to active
				vars.userActive.active = true;

				// after idle time turn inactive
				clearTimeout(vars.userActive.timer);
				vars.userActive.timer = setTimeout(function(){userInactive();}, opts.userActive.idleTime);
			}
		};

		// function called to indicate the user is currently inactive
		var userInactive = function() {
			// set state to inactive
			vars.userActive.active = false;
			// clear timer
			clearTimeout(vars.userActive.timer);
			// add active time
			vars.userActive.activeTime += (new Date()).getTime() - vars.userActive.lastChangeTime;
			// update last change time
			vars.userActive.lastChangeTime = (new Date()).getTime();
		};

		return {
			init: init
		};
	})();
	lqx.analytics.init();
}
