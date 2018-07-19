<?php 
/**
 * js.inc.php - Includes JavaScript libraries
 *
 * @version     2.0.0
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

if($this->params->get('polyfill', 1)): ?>
<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
<?php endif;

$merge_js = $this->params->get('merge_js'); 
if(!is_array($this->params->get('merge_js'))) {
	$merge_js = array();
}

// Array to store all scripts to be loaded
$scripts = array();

// Parse enqueued scripts
foreach($doc->_scripts as $script_url => $script_meta) {
	// Check if script is local or remote
	if(parse_url($script_url, PHP_URL_SCHEME)) {
		// Absolute URL
		if(in_array('remote', $merge_js)) {
			$scripts[] = array('url' => $script_url);
			unset($doc->_scripts[$script_url]);
		}
	}
	elseif (parse_url($script_url, PHP_URL_PATH)) {
		// Relative URL
		if(in_array('local', $merge_js)) {
			$url = $script_url;
			// Add leading / if missing
			if(substr($url,0,1) != '/') $url = '/' . $url;
			// Check if file exist
			if(file_exists(JPATH_BASE . $url)) {
				$scripts[] = array(
					'url' => $url,
					'version' => date("YmdHis", filemtime(JPATH_BASE . $url))
				);
				unset($doc->_scripts[$script_url]);
			}
		}
	}
}

// Parse enqueued script declarations
if(in_array('inline', $merge_js)) {
	foreach($doc->_script as $script_type => $script_data) {
		$scripts[] = array('data' => $script_data);
	}
	$doc->_script = array();
}

// Use non minified version?
$non_min_js = $this->params->get('non_min_js');

// Vue.JS
if($this->params->get('vuejs', 0)) {
	$scripts[] = array('url' => $cdnjs_url . 'vue/2.5.13/vue' . ($non_min_js ? '' : '.min') . '.js');
}

// LoDash
if($this->params->get('lodash', 0)) {
	$scripts[] = array('url' => $cdnjs_url . 'lodash.js/4.17.4/lodash' . ($non_min_js ? '' : '.min') . '.js');
}

// SmoothScroll
if($this->params->get('smoothscroll', 0)) {
	$scripts[] = array('url' => $cdnjs_url . 'smoothscroll/1.4.6/SmoothScroll' . ($non_min_js ? '' : '.min') . '.js');
}

// MomentJS
if($this->params->get('momentjs', 0)) {
	$scripts[] = array('url' => $cdnjs_url . 'moment.js/2.18.1/moment' . ($non_min_js ? '' : '.min') . '.js');
}

// DotDotDot
if($this->params->get('dotdotdot', 0)) {
	$scripts[] = array('url' => $cdnjs_url . 'jQuery.dotdotdot/1.7.4/jquery.dotdotdot' . ($non_min_js ? '' : '.min') . '.js');
}

// MobileDetect 
$scripts[] = array('url' => $cdnjs_url . 'mobile-detect/1.3.6/mobile-detect' . ($non_min_js ? '' : '.min') . '.js');

// Additional JS Libraries
$add_js_libraries = explode("\n", trim($this->params->get('add_js_libraries', '')));
foreach($add_js_libraries as $jsurl) {
	$jsurl = trim($jsurl);
	if($jsurl) {
		// Check if script is local or remote
		if(parse_url($jsurl, PHP_URL_SCHEME)) {
			// Absolute URL
			$scripts[] = array('url' => $jsurl);
		}
		elseif (parse_url($jsurl, PHP_URL_PATH)) {
			// Relative URL
			// Add leading / if missing
			if(substr($jsurl,0,1) != '/') $jsurl = '/' . $jsurl;
			// Check if file exist
			if(file_exists(JPATH_BASE . $jsurl)) {
				$scripts[] = array('url' => $jsurl, 'version' => date("YmdHis", filemtime(JPATH_BASE . $jsurl)));
			}
		}
	}
} 

// Lyquix JS
$scripts[] = array(
	'url' => $tmpl_url . '/js/lyquix' . ($non_min_js ? '' : '.min') . '.js', 
	'version' => date("YmdHis", filemtime($tmpl_path . '/js/lyquix' . ($non_min_js ? '' : '.min') . '.js'))
);

// Custom Project Scripts
if(file_exists($tmpl_path . '/js/scripts.js')) {
	$scripts[] = array(
		'url' => $tmpl_url . '/js/scripts' . ($non_min_js ? '' : '.min') . '.js',
		'version' => date("YmdHis", filemtime($tmpl_path . '/js/scripts' . ($non_min_js ? '' : '.min') . '.js'))
	);
}

// Unique filename based on scripts, last update, and order
$scripts_filename = md5(json_encode($scripts)) . '.js';

// Check if dist directory exists
if (!is_dir($tmpl_path . '/dist/')) {
	mkdir($tmpl_path . '/dist/');
}

// Check if file has already been created
if(!file_exists($tmpl_path . '/dist/' . $scripts_filename)) {
	// Prepare file
	$scripts_data = "/* " . $scripts_filename . " */\n";
	foreach($scripts as $idx => $script) {
		if(array_key_exists('data', $script)) {
			$scripts_data .= "/* Custom script declaration */\n";
			$scripts_data .= $script['data'] . "\n";
		}
		elseif (array_key_exists('version', $script)) {
			$scripts_data .= "/* Local script: " . $script['url'] . ", Version: " . $script['version'] . " */\n";
			$script['url'] = JPATH_BASE . $script['url'];
			$scripts_data .= file_get_contents($script['url']) . "\n";
		}
		else {
			$scripts_data .= "/* Remote script: " . $script['url'] . " */\n";
			$scripts_data .= file_get_contents($script['url']) . "\n";
		} 
	}
	// Save file
	file_put_contents($tmpl_path . '/dist/' . $scripts_filename, $scripts_data);
	unset($scripts_data);
}
?>
<script src="<?php echo $tmpl_url . '/dist/' . $scripts_filename; ?>"></script>
<?php
// Set lqx options
$lqx_options = array(
	'responsive' => array(
		'minIndex' => $this->params->get('min_screen', 0),
		'maxIndex' => $this->params->get('max_screen', 4)
	),
	'siteURL' => $site_abs_url,
	'tmplURL' => $site_abs_url . 'templates/' . $this->template
);

if($this->params->get('ga_account')) {
	$lqx_options['analytics'] = array(
		'createParams' => array(
			'default' => array(
				'trackingId' => $this->params->get('ga_account'),
				'cookieDomain' => 'auto'
			)
		)
	);
}

// Merge with options from template settings
$lqx_options = array_merge($lqx_options, json_decode($this->params->get('lqx_options', '{}'), true));
