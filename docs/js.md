# JavaScript

## Overview

All the scripting files are located in the [`js/`](../js/) directory. We have developed our own JavaScript library, and we use Vue.js for advanced functionality.

## JavaScript Library

### Modules

The library is made up by a collection of modules that can be disabled and configured to meet the needs of your project.

**Accordion [`js/lib/accordion.js`](../js/lib/accordion.js)**

Adds accordion functionality to any element with the `.accordion` class. It automatically uses the first child as header element unless you specificy an element with class `.accordion-header`. This module adds a class `.closed` or `.open`, and sets the accordion height as inline style.

The height of the accordion when open and closed is recalculated on resize, screen change, and orientation change.

If the accordion is a child of an `.accordion-group` parent, then when one accordion is opened the rest are closed.

**Analytics [`js/lib/analytics.js`](../js/lib/analytics.js)**

Provides functionality for custom event tracking with Google Analytics:

  * **Outbound Links:** Track outbound links (links pointing to a different domain) that users follow when leaving your site. This is recorded as an event that is triggered right before the browser abandons the page.
  * **Download Links:** Track download links, such as PDF files, Microsoft Office files, text files, etc. that don't have JavaScript capabilities and normally don't generate a page view. This custom event tracks the link as a page view.
  * **Scroll Depth:** Tracks the maximum percentage of a page that was visible to the user. This metric can be used to get a sense on whether users are scrolling down on pages to extend beyond the fold. An event is triggered right before abandoning the page, and reports the maximum tenth percentage (e.g. 10%, 20%, ..., 100%).
  * **Photo Gallery:** Generates events on gallery open, as well as individual events for each image displayed, including the image URL.
  * **Video Player:** Tracks events in YouTube and Vimeo players. It automatically enabled Javascript API if not enabled in the embed code. It tracks Start, progress and completion events, for example: Start, 10%, 20%, ..., 90%, Complete.
  * **User Active:** Keeps track of the time a user is active while viewing a page. It uses several techniques to assess if the user is active or not. Reports the percentage and absolute time that the user has been active and inactive. Tracking stops after 30 minutes.

**Detect [`js/lib/detect.js`](../js/lib/detect.js)**

A collection of detection utilities. Adds classes to the `<body>` that can be helpful when troubleshotting styles and resonsiveness across devices and browsers.

  * **Device:** uses the MobileDetect JS library https://github.com/hgoebl/mobile-detect.js to detect if the current device is mobile, and whether it is a phone or tablet, and sets classes to the `<body>` tag.  Details are also available by calling `lqx.detect.mobile`.
  * **Browser:** uses the browser User Agent string to detect the browser type (e.g. Internet Explorer,  Chrome, etc.) and version. Classes are added to the `<body>` tag for browser, browser and major version, and browser and full version. Details are also available by calling `lqx.detect.browser`.
  * **Operating System:** uses the browser User Agent string to detect the operating system type (e.g iOS, Windows, etc.) and version. Classes are added to the `<body>` tag for OS, OS and major version, and OS and full version. Details are also available by calling `lqx.detect.os`.
  * **URL Parts:** detects the URL parts (e.g. protocol, domain, path), and sets them as attributes to the `<body>` tag. Details are also available by calling `lqx.detect.urlParts`.
  * **URL Params:** detects the URL query parameters and make them available at `lqx.detect.urlParams`.

**Fixes [`js/lib/fixes.js`](../js/lib/fixes.js)**

Applies various fixes to Internet Explorer.

  * **Image Width Attribute:** adds the width attribute to images missing it.
  * **Reset Font Features:** resets the `font-features` property to normal to prevent issues displaying Google Fonts.
  * **CSS Grid:** attempts to automatically place CSS grid children elements when column, row and span properties have not been explicitly defined.

**Geolocate [`js/lib/geolocate.js`](../js/lib/geolocate.js)**

Uses the user IP address to get an approximate location of the user, using the GeoLite2 free database that provides the user city, state, country and continent. Optionally, the script can request GPS location for accurate latitude and longitude.

The process is done entirely via Javascript and a dedicated PHP script that searches the user IP address in the database, avoiding any issues with cached pages.

You must download the file `GeoLite2-City.mmdb` from http://dev.maxmind.com/geoip/geoip2/geolite2/ and save it to [`php/ip2geo`](../php/ip2geo).

