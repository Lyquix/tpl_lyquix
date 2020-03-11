<?php
/**
 * pagination.php - Custom module rendering
 *
 * @version     1.0.10
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2017 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

// No direct access
defined('_JEXEC') or die;

function modChrome_lyquix($module, &$params, &$attribs) {
	if(!empty($module->content)) {
		echo '<' . $params->get('module_tag', 'div') . ' class="module mod_' . $module->name . $params->get('moduleclass_sfx') . '">';
		if((bool)$module->showtitle) {
			echo '<' . $params->get('header_tag', 'h3') . ' class="' . $params->get('header_class') . '">' . $module->title . '</' . $params->get('header_tag', 'h3') . '>';
		}
		echo $module->content;
		echo '</' . $params->get('module_tag', 'div') . '>';
	}
}

function modChrome_raw($module, &$params, &$attribs) {
	echo $module->content;
}