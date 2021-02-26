# JavaScript

`@version     2.3.0`

## Overview

All the scripting files are located in the [`js/`](../js/) directory. We have developed our own JavaScript library, and we use Vue.js for advanced functionality.

## JavaScript Library

### Core

The library core [`js/lib/core.js`](../js/lib/core.js) implemented undelying and common functionality for all modules:

  * Provides structure of options (`lqx.opts`) and variables (`lqx.vars`) that will contain the data for all modules.
  * Provides functionality for persistent storage using localStorage, with ability for auto-save tracked data every 15 seconds and on page unload.
  * Creates `scrollthrottle` and `resizethrottle` custom events that can be used instead of the standard `scroll` and `resize` events to prevent overloading the browser with too many callbacks
  * Provides a proxy for `console.log`, `console.warn`, and `console.error` that can be easily turned on and off using the `debug` option

### Modules

The library is made up by a collection of modules that can be disabled and configured to meet the needs of your project.

**Accordion [`js/lib/accordion.js`](../js/lib/accordion.js)**

Adds accordion functionality to any element with the `.accordion` class. It automatically uses the first child as header element unless you specificy an element with class `.accordion-header`. This module adds a class `.closed` or `.open`, and sets the accordion height as inline style.

The height of the accordion when open and closed is recalculated on resize, screen change, and orientation change.

If the accordion is a child of an `.accordion-group` parent, then when one accordion is opened the rest are closed.

When an accordion is opened, the screen is scrolled to the top of the accordion. This function includes handling the closing of accordions placed above the opening accordion without screen "jumpiness". The settings for scrolling can be controlled globally, by screen size, and can be overriden at accordion group and accordion level.

It is possible to define a "padding" above the accordion as the scroll position. This padding can be measured in pixels or a percentage of screen height. Optionally, the scroll position can be based on the accordion group or any other DOM element.

Provides an interface to open, close and update accordions programatically.

Triggers Google Analytics events on accordion open and close.

**Analytics [`js/lib/analytics.js`](../js/lib/analytics.js)**

Provides functionality for custom event tracking with Google Analytics:

  * **Outbound Links:** Track outbound links (links pointing to a different domain) that users follow when leaving your site. This is recorded as an event that is triggered right before the browser abandons the page.
  * **Download Links:** Track download links, such as PDF files, Microsoft Office files, text files, etc. that don't have JavaScript capabilities and normally don't generate a page view. By default, this custom event tracks the link as a page view.
  * **Scroll Depth:** Tracks the maximum percentage of a page that was visible to the user. This metric can be used to get a sense on whether users are scrolling down on pages to extend beyond the fold. An event is triggered right before abandoning the page, and reports the maximum tenth percentage (e.g. 10%, 20%, ..., 100%).
  * **Photo Gallery:** Generates events on gallery open, as well as individual events for each image displayed, including the image URL.
  * **Video Player:** Tracks events in YouTube and Vimeo players. It automatically enabled Javascript API if not enabled in the embed code. It tracks Start, progress and completion events, for example: Start, 10%, 20%, ..., 90%, Complete.
  * **User Active:** Keeps track of the time a user is active while viewing a page. It uses several techniques to assess if the user is active or not. Reports the percentage and absolute time that the user has been active and inactive. Tracking stops after 30 minutes.
  * **Rage Clicks:** detects rage clicks (rapid sequence of clicks in nearby area), and triggers a Google Analytics event for it.
  * **JavaScript Errors:** Tracks unique JavaScript errors, providing information on the error message, the location of the error (file, line, column). These events are useful to identify errors affecting specific browsers or operating systems.

**AutoResize [`js/lib/autoresize.js`](../js/lib/autoresize.js)**

Makes `textarea`, `input` (text, email, and number), and `select` elements to resize automatically to display its value.

To activate add the class `.autoresize` to the form fields you want to resize. `textarea` elements are resized vertically, while `input` and `select` elements are resized horizontally.

Remember to include `max-width` and `max-height` styles to prevent elements from breaking your page.

Demo: http://jsfiddle.net/lyquix/4m67ud9k/

**Detect [`js/lib/detect.js`](../js/lib/detect.js)**

