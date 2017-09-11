<?php 
/**
 * body-top.inc.php - Includes for top of <body> tag
 *
 * @version     1.0.3
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2017 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */
?>
<script>
lqx.bodyScreenSize();
lqx.vars.siteURL = '<?php echo $site_abs_url; ?>';
lqx.vars.tmplURL = '<?php echo $site_abs_url . 'templates/' . $this->template; ?>';
<?php 
if($this->params->get('mobiledetect_method', 'php') == 'js') echo "lqx.mobileDetect = lqx.mobileDetect();\n"; 
if($this->params->get('mobiledetect_method', 'php') == 'php'){
	echo 'lqx.mobileDetect = {mobile: ' . ($mobile ? 'true' : 'false') . ',phone: ' . ($phone ? 'true' : 'false') . ',tablet: ' . 
		($tablet ? 'true' : 'false') . "};\n";
}
?>
</script>
<?php if($this->params->get('aos', 0)): ?>
<script src="https://cdn.rawgit.com/michalsnik/aos/2.1.1/dist/aos<?php echo $this->params->get('non_min_js') ? '' : '.min'; ?>.js"></script>
<script>
    AOS.init();
    console.log('initialized AOS');
</script>
<?php endif;