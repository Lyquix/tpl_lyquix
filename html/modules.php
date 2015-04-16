<?php
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