A collection of detection utilities. Adds classes to the `<body>` that can be helpful when troubleshotting styles and resonsiveness across devices and browsers.

  * **Device:** uses the MobileDetect JS library https://github.com/hgoebl/mobile-detect.js to detect if the current device is mobile, and whether it is a phone or tablet, and sets classes to the `<body>` tag.  Details are also available by calling `lqx.detect.mobile`.
  * **Browser:** uses the browser User Agent string to detect the browser type (e.g. Internet Explorer,  Chrome, etc.) and version. Classes are added to the `<body>` tag for browser, browser and major version, and browser and full version. Details are also available by calling `lqx.detect.browser`.
  * **Operating System:** uses the browser User Agent string to detect the operating system type (e.g iOS, Windows, etc.) and version. Classes are added to the `<body>` tag for OS, OS and major version, and OS and full version. Details are also available by calling `lqx.detect.os`.
  * **URL Parts:** detects the URL parts (e.g. protocol, domain, path), and sets them as attributes to the `<body>` tag. Details are also available by calling `lqx.detect.urlParts`.
  * **URL Params:** detects the URL query parameters and make them available at `lqx.detect.urlParams`.
  * **Browser Features:** detects specific browser features that may impact JavaScript of CSS rendering.

**FitText [`js/lib/fittext.js`](../js/lib/fittext.js)**

Provides functionality for fitting paragraph text in a specific number of lines by automatically adjusting its font size.

Settings include minimum and maximum allowed font sizes, and settings can be applied on a per-screen size basis.

**Fixes [`js/lib/fixes.js`](../js/lib/fixes.js)**

Applies various fixes to specific browsers and operating systems.

  * **Image Width Attribute:** adds the width attribute to images missing it.
  * **Reset Font Features:** resets the `font-features` property to normal to prevent issues displaying Google Fonts.
  * **CSS Grid:** attempts to automatically place CSS grid children elements when column, row and span properties have not been explicitly defined.
  * **Link Preload:** adds a workaround for `<link re="preload">` not triggering a load event.
  * **object-fit:** adds a pseudo-polyfill to support object-fit (cover and contain only) and object-position.

**Geolocate [`js/lib/geolocate.js`](../js/lib/geolocate.js)**

Uses the user IP address to get an approximate location of the user, using the GeoLite2 free database that provides the user city, state, country and continent. Optionally, the script can request GPS location for accurate latitude and longitude.

The process is done entirely via Javascript and a dedicated PHP script that searches the user IP address in the database, avoiding any issues with cached pages.

You must sign up for a free account at http://dev.maxmind.com/geoip/geoip2/geolite2/, obtain an API key, and enter it on [`php/ip2geo/config.php`](../php/ip2geo/config.dist.php). The system will automatically download the database and update it periodically.

Once located, the script adds attributes to the `<body>` tag: city, subdivision, country, continent, time-zone, latitude and longitude.

Optionally, you can enable GPS geolocation for accurate latitude and longitude, either automatically on page load, or on demand. This will show an alert/prompt to users asking for their permission to access their location. Bear in mind that using GPS only updates the latitude and longitude, therefore, there could be discrepancies with the location obtained from the IP address and reflected in the rest of the location info (city, state, country, etc.).

This module includes functionality for the matching of the current location against geographic regions. The functions `inCircle`, `inSquare`, and `inPolygon` test a lat/lon point against regions of various shapes. Additionally it is possible to generate a list of regions and define what DOM elements should be show or hidden based on the current matching regions, using the function `setRegions` and adding the attribute `data-regions-display`.

**LyqBox [`js/lib/lyqbox.js`](../js/lib/lyqbox.js)**

Our own lightbox. Provides the following features

  * 3 types of lightboxes:
    * Simple lightboxes that may includes images, HTML content, or iframes
    * Galleries: a collection of multiple content that the user can navigate. Each gallery slide has own hash URL that can be used to open page showing specific gallery slide.
    * Alerts: lightbox that opens on page load until user dismisses it
  * Complete separation of styling (CSS) and logic (Javascript)
  * Use CSS animations and transitions
  * Control galleries with left and right arrows in keyboard and swipe gestures
  * Zoom control for images
  * Thumbnails for easy navigation
  * Ability to create custom HTML structure
  * Triggers Google Analytics events

