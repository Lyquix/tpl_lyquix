#Installation and Basic Setup

To install for the first time or to upgrade to the latest release:
1. Download the latest template package from https://github.com/Lyquix/tpl_lyquix/releases
2. Install the package using Joomla extension manager
3. Set the Lyquix template as the default template for your site

At this point you should see an error in the frontend that reads `File /your/server/path/index-custom.php not found.`

Copy or rename the files `index-custom.dist.php` to `index-custom.php`, and `component-custom.dist.php` to `component-custom.php`.

Based on your design you need to select if you want to use 4, 5 or 6 block structure. If you don't know which one to use start with 4. You can change this at any time.

You need to copy the following files:

`css/less/04-blocks-downsized4.less` to `css/less/custom/04-blocks-downsized.less`
`css/less/04-blocks-fluid4.less` to `css/less/custom/04-blocks-fluid.less`
`css/less/04-blocks-size4.less` to `css/less/custom/04-blocks-size.less`
`css/less/11-responsive-container4.less` to `css/less/custom/11-responsive-container.less`

You can now process `css/styles.less` into `css/styles.css`.

Finally, assign modules to position and you should start seeing the template at work.