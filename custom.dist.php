<?php
/**
 * index-custom.dist.php - Sample custom index template file. Copy to index-custom.php for your custom project.
 *
 * @version     2.4.0
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

// No direct access
defined('_JEXEC') or die('Restricted access');

// Initialize variables
require __DIR__ . '/php/vars.php';

?><!DOCTYPE html>
<html lang="<?php echo $this -> language; ?>" >
<head>
<?php
// Meta tags
require __DIR__ . '/php/meta.php';

// Prepare for Joomla head includes
require __DIR__ . '/php/head.php';
?>
<jdoc:include type="head" />
<?php
// CSS
require __DIR__ . '/php/css.php';

// JavaScript
require __DIR__ . '/php/js.php';

// Favicons
require __DIR__ . '/php/favicon.php';
?>
<jdoc:include type="modules" name="head-scripts" />
</head>
<?php
// Prepare <body> classes
require __DIR__ . '/php/body.php';
?>
<body class="<?php echo implode(' ', $body_classes); ?>">
<?php
// If blank-page parameter is set to true, only the component will be output
if($this -> params -> get('tmpl_mode', 0) == 0 && ($app -> input-> get('tmpl') == '' || $app -> input-> get('tmpl') == 'index')) :  ?>
<header>
	<?php if($this -> countModules('header')): ?>
	<jdoc:include type="modules" name="header" />
	<?php endif; ?>

	<?php if($this -> countModules('nav-header')): ?>
	<nav>
		<jdoc:include type="modules" name="nav-header" />
	</nav>
	<?php endif; ?>
</header>

<main>
	<jdoc:include type="message" />

	<?php if($this -> countModules('top')): ?>
	<section class="top">
		<jdoc:include type="modules" name="top" />
	</section>
	<?php endif; ?>

	<?php if($this -> countModules('left')): ?>
	<aside class="left">
		<jdoc:include type="modules" name="left" />
	</aside>
	<?php endif; ?>

	<?php if(!$home): ?>
	<article>
		<jdoc:include type="modules" name="before" />
		<jdoc:include type="component" />
		<jdoc:include type="modules" name="after" />
	</article>
	<?php endif; ?>

	<?php if($this -> countModules('right')): ?>
	<aside class="right">
		<jdoc:include type="modules" name="right" />
	</aside>
	<?php endif; ?>

	<?php if($this -> countModules('bottom')): ?>
	<section class="bottom">
		<jdoc:include type="modules" name="bottom" />
	</section>
	<?php endif; ?>
</main>

<footer>
	<?php if($this -> countModules('footer')): ?>
	<jdoc:include type="modules" name="footer" />
	<?php endif; ?>

	<?php if($this -> countModules('nav-footer')): ?>
	<nav>
		<jdoc:include type="modules" name="nav-footer" />
	</nav>
	<?php endif; ?>
</footer>
<?php elseif($this -> params -> get('blank_page', 0) == 1 || $app -> input-> get('tmpl') == 'component'):  // output a "blank" page (component only) ?>
<jdoc:include type="message" />
<jdoc:include type="component" />
<?php endif; // endif for blank page ?>
<?php
// Include IE alerts
require __DIR__ . '/php/ie-alert.php';
// Add body closing tag code
require __DIR__ . '/php/body-bottom.php';
?>
<jdoc:include type="modules" name="body-scripts" />
</body>
</html>
