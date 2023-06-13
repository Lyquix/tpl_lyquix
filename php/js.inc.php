<?php
/**
 * js.inc.php - Includes JavaScript libraries
 *
 * @version     1.1.0
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2017 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

if($this->params->get('angularjs', 0)): ?>
<script src="<?php echo $cdnjs_url; ?>angular.js/1.6.1/angular<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js"></script>
<?php endif;
if($this->params->get('lodash', 0)): ?>
<script src="<?php echo $cdnjs_url; ?>lodash.js/4.17.4/lodash<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js"></script>
<?php endif;
if($this->params->get('smoothscroll', 0)): ?>
<script src="<?php echo $cdnjs_url; ?>smoothscroll/1.4.6/SmoothScroll<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js"></script>
<?php endif;
if($this->params->get('momentjs', 0)): ?>
<script src="<?php echo $cdnjs_url; ?>moment.js/2.18.1/moment<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js"></script>
<?php endif;
if($this->params->get('dotdotdot', 0)): ?>
<script src="<?php echo $cdnjs_url; ?>jQuery.dotdotdot/1.7.4/jquery.dotdotdot<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js"></script>
<?php endif; ?>
<script src="<?php echo $cdnjs_url; ?>mobile-detect/1.3.6/mobile-detect<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js"></script>
<?php
$add_js_libraries = explode("\n", trim($this->params->get('add_js_libraries', '')));
foreach($add_js_libraries as $jsurl) {
	$jsurl = trim($jsurl);
	if($jsurl) {
		echo '<script src="' . $jsurl . '"></script>';
	}
}
?>
<script src="<?php echo $tmpl_url; ?>/js/lyquix<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/js/lyquix' . ($this->params->get('non_min_js') ? '' : '.min') . '.js')); ?>"></script>
<?php if(file_exists($tmpl_path . '/js/scripts.js')): ?>
<script src="<?php echo $tmpl_url; ?>/js/scripts<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/js/scripts' . ($this->params->get('non_min_js') ? '' : '.min') . '.js')); ?>"></script>
<?php endif;

// Set lqx options
$lqx_options = [
	'bodyScreenSize' => [
		'min' => $this -> params -> get('min_screen', 0),
		'max' => $this -> params -> get('max_screen', 4)
	]
];

if($this -> params -> get('ga_account', '') || $this -> params -> get('ga4_account', '')) {
	$lqx_options['ga'] = [
		'trackingId' => $this -> params -> get('ga_account'),
		'measurementId' => $this -> params -> get('ga4_account'),
		'sendPageview' => $this -> params -> get('ga_pageview', '1') ? true : false,
		'useAnalyticsJS' => $this -> params -> get('ga_use_analytics_js', '1') ? true : false,
		'usingGTM' => $this -> params -> get('ga_via_gtm', '0') ? true : false
	];
}

// Merge with options from template settings
$lqx_options = array_replace_recursive($lqx_options, json_decode($this -> params -> get('lqx_options', '{}'), true));

?>
<script>lqx.setOptions(<?php echo json_encode($lqx_options); ?>);</script>
