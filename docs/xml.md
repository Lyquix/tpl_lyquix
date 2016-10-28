#templateDetails.xml
This file includes meta data for the template (name, date, etc.), list of files included in the template, list of available module positions, and template options.

###Files
The following files and folders are installed with the template:
```xml
<files>
	<folder>css</folder>
	<folder>html</folder>
	<folder>images</folder>
	<folder>js</folder>
	<folder>fonts</folder>
	<folder>php</folder>
	<filename>component.php</filename>
	<filename>component-custom.dist.php</filename>
	<filename>index.html</filename>
	<filename>index.php</filename>
	<filename>index-custom.dist.php</filename>
	<filename>raw.php</filename>
	<filename>templateDetails.xml</filename>
	<filename>template_preview.png</filename>
	<filename>template_thumbnail.png</filename>
</files>
```

###Module Positions
The following module positions have been defined:
  * **head** - placed at the end of the <head> tag
  * **main-header** - placed at the top of the <main> tag
  * **main-left** - placed on the left of the middle of the <main> tag
  * **main-top** - placed above the main-center position
  * **main-center** - placed on the center of the middle of the <main> tag. This position is used exclusively by the component output, except on the home page
  * **main-bottom** - placed below the main-center position
  * **main-right** - placed on the rightof the middle of the <main> tag
  * **main-footer** - placed at the bottom of the <main> tag
  * **body** - placed at the end of the <body> tag
  * All the other positions, such as **util-1** are placed in blocks inside the various rows.

###Configuration Fields
The following configuration options are available in the Joomla template manager:

  * Basic
    * Blank page: allows to create a template style that only renders the component, but includes all the template javascript and css.
  * Joomla options
    * Disable Mootools
    * Enable jQuery core and UI
    * Enable Bootstrap
    * Load Joomla javascript frameworks
  * Responsiveness
    * Minimum and maximum screen sizes for Lyquix responsive framework: xs, sm, md, lg and xl
    * Fluid layout: adds fluid classes to the body tag for specific screen sizes and device types
  * CSS
    * Additional CSS libraries
    * Remove CSS libraries added by Joomla or extensions
  * Javascript
    * Lyquix options
    * Use original or minified Javascript files
    * Use less.js
    * Load AngularJS
    * Load LoDash
    * Load ES5 shim
    * Load ES6 shim
    * Load JSON3
    * Additional Javascript libraries
    * Remove Javascript loaded by Joomla or extensions
  * Accounts
    * Google Analytics account number
    * Disqus shortname
    * AddThis pubid
    * Google site verification code
    * Bing/Yahoo sites verification code
  * Other
    * Mobile Detect Method: select whether mobile detection is done server side (PHP) or client side (JS)
    * Enable IE8 alert
    * Enable IE9 alert
