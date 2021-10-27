<?php
/**
 * ie-alert.php - Includes the IE alerts
 *
 * @version     2.3.2
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

$ie_alerts = [];
foreach([9, 10, 11] as $v) {
	if($this -> params -> get('ie' . $v . '_alert', 1)) $ie_alerts[] = 'ie' . $v;
}

if(count($ie_alerts)) : ?>
<link href="<?php echo $tmpl_url; ?>/css/ie-alert.css" rel="stylesheet" />
<div id="ie-alert" class="<?php echo implode(' ', $ie_alerts); ?>">You are using an unsupported version of Internet Explorer. To ensure security, performance, and full functionality, <a href="http://browsehappy.com/?locale=en">please upgrade to an up-to-date browser.</a><i></i></div>
<script>
document.querySelector('#ie-alert i').addEventListener('click', function(){document.querySelector('#ie-alert').style.display = 'none';});
</script>
<?php endif;
