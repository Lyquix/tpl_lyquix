#JavaScript

`lyquix.js` is our own Javascript library. We developed it after we found ourselves with similar JavaScript code in multiple projects, or loading a myriad of plugins and libraries just for a few functions.

This library groups all the functionality that we have found to be useful across projects.

#Highlights

* Very straightforward approach, just an object with a ton of functions and variables inside it
* It uses the namespace `lqx` to avoid conflicts with other libraries and global environment
* The default settings can be found at `lqx.settings`, and you can override one or more settings using `lqx.setOptions(options)` before document ready event.
* Several work variables are stored in lqx.vars where they can be accessed by other scripts if needed
* Some functionality is executed automatically, others are available to run when needed

#Functionality

Following is a list of all the functionality available:

##Screen Size and Orientation

In the Lyquix grid framework we define 5 screen sizes: xs, sm, md, lg and xl based on the window width (breakpoints). This function implements a listener on window resize (throttled) as well as orientation change, and sets a `screen` attribute to the `<body>` tag.

In addition to the listeners, `lqx.bodyScreenSize()` is normally executed right at the top of the `<body>` tag, on document ready, and on window load events.

`lqx.bodyScreenSize()` triggers the custom event `screensizechange` which can be used for any script functionality that needs to happen when resizing past screen breakpoints.

`lqx.bodyScreenOrientation()` performs a similar functionality, adding the attribute `orientation` to the `<body>` tag.

##Browser Fixes

Currently the library implements the following fixes automatically:

* IE: when images don't have a specific width/height value set inline or via CSS, the images don't appear. The script automatically detects this and adds the natural image width inline.
* IE 11: sets the CSS property font-feature-settings to normal in the `<html>` tag, as other values have been shown to be problematic on IE 11 and Windows 7
* IE 8: any SVG files are changed to corresponding PNG (same filename, different extension)

##Cookie

Straighforward function for setting and getting cookies.

`lqx.cookie(name, value, attributes)`

`name`: Name of the cookie to be read or written (mandatory).

`value`: Value to be assigned to the cookie when writing. Ommit to read cookie value.

`attributes`: Object containing the additional optional cookie attributes: maxAge (number of seconds to expiration), expires (Date object for date-time of cookie expiration), domain (domain or subdomain where cookie is applicable), path (absolute path where cookie is applicable), secure (use only over HTTPS) and httponly (do not send over xhr).

Returns:
* Cookie value (always string) when reading
* True when cookie has been written
* False when no cookie name has been received
* Null when cookie doesn't exist

##Comicfy

Want to have a little fun? Just add `?comicfy` to any URL and this function will change all fonts of your site to Comic Sans :)

##Equal Height Rows

Flexbox is here but browser support is still uneven and buggy. Until we can rely on it we use equal height rows: add the class `equalheightrow` to the block elements you want to have the same height when in the same row. That's it. 

`lqx.initEqualHeightRow()` is executed on document ready to get the list of elements and assess if there are any images still loading. Afterwards `lqx.equalHeightRow()` is executed on every screen size change and screen orientation change. Your custom scripts can call `lqx.equalHeightRow()` to force rows to be re-processes.

In order to achive high performance the list of DOM elements with `equalheightrow` class is not updated on every execution. To force the list to be updated use `lqx.equalHeightRow({refreshElems: true})`.

##GeoLocate

GeoLocation uses the user IP address to get an approximate the location of the user, using the GeoLite2 free database that provides the user city, state, country and continent. Optionally, the script can request GPS location for accurate latitude and longitude.

The process is done entirely via Javascript and a dedicated PHP script that searches the user IP address in the database, avoiding any issues with cached pages.

Once located, the script adds attributes to the `<body>` tag: city, subdivision, country, continent, and time-zone.

##getBrowser

This function parses the User Agent string to obtain the browser type and version. It returns an object with three keys: name, type and version. It is implemented as a self-executing function, so it is only executed once and then it becomes an object.

It adds classes to the `<body>` tag: browser, browser-major version, and browser-major version-minor version. For example: msie, msie-9, msie-9-0. 

##getOS

Similar to getBrowser, this function parses the User Agent string to obtain the operating system type and version. It returns an object with three keys: name, type and version. It is implemented as a self-executing function, so it is only executed once and then it becomes an object.

It adds classes to the `<body>` tag: os, os-major version, and os-major version-minor version. For example: ios, ios-9, ios-9-2. 

##Hanging Punctuation

For `<p>` elements inside a parent with `hanging-punctuation` class, the script detects punctuation marks that are on the edge of the block, and pulls them out to provide a better style and reading experience, for example:

