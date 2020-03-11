<?php
/**
 * body-bottom.inc.php - Includes for bottom of <body> tag
 *
 * @version     1.0.10
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2017 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

if($this->params->get('ie8_alert',1)): ?>
<!--[if lte IE 8]>
<link href="<?php echo $tmpl_url; ?>/css/ie8-alert.css" rel="stylesheet" />
<div class="ie8-alert">You are using an unsupported version of Internet Explorer. To ensure security, performance, and full functionality, <a href="http://browsehappy.com/?locale=<?php echo $this->language; ?>">please upgrade to an up-to-date browser.</a></div>
<![endif]-->
<?php endif;
if($this->params->get('ie9_alert',1)): ?>
<!--[if IE 9]>
<link href="<?php echo $tmpl_url; ?>/css/ie9-alert.css" rel="stylesheet" />
<div class="ie9-alert">You are using an unsupported version of Internet Explorer. To ensure security, performance, and full functionality, <a href="http://browsehappy.com/?locale=<?php echo $this->language; ?>">please upgrade to an up-to-date browser.</a><i></i></div>
<script>jQuery('.ie9-alert i').click(function(){jQuery('.ie9-alert').hide();});</script>
<![endif]-->
<?php endif; ?>

<jdoc:include type="modules" name="body" />