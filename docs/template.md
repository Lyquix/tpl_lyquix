# Template Files
In order to allow for customization of your template, without overriding template files we have modified the files `index.php` and `component.php` to look for your custom template files, `index-custom.php` and `component-custom.php` respectively.

You can see that several parts of the template have been separated into individual PHP include files for easy management and updates. You can find those files in the php directory:

  * `head-pre.inc.php` - code executed before the opening <html> tag
  	* Remove CSS and Javascript libraries added by Joomla and extensions that you cannot otherwise turn off
  	* Disable MooTools
  	* Enable jQuery core and UI
  	* Enable Bootstrap
  	* Enable Joomla Javascript frameworks
  	* Initial setup of variables used in the template
  	* Server-side MobileDetect
  * `head-top.inc.php` - code executed at the top of the <head> tag
  	* IE conditional code that fixes console.log and loads aight.js and selectivizr.js for IE8
  	* Render Google site verification code, Microsoft site validation code in home page
  	* Render canonical URL in home page
  	* Add OpenGraph tags for title and description
  	* Add X-UA-Compatible and viewport meta tags
  * `css.inc.php`
  	* Add custom CSS libraries
  	* Load styles.css. If LESS.js is in use, uses styles.less, adds file modification timestamp to URL to ensure updated files are loaded
  	* Loads less.js if activated
  	* If chunked styles.css files are available it loads them for IE9 and older
  	* If ie9.css is available it loads it for IE9 and older
  * `js.inc.php`
  	* Loads selected libraries: ES5 shim, ES6 shim/sham, JSON3, AngularJS, loDash
  	* Loads MobileDetect if configured for client-side detection
  	* Adds custom Javascript libraries
  	* Adds Lyquix Javascript library lyquix.js
  	* Renders custom lqx options
  	* If exists, loads scripts.js
  	* All Javascript files get automatically the minified version if configured to do so (recommended for production sites)
  	* All Javascript files get the modification timestamp in URL to ensure updated files are loaded
  * `favicon.inc.php` - loads favicons in all the sizes and formats to cover all browsers and devices. Use http://www.favicon-generator.org/ to generate all files and place them in image/favicon/ directory
  * `head-bottom.inc.php` - code executed at the bottom of the <head> tag
  	* Load Google Analytics
  	* Load AddThis
  	* Load modules for head position
  * `body-pre.inc.php`
  	* Prepares classes for body tag: home, phone, tablet, Joomla option/view/task, and blk-fluid classes
  * `body-top.inc.php`
  	* Runs lqx.bodyScreenSize to set the body screen attribute early and ensure proper rendering without flashing
  	* Renders mobile detect Javascript variables
  * `body-bottom.inc.php`: 
  	* Renders IE8 and IE9 alerts if enabled
  	* Loads Disqus if enabled
  	* Load modules for body position



### raw.php
Provides an alternative template file that generates a raw output from the component. This is useful for generating output such as JSON or binary files.
