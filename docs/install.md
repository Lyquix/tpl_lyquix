# Installation and Setup

`@version     2.3.1`

### Pre-Requisites

  * NodeJS and npm
  * Git BASH terminal

### First Install

  1. Download the latest template package from https://github.com/Lyquix/tpl_lyquix/releases/latest.
  2. Install the package using Joomla extension manager.

### Initial Setup

  1. Set the Lyquix template as the default template for your site.
  2. Copy or rename [`custom.dist.php`](../custom.dist.php) to `custom.php`.
  3. Copy or rename [`css/styles.dist.scss`](../css/styles.dist.scss) to `css/styles.scss`.
  4. Copy or rename [`css/custom/custom.dist.scss`](../css/custom/custom.dist.scss) to `css/custom/custom.scss`.
  5. Copy or rename [`css/css.dist.sh`](../css/css.dist.sh) to `css/css.sh`.
  6. Copy or rename [`js/scripts.dist.scss`](../js/scripts.dist.scss) to `js/scripts.js`.
  7. Copy or rename [`js/js.dist.sh`](../js/js.dist.sh) to `js/js.sh`.
  8. Run `npm install` once to get all local packages installed
  9. Run `npx gulp` to get the gulp watcher started and have CSS and JS files automatically processed when saved. You may need to restart gulp after creating new CSS and JS files to ensure they are being watched.

### Configuring Template Options

In Joomla Template Manager you will find the following options for the template.

  * **Mode**
    * Template Mode: Normal mode (default) renders all modules and component, while Component Only renders only the component in the page body.
  * **Joomla**
    * Disable MooTools
    * Enable jQuery
    * Enable jQuery UI
    * Enable Bootstrap
    * Joomla JavaScript
  * **Responsiveness**
    * Minimum Screen Size: select the minimum screen size that the responsive module will allow.
    * Maximum Screen Size: select the maximum screen size that the responsive module will allow.
  * **CSS**
    * Merge CSS: select what CSS files from extensions should be included in the merged CSS file.
    * Use original CSS
    * Load Animate.css
    * Additional CSS Libraries: add one URL per line
    * Remove CSS Libraries: add one URL per line
  * **JavaScript**
    * Merge JS: select what JS files from extensions should be included in the merged CSS file.
    * Enable lqx debug: when enabled adds option `{debug: true}` to the Lyquix library options.
    * Lyquix Library Options: add a JSON object with your custom options to extend and override the Lyquix library options.
    * Use original JS
    * Load polyfill.io
    * Load LoDash library
    * Load SmoothScroll library
    * Load Moment.js library
    * Load dotdotdot library
    * Additional JS Libraries
    * Remove JS Libraries
  * **Accounts**
    * Google Analytics Account
    * google-site-verification
    * msvalidate.01
    * p:domain_verify
  * **IE Alerts**
    * IE9 alert
    * IE10 alert
    * IE11 alert

### Customizing the Template

  * This template has been developed to allow for complete customization to meet the needs of your project.
  * Do not edit the files distributed in the template, as they will be overwritten when you upgrade the template with a newer release.
  * **Custom Styles**:
    * Customize your configuration variables, and control what mixins to import in `css/styles.scss`.
    * If you need to make changes to the styles found in [`css/lib/`](../css/lib/), do not modify these files, instead make a copy to [`css/custom/`](../css/custom/).
    * Create custom SCSS files in [`css/custom/`](../css/custom/) and import them in `css/custom/custom.scss`.
  * **Custom Scripts**:
    * Add common functions and minor functionality to `js/scripts.js`.
    * Create custom Vue controllers and components and save them to [`js/custom/controllers/`](../js/custom/controllers/) and [`js/custom/components/`](../js/custom/components/).
  * **Custom PHP**:
    * You can edit `custom.php` as needed to meet the requirements of your project.
    * You can control what PHP includes from [`php/`](../php/) folder to use.
    * Create custom PHP includes in [`php/custom/`](../php/custom/).
  * You can do `npm install` and then `gulp` to have CSS and JS files automatically processed whenever there are any changes to SCSS and JS files.


### Updating the Template

Follow the same steps as in the First Install:

  1. Download the latest template package from https://github.com/Lyquix/tpl_lyquix/releases/latest.
  2. Install the package using Joomla extension manager.
