<?php
/**
 * body.php - Prepare classes for the <body> tag
 *
 * @version     2.0.0-beta-3
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

// Prepare array of classes for body tag
if(@!is_array($body_classes)) {
	$body_classes = array();
}
if($home) {
	$body_classes[] = 'home';
}
$body_classes[] = JRequest::getVar('option');
$body_classes[] = 'view_' . JRequest::getVar('view');
if(JRequest::getVar('task')) {
	$body_classes[] = 'task_'.JRequest::getVar('task');
}
