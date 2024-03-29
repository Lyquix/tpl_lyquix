# CSS

`@version     2.4.1`

## Overview

All the styling files are located in the [`css/`](../css/) directory. We use SASS as CSS pre-processor.

The main template style file is `css/styles.css`. This file is generated by processing `css/styles.scss`. Refer to the [Installation, Setup and Customization`](./install.md) for the initial setup for your project.

In `css/styles.scss` you configure the SASS variables for your project (described below). These variables are used by the CSS library, as well as your custom styles. You can control what files and mixins you want to include from the CSS library (also described below).

Custom styles for your project should be added by creating `.scss` files in [`css/custom/`](../css/custom/) and importing them in `css/custom/custom.scss`.

## CSS Library

In this section we review the CSS library by going over the variables and file imports in `css/styles.scss`.

[**`css/lib/normalize.scss`**](../css/lib/normalize.scss)

Resets browser default stylesheets to provide consistent styling accros browsers. Based on https://github.com/necolas/normalize.css.

[**`css/lib/base.scss`**](../css/lib/base.scss)

Sets the styling of base HTML tags. This file requires setting the following variables

  * **Colors:** you will find variables for background, copy, brand colors, accent colors, greys, and assignment of this color palette to various elements
  * **Font sizes:** defines the font sizes for various HTML tags. The font size for the `<html>` element is defined as 16px, making 1rem = 10px.
  * **Line height:** set the line height for normal text, headings, big and small.
  * **Margins:** define the top-bottom margins for base text, headings, and input elements.
  * **Font families:** import webfonts and define the default serif, sans-serif, and monospace fonts, and assign font families to various HTML elements.

[**`css/lib/container.scss`**](../css/lib/container.scss)

Creates `.container` classes for each screen size, defining its left-right margins and max-width. It requires the following variables:

  * `$screen-sizes`: array of the screen sizes names. Don't change unless you know what you are doing.
  * `$container-margin`: array of the left-right margin for `.container` for each screen size (starting with xs, all the way up to xl).
  * `$container-max-width`: array of the max-width value for `.container` for each screen size.

[**`css/lib/grid.scss`**](../css/lib/grid.scss)

Creates utility CSS classes for working with CSS grids. The following variables need to be defined:

  * `$grid-column-gap`
  * `$grid-row-gap`

[**`css/lib/flexbox.scss`**](../css/lib/flexbox.scss)

Creates utility CSS classes for working with FlexBox.

[**`css/lib/blocks.scss`**](../css/lib/blocks.scss)

Creates the `.blk` classes, the workhorse of our responsive layout framework. The following variables need to be defined:

  * `$blk-denominator`: defines the maximum fraction denominator to be used for generating the fraction classes, e.g. `.blk3/5`.
  * `$blk-pct-step`: defines the step used for generating percentage block classes e.g. `.blk15%`.
  * `$blk-margin`: array that defines the default margin for each screen size.
  * `$blk-border`: array that defines the default border size for each screen size.
  * `$blk-padding`: array that defines the default padding for each screen size.

It also creates the following classes:

  * `.blkbleed-padding`, `.blkbleed-border`, `.blkbleed-margin`: Add to extend the content to the area normally occupied by padding, border, or margin. These classes are useful to "protrude" images and other elements outside of the normal boxes where content resides.
  * `.blkcenter`: Add to break the floating of `.blk` elements and position the element centered.
  * `.flex-container`: Add to change the `display` property of the element to `flex`.

[**`css/lib/common.scss`**](../css/lib/common.scss)

Creates a variety of utility CSS classes:

  * **common-clear:** clear floating and clear fix.
  * **common-float:** floating classes.
  * **common-hide-show:** hide and show classes per screen and device types.
  * **common-font-text:** change font family, size, weight, spacing, alignment, and add transformations and decorations.
  * **common-color:** change text color to any of those defined in the color palette.
  * **common-columns:** easily create CSS columns, specify number of columns per screen size.
  * **common-video:** embed responsive video players.
  * **common-icon:** base icon-font styling.
  * **common-rotate-scale:** rotate and scale elements to common degrees and sizes.
  * **common-filter:** apply various color filters: grayscale, invert, opacity, saturation, hue, and duotone.
  * **common-menu:** utility classes for adding magic to menus.
  * **common-tabs:** nothing here, sorry.
  * **common-accordions:** base styling for accordions.

[**`css/lib/print.scss`**](../css/lib/print.scss)

Prevents elements from breaking on page-breaks. Adds several classes that can used to style printed pages:

  * Page break rules
  * Hide element in print view
  * Remove background
  * Force text color to black
  * Remove text and box shadows
  * Display `href` property of links
  * Display `title` attribute of abbreviations

[**`css/lib/joomla.scss`**](../css/lib/joomla.scss)

Provides basic styling for the following Joomla elements:

  * System messages
  * Breadcrumbs
  * Pagination links

[**`css/lib/flexicontent.scss`**](../css/lib/flexicontent.scss)

Provides basic styling and fixes for FLEXIcontent.

[**`css/lib/lyqbox.scss`**](../css/lib/lyqbox.scss)

Provides basic styling for LyqBox lightbox.

## Custom Project Styles

It is recommended to break up styles for your project in multiple `.scss` files placed in [`css/custom/`](../css/custom/) and imported from `css/custom/custom.scss`. You may want to create files for header, footer, buttons, forms, home page, category pages, item pages, search, etc.

**Optional CSS Libraries**

In the template options you can select from the following optional CSS libraries to be loaded:

  * Animate.css: provides CSS classes for a variety of CSS animations. Learn more at: https://daneden.github.io/animate.css/

**Additional CSS Libraries**

You can load additional CSS libraries by just adding their URL (either local or remote) to the template options in the Joomla administrator.

**Remove CSS Libraries**

Remove CSS libraries added by components, modules or plugins by entering their URL in the template options.

## Responsiveness

The current screen size is automatically updated as `screen` attribute of the `<body>` tag. To create styles for specific screen sizes you can use rules like the following:

```css
body[screen=xs] {
	.my-class {
		...
	}
}
```

Values for screen attribute are: xs, sm, md, lg, and xl.

Additionally, on mobile devices you can use the `orientation` attribute of the `<body>` tag to create styles that consider screen orientation. For example:

```css
body[orientation=landscape] {
	.my-class {
		...
	}
}
```

Values for screen attribute are: portrait, landscape, and null (for non mobile devices).

## Support for Different Device Types, Browsers, and OS

The JavaScript library includes functionality that detects the user browser (type and version), operating system (type and version), and device type (mobile, desktop, phone, tablet). You can create custom styles for each of these by using classes and attributes added automatically to the `<body>` tag. For example:

```css
body.tablet {
	.my-class {
		...
	}
}
```

  * **Device Types:** the class `.mobile` is added for any type of mobile device. Its absence means a non-mobile device. Additionally the classes `.phone` and `.tablet` are added for devices of those types.
  * **Browser Type and Version:** three classes are added - the first is the browser type, the second is the browser type and major version number, and the third class is the browser type and complete version number.
  * **Operating System Type and Version:** three classes are added - the first is the OS type, the second is the OS type and major version number, and the third class is the OS type and complete version number.

For the complete list of browser and OS types, check [`js/lib/detect.js`](../js/lib/detect.js).

## Processing SCSS Files

You may use the shell script [`css/css.sh`](../css/css.sh) to process the SCSS files for your project. This scripts creates `css/styles.css` from the SCSS files, followed by PostCSS AutoPrefixer to add browser-specific prefixes, followed by UglifyCSS to produce a minified version that is written to `css/styles.min.css`.

## Merged CSS Files

In order to improve performance the template merges several CSS files into one. This is done in [`php/css.php`](../php/css.php). This function can be configured in the template options in the Joomla administrator.

The following CSS files are concatenated:

  * **Enqueued Stylesheets**: stylesheets added by components, modules, and plugin to be rendered by Joomla's `<jdoc:include type="head" />`. You can control if you want to include only local server stylesheets and/or remote stylesheets. By default these are not included because they can change per URL.
  * **Enqueued Style Declarations**: inline styles added by components, modules, and plugin to be rendered by Joomla's `<jdoc:include type="head" />`. By default these are not included because they can change per URL and even by page load.
  * **Additional CSS Libraries**: these are defined in the template options, and are always included.
  * The last file included is `css/styles.css` (or `css/styles.min.css`).

When merging CSS files, relative URLs contained in rules are converted to absolute URLs using the original CSS file URL as the base URL. Additionally, all @import rules are moved to the top of the merged CSS document.

The resulting CSS file is saved to `dist/`. The file name is a hash of the list of files included and their version number. If there are any changes to either the hash will be changed.
