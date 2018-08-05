# Installation and Setup

### First Install
  1. Download the latest template package from https://github.com/Lyquix/tpl_lyquix/releases
  2. Install the package using Joomla extension manager
  3. Set the Lyquix template as the default template for your site

### Initial Setup
After the initial installation you should see an error in the frontend that reads `File index-custom.php not found.` This is caused because the template is trying to use your custom project files that need to be created. Copy or rename the files `index-custom.dist.php` to `index-custom.php`, and `component-custom.dist.php` to `component-custom.php`.

Based on your design you need to select if you want to use 4, 5 or 6 block structure. If you don't know which one to use start with 4. You can change it later. You need to copy some of the base LESS files in the `css/less` directory into the `css/less/custom` directory and rename them, as follows:

  * `04-blocks-downsized4.less` to `custom/04-blocks-downsized.less`
  * `04-blocks-fluid4.less` to `custom/04-blocks-fluid.less`
  * `04-blocks-size4.less` to `custom/04-blocks-size.less`
  * `11-responsive-container4.less` to `custom/11-responsive-container.less`

You need to create a file `css/less/custom/custom.less`, you can use the sample file provided in the package `css/less/custom/custom.dist.less`. We recommend breaking up all your styles into several LESS files to keep things easy to maintain, and include them in your custom.less.

After you have these files in the `css/less/custom` folder you can compile the file `css/styles.less` into `css/styles.css`:

`lessc css/styles.less > css/styles.css`

We recommend passing styles.css through PostCSS Autoprefixer to add non-standard CSS properties as needed:

`postcss -u autoprefixer --autoprefixer.browsers "> 0.5%, last 3 versions" -r css/styles.css`


And finally pass `styles.less` through BLESS to create chunked files if needed to work correctly in IE9 or older:

`blessc chunk css/styles.css`

You can assign your modules to the template positions and you should start seeing the template at work.

### Customizing the Template
One of the features of this template is allow for customization while allowing for enhancements and upgrades to be distributed with none to minimal conflict.

Do not edit the files distributed in the template, as they will be overwritten when you upgrade the template with a newer release. Instead create custom files:

  * Template files `index-custom.php` and `component-custom.php`
  * LESS overrides and custom files
  * Custom CSS and Javascript libraries
  * Unset CSS and Javascript files loaded by Joomla or extensions
  * Custom PHP libraries

You will find more details about all these customizations in the rest of the documentation.

### Upgrading
To upgrade the template follow the same steps for initial installation. It is our objective to allow for non-conflict upgrades but always check the commits for changes that may affect your project. And always remember to test before deploying to production.


