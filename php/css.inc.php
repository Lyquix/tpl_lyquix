<?php
$add_css_libraries = explode("\n", trim($this->params->get('add_css_libraries', '')));
foreach($add_css_libraries as $cssurl) {
	$cssurl = trim($cssurl);
	if($cssurl) {
		echo '<link href="' . $cssurl . '" rel="stylesheet" />';
	}
}?>

<link href="<?php echo $tmpl_url; ?>/css/styles.<?php echo $this->params->get('lessjs') ? 'less' : 'css'; ?>?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/css/styles.' . ($this->params->get('lessjs') ? 'less' : 'css'))); ?>" id="stylesheet" rel="stylesheet" <?php echo $this->params->get('lessjs') ? 'type="text/less" ' : ''; ?>/>

<?php if($this->params->get('lessjs')): ?>
<script src="<?php echo $tmpl_url; ?>/js/less<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js"></script>
<?php endif; ?>

<?php if(file_exists($tmpl_path . '/css/styles.0.css')): ?>
<!--[if lte IE 9]>
<script>
// Unload main styles.css file
(function() {
	var stylesheet = document.getElementById('stylesheet');
	stylesheet.parentNode.removeChild(stylesheet);
})();
</script>
<?php
$styles_idx = 0; 
while(file_exists($tmpl_path . '/css/styles.' . $styles_idx . '.css')) {
	echo '<link href="' . $tmpl_url . '/css/styles.' . $styles_idx . '.css?v=' . date("YmdHis", filemtime($tmpl_path . '/css/styles.' . $styles_idx . '.css')) . '" rel="stylesheet" />';
	$styles_idx++;
}
?>
<![endif]-->
<?php endif; 
if(file_exists($tmpl_path . '/css/ie9.css')): ?>
<!--[if lte IE 9]>
<link href="<?php echo $tmpl_url; ?>/css/ie9.css?v=<?php echo date("YmdHis", filemtime($tmpl_path . '/css/ie9.css')); ?>" rel="stylesheet" />
<![endif]-->
<?php endif; ?>