#Template Files
In order to allow for customization of your template, without overriding template files we have modified the files index.php and component.php to look for your custom template, index-custom.php and component-custom.php respectively.


```php
<?php
// No direct access
defined('_JEXEC') or die('Restricted access');
```
All php files loaded by Joomla must include this line of code that prevents direct execution.

```php
// if custom-index.php file exists the whole template is overriden
if(file_exists(__DIR__ . '/custom-index.php')) :
	include __DIR__ . '/custom-index.php'; 
else :
```
Checks for the file index-custom.php. If it finds it, it is included, otherwise a message is displayed.

```php
?><!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" >
	<head>
		<jdoc:include type="head" />
	</head>
	<body>
		File <span style="font-family: monospace;"><?php echo JPATH_BASE . '/templates/' . $this->template; ?>/custom-index.php</span> not found.
	</body>
</html>
```
An error message indicating that the file index-custom.php cannot be found is displayed

```php
<?php endif; // endif for including custom-index.php
```
Close the if/else block


In the repo you can find the file index-custom.dist.php that you can use as the base for your custom template. Just rename it to index-custom.php. The component file has a very similar structure.
```php
<?php
// No direct access
defined('_JEXEC') or die('Restricted access');
```
All php files loaded by Joomla must include this line of code that prevents direct execution.

```php
// Enable Joomla Bootstrap framework;
JHtml::_('bootstrap.framework');
JHtml::_('jquery.ui', array('core', 'sortable'));
```
Enables loading of jQuery UI and Bootstrap. Recommended for compatibility with Joomla core functions and several 3rd party extensions.

```php
// declare some variables
$home = $mobile = $phone = $tablet = false;
$tmpl_url = JURI::root(true) . '/templates/' . $this->template;
$tmpl_path = JPATH_BASE . '/templates/' . $this->template;
```
Declares some variables to avoid getting PHP warnings later

$tmpl_url stores the base site URL and $tmpl_path stores the base template path in disk

```php
// Check if we are on the home page
if(JRequest::getVar('Itemid') == JFactory::getApplication()->getMenu()->getDefault()->id){ $home = true; }
```
Sets variable $home to true if we are displaying the home page. This is used for adding CSS classes and making necessary layout changes

```php
// Check if we are on a mobile (smartphone) or tablet
require_once('php/Mobile_Detect.php');
$detect = new Mobile_Detect;
if($detect->isMobile()){
	$mobile = true;
	if($detect->isTablet()){ $tablet = true; }
	else { $phone = true; }
}
?>
```
Sets the variables $mobile, $phone and $tablet to indicate if the site is viewed in a mobile device and whether it is a phone or tablet. This requires the Mobile Detect library.

```php
<!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" >
<head>
```
Generates the HTML5 heading, with language code, useful for SEO and accessibility

```php
<!--[if IE]>
<script>if(typeof console=='undefined'||typeof console.log=='undefined'){console={};console.log=function(){};}</script>
<![endif]-->
```
For IE, adds the console.log function if it doesn't exist

```php
<!--[if lt IE 9]>
<script src="<?php echo $tmpl_url; ?>/js/html5shiv<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js"></script>
<script src="<?php echo $tmpl_url; ?>/js/selectivizr<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js"></script>
<![endif]-->
```
For IE8 and older html5shiv creates HTML5 DOM elements and provides default styles. Selectivizr adds support for modern CSS selectors.

This needs to be added before any other scripts and CSS.

```php
<?php if($home) {
	echo $this->params->get('google_site_verification') ? '<meta name="google-site-verification" content="' . $this->params->get('google_site_verification') . '" />' . "\n" : '';
	echo $this->params->get('msvalidate') ? '<meta name="msvalidate.01" content="' . $this->params->get('msvalidate') . '" />' . "\n" : '';
	echo $this->params->get('p_domain_verify') ? '<meta name="p:domain_verify" content="' . $this->params->get('p_domain_verify') . '"/>' . "\n" : '';
	echo '<link href="' . JURI::root() . '" rel="canonical" />' . "\n";
} ?>
```
For the home page it inserts meta tags for:

Google site verification code

Bing/Yahoo site verification code

Canonical URL
```php
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
```
Add hard-coded custom meta tags

