<?php
// Prepare array of classes for body tag
if(@!is_array($body_classes)) $body_classes = array();
if($home) $body_classes[] = 'home';
if($phone) $body_classes[] = 'phone';
if($tablet) $body_classes[] = 'tablet';
$body_classes[] = JRequest::getVar('option');
$body_classes[] = 'view_' . JRequest::getVar('view');
if(JRequest::getVar('task')) $body_classes[] = 'task_'.JRequest::getVar('task');

if(is_array($this->params->get('fluid_screen')) && 
	(($this->params->get('fluid_device', 'any') == 'any') || 
	($this->params->get('fluid_device') == 'mobile' && $mobile) || 
	($this->params->get('fluid_device') == 'phone' && $phone) || 
	($this->params->get('fluid_device') == 'tablet' && $tablet))) {
	foreach($this->params->get('fluid_screen') as $fluid_screen){
		$body_classes[] = 'blkfluid-' . $fluid_screen;
	}
}
?>
