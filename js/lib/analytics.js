/**
 * analytics.js - Analytics functionality
 *
 * @version     2.4.0
 * @package     wp_theme_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/wp_theme_lyquix
 */

if(lqx && !('analytics' in lqx)) {
	lqx.analytics = (function(){
		var opts = {
			downloads: {
				enabled: true,
				extensions: [
					// Images
					'gif','png','jpg','jpeg','tif','tiff','svg','webp','bmp',
					// Compressed
					'zip','rar','gzip','gz','7z','tar',
					// Executables, installation, binaries
					'exe','msi','dmg','dll',
					// Documents
					'txt','log','pdf','rtf','doc','docx','dot','dotx','xls','xlsx','xlt','xltx','ppt','pptx','pot','potx',
					// Audio
					'aac','aiff','mp3','mp4','m4a','m4p','wav','wma',
					// Video
					'3gp','3g2','mkv','vob','ogv','ogg','webm','wma','m2v','m4v','mpg','mp2','mpeg','mpe','mpv','mov','avi','wmv','flv','f4v','swf','qt',
					// Web code
					'xml','js','json','jsonp','css','less','sass','scss'
				],
				hitType: 'pageview', // pageview or event
				nonInteraction: false // for events only
			},
			errors: {
				enabled: true,
				maxErrors: 100,
				ieVersion: 11 // IE older than this version will be ignored
			},
			outbound: {
				enabled: true,
				exclude: [], // Array of domains to be excluded, not considered external sites
				nonInteraction: true
			},
			scrollDepth: {
				enabled: true
			},
			video: {
				enabled: true,
				nonInteraction: false
			},
			userActive: {
				enabled: true,
				idleTime: 5000,	// idle time (ms) before user is set to inactive
				throttle: 100,	// throttle period (ms)
				refresh: 250,	// refresh period (ms)
				maxTime: 1800000 // max time when tracking stops (ms)
			},
			rageClicks: {
				enabled: true,
				minClicks: 3, // Look for 3 consecutive clicks or more...
				maxTime: 5, // ... within 5 seconds...
				maxDistance: 100 // within a 100x100 pixel area
			},
			// Google Analytics opts
			usingGTM: false,		// set to true if Google Analytics is loaded via GTM
			sendPageview: true,		// set to false if you don't want to send the Pageview (e.g. when sent via GTM)
			trackingId: null,		// Google Analytics tracking ID
			useAnalyticsJS: true, 	// Use analytics.js instead of gtag for Universal Google Analytics (old GA)
			measurementId: null, 		// Google Analytics 4 measurement ID
			abTest: {
				name: null,			// Set a test name to activate A/B Testing Dimension
				dimension: null,		// Set the Google Analytics dimension that will save the test name and assigned group
				split: 0.5, 		// Sets the percentage of users that will be assigned to group A, default if 50%
				removeNoMatch: true,		// Set to false to hide no-match elements instead of removing them from DOM
				cookieDays: 30,		// How long should the group assignment be saved in cookie, default 30 days
				displaySelector: '[data-abtest], [class*="abtest-"]', // Do not change
			}
		};

		var vars = {
			abTestGroup: null,
			scrollDepthMax: null,
			gaReady: false, 	// Track status of ga function
			gtagReady: false,	// Track status of gtag function
			youTubeIframeAPIReady: false,
			youtubePlayers: {},
			vimeoPlayers: {},
			userActive: null,
			errorHashes: [],
			clickEvents: []
		};

		var init = function(){
			// Copy default opts and vars
			jQuery.extend(true, lqx.opts.analytics, opts);
			opts = lqx.opts.analytics;
			jQuery.extend(true, lqx.vars.analytics, vars);
			vars = lqx.vars.analytics;

			// Initialize on lqxready
			lqx.vars.window.on('lqxready', function() {
				// Initialize only if enabled
				if(opts.enabled) {
					lqx.log('Initializing `analytics`');

					// Load Google Analytics 4
					if(!opts.usingGTM && opts.measurementId) {
						gtagCode(opts.measurementId);
					}
					// Load Google Analytics
					if(!opts.usingGTM && opts.trackingId) {
						if(opts.useAnalyticsJS)
						gaCode(opts.trackingId);
					}
					// Wait for GA to be ready before starting tracking functions
					checkGA();

					// Set YouTube API callback function
					window.onYouTubeIframeAPIReady = function(){
						onYouTubeIframeAPIReady();
					};
				}
			});

			// Run only once
			lqx.analytics.init = function(){
				lqx.warn('lqx.analytics.init already executed');
			};

			return true;
		};

		var checkGA = function(count) {
			if(count == undefined) count = 0;
			if('GoogleAnalyticsObject' in window && typeof window.ga == 'function') initTracking();
			else if(count < 600) setTimeout(function() {checkGA(count++);}, 100);

			if (!count) count = 0;

			// Check for ga ready or not in use
			if (!opts.trackingId || !opts.useAnalyticsJS) vars.gaReady = true;
			if ('ga' in window && typeof window['ga'] == 'function') vars.gaReady = true;

			// Check for gtag ready or not in use
			if (!opts.measurementId && opts.useAnalyticsJS) vars.gtagReady = true;
			if ('gtag' in window && typeof window['gtag'] == 'function') vars.gtagReady = true;

			// All ready?
			if (vars.gaReady && vars.gtagReady) initTracking();
			else if (count < 600) setTimeout(() => {
				checkGA(count++);
			}, 100);
		};

		var gtagCode = function(tagId) {
			lqx.log('Loading Google Analytics code (gtag.js)');

			// Create the script element
			let ga4Script = document.createElement('script');
			ga4Script.async = true;
			ga4Script.src = 'https://www.googletagmanager.com/gtag/js?id=' + tagId;

			// Append the first script element to the head
			document.head.appendChild(ga4Script);

			// Create the second script element
			ga4Script = document.createElement('script');
			ga4Script.innerHTML = `
				window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				gtag('js', new Date());
				gtag('config', '${tagId}'${opts.sendPageview ? '' : ", {'send_page_view': false}"});
			`;

			// Append the second script element to the head
			document.head.appendChild(ga4Script);
		};

		var gaCode = function(tagId) {
			lqx.log('Loading Google Analytics code (analytics.js)');

			// Create the script element
			let gaScript = document.createElement('script');
			gaScript.innerHTML = `
				(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
				(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
				m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
				})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
				ga('create', '${tagId}', 'auto');
				${opts.sendPageview ? "ga('send', 'pageview');" : ''}
			`;

			// Append the second script element to the head
			document.head.appendChild(gaScript);
		};

		// Sends google analytics pageview to ga and gtag as available
		/**
		 *
		 * pageInfo = {
		 *  url
		 *  title
		 *  callback
		 * }
		 */
		let sendGAPageview = (pageInfo) => {
			// Send event with ga
			if (vars.gaReady) {
				if (pageInfo.url && pageInfo.title) {
					let url = new URL(pageInfo.url, window.location.href);

					let pageParams = {
						hitType: 'pageview',
						location: url.href,
						page: url.pathname + url.search,
						title: pageInfo.title
					};

					if('callback' in pageInfo) pageParams['hitCallback'] = pageInfo.callback;

					ga('send', pageParams);
				}
				else ga('send', 'pageview');
			}

			// Send event with gtag
			if (vars.gtagReady) {
				if (pageInfo.url && pageInfo.title) {
					let url = new URL(pageInfo.url, window.location.href);

					let pageParams = {
						page_location: url.href,
						page_path: url.pathname + url.search,
						page_title: pageInfo.title
					};

					if('callback' in pageInfo) pageParams['event_callback'] = pageInfo.callback;

					gtag('event', 'page_view', pageParams);
				}
				else gtag('event', 'page_view');
			}
		};

		// Sends google analytics events to ga and gtag as available
		/**
		 * eventInfo = {
		 * 	eventName - if none passed, eventAction will be used as eventName
		 * 	eventAction
		 * 	eventCategory
		 * 	eventLabel
		 * 	nonInteraction - boolean
		 * 	hitCallback - function
		 * }
		 */
		let sendGAEvent = (eventInfo) => {
			let ga4PropMap = {
				eventCategory: 'event_category',
				eventLabel: 'event_label',
				eventAction: 'event_action',
				nonInteraction: 'non_interaction',
				hitCallback: 'event_callback'
			};

			// Send event with ga
			if (vars.gaReady) {
				let eventParams = {
					hitType: 'event'
				};

				Object.keys(ga4PropMap).forEach((prop) => {
					if (prop in eventInfo && eventInfo[prop]) eventParams[prop] = eventInfo[prop];
				});

				// send event
				ga('send', eventParams);
			}

			// Send event with gtag
			if (vars.gtagReady) {
				let eventParams = {};

				Object.keys(ga4PropMap).forEach((prop) => {
					if (prop in eventInfo && eventInfo[prop]) eventParams[ga4PropMap[prop]] = eventInfo[prop];
				});

				let eventName = ('eventName' in eventInfo && eventInfo.eventName) ? eventInfo.eventName : eventInfo.eventAction;

				// send event
				gtag('event', eventName, eventParams);
			}
		};


		// Initialize tracking
		var initTracking = function() {
			// Track downloads and outbound links
			if(opts.outbound.enabled || opts.downloads.enabled) {
				lqx.log('Setting up outbound/download links tracking');

				function setup(elems) {
					if(elems instanceof Node) {
						// Not an array, convert to an array
						elems = [elems];
					}
					else if(elems instanceof jQuery) {
						// Convert jQuery to array
						elems = elems.toArray();
					}
					if(elems.length) {
						lqx.log('Setting up ' + elems.length + ' download links', elems);
						elems.forEach(function(elem){
							// check if it has an href attribute, otherwise it is just a page anchor
							if(elem.href) {
								elem = jQuery(elem);

								// get absolute url
								var url = new URL(elem.attr('href'), window.location.href);

								// determine if the link target is opening in a new window
								var newWindow = (elem.attr('target') && !elem.attr('target').match(/^_(self|parent|top)$/i));

								// check if it is an outbound link, track as event
								if(opts.outbound.enabled && url.host != window.location.host && opts.outbound.exclude.indexOf(url.host) == -1) {
									lqx.log('Found outbound link to ' + url.href);
									elem.on('click', function(e){
										lqx.log('Outbound link to: ' + url.href);

										// links opens in a new window when user holds the ctrl key
										newWindow = newWindow || e.ctrlKey || e.shiftKey || e.metaKey;

										// set label
										var label = elem.attr('title') ? elem.attr('title') + ' [' + url.href + ']' : url.href;

										// send event
										sendGAEvent({
											eventCategory: 'Outbound Links',
											eventAction: 'click',
											eventLabel: label,
											nonInteraction: opts.outbound.nonInteraction,
											hitCallback: newWindow ? null : function() {
												window.location.href = url.href; // when opening in same window, wait for ga event to be sent
											}
										});

										// when opening in new window, allow the link to proceed, otherwise wait for ga event
										return newWindow;
									});
								}

								// check if it is a download link (not a webpage) and track as pageview
								if(opts.downloads.enabled && url.href.match(new RegExp('\.(' + opts.downloads.extensions.join('|') + ')$', 'i')) !== null) {
									lqx.log('Found download link to ' + url.href);
									elem.on('click', function(e){
										lqx.log('Download link to: ' + url.href);

										// links opens in a new window when user holds the ctrl key
										newWindow = newWindow || e.ctrlKey || e.shiftKey || e.metaKey;

										// set labels
										var loc = url.protocol + '//' + url.hostname + url.pathname + url.search;
										var page = url.pathname + url.search;
										var title = elem.attr('title') ? elem.attr('title') : 'Download: ' + page;
										var label = elem.attr('title') ? elem.attr('title') + ' [' + page + ']' : page;

										// send pageview
										if(opts.downloads.hitType == 'pageview') {
											sendGAPageview({
												url: loc,
												title: title,
												callback: newWindow ? null : function() {
													window.location.href = url.href; // when opening in same window, wait for ga event to be sent
												}
											});
										}

										// or send event
										else if(opts.downloads.hitType == 'event') {
											sendGAEvent({
												eventCategory: 'Download Links',
												eventAction: 'click',
												eventLabel: label,
												nonInteraction: opts.downloads.nonInteraction,
												hitCallback: newWindow ? null : function() {
													window.location.href = url.href; // when opening in same window, wait for ga event to be sent
												}
											});
										}

										// when opening in new window, allow the link to proceed, otherwise wait for ga event
										return newWindow;
									});
								}
							}
						});
					}
				}

				// Find all a tags and cycle through them
				setup(jQuery('a'));

				// Add a mutation handler for links added to the DOM
				lqx.mutation.addHandler('addNode', 'a', setup);
			}

			// Track errors
			if(opts.errors.enabled && lqx.detect.browser().type != 'msie' ? true : lqx.detect.browser().version >= opts.errors.ieVersion) {
				// Add listener to window element for javascript errors
				window.addEventListener('error', function(e) {
					var errStr = e.message + ' [' + e.error + '] ' + e.filename + ':' + e.lineno + ':' + e.colno;
					var errHash = lqx.util.hash(errStr);
					if(vars.errorHashes.indexOf(errHash) == -1 && vars.errorHashes.length < opts.errors.maxErrors) {
						vars.errorHashes.push(errHash);
						sendGAEvent({
							hitType: 'event',
							eventCategory: 'JavaScript Errors',
							eventAction: 'error',
							eventLabel: errStr,
							nonInteraction: true
						});
					}
					return false;
				});
			}

			// Track scroll depth
			if(opts.scrollDepth.enabled) {
				lqx.log('Setting up scroll depth tracking');

				let calcScrollDepth = () => {
					return Math.ceil(100 * (vars.window.scrollTop() + vars.window.height()) / vars.document.height());
				};

				// add listener to scrollthrottle event
				window.addEventListener('scroll', () => {
					// capture the hightest scroll point, stop calculating once reached 100
					if (vars.scrollDepthMax < 100) {
						vars.scrollDepthMax = calcScrollDepth();
					}
				}, {passive: true});

				// add listener to page unload
				vars.window.on('beforeunload', () => {
					calcScrollDepth();
					sendGAEvent({
						eventCategory: 'Scroll Depth',
						eventAction: vars.scrollDepthMax,
						nonInteraction: true
					});
				});
			}

			// Track video
			if(opts.video.enabled){
				lqx.log('Setting video tracking');

				// Set listeners for Vimeo videos
				window.addEventListener('message', vimeoReceiveMessage, false);

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
			if(opts.userActive.enabled) {
				lqx.log('Setting active time tracking');
				initUserActive();

				// Add listener on page unload
				lqx.vars.window.on('beforeunload', function(){
					sendGAEvent({
						hitType: 'event',
						eventCategory: 'User Active Time',
						eventAction: 'Percentage',
						eventValue: parseInt(100 * vars.userActive.activeTime / (vars.userActive.activeTime + vars.userActive.inactiveTime)),
						nonInteraction: true
					});

					sendGAEvent({
						hitType: 'event',
						eventCategory: 'User Active Time',
						eventAction: 'Active Time (ms)',
						eventValue: parseInt(vars.userActive.activeTime),
						nonInteraction: true
					});

					sendGAEvent({
						hitType: 'event',
						eventCategory: 'User Active Time',
						eventAction: 'Inactive Time (ms)',
						eventValue: parseInt(vars.userActive.inactiveTime),
						nonInteraction: true
					});
				});
			}

			// Track rage clicks
			if(opts.rageClicks.enabled) {
				jQuery('body').on('click', function(event){
					// Save click event
					vars.clickEvents.push({
						event: event,
						time: (new Date()).getTime() / 1000
					});

					// Are there at least minClicks in the array?
					if(vars.clickEvents.length >= opts.rageClicks.minClicks) {
						// Get index of last event
						var totalClicks = vars.clickEvents.length;
						var lastClick = totalClicks - 1;

						// Check if clicks within maxTime
						var timeDiff = vars.clickEvents[lastClick].time - vars.clickEvents[0].time;
						if(timeDiff <= opts.rageClicks.maxTime) {
							// Find the max and min x and y coordinates of all clicks
							var minX = vars.clickEvents[0].event.clientX;
							var maxX = vars.clickEvents[0].event.clientX;
							var minY = vars.clickEvents[0].event.clientY;
							var maxY = vars.clickEvents[0].event.clientY;
							for(var i = 1; i <= lastClick; i++) {
								var x = vars.clickEvents[i].event.clientX;
								var y = vars.clickEvents[i].event.clientY;
								if(x < minX) minX = x;
								if(x > maxX) maxX = x;
								if(y < minY) minY = y;
								if(y > maxY) maxY = y;
							}

							// Check if clicks are within the maxDistance
							if((maxX - minX <= opts.rageClicks.maxDistance) && (maxY - minY <= opts.rageClicks.maxDistance)) {
								// Round area of first click to closest 50 pixels to avoid to many differing values in the event
								minX = Math.floor(minX / 50) * 50;
								maxX = Math.ceil(maxX / 50) * 50;
								minY = Math.floor(minY / 50) * 50;
								maxY = Math.ceil(maxY / 50) * 50;
								sendGAEvent({
									hitType: 'event',
									eventCategory: 'Rage Click',
									eventAction: 'click',
									eventLabel: [minX, minY, maxX, maxY].join(','),
									nonInteraction: true
								});
							}
						}
						// Remove used Clicks
						vars.clickEvents.splice(0, totalClicks);
					}
				});
			}
		};

		// initialize the js api for youtube and vimeo players
		var initVideoPlayerAPI = function(elem) {
			var src = elem.attr('src');

			if(typeof src != 'undefined') {
				var playerId = elem.attr('id');
				// Check youtube players
				if (src.indexOf('youtube.com/embed/') != -1) {
					if (!vars.youTubeIframeAPIReady) {
						// Load YouTube iframe API
						// Create the script element
						let ytScript = document.createElement('script');
						ytScript.async = true;
						ytScript.src = 'https://www.youtube.com/iframe_api';
						ytScript.onload = () => {
							vars.youTubeIframeAPIReady = true;
						};

						// Append the first script element to the head
						document.head.appendChild(ytScript);
					}

					// Add id if it doesn't have one
					if (typeof playerId == 'undefined') {
						playerId = 'youtubePlayer' + (Object.keys(vars.youtubePlayers).length);
						elem.attr('id', playerId);
					}

					// Reload with API support enabled
					if (src.indexOf('enablejsapi=1') == -1) {
						elem.attr('src', src + (src.indexOf('?') == -1 ? '?' : '&') + 'enablejsapi=1&version=3');
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
						elem.attr('src', src + (src.indexOf('?') == -1 ? '?' : '&') + 'api=1&player_id=' + playerId);
					}

					// Add to list of players
					if(!(playerId in vars.vimeoPlayers)) {
						vars.vimeoPlayers[playerId] = {};
					}
				}
			}
		};

		var onYouTubeIframeAPIReady = function(count){
			if (!count) count = 0;

			if(vars.youTubeIframeAPIReady && (typeof YT !== 'undefined') && YT && ('Player' in YT)) {
				Object.keys(vars.youtubePlayers).forEach(function(playerId) {
					if(!('playerObj' in vars.youtubePlayers[playerId])) {
						vars.youtubePlayers[playerId].playerObj = new YT.Player(playerId, {
							events: {
								onReady: function(e){
									youtubePlayerReady(e, playerId);
								},
								onStateChange: function(e){
									youtubePlayerStateChange(e, playerId);
								}
							}
						});
					}
				});
			}
			else {
				// keep track how many time we have attempted, retry unless it has been more than 30secs
				count++;
				if(count < 600) window.setTimeout(function(){
					onYouTubeIframeAPIReady();
				}, 100);
				else lqx.error('YouTube API not available');
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
					vars.youtubePlayers[playerId].timer = window.setTimeout(function(){youtubePlayerStateChange(e, playerId);}, 1000);

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
								window.clearTimeout(vars.youtubePlayers[playerId].timer);
							}
						}
					}
				}

				// video buffering
				if(vars.youtubePlayers[playerId].playerObj.getPlayerState() == 3) {
					// recursively call this function in 1s to keep track of video progress
					vars.youtubePlayers[playerId].timer = window.setTimeout(function(){youtubePlayerStateChange(e, playerId);}, 1000);
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
				var player = vars.vimeoPlayers[data.player_id];
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
			sendGAEvent({
				eventCategory: 'Video',
				eventAction: label,
				eventLabel: title + ' (' + jQuery('#' + playerId).attr('src').split('?')[0] + ')',
				eventValue: value,
				nonInteraction: opts.video.nonInteraction
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
			['resize', 'scroll', 'orientationchange'].forEach((e) => {
				window.addEventListener(e, userActive, { passive: true });
			});

			[
				'keydown', 'keyup', 'keypress',
				'mousewheel', 'wheel',
				'touchstart', 'touchmove', 'touchend', 'touchcancel'
			].forEach((e) => {
				document.addEventListener(e, userActive, { passive: true });
			});

			// add listener for window on focus in/out
			document.addEventListener('visibilitychange', (e) => {
				if (document.visibilityState === 'visible') userActive();
				else userInactive();
			});

			// refresh active and inactive time counters
			var timer = window.setInterval(function(){
				// Stop updating if maxTime is reached
				if(vars.userActive.activeTime + vars.userActive.inactiveTime >= opts.userActive.maxTime) window.clearInterval(timer);
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
				window.setTimeout(function(){vars.userActive.throttle = false;}, opts.userActive.throttle);
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
				window.clearTimeout(vars.userActive.timer);
				vars.userActive.timer = window.setTimeout(function(){userInactive();}, opts.userActive.idleTime);
			}
		};

		// function called to indicate the user is currently inactive
		var userInactive = function() {
			// set state to inactive
			vars.userActive.active = false;
			// clear timer
			window.clearTimeout(vars.userActive.timer);
			// add active time
			vars.userActive.activeTime += (new Date()).getTime() - vars.userActive.lastChangeTime;
			// update last change time
			vars.userActive.lastChangeTime = (new Date()).getTime();
		};

		// Show/hide element based on region
		var abTestDisplay = function(elems) {
			/**
			 *
			 * Checks for elements with attribute data-abtest with values 'testName-A' or 'testName-B',
			 * or class names 'abtest-testName-a' or 'abtest-testName-b'
			 *
			 */
			if(elems instanceof Node) {
				// Not an array, convert to an array
				elems = [elems];
			}
			else if(elems instanceof jQuery) {
				// Convert jQuery to array
				elems = elems.toArray();
			}
			if(elems.length) {
				elems.forEach(function(elem){
					elem = jQuery(elem);

					var elemGroupMatch = false;

					// Get attribute options first
					if(elem.attr('data-abtest') === vars.abTestGroup) elemGroupMatch = true;

					// Get classes
					if(elem.hasClass('abtest-' + vars.abTestGroup)) elemGroupMatch = true;

					// hide/remove element
					if(!elemGroupMatch) {
						if(opts.abTest.removeNoMatch) elem.remove();
						else elem.css('display', 'none');
					}
				});
			}
		};

		return {
			init,
			sendGAEvent,
			sendGAPageview
		};
	})();
	lqx.analytics.init();
}
