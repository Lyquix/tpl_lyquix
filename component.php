<?php
/**
 * component.php - Component template file, calls the project custom component template file.
 *
 * @version     2.0.0-beta-4
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

// No direct access
defined('_JEXEC') or die('Restricted access');

/**
*** NOTICE: Do not modify this file!
*** To customize your template, create a file named custom.php
*** You may rename the included file custom.dist.php
**/

if(file_exists(__DIR__ . '/custom.php')) :
	include __DIR__ . '/custom.php';
else :
?><!DOCTYPE html>
<html>
	<body>
		File <span style="font-family: monospace;"><?php echo JPATH_BASE . '/templates/' . $this->template; ?>/custom.php</span> not found.
	</body>
</html>
<?php endif; // endif for including custom.php