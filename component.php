<?php
// No direct access
defined('_JEXEC') or die('Restricted access');

// if custom-index.php file exists the whole template is overriden
if(file_exists(JPATH_BASE . '/templates/' . $this->template . 'custom-component.php')) :
	include 'custom-component.php'; 
else :

// Enable Joomla Bootstrap and jQuery UI framework;
JHtml::_('bootstrap.framework');
JHtml::_('jquery.ui', array('core', 'sortable'));

// Check if we are on the home page
if(JRequest::getVar('Itemid') == JFactory::getApplication()->getMenu()->getDefault()->id){ $home = true; }

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
<script src="<?php echo JURI::root(true); ?>/templates/<?php echo $this->template; ?>/js/html5shiv.js" type="text/javascript"></script>
<script src="<?php echo JURI::root(true); ?>/templates/<?php echo $this->template; ?>/js/selectivizr.js" type="text/javascript"></script>
<![endif]-->
<?php if($home) {
	echo $this->params->get('google_site_verification') ? '<meta name="google-site-verification" content="' . $this->params->get('google_site_verification') . '" />' . "\n" : '';
	echo $this->params->get('msvalidate') ? '<meta name="msvalidate.01" content="' . $this->params->get('msvalidate') . '" />' . "\n" : '';
	echo $this->params->get('p_domain_verify') ? '<meta name="p:domain_verify" content="' . $this->params->get('p_domain_verify') . '"/>' . "\n" : '';
	echo '<link href="' . JURI::root() . '" rel="canonical" />' . "\n";
} ?>
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width">
<jdoc:include type="head" />
<link href="<?php echo JURI::root(true); ?>/templates/<?php echo $this->template; ?>/css/styles.css?v=<?php echo date("YmdHis", filemtime(JPATH_BASE . '/templates/' . $this->template . '/css/styles.css')); ?>" rel="stylesheet" type="text/css" />
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
<script src="<?php echo JURI::root(true); ?>/templates/<?php echo $this->template; ?>/js/lyquix.js?v=<?php echo date("YmdHis", filemtime(JPATH_BASE . '/templates/' . $this->template . '/js/lyquix.js')); ?>" type="text/javascript"></script>
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
<?php echo $this->params->get('addthis_pubid') ? '<script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=' . $this->params->get('addthis_pubid') . '"></script>' : ''; ?>
<?php if(file_exists(JPATH_BASE . '/templates/' . $this->template . '/js/scripts.js')): ?>
<script src="<?php echo JURI::root(true); ?>/templates/<?php echo $this->template; ?>/js/scripts.js?v=<?php echo date("YmdHis", filemtime(JPATH_BASE . '/templates/' . $this->template . '/js/scripts.js')); ?>" type="text/javascript"></script>
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
?>">
<script type="text/javascript">
(function(){
	w = jQuery(window).width();
	if(w < 640) s = 'xs';
	if(w >= 640) s = 'sm';
	if(w >= 960) s = 'md';
	if(w >= 1280) s = 'lg';
	if(w >= 1600) s = 'xl';
	jQuery('body').attr('screen',s);
})();
</script>

<jdoc:include type="message" />
<jdoc:include type="component" />

<!--[if lte IE 8]>
<link href="<?php echo JURI::root(true); ?>/templates/<?php echo $this->template; ?>/css/ie8-alert.css" rel="stylesheet" type="text/css" />
<div class="ie8-alert">You are using an unsupported version of Internet Explorer. To ensure security, performance, and full functionality, <a href="http://browsehappy.com/" target="_blank">please upgrade to an up-to-date browser.</a></div>
<![endif]-->

<?php echo $this->params->get('disqus_shortname') ? '<script type="text/javascript" src="//' . $this->params->get('disqus_shortname') . '.disqus.com/embed.js"></script>' : ''; ?>

<jdoc:include type="modules" name="body" />

</body>
</html>
<?php endif; // endif for including custom-component.php