```php
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
Sets the viewport for proper mobile rendering: sets the viewport to the size of the device screen, and initial scale to 100%.

```php
<jdoc:include type="head" />
```
Inserts Joomla head, this includes meta tags, CSS and Javascript added by extensions. This must be added before any custom scripts and CSS so that they can be overridden if necessary.

```php
<link href="<?php echo $tmpl_url; ?>/css/styles.<?php echo $this->params->get('lessjs') ? 'less' : 'css'; ?>?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/css/styles.' . ($this->params->get('lessjs') ? 'less' : 'css'))); ?>" rel="stylesheet" <?php echo $this->params->get('lessjs') ? 'type="text/less" ' : ''; ?>/>

<link href="<?php echo $tmpl_url; ?>/css/icons.<?php echo $this->params->get('lessjs') ? 'less' : 'css'; ?>?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/css/icons.' . ($this->params->get('lessjs') ? 'less' : 'css'))); ?>" rel="stylesheet" <?php echo $this->params->get('lessjs') ? 'type="text/less" ' : ''; ?>/>

<?php if($this->params->get('lessjs')): ?>
<script src="<?php echo $tmpl_url; ?>/js/less<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js"></script>
<?php endif; ?>
```
Adds the main stylesheet and the font icon libraries.

During development you can activate LESS which loads the less.js library and processes the LESS file on the browser.

Read below for how to generate this style sheet using multiple base files and LESS pre-compiler.

Automatically appends an integer that represents the date-time of the last modification. This is intended to force browsers to load the latest version of the file.

```php
<?php if(file_exists($tmpl_path . '/css/ie9.css')): ?>
<!--[if lte IE 9]>
<link href="<?php echo $tmpl_url; ?>/css/ie9.css" rel="stylesheet" />
<![endif]-->
<?php endif;
if(file_exists($tmpl_path . '/css/ie8.css')): ?>
<!--[if lte IE 8]>
<link href="<?php echo $tmpl_url; ?>/css/ie8.css" rel="stylesheet" />
<![endif]-->
<?php endif;
if(file_exists($tmpl_path . '/css/ie7.css')): ?>
<!--[if lte IE 7]>
<link href="<?php echo $tmpl_url; ?>/css/ie7.css" rel="stylesheet" />
<![endif]-->
<?php endif; ?>
```
If files exist, inserts CSS fixes for old IE versions, if the files exists. Start with IE 9 and goes backwards as newer versions require fewer fixes.

```php
<?php if($this->params->get('angularjs', 0)): ?>
<script src="<?php echo $tmpl_url; ?>/js/angular<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/js/angular' . ($this->params->get('non_min_js') ? '' : '.min') . '.js')); ?>"></script>
<?php endif; ?>

<?php if($this->params->get('lodash', 0)): ?>
<script src="<?php echo $tmpl_url; ?>/js/lodash<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/js/lodash' . ($this->params->get('non_min_js') ? '' : '.min') . '.js')); ?>"></script>
<?php endif; ?>

<?php
$add_js_libraries = explode("\n", trim($this->params->get('add_js_libraries', 0)));
foreach($add_js_libraries as $jsurl) {
	$jsurl = trim($jsurl);
	if($jsurl) {
		echo '<script src="' . $jsurl . '"></script>';
	}
} 
?>
```
If selected, loads AngularJS and loDash libraries.

Parses a list of URLs for custom javascript libraries and loads them

```php
<script src="<?php echo $tmpl_url; ?>/js/lyquix<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/js/lyquix' . ($this->params->get('non_min_js') ? '' : '.min') . '.js')); ?>"></script>

<?php echo '<script>lqx.setOptions({bodyScreenSize: {min: ' . $this->params->get('min_screen', 0) . ', max: ' . $this->params->get('max_screen', 4) . '}});</script>'; 

