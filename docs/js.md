# JavaScript

## Overview

All the scripting files are located in the [`js/`](../js/) directory. We have developed our own JavaScript library, and we use Vue.js for advanced functionality.

## JavaScript Library Modules

The library is made up by a collection of modules that can be disabled and configured to meet the needs of your project.

#### Accordion

Adds accordion functionality to any element with the `.accordion` class. It automatically uses the first child as header element unless you specificy an element with class `.accordion-header`. This module adds a class `.closed` or `.open`, and sets the accordion height as inline style.

The height of the accordion when open and closed is recalculated on resize, screen change, and orientation change.

If the accordion is a child of an `.accordion-group` parent, then when one accordion is opened the rest are closed.

#### Analytics

Provides functionality for custom event tracking with Google Analytics:

  * **Outbound Links:** Track outbound links (links pointing to a different domain) that users follow when leaving your site. This is recorded as an event that is triggered right before the browser abandons the page.
  * **Download Links:** Track download links, such as PDF files, Microsoft Office files, text files, etc. that don't have JavaScript capabilities and normally don't generate a page view. This custom event tracks the link as a page view.
  * **Scroll Depth:** Tracks the maximum percentage of a page that was visible to the user. This metric can be used to get a sense on whether users are scrolling down on pages to extend beyond the fold. An event is triggered right before abandoning the page, and reports the maximum tenth percentage (e.g. 10%, 20%, ..., 100%).
  * **Photo Gallery:** Generates events on gallery open, as well as individual events for each image displayed, including the image URL.
  * **Video Player:** Tracks events in YouTube and Vimeo players. It automatically enabled Javascript API if not enabled in the embed code. It tracks Start, progress and completion events, for example: Start, 10%, 20%, ..., 90%, Complete.
  * **User Active:** Keeps track of the time a user is active while viewing a page. It uses several techniques to assess if the user is active or not. Reports the percentage and absolute time that the user has been active and inactive. Tracking stops after 30 minutes.

#### Detect

A collection of detection utilities.

  * **Device:** uses the MobileDetect JS library https://github.com/hgoebl/mobile-detect.js to detect if the current device is mobile, and whether it is a phone or tablet, and sets classes to the `<body>` tag.  Details are also available by calling `lqx.detect.mobile`.
  * **Browser:** uses the browser User Agent string to detect the browser type (e.g. Internet Explorer,  Chrome, etc.) and version. Classes are added to the `<body>` tag for browser, browser and major version, and browser and full version. Details are also available by calling `lqx.detect.browser`.
  * **Operating System:** uses the browser User Agent string to detect the operating system type (e.g iOS, Windows, etc.) and version. Classes are added to the `<body>` tag for OS, OS and major version, and OS and full version. Details are also available by calling `lqx.detect.os`.
  * **URL Parts:** detects the URL parts (e.g. protocol, domain, path), and sets them as attributes to the `<body>` tag. Details are also available by calling `lqx.detect.urlParts`.
  * **URL Params:** detects the URL query parameters and make them available at `lqx.detect.urlParams`.

#### Fixes

Applies various fixes to Internet Explorer.

  * **Image Width Attribute:** adds the width attribute to images missing it.
  * **Reset Font Features:** resets the `font-features` property to normal to prevent issues displaying Google Fonts.
  * **CSS Grid:** attempts to automatically place CSS grid children elements when column, row and span properties have not been explicitly defined.

#### Geolocate

Uses the user IP address to get an approximate location of the user, using the GeoLite2 free database that provides the user city, state, country and continent. Optionally, the script can request GPS location for accurate latitude and longitude.

The process is done entirely via Javascript and a dedicated PHP script that searches the user IP address in the database, avoiding any issues with cached pages.

You must download the file `GeoLite2-City.mmdb` from http://dev.maxmind.com/geoip/geoip2/geolite2/ and save it to `php/ip2geo`.

Once located, the script adds attributes to the `<body>` tag: city, subdivision, country, continent, and time-zone.

Optionally, you can enable GPS geolocation for more accurate results. This will show an alert/prompt to users asking for their permission to access their location.

#### LyqBox

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

#### Menu

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

### Functions

**`lqx.detect.browser()`**

Provides details of detected browser.

**`lqx.detect.mobile()`**

Provides details of detected device.

**`lqx.detect.os()`**

Provides details of detected operating system.

**`lqx.detect.urlParams()`**

Provides list of detected URL query parameters.

**`lqx.detect.urlParts()`**

Provides details of URL parts.

**`lqx.error(arg)`**

Accepts string or objects to be displayed in the console, only when the `debug` option is enabled. Use instead of `console.error` if you want to easily turn off all console messages when `debug` option is disabled.

**`lqx.geolocate.inCircle(test, center, radius)`**

Calculates if a test point is within a circle defined by a center point and radius. Test and center points are object with keys `lat` and `lon`, and radius is distance in kilometers.

**`lqx.geolocate.inPolygon(test, poly)`**

Calculates if a test point is within a polygon of arbitrary points. Test is an object with keys `lat` and `lon`. Poly is an array of objects, each with keys `lat` and `lon`.

**`lqx.geolocate.inSquare(test, corner1, corner2)`**

Calculate if a test point is within a square region defined by two opposite corners. Test, corner1 and corner2 are objects with keys `lat` and `lon`.

**`lqx.geolocate.location()`**

Returns location information: city, state, country, continent, time zone, latitude, longitude, and radius. By default geolocation is done using user's IP address, optionally GPS can be used for more accurate results.

**`lqx.log(arg)`**

Accepts string or objects to be displayed in the console, only when the `debug` option is enabled. Use instead of `console.log` if you want to easily turn off all console messages when `debug` option is disabled.

**`lqx.options(opts)`**

Accepts an object of options (settings) and overrides or extends default or current option values.

**`lqx.read(opts)`**

Initializes the library and sets the initial options. This function should be executed once on your page, after the `<body>` tag is available. This function triggers the custom event `lqxready`.

**`lqx.warn(arg)`**

Accepts string or objects to be displayed in the console, only when the `debug` option is enabled. Use instead of `console.warn` if you want to easily turn off all console messages when `debug` option is disabled.

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

**`lqxready`**

Triggered once by `lqx.ready` when the library is initialized and `<body>` is ready.

**`scrollthrottle`**

Triggers every 15ms when the `scroll` event is being triggered. Use this event instead of `scroll` to prevent browser to be overwhelmed.

**`resizethrottle`**

Triggers every 15ms when the `resize` event is being triggered. Use this event instead of `resize` to prevent browser to be overwhelmed.

