#Lyquix Joomla Template#

##What is this?##

Lyquix developed this Joomla template in 2014 for using in client projects. After about one year of development and testing we have decided to make it open source, so that others can use it and contribute to it. Perhaps some of the ideas used in this template can be inspiration for other templates and even for the Joomla project.

The objectives of this template are:

1. **Consistently implement best practices** that we have learned over the years. We want to incorporate that knowledge into this base template so that we can assure consistency across projects, and bring their benefit to all our clients.
2. **Provide a fully-featured base template** that includes a useful page structure, common CSS classes, and Javascript code that allows us to be more efficient by avoiding to recreate the wheel on every project, without limiting the flexibility and uniqueness of each project.
3. **Allow a simple mechanism for updating templates over time**. As we enhance the template in new projects, or fix problems, we want make it easy to deploy those enhancements and fixes to all our clients without having to reverse engineer each project, and without affecting the customizations that we develop for each client.

##Is this template for you?##

This is intended for advanced developers, or those looking to learn advanced template development. 

If you are looking for a "one-click & go" template, this is not for you. After you first install this template you will probably see a blank page with an error message. 

This is intended to be the foundation for developers that build custom templates from scratch. This is not a pre-made template that looks pretty and you tweak to fit your design.

##Features##

###Mobile###

  * Sets meta viewport
  * Use MobileDetect to identify if the visitor is using a mobile device, and whether it is a tablet or phone, and adds classes to the body tag
  * Detection can be set to be done server-side (PHP) or client-side (JS)
  * A JS object lqx.mobileDetect is created with the result of mobile detection
  * Responsive and fluid: in the documentation you can find more information about our approach to responsive and fluid design
  * Sets mobile icons
  * Adds attributes to body tag to identify screen size and orientation for easy use in CSS

###Grid Layout and Responsive Framework###

The template implements a grid layout and responsive framework. Think Bootstrap grid, but with a different overall approach. Our grid layout is based on the following principles:

  * On a macro level the design is broken down into columns and rows
  * We define 5 screen sizes, and we call them xs, sm, md, lg and xl. The smallest screen (smartphone on portrait orientation) has one colum. The other screen sizes are multiples of the smallest screen and they have between 2 and 5 columns
  * Columns are further divided into blocks. The template can be configured to have 4, 5 or 6 blocks on the smallest screen size, to fit your design needs
  * Configure minimum and maximum allowed screens
  * Blocks are divided into content, padding, border and margin. You can configure the template to specify the sizes of those components to fit your design needs
  * Automatic downsizing: large blocks in a small screen (or inside smaller blocks) are automatically downsized
  * Utility classes for layout-only blocks
  * Fluid layout can be activated only where needed: by screen size, and device type (all, mobile only, tablets only, phones only)

###CSS and LESS###

  * Hundreds of common classes for efficiently styling your site with cross-browser compatibility
  * Use LESS for easy customization and maintenance
  * Stylesheet URL is appended with date-time of last modification to ensure visitors always load latest version
  * Incorporates 6 icon libraries: FontAwesome, IcoMoon, IonIcons, MapIcons, TypIcons and WeatherIcons, using consistent classes and allowing for LESS mixings everywhere
  * 7-row, 6-column base layout provides a very good starting point for any design
  * Utility functions for creating the structure and base functionality of menus
  * Base styles for print version
  * Allows adding custom CSS libraries from template settings
  * Recommended: use PostCSS Autoprefixer to add support for custom browser prefixes and variations
  * Recommended: use BLESS to chunk files to avoid issues with IE9, which are automatically detected and loaded

###Javascript###

  * Automatically loads less.js and .less files during development only (controlled by template settings)
  * Options to load AngularJS, loDash and additional custom-url javascript libraries
  * Custom script.js URL is appended with date-time of last modification to ensure visitors always load latest version
  * Loads Joomla Bootstrap with jQuery UI
  * Responsiveness: listens to screen resize and rotation events, then sets the attribute "screen" in the body tag based on the screen size, and triggers the custom event screensizechange. This event can then be listened by other functions to implement full responsiveness. Supports down to IE8.
  * Script-supported styling including equal height rows, hanging punctuation, image captions, color shades
  * Overrides Lyquix Javascript defaults via template settings
  * Loads Google Analytics, AddThis and Disqus if account numbers are set in template settings
  * Uses minified files for production
  * Template for custom project scripts
  * Detects browser and operating system, type and version, and adds them as classes to body tag
  * Custom events: onscreensizechange, scrollthrottle, and resizethrottle

###LyqBox: our own Lightbox library###

  * Use a simple HTML structure to generate lightboxes
  * Create dismissable alerts
  * Galleries of images, videos, and HTML content

###Joomla###

  * Several module positions for 7-row, 6-column layout, as well as header and footer positions
  * Template configuration fields for Google Analytics, AddThis and Disqus accounts, Google and Yahoo/Bing site verification, blank page option, use less.js during development, use non-minified files during development, fluid screen sizes and fluid devices preferences
  * Template options for loading frameworks and libraries: loDash, AngularJS, and polyfills for ES5 and ES6
  * Base templates for index, component, error, offline
  * Displays module positions only if module available
  * Add classes to body tag identifying component, view, task
  * Easily add custom js and css libraries in template settings
  * Unset js and css added by Joomla and extensions

###Customization###

  * All PHP templates can be overriden by adding index-custom.php and component-custom.php
  * LESS files can be overriden by adding custom files to the css/less/custom folder. [NOTE: this feature relies on the import keyword 'optional' introduced in LESS 2, and as of this writing it is only supported by the LESS command line compiler]
  * Updated versions of the template will not override or modified customization files

###Dealing with IE###

  * Adds fix IE console
  * Sets X-UA-Compatible tag
  * Loads html5shiv and selectivzr
  * Adds conditional comments for CSS fixes for IE (only if CSS files exist)
  * Automatically loads chunked CSS files for IE9
  * Adds classes to body tag that identify browser type and version
  * Adds width attribute to images if missing
  * Hacks for font rendering issues in IE11
  * Displays outdated browser warning for IE8 and IE9 users

###Tracking with Google Analytics###
  
  * Loads Google Analytics universal tracking code when UA- account is set in template settings
  * Implements parameter-driven Google Analytics configuration, as well as custom function
  * Tracking of outbound links as events
  * Tracking of download file as page views
  * Tracking of page scroll depth as event
  * Tracking of photo gallery open and browsing as events
  * Tracking of video player events (play, percentage, and complete), supports YouTube and Vimeo
  * Tracking of active/inactive user time
  * A/B testing by randomly assigning visitors to A/B groups (via cookie for 30 days), adding attribute to body tag, and setting test name and test group via dimensions

##Documentation##

Since this started as an internal project, the documentation was initially developed as a Google Doc. We have made that document public now and you can find it here https://goo.gl/ZncfgQ

We are slowly moving the documentation into this repo:

  * [Installation and basic setup](https://github.com/Lyquix/tpl_lyquix/blob/master/docs/install.md)
  * [Files, positions, configuration: templateDetails.xml](https://github.com/Lyquix/tpl_lyquix/blob/master/docs/xml.md)
  * [Base template files: index.php, component.php](https://github.com/Lyquix/tpl_lyquix/blob/master/docs/template.md)
  * [JavaScript functionality](https://github.com/Lyquix/tpl_lyquix/blob/master/docs/js.md)

##To Do and Ideas##

Refer to the Issues in this repo
