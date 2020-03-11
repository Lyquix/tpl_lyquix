<?php
/**
 * index.php - Main template file, calls custom project template
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

/**
*** NOTICE: Do not modify this file!
*** If you need to customize your template, create a file named custom-index-custom.php
*** You may rename the included file index-custom.dist.php
**/

if(file_exists(__DIR__ . '/index-custom.php')) :
	include __DIR__ . '/index-custom.php';
else :
?><!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" >
	<head>
		<jdoc:include type="head" />
	</head>
	<body>
		File <span style="font-family: monospace;"><?php echo JPATH_BASE . '/templates/' . $this->template; ?>/index-custom.php</span> not found.
	</body>
</html>
<?php endif; // endif for including custom-index.php