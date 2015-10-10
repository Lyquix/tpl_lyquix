#templateDetails.xml
This file includes meta data for the template (name, date, etc.), list of files included in the template, list of available module positions, and template options.

###Files
```xml

<files>
	<folder>css</folder>
	<folder>html</folder>
	<folder>images</folder>
	<folder>js</folder>
	<folder>fonts</folder>
	<folder>php</folder>
	<filename>component.php</filename>
	<filename>component-custom.php</filename>
	<filename>index.html</filename>
	<filename>index.php</filename>
	<filename>index-custom.php</filename>
	<filename>offline.php</filename>
	<filename>raw.php</filename>
	<filename>templateDetails.xml</filename>
	<filename>template_preview.png</filename>
	<filename>template_thumbnail.png</filename>
</files>
```

###Module Positions
```xml
<positions>

	<position>head</position>

	<position>util-1</position>
	<position>util-2</position>
	<position>util-3</position>
	<position>util-4</position>
	<position>util-5</position>
	<position>util-6</position>

	<position>header-1</position>
	<position>header-2</position>
	<position>header-3</position>
	<position>header-4</position>
	<position>header-5</position>
	<position>header-6</position>

	<position>top-1</position>
	<position>top-2</position>
	<position>top-3</position>
	<position>top-4</position>
	<position>top-5</position>
	<position>top-6</position>

	<position>main-header</position>
	<position>main-left</position>
	<position>main-top</position>
	<position>main-center</position>
	<position>main-bottom</position>
	<position>main-right</position>
	<position>main-footer</position>

	<position>bottom-1</position>
	<position>bottom-2</position>
	<position>bottom-3</position>
	<position>bottom-4</position>
	<position>bottom-5</position>
	<position>bottom-6</position>

	<position>footer-1</position>
	<position>footer-2</position>
	<position>footer-3</position>
	<position>footer-4</position>
	<position>footer-5</position>
	<position>footer-6</position>

	<position>copyright-1</position>
	<position>copyright-2</position>
	<position>copyright-3</position>
	<position>copyright-4</position>
	<position>copyright-5</position>
	<position>copyright-6</position>

	<position>body</position>

</positions>
```
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
```xml
<config>
	<fields name="params">
		<fieldset name="advanced">
			<field name="ga_account" type="text" default="" label="Google Analytics Account" description="Enter a Google Analytics property account number to load Google Analytics and send data to the account" />
			<field name="disqus_shortname" type="text" default="" label="Disqus Shortname" description="Enter your Disqus shortname to load the Disqus library" />
			<field name="addthis_pubid" type="text" default="" label="AddThis PubID" description="Enter your AddThis pubid number to load the AddThis library" />
			<field name="google_site_verification" type="text" default="" label="google-site-verification" description="Enter your Google Webmaster Tools site verification number" />
			<field name="msvalidate" type="text" default="" label="msvalidate.01" description="Enter your Bing/Yahoo site validation number" />
			<field name="p_domain_verify" type="text" default="" label="p:domain_verify" description="" />
			<field name="lqx_options" type="text" default="" label="Lyquix Library Options" description="Object of options to override Lyquix default settings" />
			<field name="blank_page" type="radio" default="0" label="Blank Page" description="">
				<option value="0">No</option>
				<option value="1">Yes</option>
			</field>
			<field name="add_css_libraries" type="textarea" default="" label="Additional CSS Libraries" description="Enter one URL per line for additional javascript libraries you need for your project. We recommend: a) remove the protcol (http or https) from the URL, b) use the minified version for the production site" />
			<field name="non_min_js" type="radio" default="0" label="Use original JS" description="Uses the original JS files instead of the minified versions. Activate only for development.">
				<option value="0">No</option>
				<option value="1">Yes</option>
			</field>
			<field name="lessjs" type="radio" default="0" label="Use less.js" description="Uses LESS instead of CSS with JavaScript processing. Activate only for development. Not recommended for production as it degrades page performance.">
				<option value="0">No</option>
				<option value="1">Yes</option>
			</field>
			<field name="angularjs" type="radio" default="0" label="Load AngularJS library" description="">
				<option value="0">No</option>
				<option value="1">Yes</option>
			</field>
			<field name="lodash" type="radio" default="0" label="Load LoDash library" description="">
				<option value="0">No</option>
				<option value="1">Yes</option>
			</field>
			<field name="add_js_libraries" type="textarea" default="" label="Additional Javascript Libraries" description="Enter one URL per line for additional javascript libraries you need for your project. We recommend: a) remove the protcol (http or https) from the URL, b) use the minified version for the production site" />
			<field name="min_screen" type="list" label="Minimum Screen Size" default="0" description="Select the minimum screen size that will be allowed">
				<option value="0">XS</option>
				<option value="1">SM</option>
				<option value="2">MD</option>
				<option value="3">LG</option>
				<option value="4">XL</option>
			</field>
			<field name="max_screen" type="list" label="Maximum Screen Size" default="4" description="Select the maximum screen size that will be allowed">
				<option value="0">XS</option>
				<option value="1">SM</option>
				<option value="2">MD</option>
				<option value="3">LG</option>
				<option value="4">XL</option>
			</field>
			<field name="fluid_screen" type="checkboxes" label="Fluid Layout Screens" description="Select for what screen sizes should fluid layout be enabled">
				<option value="xs">XS</option>
				<option value="sm">SM</option>
				<option value="md">MD</option>
				<option value="lg">LG</option>
				<option value="xl">XL</option>
			</field>
			<field name="fluid_device" type="radio" default="any" label="Fluid Layout Devices" description="Select what devices are allowed to have fluid layouts">
				<option value="any">Any (Mobile and Desktop)</option>
				<option value="mobile">Mobile only</option>
				<option value="phone">Phones only</option>
				<option value="tablet">Tablets only</option>
			</field>
			<field name="mobiledetect_method" type="radio" default="php" label="Mobile Detect Method" description="Selects the method for detecting mobile devices. Adds CSS classes mobile, tablet and phone to the body tag if applicable. Server-side (PHP) is the default method but if your site uses page cache, you should use client-side method.">
				<option value="php">Server-Side (PHP)</option>
				<option value="js">Client-Side (JavaScript)</option>
			</field>
		</fieldset>
	</fields>
</config>
```
* Google Analytics account number
* Disqus shortname
* AddThis pubid
* Google site verification code
* Bing/Yahoo sites verification code
* Blank page: allows to create a template style that only renders the component, but includes all the template javascript and css.
* Additional CSS libraries: enter one URL per line
* Original JS: during development you can load the original JS files (non minified) for easier debugging.
* Less.js: during development, loads less.js and compiles LESS files on the browser.
* AngularJS: loads the AngularJS library
* LoDash: loads the LoDash library
* Additional JS libraries: enter one URL per line
* Minimum and maximum screen sizes for Lyquix responsive framework: xs, sm, md, lg and xl
* Fluid layout: adds fluid classes to the body tag for specific screen sizes and device types
* Mobile Detect Method: select whether mobile detection is done server side (PHP) or client side (JS)