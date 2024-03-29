<?php
/**
 * head.php - Prepare the Joomla <jdoc:include type="head" /> tag
 *
 * @version     2.4.1
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

// Prevent adding component css and js libraries in <jdoc:include type="head" />
$remove_css_libraries = explode("\n", trim($this -> params -> get('remove_css_libraries', '')));
foreach($remove_css_libraries as $css_url) unset($doc -> _styleSheets[trim($css_url)]);
$remove_js_libraries = explode("\n", trim($this -> params -> get('remove_js_libraries', '')));
foreach($remove_js_libraries as $js_url) unset($doc -> _scripts[trim($js_url)]);

// Disable MooTools
if($this -> params -> get('disable_mootools', 1)) {
	// css
	foreach([
		'/media/system/css/modal.css',
		] as $css_url) unset($doc -> _styleSheets[$site_rel_url . trim($css_url)]);
	// js
	foreach([
		'/media/system/js/mootools-core.js',
		'/media/system/js/mootools-more.js',
		'/media/system/js/mootree.js',
		'/media/system/js/mootools-core-uncompressed.js',
		'/media/system/js/mootools-more-uncompressed.js',
		'/media/system/js/mootree-uncompressed.js',
		] as $js_url) unset($doc -> _scripts[$site_rel_url . trim($js_url)]);
}

// Enable jQuery
if($this -> params -> get('enable_jquery', 1)) {
	JHtml::_('jquery.framework');
}

// Enable jQuery UI
if($this -> params -> get('enable_jquery_ui', '')) {
	JHtml::_('jquery.ui', explode(",", $this -> params -> get('enable_jquery_ui')));
}

// Enable Bootstrap
if($this -> params -> get('enable_bootstrap', 1)) {
	JHtml::_('bootstrap.framework');
}

// Joomla Javascript Framework
if(is_array($this -> params -> get('joomla_js'))) {
	foreach($this -> params -> get('joomla_js') as $joomla_js) JHtml::_('behavior.' . $joomla_js);
}
