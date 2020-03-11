<?php
/**
 * component-custom.dist.php - Sample custom component template file. Copy to component-custom.php to customize for your project.
 *
 * @version     1.0.10
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2017 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

// No direct access
defined('_JEXEC') or die('Restricted access');

// Pre-head includes
include(__DIR__ . '/php/head-pre.inc.php');
?><!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" >
<head>
<?php
// Head top includes
include(__DIR__ . '/php/head-top.inc.php');
?>
<jdoc:include type="head" />
<?php
// CSS includes
include(__DIR__ . '/php/css.inc.php');

// JavaScript includes
include(__DIR__ . '/php/js.inc.php');

// Favicons includes
include(__DIR__ . '/php/favicon.inc.php');

// Head bottom includes
include(__DIR__ . '/php/head-bottom.inc.php');
?>
</head>
<?php
// Pre-body includes
include(__DIR__ . '/php/body-pre.inc.php');
?>
<body class="<?php echo implode(' ', $body_classes); ?>">
<?php
// Body top includes
include(__DIR__ . '/php/body-top.inc.php');
?>
<jdoc:include type="message" />
<jdoc:include type="component" />
<?php
// Body bottom includes
include(__DIR__ . '/php/body-bottom.inc.php');
?>
</body>
</html>
