<?php
// No direct access
defined('_JEXEC') or die('Restricted access');
$app = JFactory::getApplication();

/**
*** NOTICE: Do not modify this file!
*** If you need to customize your template, create a file named custom-error.php
**/

// if custom-index.php file exists the whole template is overriden
if(file_exists(__DIR__ . '/custom-error.php')) :
	include __DIR__ . '/custom-error.php'; 
else :

// declare some variables
$home = $mobile = $phone = $tablet = false;

// Check if we are on a mobile device, whether smartphone or tablet
require_once('php/Mobile_Detect.php');
$detect = new Mobile_Detect;
if($detect->isMobile()){
	$mobile = true;
	if($detect->isTablet()){ $tablet = true; }
	else { $phone = true; }
}
?><!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" >
<head>
<!--[if IE]>
<script type="text/javascript">if(typeof console=='undefined'||typeof console.log=='undefined'){console={};console.log=function(){};}</script>
<![endif]-->
<!--[if lt IE 9]>
<script src="<?php echo JURI::root(true); ?>/templates/<?php echo $this->template; ?>/js/html5shiv<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js" type="text/javascript"></script>
<script src="<?php echo JURI::root(true); ?>/templates/<?php echo $this->template; ?>/js/selectivizr<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js" type="text/javascript"></script>
<![endif]-->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<title>Error <?php echo $this->error->getCode(); ?>: <?php echo htmlspecialchars($this->error->getMessage(), ENT_QUOTES, 'UTF-8'); ?></title>
<?php if ($app->get('debug_lang', '0') == '1' || $app->get('debug', '0') == '1') : ?>
<link rel="stylesheet" href="<?php echo JURI::root(true); ?>/media/cms/css/debug.css" type="text/css" />
<?php endif; ?>
<script src="<?php echo JURI::root(true); ?>/media/jui/js/jquery.min.js" type="text/javascript"></script>
<script src="<?php echo JURI::root(true); ?>/media/jui/js/jquery-noconflict.js" type="text/javascript"></script>
<script src="<?php echo JURI::root(true); ?>/media/jui/js/jquery-migrate.min.js" type="text/javascript"></script>
<script src="<?php echo JURI::root(true); ?>/media/jui/js/bootstrap.min.js" type="text/javascript"></script>
<script src="<?php echo JURI::root(true); ?>/media/jui/js/jquery.ui.core.min.js" type="text/javascript"></script>
<link href="<?php echo JURI::root(true); ?>/templates/<?php echo $this->template; ?>/css/styles.<?php echo $this->params->get('lessjs') ? 'less' : 'css'; ?>?v=<?php echo date("YmdHis", filemtime(JPATH_BASE . '/templates/' . $this->template . '/' . ($this->params->get('lessjs') ? 'less' : 'css') . '/styles.css')); ?>" rel="stylesheet" type="text/<?php echo $this->params->get('lessjs') ? 'less' : 'css'; ?>" />
<?php if($this->params->get('lessjs')): ?>
<script src="<?php echo JURI::root(true); ?>/templates/<?php echo $this->template; ?>/js/less<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js" type="text/javascript"></script>
<?php endif; ?>
<?php if(file_exists(JPATH_BASE . '/templates/' . $this->template . '/css/ie9.css')): ?>
<!--[if lte IE 9]>
<link href="<?php echo JURI::root(true); ?>/templates/<?php echo $this->template; ?>/css/ie9.css" rel="stylesheet" type="text/css" />
<![endif]-->
<?php endif;
if(file_exists(JPATH_BASE . '/templates/' . $this->template . '/css/ie8.css')): ?>
<!--[if lte IE 8]>
<link href="<?php echo JURI::root(true); ?>/templates/<?php echo $this->template; ?>/css/ie8.css" rel="stylesheet" type="text/css" />
<![endif]-->
<?php endif;
if(file_exists(JPATH_BASE . '/templates/' . $this->template . '/css/ie7.css')): ?>
<!--[if lte IE 7]>
<link href="<?php echo JURI::root(true); ?>/templates/<?php echo $this->template; ?>/css/ie7.css" rel="stylesheet" type="text/css" />
<![endif]-->
<?php endif; ?>
<script src="<?php echo JURI::root(true); ?>/templates/<?php echo $this->template; ?>/js/lyquix<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js?v=<?php echo date("YmdHis", filemtime(JPATH_BASE . '/templates/' . $this->template . '/js/lyquix' . ($this->params->get('non_min_js') ? '' : '.min') . '.js')); ?>" type="text/javascript"></script>
<?php echo $this->params->get('lqx_options') ? '<script type="text/javascript">lqx.setOptions(' . $this->params->get('lqx_options') . ');</script>' : ''; ?>
<?php if(file_exists(JPATH_BASE . '/templates/' . $this->template . '/images/favicon.ico')): ?>
<link href="<?php echo JURI::root(true); ?>/templates/<?php echo $this->template; ?>/images/favicon.ico" rel="shortcut icon" />
<?php endif;
if(file_exists(JPATH_BASE . '/templates/' . $this->template . '/images/apple-touch-icon.png')): ?>
<link href="<?php echo JURI::root(true); ?>/templates/<?php echo $this->template; ?>/images/apple-touch-icon.png" rel="apple-touch-icon" />
<?php endif;
if(file_exists(JPATH_BASE . '/templates/' . $this->template . '/images/apple-touch-icon-76x76.png')): ?>
<link href="<?php echo JURI::root(true); ?>/templates/<?php echo $this->template; ?>/images/apple-touch-icon-76x76.png" rel="apple-touch-icon" sizes="76x76" />
<?php endif;
if(file_exists(JPATH_BASE . '/templates/' . $this->template . '/images/apple-touch-icon-120x120.png')): ?>
<link href="<?php echo JURI::root(true); ?>/templates/<?php echo $this->template; ?>/images/apple-touch-icon-120x120.png" rel="apple-touch-icon" sizes="120x120" />
<?php endif;
if(file_exists(JPATH_BASE . '/templates/' . $this->template . '/images/apple-touch-icon-152x152.png')): ?>
<link href="<?php echo JURI::root(true); ?>/templates/<?php echo $this->template; ?>/images/apple-touch-icon-152x152.png" rel="apple-touch-icon" sizes="152x152" />
<?php endif;
echo $this->params->get('ga_account') ? "<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', '" . $this->params->get('ga_account') . "', 'auto');
ga('send', 'pageview');
</script>" : ''; ?>
<?php if(file_exists(JPATH_BASE . '/templates/' . $this->template . '/js/scripts.js')): ?>
<script src="<?php echo JURI::root(true); ?>/templates/<?php echo $this->template; ?>/js/scripts<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js?v=<?php echo date("YmdHis", filemtime(JPATH_BASE . '/templates/' . $this->template . '/js/scripts' . ($this->params->get('non_min_js') ? '' : '.min') . '.js')); ?>" type="text/javascript"></script>
<?php endif; ?>
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
<script type="text/javascript">
lqx.bodyScreenSize();
</script>
<div class="container cf">
	<h1>Error <?php echo $this->error->getCode(); ?>:<br /><?php echo htmlspecialchars($this->error->getMessage(), ENT_QUOTES, 'UTF-8'); ?></h1>
	<p><strong><?php echo JText::_('JERROR_LAYOUT_NOT_ABLE_TO_VISIT'); ?></strong></p>
	<ul>
		<li><?php echo JText::_('JERROR_LAYOUT_AN_OUT_OF_DATE_BOOKMARK_FAVOURITE'); ?></li>
		<li><?php echo JText::_('JERROR_LAYOUT_SEARCH_ENGINE_OUT_OF_DATE_LISTING'); ?></li>
		<li><?php echo JText::_('JERROR_LAYOUT_MIS_TYPED_ADDRESS'); ?></li>
		<li><?php echo JText::_('JERROR_LAYOUT_YOU_HAVE_NO_ACCESS_TO_THIS_PAGE'); ?></li>
		<li><?php echo JText::_('JERROR_LAYOUT_REQUESTED_RESOURCE_WAS_NOT_FOUND'); ?></li>
		<li><?php echo JText::_('JERROR_LAYOUT_ERROR_HAS_OCCURRED_WHILE_PROCESSING_YOUR_REQUEST'); ?></li>
	</ul>
	<p><?php echo JText::_('JERROR_LAYOUT_PLEASE_CONTACT_THE_SYSTEM_ADMINISTRATOR'); ?></p>
	<div id="techinfo">
		<p><?php echo htmlspecialchars($this->error->getMessage(), ENT_QUOTES, 'UTF-8'); ?></p>
		<?php if ($this->debug) : ?>
			<p><?php echo $this->renderBacktrace(); ?></p>
		<?php endif; ?>
	</div>
</div>

<!--[if lte IE 8]>
<link href="<?php echo JURI::root(true); ?>/templates/<?php echo $this->template; ?>/css/ie8-alert.css" rel="stylesheet" type="text/css" />
<div class="ie8-alert">You are using an unsupported version of Internet Explorer. To ensure security, performance, and full functionality, <a href="http://browsehappy.com/" target="_blank">please upgrade to an up-to-date browser.</a></div>
<![endif]-->

</body>
</html>
<?php endif; // endif for including custom-error.php