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

##gaReady

When a Google Analytics account is set in the template options, the universal analytics code is rendered. Unlike the default that immediately calls `ga('create', 'UA-XXXXX-Y', 'auto');` and `ga('send', 'pageview');`, the template calls `ga(lqx.gaReady);`, which executes several steps:

* set, require and provide commands passed via options
* A/B testing: set the test name, and dimension numbers for storing test name and assigned group
* Custom function to execute before pageview
* Send pageview

##GeoLocate

GeoLocation uses IP to get an approximate the location of the user, using the GeoLite2 free database that provides the user city, state, country and continent. Optionally, the script can request GPS location for accurate latitude and longitude.

Once located, the script adds attributes to the `<body>` tag: city, subdivision, country, continent, and time-zone.

##getBrowser

##getOS

##Hanging Punctuation

##Image Caption

##Image Load Attribute

##log

##Logging

##lyqBox

##Mobile Detect

##Mobile Menu

##Mutation Observer

##Parse URL Params

##Resize Throttle

##Screen Size Change

##Scroll Throttle

##setOptions

##Shade Color

##Tracking

##User Active
