# Installation and Setup

### Pre-Requisites

  * NodeJS and npm
  * SASS, PostCSS, autoprefixer, UglifyCSS, Uglify-JS (use command `npm install -g *package*`)
  * In Windows you may want to use git bash terminal to run `css/css.sh` and `js/js.sh`, and you will need to download wget from https://eternallybored.org/misc/wget/ and copy it to C:\Program Files\Git\mingw64\bin

### First Install

  1. Download the latest template package from https://github.com/Lyquix/tpl_lyquix/releases
  2. Install the package using Joomla extension manager

### Initial Setup

  1. Set the Lyquix template as the default template for your site
  2. Copy or rename `custom.dist.php` to `custom.php`
  3. Copy or rename `css/styles.dist.scss` to `css/styles.scss`
  4. Copy or rename `css/custom/custom.dist.scss` to `css/custom/custom.scss`
  5. Run `css/css.sh` to generate `css/styles.css`
  6. Copy or rename `js/scripts.dist.scss` to `js/scripts.js`
  7. Run `js/js.sh` to generate various custom scripts and Vue files

### Customizing the Template

  * This template has been developed to allow for complete customization to meet the needs of your project.
  * Do not edit the files distributed in the template, as they will be overwritten when you upgrade the template with a newer release.
  * **Custom Styles**:
    * Customize your configuration variables, and control what mixins to import in `css/styles.scss`
    * Create custom SCSS files in `css/custom` and import them in `css/custom/custom.scss`
  * **Custom Scripts**:
    * Add common functions and minor functionality to `js/scripts.js`
    * Create custom Vue controllers and components and save them to `js/custom/controllers` and `js/custom/components`
  * **Custom PHP**:
    * You can edit `custom.php` as needed to meet the requirements of your project
    * You can control what PHP includes from `php` folder to use
    * Create custom PHP includes in `php/custom`


### Updating the Template

Follow the same steps as in the First Install.
