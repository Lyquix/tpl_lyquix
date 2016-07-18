<!--[if IE]>
<script>if(typeof console=='undefined'||typeof console.log=='undefined'){console={};console.log=function(){};}</script>
<![endif]-->
<!--[if lt IE 9]>
<script src="<?php echo $tmpl_url; ?>/js/aight<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js"></script>
<script src="<?php echo $tmpl_url; ?>/js/selectivizr<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js"></script>
<![endif]-->
<?php 
// Adds search engine domain validation strings to home page only
if($home) {
	echo $this->params->get('google_site_verification') ? '<meta name="google-site-verification" content="' . $this->params->get('google_site_verification') . '" />' . "\n" : '';
	echo $this->params->get('msvalidate') ? '<meta name="msvalidate.01" content="' . $this->params->get('msvalidate') . '" />' . "\n" : '';
	echo $this->params->get('p_domain_verify') ? '<meta name="p:domain_verify" content="' . $this->params->get('p_domain_verify') . '"/>' . "\n" : '';
	echo '<link href="' . JURI::root() . '" rel="canonical" />' . "\n";
} 
?>
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<?php 
// Prevent adding component css and js libraries in <jdoc:include type="head" />
$doc = JFactory::getDocument();
$remove_css_js_libraries = explode("\n", trim($this->params->get('remove_css_js_libraries', '')));
foreach($remove_css_js_libraries as $js_css_url) {
	$js_css_url = trim($js_css_url);
	if($js_css_url) {
        $ext = pathinfo($js_css_url, PATHINFO_EXTENSION);
        if($ext == 'css')
            unset($doc->_styleSheets[$js_css_url]);
        else if ($ext == 'js')
            unset($doc->_scripts[$js_css_url]);
	}
}
?>