# Installation and Setup

### Pre-Requisites

  * NodeJS and npm
  * SASS, PostCSS, autoprefixer, UglifyCSS, Uglify-JS (use command `npm install -g *package*`)
  * In Windows you may want to use git bash terminal to run `[css/css.sh](../css/css.sh)` and `[js/js.sh](../js/js.sh)`, and you will need to download wget from https://eternallybored.org/misc/wget/ and copy it to `C:\Program Files\Git\mingw64\bin`.

### First Install

  1. Download the latest template package from https://github.com/Lyquix/tpl_lyquix/releases.
  2. Install the package using Joomla extension manager.

### Initial Setup

  1. Set the Lyquix template as the default template for your site.
  2. Copy or rename `[custom.dist.php](../custom.dist.php)` to `custom.php`.
  3. Copy or rename `[css/styles.dist.scss](../css/styles.dist.scss)` to `css/styles.scss`.
  4. Copy or rename `[css/custom/custom.dist.scss](../css/custom/custom.dist.scss)` to `css/custom/custom.scss`.
  5. Run `[css/css.sh](../css/css.sh)` to generate `css/styles.css`.
  6. Copy or rename `[js/scripts.dist.scss](../js/scripts.dist.scss)` to `js/scripts.js`.
  7. Run `[js/js.sh](../js/js.sh)` to generate various custom scripts and Vue files.
  8. Copy or rename `[css/css.dist.sh](../css/css.dist.sh)` to `css/css.sh`, and `[js/js.dist.sh](../js/js.dist.sh)` to `js/js.sh`.

### Configuring Template Options

In Joomla Template Manager you will find the following options for the template.

  * Mode
    * **Template Mode**
  * Joomla
    * **Disable MooTools**
    * **Enable jQuery**
    * **Enable jQuery UI**
    * **Enable Bootstrap**
    * **Joomla JavaScript**
  * Responsiveness**
    * **Minimum Screen Size**
    * **Maximum Screen Size**
  * CSS
    * **Merge CSS**
    * **Use original CSS**
    * **Load Animate.css**
    * **Additional CSS Libraries**
    * **Remove CSS Libraries**
  * JavaScript
    * **Merge JS**
    * **Enable lqx debug**
    * **Lyquix Library Options**
    * **Use original JS**
    * **Load polyfill.io**
    * **Load LoDash library**
    * **Load SmoothScroll library**
    * **Load Moment.js library**
    * **Load dotdotdot library**
    * **Load Animate.css**
    * **Additional JS Libraries**
    * **Remove JS Libraries**
  * Accounts
    * **Google Analytics Account**
    * **google-site-verification**
    * **msvalidate.01**
    * **p:domain_verify**
  * IE Alerts
    * **IE9 alert**
    * **IE10 alert**
    * **IE11 alert**

### Customizing the Template

  * This template has been developed to allow for complete customization to meet the needs of your project.
  * Do not edit the files distributed in the template, as they will be overwritten when you upgrade the template with a newer release.
  * **Custom Styles**:
    * Customize your configuration variables, and control what mixins to import in `css/styles.scss`.
    * Create custom SCSS files in `[css/custom/](../css/custom/)` and import them in `css/custom/custom.scss`.
  * **Custom Scripts**:
    * Add common functions and minor functionality to `js/scripts.js`.
    * Create custom Vue controllers and components and save them to `[js/custom/controllers/](../js/custom/controllers/)` and `[js/custom/components/](../js/custom/components/)`.
  * **Custom PHP**:
    * You can edit `custom.php` as needed to meet the requirements of your project.
    * You can control what PHP includes from `[php/](../php/)` folder to use.
    * Create custom PHP includes in `[php/custom/](../php/custom/)`.


### Updating the Template

Follow the same steps as in the First Install.
