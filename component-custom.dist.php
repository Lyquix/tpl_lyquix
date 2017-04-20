<?php
// No direct access
defined('_JEXEC') or die('Restricted access');

include($tmpl_path . '/php/head-pre.inc.php');
?><!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" >
<head>
<?php 
include($tmpl_path . '/php/head-top.inc.php'); 
?>
<jdoc:include type="head" />
<?php 
include($tmpl_path . '/php/css.inc.php');
include($tmpl_path . '/php/js.inc.php');
include($tmpl_path . '/php/favicon.inc.php');
include($tmpl_path . '/php/head-bottom.inc.php');
?>
</head>
<?php
include($tmpl_path . '/php/body-pre.inc.php');
?>
<body class="<?php echo implode(' ', $body_classes); ?>">
<?php
include($tmpl_path . '/php/body-top.inc.php');
?>
<jdoc:include type="message" />
<jdoc:include type="component" />
<?php include($tmpl_path . '/php/body-post.inc.php'); ?>
</body>
</html>
