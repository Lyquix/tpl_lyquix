<?php
// No direct access
defined('_JEXEC') or die('Restricted access');

// Enable Joomla Bootstrap and jQuery UI framework;
JHtml::_('bootstrap.framework');
JHtml::_('jquery.ui', array('core', 'sortable'));

// declare some variables
$home = $mobile = $phone = $tablet = false;
$tmpl_url = JURI::root(true) . '/templates/' . $this->template;
$tmpl_path = JPATH_BASE . '/templates/' . $this->template;

// Check if we are on the home page
if(JRequest::getVar('Itemid') == JFactory::getApplication()->getMenu()->getDefault()->id){ $home = true; }

// Check if we are on a mobile device, whether smartphone or tablet
if($this->params->get('mobiledetect_method', 'php') == 'php') {
	require_once(__DIR__ . '/php/Mobile_Detect.php');
	$detect = new Mobile_Detect;
	if($detect->isMobile()){
		$mobile = true;
		if($detect->isTablet()){ $tablet = true; }
		if($detect->isPhone()){ $phone = true; }
	}
}
?><!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" >
<head>
<!--[if IE]>
<script>if(typeof console=='undefined'||typeof console.log=='undefined'){console={};console.log=function(){};}</script>
<![endif]-->
<!--[if lt IE 9]>
<script src="<?php echo $tmpl_url; ?>/js/html5shiv<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js"></script>
<script src="<?php echo $tmpl_url; ?>/js/selectivizr<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js"></script>
<![endif]-->
<?php if($home) {
	echo $this->params->get('google_site_verification') ? '<meta name="google-site-verification" content="' . $this->params->get('google_site_verification') . '" />' . "\n" : '';
	echo $this->params->get('msvalidate') ? '<meta name="msvalidate.01" content="' . $this->params->get('msvalidate') . '" />' . "\n" : '';
	echo $this->params->get('p_domain_verify') ? '<meta name="p:domain_verify" content="' . $this->params->get('p_domain_verify') . '"/>' . "\n" : '';
	echo '<link href="' . JURI::root() . '" rel="canonical" />' . "\n";
} ?>
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<jdoc:include type="head" />
<link href="<?php echo $tmpl_url; ?>/css/styles.<?php echo $this->params->get('lessjs') ? 'less' : 'css'; ?>?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/css/styles.' . ($this->params->get('lessjs') ? 'less' : 'css'))); ?>" rel="stylesheet" <?php echo $this->params->get('lessjs') ? 'type="text/less" ' : ''; ?>/>
<link href="<?php echo $tmpl_url; ?>/css/icons.<?php echo $this->params->get('lessjs') ? 'less' : 'css'; ?>?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/css/icons.' . ($this->params->get('lessjs') ? 'less' : 'css'))); ?>" rel="stylesheet" <?php echo $this->params->get('lessjs') ? 'type="text/less" ' : ''; ?>/>
<?php
$add_css_libraries = explode("\n", trim($this->params->get('add_css_libraries', '')));
foreach($add_css_libraries as $cssurl) {
	$cssurl = trim($cssurl);
	if($cssurl) {
		echo '<link href="' . $cssurl . '" rel="stylesheet" />';
	}
} 
if($this->params->get('lessjs')): ?>
<script src="<?php echo $tmpl_url; ?>/js/less<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js"></script>
<?php endif; ?>
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
<?php endif;
if($this->params->get('angularjs', 0)): ?>
<script src="<?php echo $tmpl_url; ?>/js/angular<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/js/angular' . ($this->params->get('non_min_js') ? '' : '.min') . '.js')); ?>"></script>
<?php endif;
if($this->params->get('lodash', 0)): ?>
<script src="<?php echo $tmpl_url; ?>/js/lodash<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/js/lodash' . ($this->params->get('non_min_js') ? '' : '.min') . '.js')); ?>"></script>
<?php endif;
if($this->params->get('mobiledetect_method', 'php') == 'js'): ?>
<script src="<?php echo $tmpl_url; ?>/js/mobile-detect<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/js/mobile-detect' . ($this->params->get('non_min_js') ? '' : '.min') . '.js')); ?>"></script>
<?php endif;
$add_js_libraries = explode("\n", trim($this->params->get('add_js_libraries', '')));
foreach($add_js_libraries as $jsurl) {
	$jsurl = trim($jsurl);
	if($jsurl) {
		echo '<script src="' . $jsurl . '"></script>';
	}
} 
?>
<script src="<?php echo $tmpl_url; ?>/js/lyquix<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/js/lyquix' . ($this->params->get('non_min_js') ? '' : '.min') . '.js')); ?>"></script>
<?php echo '<script>lqx.setOptions({bodyScreenSize: {min: ' . $this->params->get('min_screen', 0) . ', max: ' . $this->params->get('max_screen', 4) . '}});</script>'; 
echo $this->params->get('lqx_options') ? '<script>lqx.setOptions(' . $this->params->get('lqx_options') . ');</script>' : ''; 
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
echo $this->params->get('ga_account') ? "<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', '" . $this->params->get('ga_account') . "', 'auto');
ga('send', 'pageview');
</script>" : ''; ?>
<?php echo $this->params->get('addthis_pubid') ? '<script src="//s7.addthis.com/js/300/addthis_widget.js#pubid=' . $this->params->get('addthis_pubid') . '"></script>' : ''; ?>
<?php if(file_exists($tmpl_path . '/js/scripts.js')): ?>
<script src="<?php echo $tmpl_url; ?>/js/scripts<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/js/scripts' . ($this->params->get('non_min_js') ? '' : '.min') . '.js')); ?>"></script>
<?php endif; ?>
<jdoc:include type="modules" name="head" />
</head>
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
<script>
lqx.bodyScreenSize();
<?php if($this->params->get('mobiledetect_method', 'php') == 'js'): ?>lqx.mobileDetect = lqx.mobileDetect();
<?php endif;
if($this->params->get('mobiledetect_method', 'php') == 'php'){
	echo 'lqx.mobileDetect = {mobile: ' . ($mobile ? 'true' : 'false') . ',phone: ' . ($phone ? 'true' : 'false') . ',tablet: ' . ($tablet ? 'true' : 'false') . "};\n";
}
?>
</script>
<jdoc:include type="message" />
<jdoc:include type="component" />

<!--[if lte IE 8]>
<link href="<?php echo $tmpl_url; ?>/css/ie8-alert.css" rel="stylesheet" />
<div class="ie8-alert">You are using an unsupported version of Internet Explorer. To ensure security, performance, and full functionality, <a href="http://browsehappy.com/" target="_blank">please upgrade to an up-to-date browser.</a></div>
<![endif]-->

<?php echo $this->params->get('disqus_shortname') ? '<script src="//' . $this->params->get('disqus_shortname') . '.disqus.com/embed.js"></script>' : ''; ?>

<jdoc:include type="modules" name="body" />

</body>
</html>