To activate an element in your page with lightbox add the following attributes:

  * `data-lyqbox`: Indicates that this is a lyqbox element. Leave empty for single lightboxes, or use an identifier that ties together elements that belong to the same gallery, or as unique identifier for alerts.
  * `data-lyqbox-type`:
    * `image`: use for loading images in lightbox
    * `video`: use for loading a video iframe in lightbox
    * `html`, `alert`: use for loading HTML content in lightbox
  * `data-lyqbox-url`: mandatory for image and video types. Optional for html and alert types, used to load content from URL.
  * `data-lyqbox-title`: optional slide title
  * `data-lyqbox-caption`: optional slide caption
  * `data-lyqbox-credit`: optional slide credits
  * `data-lyqbox-class`: optional slide custom CSS classes
  * `data-lyqbox-alias`: slide alias to use in URL hash
  * `data-lyqbox-html`: content for html or alert lightboxes
  * `data-lyqbox-thumb`: URL of thumbnail image, for galleries only
  * `data-lyqbox-alert-dismiss`: set the text to be used in the dismiss button for alerts. If none set, it defaults to "Dismiss".
  * `data-lyqbox-alert-expire`: set the time in seconds after dismissal that the alert will not be shown again. If none set, it defaults to 30 days.

**Menu [`js/lib/menu.js`](../js/lib/menu.js)**

Adds functionality for mobile menus:

  * Open sub-menus with click events
  * Close menu when clicking outside of menu
  * Menu open/close control (hamburguer icon)

To activate just add the class `.horizontal` or `.vertical` to the parent element of your `<ul>` menu. Optionally add an element `.menu-control` sibbling to the `<ul>` menu to use as "hamburger menu" element. The class `open` will be added the the `<ul>` and `<li>` elements when they have been clicked open.

This module works in conjunction with the CSS styles found in [`css/lib/common.scss`](../css/lib/common.scss):
  * `.horizontal`: top level items are arranged in a single row
  * `.vertical`: top level items are stacked in a single column

By default, sub-menus are hidden, to show them add classes:
  * `.level-2`: enables the 2nd level menu items
  * `.level-3`: enables the 3rd level menu items

By default, sub-menus open down and right, to open left add class `.open-left`.

In vertical menus, to open sub-menus stacked (accordion), add class `.stacked`.

Demo: https://codepen.io/lyquix/pen/geOgQb

**Mutation [`js/lib/mutation.js`](../js/lib/mutation.js)**

Provides a simple interface for detecting DOM mutations and triggering callbacks. It allows creating observers for added nodes, removed nodes, and modified attributes. Observers cover the whole `document`.

See below `lqx.mutation.addHandler` for info on how to add observers.

**PopUp [`js/lib/popup.js`](../js/lib/popup.js)**

Provides functionality for controlling the display of popups:

  * Adds a class `open` or `closed` to control popup styling
  * Allows automatic open delay time after page load
  * Allows automatic popup closing after time (optional)
  * Provides two different closing actions: close and dismiss. Each can be handled from different elements and can provide different behavior regarding re-opening of the popup
  * Control how much time the popup shall be closed after close and dismiss actions
  * Allow for close/dismiss when any link on the popup content is clicked, or when an overlay element is clicked
  * Allow for popup to be re-opened during the same session

**Responsive [`js/lib/responsive.js`](../js/lib/responsive.js)**

Provides the functionality to enable responsiveness:

  * Adds and automatically updates the attribute `screen` to the `<body>` tag
  * For mobile devices, adds and automatically updates the attribute `orientation` to the `<body>` tag
  * Triggers the custom event `screensizechange`.

**String [`js/lib/string.js`](../js/lib/string.js)**

Adds new functionality to the `String` prototype.

  * `capitalize` returns a string where the first letter is uppercase, and the rest are lower case  (e.g `Lorem ipsum DOLOR sIT amet` => `Lorem ipsum dolor sit amet`).
  * `isCreditCard` returns true if the string is a valid credit card number.
  * `isEmail` returns true if the string is a valid email address.
  * `isSSN` returns true if the string is a valid social security number.
  * `isURL` returns true if the string is a valid URL.
  * `isUsPhone` returns true if the string is a valid north american phone number.
  * `isZipCode` returns true if the string is a valid US zip code.
  * `latinize` returns a string in its latin alphabet equivalent  (e.g `Lorem ipsum CAFFÉ latté хорошая погода` => `Lorem ipsum CAFFE latte horoshaya pogoda`).
  * `slugify` returns a slug (e.g `Lorem ipsum CAFFÉ latté хорошая погода` => `lorem-ipsum-caffe-latte-horoshaya-pogoda`).
  * `toCamelCase` returns a string in camel case (e.g `Lorem ipsum DOLOR sIT amet` => `loremIpsumDolorSitAmet`).
  * `toKebabCase` returns a string in kebab case (e.g `Lorem ipsum DOLOR sIT amet` => `lorem-ipsum-dolor-sit-amet`).
  * `toSnakeCase` returns a string in snake case (e.g `Lorem ipsum DOLOR sIT amet` => `lorem_ipsum_dolor_sit_amet`).
  * `toTitleCase` returns a string in title case (e.g `Lorem ipsum DOLOR sIT amet` => `Lorem Ipsum Dolor Sit Amet`).
  * `words` returns an array with each word found in the string.