echo $this->params->get('lqx_options') ? '<script>lqx.setOptions(' . $this->params->get('lqx_options') . ');</script>' : ''; 
```
Loads the Lyquix JavaScript library.

Automatically appends an integer that represents the date-time of the last modification. This is intended to force browsers to load the latest version of the file.

Sets the minimum and maximum screen sizes

Overrides default Lyquix script settings.
```php
// use http://www.favicon-generator.org/ to generate all these versions
if(file_exists($tmpl_path . '/images/favicon/apple-icon-57x57.png')): ?>
<link rel="apple-touch-icon" sizes="57x57" href="<?php echo $tmpl_url; ?>/images/favicon/apple-icon-57x57.png">
<?php endif;
if(file_exists($tmpl_path . '/images/favicon/apple-icon-60x60.png')): ?>
<link rel="apple-touch-icon" sizes="60x60" href="<?php echo $tmpl_url; ?>/images/favicon/apple-icon-60x60.png">
<?php endif;
if(file_exists($tmpl_path . '/images/favicon/apple-icon-72x72.png')): ?>
<link rel="apple-touch-icon" sizes="72x72" href="<?php echo $tmpl_url; ?>/images/favicon/apple-icon-72x72.png">
<?php endif;
if(file_exists($tmpl_path . '/images/favicon/apple-icon-76x76.png')): ?>
<link rel="apple-touch-icon" sizes="76x76" href="<?php echo $tmpl_url; ?>/images/favicon/apple-icon-76x76.png">
<?php endif;
if(file_exists($tmpl_path . '/images/favicon/apple-icon-114x114.png')): ?>
<link rel="apple-touch-icon" sizes="114x114" href="<?php echo $tmpl_url; ?>/images/favicon/apple-icon-114x114.png">
<?php endif;
if(file_exists($tmpl_path . '/images/favicon/apple-icon-120x120.png')): ?>
<link rel="apple-touch-icon" sizes="120x120" href="<?php echo $tmpl_url; ?>/images/favicon/apple-icon-120x120.png">
<?php endif;
if(file_exists($tmpl_path . '/images/favicon/apple-icon-144x144.png')): ?>
<link rel="apple-touch-icon" sizes="144x144" href="<?php echo $tmpl_url; ?>/images/favicon/apple-icon-144x144.png">
<?php endif;
if(file_exists($tmpl_path . '/images/favicon/apple-icon-152x152.png')): ?>
<link rel="apple-touch-icon" sizes="152x152" href="<?php echo $tmpl_url; ?>/images/favicon/apple-icon-152x152.png">
<?php endif;
if(file_exists($tmpl_path . '/images/favicon/apple-icon-180x180.png')): ?>
<link rel="apple-touch-icon" sizes="180x180" href="<?php echo $tmpl_url; ?>/images/favicon/apple-icon-180x180.png">
<?php endif;
if(file_exists($tmpl_path . '/images/favicon/android-icon-192x192.png')): ?>
<link rel="icon" type="image/png" sizes="192x192"  href="<?php echo $tmpl_url; ?>/images/favicon/android-icon-192x192.png">
<?php endif;
if(file_exists($tmpl_path . '/images/favicon/favicon.ico')): ?>
<link rel="shortcut icon" type="image/vnd.microsoft.icon" href="<?php echo $tmpl_url; ?>/images/favicon/favicon.ico">
<?php endif;
if(file_exists($tmpl_path . '/images/favicon/favicon-32x32.png')): ?>
<link rel="icon" type="image/png" sizes="32x32" href="<?php echo $tmpl_url; ?>/images/favicon/favicon-32x32.png">
<?php endif;
if(file_exists($tmpl_path . '/images/favicon/favicon-96x96.png')): ?>
<link rel="icon" type="image/png" sizes="96x96" href="<?php echo $tmpl_url; ?>/images/favicon/favicon-96x96.png">
<?php endif;
if(file_exists($tmpl_path . '/images/favicon/favicon-16x16.png')): ?>
<link rel="icon" type="image/png" sizes="16x16" href="<?php echo $tmpl_url; ?>/images/favicon/favicon-16x16.png">
<?php endif;
```
If files exist, inserts favicon and Apple icon files:

favicon.ico is the the small icon that is displayed on the window or bookmarks

The other images add site icons for iPhone, iPad and Android devices.

Use http://www.favicon-generator.org/ to generate all these files and place them in the /templates/lyquix//images/favicon/ folder.
```php
echo $this->params->get('ga_account') ? "<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', '" . $this->params->get('ga_account') . "', 'auto');
ga('send', 'pageview');
</script>" : ''; ?>
```
Inserts Google Analytics Universal Code if account information is available from the template parameters.

```php
<?php echo $this->params->get('addthis_pubid') ? '<script src="//s7.addthis.com/js/300/addthis_widget.js#pubid=' . $this->params->get('addthis_pubid') . '"></script>' : ''; ?>
```
If an AddThis account is provided, the javascript code is added.

```php
<?php if(file_exists($tmpl_path . '/js/scripts.js')): ?>
<script src="<?php echo $tmpl_url; ?>/js/scripts<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/js/scripts' . ($this->params->get('non_min_js') ? '' : '.min') . '.js')); ?>"></script>
<?php endif; ?>
```
If file exists, insert custom scripts for project.

```php
<jdoc:include type="modules" name="head" />
</head>
```
Module position head, can be used to insert custom meta tags, scripts and CSS (e.g. Google Analytics, open graph tags, Google author tag).

```php
<body class="<?php 
echo ($home ? 'home ' : '').
	($mobile ? 'mobile ' : '').
	($phone ? 'phone ' : '').
	($tablet ? 'tablet ' : '').
	JRequest::getVar('option').
	' view_'.JRequest::getVar('view').
	(is_null(JRequest::getVar('task')) ? '' : ' task_'.JRequest::getVar('task'));

