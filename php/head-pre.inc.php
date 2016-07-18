<?php
// Enable Joomla Bootstrap and jQuery UI framework;
JHtml::_('bootstrap.framework');
JHtml::_('jquery.ui', array('core', 'sortable'));

// declare some variables
$home = $mobile = $phone = $tablet = false;

// Check if we are on the home page
if(JRequest::getVar('Itemid') == JFactory::getApplication()->getMenu()->getDefault()->id){ $home = true; }

// Check if we are on a mobile device, whether smartphone or tablet
if($this->params->get('mobiledetect_method', 'php') == 'php') {
	require_once($tmpl_path . '/php/Mobile_Detect.php');
	$detect = new Mobile_Detect;
	if($detect->isMobile()){
		$mobile = true;
		if($detect->isTablet()){ $tablet = true; }
		if($detect->isPhone()){ $phone = true; }
	}
}
?>