**Tabs [`js/lib/tabs.js`](../js/lib/tabs.js)**

Provides functionality for tabs.

Looks for elements with the class `.tab` and `.tab-panel`, wrapped by a `.tab-group` parent. In `.tab` elements looks for the attribute `data-tab`, and in `.tab-panel` looks for a matching `data-tab` attribute.

Moves the `.tab` elements to a group `.tab-nav`, and moves the `.tab-panel` elements to a group `.tab-content`.

For the tab/panel selected it adds the class `.open`, otherwise adds the class `.closed`.

Triggers Google Analytics events on tab open.

**Util [`js/lib/util.js`](../js/lib/util.js)**

Provides utility functions, listed below.

### Functions

The following functions are exposed:

**`lqx.accordion.close(id)`**

Pass an accordion id (see in the accordion element for the `data-accordion` attribute) to close it.

**`lqx.accordion.open(id)`**

Pass an accordion id (see in the accordion element for the `data-accordion` attribute) to open it.

**`lqx.accordion.setup(elem)`**

Setups an element `elem` (DOM element or jQuery) as an accordion.

**`lqx.accordion.update(id)`**

Update accordions stored open and closed heights. If no id is passed, all accordions are updated.

**`lqx.autoresize.setup(elem)`**

Setups an element `elem` (DOM element or jQuery) for autoresize.

**`lqx.detect.browser()`**

Returns details of detected browser.

**`lqx.detect.mobile()`**

Returns details of detected device.

**`lqx.detect.os()`**

Returns details of detected operating system.

**`lqx.detect.urlParams()`**

Returns list of detected URL query parameters.

**`lqx.detect.urlParts()`**

Returns details of URL parts.

**`lqx.error(arg)`**

Use instead of `console.error` if you want to easily turn off all console messages when `debug` option is disabled. Accepts string or objects to be displayed in the console, only when the `debug` option is enabled.

**`lqx.fittext.resize(id)`**

Forces the FitText element identified by `id` to be updated. This is a useful function to execute after layout and style changes other than those caused by screen resizes or orientation changes.

**`lqx.fittext.setup(elem)`**

Setups an element `elem` (DOM element or jQuery) for fittext functionality.

**`lqx.geolocate.getGPS()`**

Allows for the on-demand requests of location to the browser. On mobile devices this usually relies on the usage of GPS coordinates, in other cases, location is approximate based on browser and operating system on methods. Note that this usually triggers a request for approval from the user.

**`lqx.geolocate.inCircle(test, center, radius)`**

Returns `true` if a test point is within a circle defined by a center point and radius. Test and center points are object with keys `lat` and `lon`, and radius is distance in kilometers.

**`lqx.geolocate.inPolygon(test, poly)`**

Returns `true` if a test point is within a polygon of arbitrary points. Test is an object with keys `lat` and `lon`. Poly is an array of objects, each with keys `lat` and `lon`.

**`lqx.geolocate.inSquare(test, corner1, corner2)`**

Returns `true` if a test point is within a square region defined by two opposite corners. Test, corner1 and corner2 are objects with keys `lat` and `lon`.

**`lqx.geolocate.location()`**

Returns location information: city, state, country, continent, time zone, latitude, longitude, and radius.

**`lqx.geolocate.setRegions(regions)`**

Processes the region definitions in `region` and identifies what regions match the current location. Triggers the showing or hiding of elements based on regions rules.

**`lqx.geolocate.getRegions()`**

Returns an array of regions that match the current location.

**`lqx.log(arg)`**

Use instead of `console.log` if you want to easily turn off all console messages when `debug` option is disabled. Accepts string or objects to be displayed in the console, only when the `debug` option is enabled.

**`lqx.mutation.addHandler(type, selector, callback)`**

