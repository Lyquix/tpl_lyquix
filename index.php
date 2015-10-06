<?php
// No direct access
defined('_JEXEC') or die('Restricted access');

/**
*** NOTICE: Do not modify this file!
*** If you need to customize your template, create a file named custom-index.php
**/

// if custom-index.php file exists the whole template is overriden
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