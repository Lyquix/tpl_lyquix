<script>
lqx.bodyScreenSize();
<?php 
if($this->params->get('mobiledetect_method', 'php') == 'js') echo "lqx.mobileDetect = lqx.mobileDetect();\n"; 
if($this->params->get('mobiledetect_method', 'php') == 'php'){
	echo 'lqx.mobileDetect = {mobile: ' . ($mobile ? 'true' : 'false') . ',phone: ' . ($phone ? 'true' : 'false') . ',tablet: ' . ($tablet ? 'true' : 'false') . "};\n";
}
?>
</script>