![](http://i.imgur.com/UZ0m0UY.png)

##Image Caption

Adds a caption, using the alt attribute, for images wrapped in elements with `.image.caption` classes. For example:

```
<div class="image caption">
    <img src="..." alt="Image Description" />
</div>
```

is converted to:

```
<div class="image caption">
    <img src="..." alt="Image Description" />
    <div class="caption">Image Description</div>
</div>
```

##Image Load Attribute

##log

Use `lqx.log()` instead of `console.log()` for debugging purposes in your code, with the ability to turn output on and off via `lqx.settings.debug`. You don't have to worry about removing debugging lines in your code.

##Logging

Advanced Javascript logging that shows every function call and arguments passed.

##lyqBox

Our own lightbox library. Provides the following features

* 3 types of lightboxes:
  * Simple lightboxes that may includes images, HTML content, or iframes
  * Galleries: a collection of multiple content that the user can navigate. Each gallery item has own hash URL that can be used to open page showing specific gallery item.
  * Alerts: lightbox that opens on page load until user dismisses it
* Complete separation of styling (CSS) and logic (Javascript)
* Use CSS animations and transitions
* Control galleries with left and right arrows in keyboard and swipe gestures
* Ability to create custom HTML structure

To activate an element in your page with lightbox add the following attributes:

* `data-lyqbox`: Indicates that this is a lyqbox element. Leave empty for single lightboxes, or use an identifier that ties together elements that belong to the same gallery, or as unique identifier for alerts.
* `data-lyqbox-type`: 
  * `image`: use for loading images in lightbox
  * `video`: use for loading a video iframe in lightbox
  * `html`, `alert`: use for loading HTML content in lightbox
* `data-lyqbox-url`: mandatory for image and video types. Optional for html and alert types, used to load content from URL.
* `data-lyqbox-title`: optional item title
* `data-lyqbox-caption`: optional item caption
* `data-lyqbox-credit`: optional item credits
* `data-lyqbox-class`: optional item custom CSS classes
* `data-lyqbox-alias`: item alias to use in URL hash
* `data-lyqbox-html`: content for html or alert lightboxes

##Mobile Detect

Requires MobileDetect JS library https://github.com/hgoebl/mobile-detect.js to detect if the current device is mobile, and whether it is a phone or tablet.

It returns an object with three keys: mobile, phone, and tablet. All have boolean values.

##Mobile Menu

Adds appropriate listeners to support menus in mobile/touch screens:

* Menu open/close control element (hamburguer icon)
* Close menu when clicking outside of menu
* Click listeners to menu items to open/close children menus or open link

To activate just add any of the following classes to a parent element of `ul.menu`: `.horizontal`, `.vertical`, or `.slide-out`.

Adds class "open" to menus that are displaying.

##Mutation Observer

Handles changes in the HTML structure of the document (mutations) to detect when new video players have been added to the DOM. This allows for proper setup and tracking events.

##Parse URL Params

Parses parameters in URL and make them available in array `lqx.vars.urlParams` where keys are the parameter names.

##Resize Throttle

Custom event can be used to trigger functions on resize but only every 15ms (time can be set via options) instead of continuosly as done by the native resize event. For example:

`jQuery(window).on('resizethrottle', function(){ /* your code here */ });`

##Screen Size Change

Custom event can be used to trigger functions on screen size change (window is resized past a breakpoint). This can be used in conjunction with `lqx.vars.lastScreenSize` to identify what is the current screen size.

For example:

`jQuery(window).on('screensizechange', function(){ /* your code here */ });`

##Scroll Throttle

Custom event can be used to trigger functions on scroll but only every 15ms (time can be set via options) instead of continuosly as done by the native scroll event. For example:

`jQuery(window).on('scrollthrottle', function(){ /* your code here */ });`

##setOptions

Function for overriding default settings. Just run `lqx.setOptions(options)` where options in an object that includes the settings to override, for example:

`lqx.setOptions({debug: true});`
`lqx.setOptions({ga: {abTestName: "Buy Button Design"}});`

##Shade Color

##Google Analytics Custom Tracking

###gaReady

When a Google Analytics account is set in the template options, the universal analytics code is rendered. Unlike the default that immediately calls `ga('create', 'UA-XXXXX-Y', 'auto');` and `ga('send', 'pageview');`, the template calls `ga(lqx.gaReady);`, which executes several steps:

* set, require and provide commands passed via options
* A/B testing: set the test name, and dimension numbers for storing test name and assigned group
* Custom function to execute before pageview
* Send pageview

###Outbound Links

Track outbound links (links pointing to a different site) that users follow when leaving your site. This is recorded as an event that is triggered right before the browser abandons the page.

###Download Links

Track download links, such as PDF files, Microsoft Office files, text files, etc. that don't have Javascript capabilities and normally don't generate a pageview. This custom event tracks the link as a pageview.

###Scroll Depth

Tracks the maximum percentage of a page that was visible to the user. This metric can be used to get a sense on whether users are scrolling down on pages to extend beyond the fold. An event is triggered right before abandoning the page, and reports the maximum tenth percentage (e.g. 10%, 20%, ..., 100%)

###Photo Gallery

Generates events on gallery open, as well as individual events for each image displayed, including the image URL.

###Video Player

Tracks events in YouTube and Vimeo players. It automatically enabled Javascript API if not enabled in the embed code. It tracks Start, progress and completion events, for example: Start, 10%, 20%, ..., 90%, Complete.

###User Active

Keeps track of the time a user is active while viewing a page. It uses several techniques to assess if the user is active or not. Reports the percentage and absolute time that the user has been active and inactive. Tracking stops after 30 minutes.