if(is_array($this->params->get('fluid_screen')) && (($this->params->get('fluid_device', 'any') == 'any') || ($this->params->get('fluid_device') == 'mobile' && $mobile) || ($this->params->get('fluid_device') == 'phone' && $phone) || ($this->params->get('fluid_device') == 'tablet' && $tablet) )) {
	foreach($this->params->get('fluid_screen') as $fluid_screen){
		echo ' blkfluid-' . $fluid_screen;
	}
}
?>">
```
Inserts the body tag with additional classes:

home - indicates if we are on the home page

mobile - indicates if we are viewing in a smartphone

phone/tablet - indicates if we are viewing in a phone or tablet

component name, e.g. com_flexicontent

view name, e.g. view-item

task name, e.g. task-display

Additionally, blkfluid- classes are added based on the template configuration

```php
<script>
lqx.bodyScreenSize();
</script>
```
Adds an attribute "screen" to the body tag with the size code: xs, sm, md, lg, and xl.

This attribute is updated automatically with Javascript upon screen size changes.

```php
<?php if(!$this->params->get('blank_page',0)) : // if blank-page parameter is set, only the component will be output ?>
```
If style settings is set to "Blank page" it will skip the page structure and output only the component.

```php
<header>
	
	<?php if($this->countModules('util-1') || $this->countModules('util-2') || $this->countModules('util-3') || $this->countModules('util-4') || $this->countModules('util-5') || $this->countModules('util-6')): ?>
	<div class="row util">
		<div class="container cf">
			<div class="util-1 blk4 blkgroup">
				<jdoc:include type="modules" name="util-1" />
			</div>
			<div class="util-2 blk4 blkgroup">
				<jdoc:include type="modules" name="util-2" />
			</div>
			<div class="util-3 blk4 blkgroup">
				<jdoc:include type="modules" name="util-3" />
			</div>
			<div class="util-4 blk4 blkgroup">
				<jdoc:include type="modules" name="util-4" />
			</div>
			<div class="util-5 blk4 blkgroup">
				<jdoc:include type="modules" name="util-5" />
			</div>
			<div class="util-6 blk4 blkgroup">
				<jdoc:include type="modules" name="util-6" />
			</div>
		</div>
	</div>
	<?php endif; ?>
	
	<?php if($this->countModules('header-1') || $this->countModules('header-2') || $this->countModules('header-3') || $this->countModules('header-4') || $this->countModules('header-5') || $this->countModules('header-6')): ?>
	<div class="row header">
		<div class="container cf">
			<div class="header-1 blk4 blkgroup">
				<jdoc:include type="modules" name="header-1" />
			</div>
			<div class="header-2 blk4 blkgroup">
				<jdoc:include type="modules" name="header-2" />
			</div>
			<div class="header-3 blk4 blkgroup">
				<jdoc:include type="modules" name="header-3" />
			</div>
			<div class="header-4 blk4 blkgroup">
				<jdoc:include type="modules" name="header-4" />
			</div>
			<div class="header-5 blk4 blkgroup">
				<jdoc:include type="modules" name="header-5" />
			</div>
			<div class="header-6 blk4 blkgroup">
				<jdoc:include type="modules" name="header-6" />
			</div>
		</div>
	</div>
	<?php endif; ?>
	
	<?php if($this->countModules('top-1') || $this->countModules('top-2') || $this->countModules('top-3')|| $this->countModules('top-4') || $this->countModules('top-5') || $this->countModules('top-6')): ?>
	<div class="row top">
		<div class="container cf">
			<div class="top-1 blk4 blkgroup">
				<jdoc:include type="modules" name="top-1" />
			</div>
			<div class="top-2 blk4 blkgroup">
				<jdoc:include type="modules" name="top-2" />
			</div>
			<div class="top-3 blk4 blkgroup">
				<jdoc:include type="modules" name="top-3" />
			</div>
			<div class="top-4 blk4 blkgroup">
				<jdoc:include type="modules" name="top-4" />
			</div>
			<div class="top-5 blk4 blkgroup">
				<jdoc:include type="modules" name="top-5" />
			</div>
			<div class="top-6 blk4 blkgroup">
				<jdoc:include type="modules" name="top-6" />
			</div>
		</div>
	</div>
	<?php endif; ?>
	