Adds an observer of type `addNode`, `removeNode` or `modAttrib`, and when the target mutated element matches the provided `selector`, triggers the `callback` passing the element object.

**`lqx.options(opts)`**

Overrides or extends default or current option (settings) values. Accepts an object of options. Refer to [Lyquix Options](lqxoptions.md).

**`lqx.options(opts)`**


**`lqx.ready(opts)`**

Initializes the library and sets the initial options. This function should be executed once on your page, after the `<body>` tag is available. This function triggers the custom event `lqxready`.

**`lqx.store.get(module, prop)`**

Returns the value of the provided module/property stored in the persistent storage.

**`lqx.store.set(module, prop)`**

Saves the current value of `lqx.vars[module][prop]` in the persisten storage, and initiates the automatic saving (every 15 seconds), as well as saving upon page unload.

**`lqx.store.unset(module, prop)`**

Removes the provided module/property from the persistent storage.

**`lqx.store.update()`**

Forces tracked module/properties to be updated from `lqx.vars` to the persisten storage.

**`lqx.tabs.setup(elem)`**

Setups an element `elem` (DOM element or jQuery) a tab.

**`lqx.util.cookie(name, value, attributes)`**

Function for handling cookies with ease, inspired by https://github.com/js-cookie/js-cookie and https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie/Simple_document.cookie_framework

  * `name`: cookie name (string). When passing only the name the function returns the value of the cookie. If no matching cookie exists, returns false.
  * `value`: cookie value (string). When passing both name and value, the function sets a new cookie (or updates an existing one) with the passed value.
  * `attributes`: additional cookie attributes (object). When passed with name and value, attributes allow to configure additional settings for the cookie:
    * `maxAge`: an integer indicating the number of seconds until the cookie expires
    * `expires`: a Date object that indicates when the cookie will expire
    * `path`: string
    * `domain`: string
    * `secure`: any non-false value
    * `httpOnly`: any non-false value

**`lqx.util.decrypt(key, cyphertext)`**

Decryption function for cyphertext generated with `lqx.util.encrypt`.

**`lqx.util.encrypt(key, plaintext)`**

Basic XOR-based encryption function. Provides a "decent" security level as long as the key is longer than the total length of encrypted text. **Not recommended for sensitive applications requiring strong encryption.** Proper support for UTF8 strings.

**`lqx.util.hash(str)`**

Provides a simple hash function. Should not be used for very long strings, nor for crytographic applications.

**`lqx.util.passwordDerivedKey(password, salt, iterations, len)`**

Generates a 256-bit encryption key. All arguments are optional.

**`lqx.util.randomStr(len)`**

Generates a random string of length `len`.


**`lqx.util.swipe(selector, callback, options)`**

Adds a swipe detection listener on element(s) identified by `selector`, and triggers the `callback` function when a swipe is detected, passing the direction of the swap: :u (up), d (down), l (left), r (right), or a combination of vertical and horizontal direction.

Optionally you can pass custom `options`, an object with keys

  * `minX`: minimum pixel distance in the x axis to consider the move a swipe
  * `minY`: minimum pixel distance in the y axis to consider the move a swipe
  * `maxT`: maximum time in ms allowed for a swipe
  * `disableScroll`: set to true if you want to prevent the default touch behavior (e.g. prevent the screen to scroll)
  * `detectV`: set to false to ignore vertical swipes
  * `detectH`: set to false to ignore horizontal swipes

**`lqx.util.sprintf(format, arg1, arg2, ...)`**

Returns a string produced according to the formatting string `format`, utilizing the data passed in the following arguments.

Refer to http://php.net/manual/en/function.sprintf.php for complete formatting options.

**`lqx.util.uniqueStr()`**

Generates a pseudo-random string based on current time and a random seed.

**`lqx.util.uniqueUrl(sel, attrib)`**

Appends a unique parameter to a URL in attribute `attrib` on the elements identified by selector `sel`. Useful with forms to bypass caching, e.g. `lqx.util.uniqueUrl('form', 'action')`.

**`lqx.util.versionCompare(a, b)`**

Compares software version strings. Returns 0 when versions are the same, 1 when a > b, and -1 when a < b. Assumes that the version strings are comprised of numbers (integers) separated by dots, e.g. `2.08.5`.

**`lqx.warn(arg)`**

Use instead of `console.warn` if you want to easily turn off all console messages when `debug` option is disabled. Accepts string or objects to be displayed in the console, only when the `debug` option is enabled.

