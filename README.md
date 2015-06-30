#Lyquix Joomla Template#

##What is this?##

Lyquix developed this Joomla template in 2014 for using in client projects. After about one year of development and testing we have decided to make it open source, so that others can use it and contribute to it. Perhaps some of the ideas used in this template can be inspiration for other templates and even for the Joomla project.

The objectives of this template are:

1. **Consistently implement best practices** that we have learned over the years. We want to incorporate that knowledge into this base template so that we can assure consistency across projects, and bring their benefit to all our clients.
2. **Provide a fully-featured base template** that includes a useful page structure, common CSS classes, and Javascript code that allows us to be more efficient by avoiding to recreate the wheel on every project, without limiting the flexibility and uniqueness of each project.
3. **Allow a simple mechanism for updating templates over time**. As we enhance the template in new projects, or fix problems, we want make it easy to deploy those enhancements and fixes to all our clients without having to reverse engineer each project, and without affecting the customizations that we develop for each client.

##Is this template for you?##

This is intended for advanced developers, or those looking to learn advanced template development. 

If you are looking for a "one-click & go" template, this is not for you. After you first install this template you will probably see a blank page. 

This is intended to be the foundation for developers that build custom templates from scratch. This is not a pre-made template that looks pretty and you tweak to fit your design.

##Features##

###Mobile###

  * Sets meta viewport
  * Use MobileDetect to identify if the visitor is using a mobile device, and whether it is a tablet or phone, and adds classes to the body tag
  * Responsive and fluid: in the documentation you can find more information about our approach to responsive and fluid design
  * Sets mobile icons

###CSS and LESS###

  * Hundreds of common classes for efficiently styling your site with cross-browser compatibility
  * Use LESS for easy customization and maintenance
  * Stylesheet URL is appended with date-time of last modification to ensure visitors always load latest version
  * Incorporates 6 icon libraries: FontAwesome, IcoMoon, IonIcons, MapIcons, TypIcons and WeatherIcons, using consistent classes and allowing for LESS mixings everywhere
  * 7-row, 6-column base layout provides a very good starting point for any design

###Javascript###

  * Automatically loads less.js and .less files during development only (controlled by template settings)
  * Custom scripts URL is appended with date-time of last modification to ensure visitors always load latest version
  * Loads Joomla Bootstrap with jQuery UI
  * Lyquix Javascript library includes useful functionality for responsiveness, analytics (scroll depth, video events, photo gallery events, download URLs, exit URLs), photo galleries, sliders, and script-supported styling including equal height rows, hanging punctuation, image captions, color shades
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

  * All PHP templates can be overriden by adding custom-index.php, custom-component.php, custom-error.php or custom-offline.php
  * LESS files can be overriden by adding custom files to the css/less/custom folder. [NOTE: this feature relies on the import keyword 'optional' introduced in LESS 2, and as of this writing it is only supported by the LESS command line compiler]
  * Updated versions of the template will not override or modified customization files

###Dealing with good old IE###

  * Adds fix IE console
  * Loads html5shiv and selectivzr
  * Adds conditional comments for CSS fixes for IE (only if CSS files exist)
  * Displays warning for IE8 and older users

##Documentation##

Since this started as an internal project, the documentation was initially developed as a Google Doc. We have made that document public now and you can find it here https://goo.gl/ZncfgQ

##To Do##

There is still work to do! Please let us know if you would like to help, find any issues, or have any ideas.

  * Finish the documentation
  * Update 3rd party libraries as needed
  * Tracking of Vimeo video player events
  * Cross-browser testing of all CSS3-supported styles (and document what is not supported in which browsers)

Some ideas we have and plan on develop next:

  * Styles for related content, and side content
  * Styles for FLEXIcontent
  * More module and component overrides - some popular components have very poor frontends
  * More styles and effects for mobile (e.g. animated menus)
