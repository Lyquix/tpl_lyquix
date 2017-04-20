<?php
if($this->params->get('es5_shim', 0) || $this->params->get('es5_es6_shim', 0)): ?>
<script src="<?php echo $tmpl_url; ?>/js/es5-shim<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/js/es5-shim' . ($this->params->get('non_min_js') ? '' : '.min') . '.js')); ?>"></script>
<script src="<?php echo $tmpl_url; ?>/js/es5-sham<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/js/es5-sham' . ($this->params->get('non_min_js') ? '' : '.min') . '.js')); ?>"></script>
<?php endif;
if($this->params->get('es5_es6_shim', 0)): ?>
<script src="<?php echo $tmpl_url; ?>/js/es6-shim<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/js/es6-shim' . ($this->params->get('non_min_js') ? '' : '.min') . '.js')); ?>"></script>
<script src="<?php echo $tmpl_url; ?>/js/es6-sham<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/js/es6-sham' . ($this->params->get('non_min_js') ? '' : '.min') . '.js')); ?>"></script>
<?php endif;
if($this->params->get('json3', 0)): ?>
<script src="<?php echo $tmpl_url; ?>/js/json3<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/js/json3' . ($this->params->get('non_min_js') ? '' : '.min') . '.js')); ?>"></script>
<?php endif;
if($this->params->get('angularjs', 0)): ?>
<script src="<?php echo $tmpl_url; ?>/js/angular<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/js/angular' . ($this->params->get('non_min_js') ? '' : '.min') . '.js')); ?>"></script>
<?php endif;
if($this->params->get('lodash', 0)): ?>
<script src="<?php echo $tmpl_url; ?>/js/lodash<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/js/lodash' . ($this->params->get('non_min_js') ? '' : '.min') . '.js')); ?>"></script>
<?php endif;
if($this->params->get('smoothscroll', 0)): ?>
<script src="<?php echo $tmpl_url; ?>/js/smoothscroll<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/js/smoothscroll' . ($this->params->get('non_min_js') ? '' : '.min') . '.js')); ?>"></script>
<?php endif;
if($this->params->get('mobiledetect_method', 'php') == 'js'): ?>
<script src="<?php echo $tmpl_url; ?>/js/mobile-detect<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/js/mobile-detect' . ($this->params->get('non_min_js') ? '' : '.min') . '.js')); ?>"></script>
<?php endif;
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
<?php endif; ?>
<script>lqx.setOptions({
	bodyScreenSize: {min: <?php echo $this->params->get('min_screen', 0); ?>, max: <?php echo $this->params->get('max_screen', 4); ?>}<?php if($this->params->get('ga_account')) : ?>,
	ga: {createParams: {default: {trackingId: '<?php echo $this->params->get('ga_account'); ?>', cookieDomain: 'auto'}}}<?php endif; ?>
});</script>
<?php if($this->params->get('lqx_options', '{}') != '{}') : ?>
<script>lqx.setOptions(<?php echo $this->params->get('lqx_options', '{}'); ?>);</script>
<?php endif; ?>