### Variables

**`lqx.opts`**

*Object*

Stores the options (settings) for the library, organized by module. You should not modify this object directly, instead use `lqx.options`.

**`lqx.vars`**

*Object*

Stores the working data for the library. You should not read or modify this object directly, instead use the exposed functions for getting or setting data.

**`lqx.version`**

*String*

Contains the library version number.

### Events

**`geolocateready`**

Triggered when geolocation has been completed.

**`lqxready`**

Triggered once by `lqx.ready` when the library is initialized and `<body>` is ready.

**`resizethrottle`**

Triggers every 15ms when the `resize` event is being triggered. Use this event instead of `resize` to prevent browser to be overwhelmed.

**`screensizechange`**

Triggers when the screen size changes and beyond a breakpoint.

**`scrollthrottle`**

Triggers every 15ms when the `scroll` event is being triggered. Use this event instead of `scroll` to prevent browser to be overwhelmed.

## Custom Project Scripts

**`js/scripts.core.js`**

Use this file to include any global, utility, or minor functionality that you need for your project.

You may use the file `js/scripts.core.dist.js` included in the template as the template, just copy or rename it to `js/scripts.core.js`. Please bear in mind how this file has been structured:

  * It takes the `$lqx` namespace. If you have other libraries already using `$lqx` you can change it to your own namespace to avoid conflicts.
  * It checks for jQuery and lqx libraries. You can add other dependencies.
  * The main structure is a self-executing function that returns only the variables and functions that need to be access from outside.
  * Runs `init()` as soon as it's loaded.
  * Additional modules can be added and saved in the `js/custom/scripts` directory, following the structure of modules in `js/lib`

**Vue**

For advanced or complex functionality, we recommend the use of Vue apps. Your controllers should be placed in `js/custom/controllers`, and components in `js/custom/components`.

**Optional JS Libraries**

In the template options you can select from the following optional CSS libraries to be loaded:

  * Polyfill.io: a service that loads JavaScript polyfills, customized to the user's browser type and version. https://polyfill.io/v2/docs/
  * Lodash: a collection of functions that make it easier to manipulate data in JavaScript. https://lodash.com/
  * SmoothScroll: make page scrolling smooth. https://github.com/galambalazs/smoothscroll-for-websites
  * Moment.js: utility functions to handle dates and time. https://momentjs.com/
  * DotDotDot: a jQuery plugins that provides smart and responsive text truncation with ellipsis. http://dotdotdot.frebsite.nl/

**Additional JS Libraries**

You can load additional JS libraries by just adding their URL (either local or remote) to the template options in the Joomla administrator.

**Remove JS Libraries**

Remove JS libraries added by components, modules or plugins by entering their URL in the template options.

## Processing JS Files

You may use the shell script [`js/js.sh`](../js/js.sh) to process the JS files for your project. This scripts creates `js/lyquix.js` from the JavaScript library modules located at `js/lib/`, and `js/vue.js` from the custom controllers and components located atS `js/custom/`. It also creates `.min.js` versions of both files and of `js/scripts.js`.

## Merged JS Files

In order to improve performance the template merges several JS files into one. This is done in [`php/js.php`](../php/js.php). This function can be configured in the template options in the Joomla administrator.

The following JS files are concatenated:

  * **Enqueued Scripts**: scripts added by components, modules, and plugin to be rendered by Joomla's `<jdoc:include type="head" />`. You can control if you want to include only local server scripts and/or remote scripts. By default these are not included because they can change per URL.
  * **Enqueued Script Declarations**: inline scripts added by components, modules, and plugin to be rendered by Joomla's `<jdoc:include type="head" />`. By default these are not included because they can change per URL and even by page load.
  * **Standard JS Libraries**: these are libraries that can be activated from the Joomla template administrator: LoDash, SmoothScroll, MomentJS, and DotDotDot. When enabled, they are always included.
  * **MobileDetect**: provides functionality for detecting mobile devices. This library is always included.
  * **Additional JS Libraries**: these are defined in the template options, and are always included.
  * **Lyquix JavaScript Library**: `js/lyquix.js` is always included.
  * **Vue Applications**: `js/vue.js` is always included.
  * **Custom Project Scripts**: `js/scripts.js` is always included.

The resulting JS file is saved to `dist/`. The file name is a hash of the list of files included and their version number. If there are any changes to either the hash will be changed.