Once located, the script adds attributes to the `<body>` tag: city, subdivision, country, continent, time-zone, latitude and longitude.

Optionally, you can enable GPS geolocation for accurate latitude and longitude. This will show an alert/prompt to users asking for their permission to access their location. Bear in mind that using GPS only updates the latitude and longitude, therefore, there could be discrepancies with the location obtained from the IP address and reflected in the rest of the location info (city, state, country, etc.).

**LyqBox [`js/lib/lyqbox.js`](../js/lib/lyqbox.js)**

Our own lightbox. Provides the following features

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

**Responsive [`js/lib/responsive.js`](../js/lib/responsive.js)**

Provides the functionality to enable responsiveness:

  * Adds and automatically updates the attribute `screen` to the `<body>` tag
  * For mobile devices, adds and automatically updates the attribute `orientation` to the `<body>` tag
  * Triggers the custom event `screensizechange`.

**Tabs [`js/lib/tabs.js`](../js/lib/tabs.js)**

Provides functionality for tabs.

Looks for elements with the class `.tab` and `.tab-panel`, wrapped by a `.tab-group` parent. In `.tab` elements looks for the attribute `data-tab`, and in `.tab-panel` looks for a matching `data-tab` attribute.

Moves the `.tab` elements to a group `.tab-nav`, and moves the `.tab-panel` elements to a group `.tab-content`.

For the tab/panel selected it adds the class `.open`, otherwise adds the class `.closed`.

**Util [`js/lib/util.js`](../js/lib/util.js)**

Provides utility functions, listed below.

### Functions

The following functions are exposed:

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

**`lqx.geolocate.inCircle(test, center, radius)`**

Returns `true` if a test point is within a circle defined by a center point and radius. Test and center points are object with keys `lat` and `lon`, and radius is distance in kilometers.

**`lqx.geolocate.inPolygon(test, poly)`**

Returns `true` if a test point is within a polygon of arbitrary points. Test is an object with keys `lat` and `lon`. Poly is an array of objects, each with keys `lat` and `lon`.

**`lqx.geolocate.inSquare(test, corner1, corner2)`**

Returns `true` if a test point is within a square region defined by two opposite corners. Test, corner1 and corner2 are objects with keys `lat` and `lon`.

**`lqx.geolocate.location()`**

Returns location information: city, state, country, continent, time zone, latitude, longitude, and radius.

**`lqx.log(arg)`**

Use instead of `console.log` if you want to easily turn off all console messages when `debug` option is disabled. Accepts string or objects to be displayed in the console, only when the `debug` option is enabled.

**`lqx.mutation.addHandler(type, selector, callback)`**

Adds an observer of type `addNode`, `removeNode` or `modAttrib`, and when the target mutated element matches the provided `selector`, triggers the `callback` passing the element object.

**`lqx.options(opts)`**

Overrides or extends default or current option (settings) values. Accepts an object of options.

**`lqx.read(opts)`**

Initializes the library and sets the initial options. This function should be executed once on your page, after the `<body>` tag is available. This function triggers the custom event `lqxready`.

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

**`lqx.util.swipe(selector, callback)`**

Adds a swipe detection listener on element(s) identified by `selector`, and triggers the `callback` function when a swipe is detected, passing the direction of the swap: :up, dn, lt, rt.

**`lqx.util.uniqueUrl(sel, attrib)`**

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

**`js/scripts.js`**

Use this file to include any global, utility, or minor functionality that you need for your project.

You may use the file `js/scripts.dist.js` included in the template as the template, just copy or rename it to `js/scripts.js`. Please bear in mind how this file has been structured:

  * It takes the `$` namespace. If you have other libraries already using `$` you can change it to your own namespace to avoid conflicts.
  * It checks for jQuery and lqx libraries. You can add other dependencies.
  * The main structure is a self-executing function that returns only the variables and functions that need to be access from outside.
  * Runs `init()` as soon as it's loaded.

**Vue**

For advanced or complex functionality, we recommend the use of Vue apps. Your controllers should be placed in `js/custom/controllers`, and components in `js/custom/components`.

## Processing JS Files

You may use the shell script [`js/js.sh`](../js/js.sh) to process the SCSS files for your project. This scripts creates `js/lyquix.js` from the JavaScript library modules located at `js/lib/`, and `js/vue.js` from the custom controllers and components located atS `js/custom/`. It also creates `.min.js` versions of both files and of `js/scripts.js`.

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
