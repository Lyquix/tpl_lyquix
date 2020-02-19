<?php
/**
 * ie-alert.php - Includes the IE alerts
 *
 * @version     2.2.2
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

$ie9 = $this -> params -> get('ie9_alert', 1);
$ie10 = $this -> params -> get('ie10_alert', 1);
$ie11 = $this -> params -> get('ie11_alert', 0);

if($ie9 || $ie10 || $ie11) : ?>
<link href="<?php echo $tmpl_url; ?>/css/ie-alert.css" rel="preload" as="style" onload="this.rel='stylesheet'" />
<div class="ie-alert<?php echo ($ie9 ? ' ie9' : '') . ($ie10 ? ' ie10' : '') . ($ie11 ? ' ie11' : ''); ?>">You are using an unsupported version of Internet Explorer. To ensure security, performance, and full functionality, <a href="http://browsehappy.com/?locale=en">please upgrade to an up-to-date browser.</a><i></i></div>
<script>
document.querySelector('.ie-alert i').addEventListener('click', function(){document.querySelector('.ie-alert').style.display = 'none';});
</script>
<?php endif;