</header>
```
Adds the header section, using the new HTML5 tag header.

The template sets 3 header rows above the main content with names util, header and top. The rows are automatically generated or hidden based on whether the modules in these position have any output.

Use custom styles like div.row.util to add styles to specific sections.

The class container provides responsive functionality by automatically limits the width of the page content to screen size.

The class cf (clear fix) ensures that the row wraps all the columns.

Use custom styles like div.util-1 to style specific columns.

Adjust the size and number of blocks using blk1 to blk20 classes. In this example each row contains 5 columns of equal width blk4. You may remove or add columns as needed and change their widths.

```php
<main class="row main">
	
	<div class="container cf">
		
		<jdoc:include type="message" />
		
		<?php if($this->countModules('main-header')): ?>
		<div class="main-header">
			<jdoc:include type="modules" name="main-header" />
		</div>
		<?php endif; ?>
		
		<div class="main-middle blk20 blkgroup">
			
			<?php if($this->countModules('main-left')): ?>
			<div class="main-left blk4 blkgroup">
				<jdoc:include type="modules" name="main-left" />
			</div>
			<?php endif; ?>

			<div class="main-center blk<?php echo 20 - ($this->countModules('main-left') ? 4 : 0) - ($this->countModules('main-right') ? 4 : 0)  ?> blkgroup">
				
				<?php if($this->countModules('main-top')): ?>
				<div class="main-top">
					<jdoc:include type="modules" name="main-top" />
				</div>
				<?php endif; ?>
				
				<?php if($home): ?>
				<jdoc:include type="modules" name="main-center" />
				<?php else: ?>
				<article>
					<jdoc:include type="component" />
				</article>
				<?php endif; ?>
				
				<?php if($this->countModules('main-bottom')): ?>
				<div class="main-bottom">
					<jdoc:include type="modules" name="main-bottom" />
				</div>
				<?php endif; ?>
				
			</div>

			<?php if($this->countModules('main-right')): ?>
			<div class="main-right blk4 blkgroup">
				<jdoc:include type="modules" name="main-right" />
			</div>
			<?php endif; ?>
			
		</div>
		
		<?php if($this->countModules('main-footer')): ?>
		<div class="main-footer">
			<jdoc:include type="modules" name="main-footer" />
		</div>
		<?php endif; ?>
		
	</div>
	
