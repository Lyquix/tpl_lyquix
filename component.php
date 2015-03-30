<?php
// No direct access
defined('_JEXEC') or die('Restricted access');

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
<script src="<?php echo $this->baseurl ?>/templates/<?php echo $this->template; ?>/js/html5shiv.js" type="text/javascript"></script>
<script src="<?php echo $this->baseurl ?>/templates/<?php echo $this->template; ?>/js/selectivizr.js" type="text/javascript"></script>
<![endif]-->
<?php if($home) {
	echo $this->params->get('google_site_verification') ? '<meta name="google-site-verification" content="' . $this->params->get('google_site_verification') . '" />' . "\n" : '';
	echo $this->params->get('msvalidate') ? '<meta name="msvalidate.01" content="' . $this->params->get('msvalidate') . '" />' . "\n" : '';
	echo $this->params->get('p_domain_verify') ? '<meta name="p:domain_verify" content="' . $this->params->get('p_domain_verify') . '"/>' . "\n" : '';
	echo '<link href="' . JURI::base() . '" rel="canonical" />' . "\n";
} ?>
<meta name="viewport" content="width=device-width, initial-scale=1">
<jdoc:include type="head" />
<link href="<?php echo $this->baseurl ?>/templates/<?php echo $this->template; ?>/css/styles.css?v=<?php echo date("YmdHis", filemtime(JPATH_BASE . '/templates/' . $this->template . '/css/styles.css')); ?>" rel="stylesheet" type="text/css" />
<!--[if lte IE 9]>
<link href="<?php echo $this->baseurl ?>/templates/<?php echo $this->template; ?>/css/ie9.css" rel="stylesheet" type="text/css" />
<![endif]-->
<!--[if lte IE 8]>
<link href="<?php echo $this->baseurl ?>/templates/<?php echo $this->template; ?>/css/ie8.css" rel="stylesheet" type="text/css" />
<![endif]-->
<!--[if lte IE 7]>
<link href="<?php echo $this->baseurl ?>/templates/<?php echo $this->template; ?>/css/ie7.css" rel="stylesheet" type="text/css" />
<![endif]-->
<script src="<?php echo $this->baseurl ?>/templates/<?php echo $this->template; ?>/js/scripts.js?v=<?php echo date("YmdHis", filemtime(JPATH_BASE . '/templates/' . $this->template . '/js/scripts.js')); ?>" type="text/javascript"></script>
<?php echo $this->params->get('lqx_options') ? '<script type="text/javascript">lqx.setOptions(' . $this->params->get('lqx_options') . ');</script>' : ''; ?>
<link href="<?php echo $this->baseurl ?>/templates/<?php echo $this->template; ?>/images/favicon.ico" rel="shortcut icon" />
<link href="<?php echo $this->baseurl ?>/templates/<?php echo $this->template; ?>/images/apple-touch-icon.png" rel="apple-touch-icon" />
<link href="<?php echo $this->baseurl ?>/templates/<?php echo $this->template; ?>/images/apple-touch-icon-76x76.png" rel="apple-touch-icon" sizes="76x76" />
<link href="<?php echo $this->baseurl ?>/templates/<?php echo $this->template; ?>/images/apple-touch-icon-120x120.png" rel="apple-touch-icon" sizes="120x120" />
<link href="<?php echo $this->baseurl ?>/templates/<?php echo $this->template; ?>/images/apple-touch-icon-152x152.png" rel="apple-touch-icon" sizes="152x152" />
<?php echo $this->params->get('ga_account') ? "<!-- Google Analytics -->
<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', '" . $this->params->get('ga_account') . "', 'auto');
ga('send', 'pageview');
</script>
<!-- End Google Analytics -->" : ''; ?>
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
<jdoc:include type="message" />
<jdoc:include type="component" />
<!--[if lte IE 8]>
<div class="ie8-alert">You are using an unsupported version of Internet Explorer. To ensure security, performance, and full functionality, <a href="http://browsehappy.com/" target="_blank">please upgrade to an up-to-date browser.</a></div>
<![endif]-->
<?php echo $this->params->get('addthis_pubid') ? '<script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=' . $this->params->get('addthis_pubid') . '"></script><script type="text/javascript">addthis.layers({\'theme\':\'transparent\',\'share\':{\'position\':\'left\',\'numPreferredServices\':5}});</script>' : ''; ?>
<?php echo $this->params->get('disqus_shortname') ? '<script type="text/javascript" src="//' . $this->params->get('disqus_shortname') . '.disqus.com/embed.js"></script>' : '' ?>
</body>
</html>