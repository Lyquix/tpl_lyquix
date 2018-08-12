# Template Files and Module Positions

`templateDetails.xml` contains meta data for the template (name, date, etc.), list of files included in the template, list of available module positions, and template options.

### Files

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
	<filename>custom.dist.php</filename>
	<filename>index.html</filename>
	<filename>index.php</filename>
	<filename>raw.php</filename>
	<filename>templateDetails.xml</filename>
	<filename>template_preview.png</filename>
	<filename>template_thumbnail.png</filename>
</files>
```

### Module Positions

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
