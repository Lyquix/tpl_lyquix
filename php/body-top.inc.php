<?php
/**
 * body-top.inc.php - Includes for top of <body> tag
 *
 * @version     1.0.12
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
</script>
<?php
echo $this->params->get('gtm_account') ? "<!-- Google Tag Manager (noscript) -->
<noscript><iframe src=\"https://www.googletagmanager.com/ns.html?id=" . $this->params->get('gtm_account') . "\"
height=\"0\" width=\"0\" style=\"display:none;visibility:hidden\"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->" : "";