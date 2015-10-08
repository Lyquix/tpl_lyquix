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
  * Responsive and fluid: in the documentation you can find more information about our approach to responsive and fluid design
  * Sets mobile icons

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

###Javascript###

  * Automatically loads less.js and .less files during development only (controlled by template settings)
  * Options to load AngularJS, loDash and additional custom-url javascript libraries
  * Custom script.js URL is appended with date-time of last modification to ensure visitors always load latest version
  * Loads Joomla Bootstrap with jQuery UI
  * Lyquix Javascript library includes useful functionality for:
    * Responsiveness: listens to screen resize and rotation events, then sets the attribute "screen" in the body tag based on the screen size, and triggers the custom event screensizechange. This event can then be listened by other functions to implement full responsiveness. Supports down to IE8.
    * Analytics - tracking of common events using Google Analytics:
      * Scroll depth
      * Video events on YouTube and Vimeo players: start, progress milestones, complete
      * Photo gallery events: gallery open and image view
      * Download URLs
      * Exit URLs
    * Script-supported styling including equal height rows, hanging punctuation, image captions, color shades
  * Overrides Lyquix Javascript defaults via template settings
  * Loads Google Analytics, AddThis and Disqus if account numbers are set in template settings
  * Uses minified files for production

###Joomla###

  * Several module positions for 7-row, 6-column layout, as well as header and footer positions
  * Template configuration fields for Google Analytics, AddThis and Disqus accounts, Google and Yahoo/Bing site verification, blank page option, use less.js during development, use non-minified files during development, fluid screen sizes and fluid devices preferences
  * Base templates for index, component, error, offline
  * Displays module positions only if module available
  * Add classes to body tag identifying component, view, task

###Customization###

  * All PHP templates can be overriden by adding index-custom.php and component-custom.php
  * LESS files can be overriden by adding custom files to the css/less/custom folder. [NOTE: this feature relies on the import keyword 'optional' introduced in LESS 2, and as of this writing it is only supported by the LESS command line compiler]
  * Updated versions of the template will not override or modified customization files

###Dealing with good old IE###

  * Adds fix IE console
  * Loads html5shiv and selectivzr
  * Adds conditional comments for CSS fixes for IE (only if CSS files exist)
  * Adds width attributes to images if missing
  * On IE8 implements a hack for responsiveness to work
  * On IE8 implements fallback of inline svg images to png
  * Hacks for font rendering issues in IE11
  * Displays warning for IE8 and older users

##Documentation##

Since this started as an internal project, the documentation was initially developed as a Google Doc. We have made that document public now and you can find it here https://goo.gl/ZncfgQ

We are slowly moving the documentation into this repo:

[Installation and basic setup](https://github.com/Lyquix/tpl_lyquix/blob/master/docs/install.md)
[Files, positions, configuration: templateDetails.xml](https://github.com/Lyquix/tpl_lyquix/blob/master/docs/xml.md)
[Base template files: index.php, component.php](https://github.com/Lyquix/tpl_lyquix/blob/master/docs/template.md)

##To Do##

There is still work to do! Please let us know if you would like to help, find any issues, or have any ideas.

  * Finish the documentation
  * Update 3rd party libraries as needed
  * Cross-browser testing of all CSS3-supported styles (and document what is not supported in which browsers)

Some ideas we have and plan on develop next:

  * Styles for related content, and side content
  * Styles for FLEXIcontent
  * More module and component overrides - some popular components have very poor frontends
  * More styles and effects for mobile (e.g. animated menus)