</main>
```
Adds the main content section, using the new HTML5 tag main.

At the top we place the system messages.

The main section is divided in 3 rows and the middle row is divided in 3 columns.

All of the cells in this arrangement are displayed only if the modules assigned to the positions are producing output.

For the interior pages we place the component output in the middle-center cell. The size of this cell is determined automatically based on whether there is a left and/or right columns.

```php
<footer>

	<?php if($this->countModules('bottom-1') || $this->countModules('bottom-2') || $this->countModules('bottom-3') || $this->countModules('bottom-4') || $this->countModules('bottom-5') || $this->countModules('bottom-6')): ?>
	<div class="row bottom">
		<div class="container cf">
			<div class="bottom-1 blk4 blkgroup">
				<jdoc:include type="modules" name="bottom-1" />
			</div>
			<div class="bottom-2 blk4 blkgroup">
				<jdoc:include type="modules" name="bottom-2" />
			</div>
			<div class="bottom-3 blk4 blkgroup">
				<jdoc:include type="modules" name="bottom-3" />
			</div>
			<div class="bottom-4 blk4 blkgroup">
				<jdoc:include type="modules" name="bottom-4" />
			</div>
			<div class="bottom-5 blk4 blkgroup">
				<jdoc:include type="modules" name="bottom-5" />
			</div>
			<div class="bottom-6 blk4 blkgroup">
				<jdoc:include type="modules" name="bottom-6" />
			</div>
		</div>
	</div>
	<?php endif; ?>
	
	<?php if($this->countModules('footer-1') || $this->countModules('footer-2') || $this->countModules('footer-3') || $this->countModules('footer-4') || $this->countModules('footer-5') || $this->countModules('footer-6')): ?>
	<div class="row footer">
		<div class="container cf">
			<div class="footer-1 blk4 blkgroup">
				<jdoc:include type="modules" name="footer-1" />
			</div>
			<div class="footer-2 blk4 blkgroup">
				<jdoc:include type="modules" name="footer-2" />
			</div>
			<div class="footer-3 blk4 blkgroup">
				<jdoc:include type="modules" name="footer-3" />
			</div>
			<div class="footer-4 blk4 blkgroup">
				<jdoc:include type="modules" name="footer-4" />
			</div>
			<div class="footer-5 blk4 blkgroup">
				<jdoc:include type="modules" name="footer-5" />
			</div>
			<div class="footer-6 blk4 blkgroup">
				<jdoc:include type="modules" name="footer-6" />
			</div>
		</div>
	</div>
	<?php endif; ?>
	
	<?php if($this->countModules('copyright-1') || $this->countModules('copyright-2') || $this->countModules('copyright-3') || $this->countModules('copyright-4') || $this->countModules('copyright-5') || $this->countModules('copyright-6')): ?>
	<div class="row copyright">
		<div class="container cf">
			<div class="copyright-1 blk4 blkgroup">
				<jdoc:include type="modules" name="copyright-1" />
			</div>
			<div class="copyright-2 blk4 blkgroup">
				<jdoc:include type="modules" name="copyright-2" />
			</div>
			<div class="copyright-3 blk4 blkgroup">
				<jdoc:include type="modules" name="copyright-3" />
			</div>
			<div class="copyright-4 blk4 blkgroup">
				<jdoc:include type="modules" name="copyright-4" />
			</div>
			<div class="copyright-5 blk4 blkgroup">
				<jdoc:include type="modules" name="copyright-5" />
			</div>
			<div class="copyright-6 blk4 blkgroup">
				<jdoc:include type="modules" name="copyright-6" />
			</div>
		</div>
	</div>
	<?php endif; ?>
	
</footer>
```
Adds the footer sections, which works in the same way as the header sections described above.

```php
<?php else:  // outputting a blank page ?>
<jdoc:include type="component" />
<?php endif; // endif for blank page ?>
```
If template style is set to be blank page only renders the component

```php
<!--[if lte IE 8]>
<link href="<?php echo $tmpl_url; ?>/css/ie8-alert.css" rel="stylesheet" />
<div class="ie8-alert">You are using an unsupported version of Internet Explorer. To ensure security, performance, and full functionality, <a href="http://browsehappy.com/" target="_blank">please upgrade to an up-to-date browser.</a></div>
<![endif]-->
```
Insert right before the closing body tag to show an alert to users of Internet Explorer 8 or older.

```php
<?php echo $this->params->get('disqus_shortname') ? '<script src="//' . $this->params->get('disqus_shortname') . '.disqus.com/embed.js"></script>' : ''; ?>
```
Inserts Javascript for Disqus if the account name is added to template parameters.

```php
<jdoc:include type="modules" name="body" />
```
Module position body, can be used to insert custom scripts and content at the end of the page. 

```php
</body>
</html>
```
Closes body and html tags

###raw.php
Provides an alternative template file that generated a raw output from the component. This is useful for generating output such as JSON or binary files.

```php
<?php
// No direct access
defined('_JEXEC') or die('Restricted access');
?><jdoc:include type="component" />
```
Only the component output is included.

###php/Mobile_Detect.php
This library allows the server to detect whether the browser is a mobile device, and what type of device it is. This library is downloaded from http://mobiledetect.net/ and will be updated periodically to keep up with need devices.

