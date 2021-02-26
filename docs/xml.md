# Template Files and Module Positions

`@version     2.3.0`

[`templateDetails.xml`](../templateDetails.xml) contains meta data for the template (name, date, etc.), list of files included in the template, list of available module positions, and template options.

### Files

The following files and folders are installed with the template:

```xml
<files>
	<folder>css</folder>
	<folder>docs</folder>
	<folder>css</folder>
	<folder>fonts</folder>
	<folder>images</folder>
	<folder>js</folder>
	<folder>php</folder>
	<filename>.htaccess</filename>
	<filename>component.php</filename>
	<filename>custom.dist.php</filename>
	<filename>index.php</filename>
	<filename>raw.php</filename>
	<filename>templateDetails.xml</filename>
	<filename>template_preview.png</filename>
	<filename>template_thumbnail.png</filename>
</files>
```

### Module Positions

The template includes various module positions that you can use or ignore as needed. Below is the list with its recommended placement:

  * `head-scripts`: at the end of the `<head>` tag, use it to load additional CSS code, JS code, and meta tags.
  * `body-scripts`: at the end of the `<body>` tag, use it to load end-of-the-page JS code.
  * `header`, `nav-header`, `util`, `top`: use for positions in the header/top area of the page.
  * `footer`, `nav-footer`, `bottom`, `copyright`: use for positions in the header/bottom area or the page.
  * `left`, `center`, `right`, `before`, `after`, `aside`, `prev`, `next`: various position to be used as you need.
