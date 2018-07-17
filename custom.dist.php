<?php
/**
 * index-custom.dist.php - Sample custom index template file. Copy to index-custom.php for your custom project.
 *
 * @version     2.0.0
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

// No direct access
defined('_JEXEC') or die('Restricted access');

// Pre-head includes
include(__DIR__ . '/php/head-pre.php');

?><!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" >
<head>
<?php
// Head top includes
include(__DIR__ . '/php/head-top.php'); 
?>
<jdoc:include type="head" />
<?php
// CSS includes
include(__DIR__ . '/php/css.php');

// JavaScript includes
include(__DIR__ . '/php/js.php');

// Favicons include
include(__DIR__ . '/php/favicon.php');
?>
<jdoc:include type="modules" name="head-scripts" />
</head>
<?php
// Pre-body includes
include(__DIR__ . '/php/body-pre.php');
?>
<body class="<?php echo implode(' ', $body_classes); ?>">
<script>
lqx.ready(<?php echo json_encode($lqx_options); ?>);
</script>
<?php
// if blank-page parameter is set to true, only the component will be output
if($this->params->get('blank_page',0) != 0 && JFactory::getApplication() -> input-> get('tmpl') != 'component') :  ?>
<header>
	
	<?php if($this->countModules('header')): ?>
	<jdoc:include type="modules" name="header" />
	<?php endif; ?>

	<?php if($this->countModules('nav-header')): ?>
	<nav>
		<jdoc:include type="modules" name="nav-header" />
	</nav>
	<?php endif; ?>

</header>

<main>

	<jdoc:include type="message" />

	<?php if($this->countModules('top')): ?>
	<section class="top">
		<jdoc:include type="modules" name="top" />
	</section>
	<?php endif; ?>

	<?php if($this->countModules('left')): ?>
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

	<?php if($this->countModules('right')): ?>
	<aside class="right">
		<jdoc:include type="modules" name="right" />
	</aside>
	<?php endif; ?>

	<?php if($this->countModules('bottom')): ?>
	<section class="bottom">
		<jdoc:include type="modules" name="bottom" />
	</section>
	<?php endif; ?>
	
</main>

<footer>

	<?php if($this->countModules('footer')): ?>
	<jdoc:include type="modules" name="footer" />
	<?php endif; ?>

	<?php if($this->countModules('nav-footer')): ?>
	<nav>
		<jdoc:include type="modules" name="nav-footer" />
	</nav>
	<?php endif; ?>

</footer>
<?php else:  // output a "blank" page (component only) ?>
<jdoc:include type="message" />
<jdoc:include type="component" />
<?php endif; // endif for blank page ?>
<?php
// Body bottom includes
include(__DIR__ . '/php/body-bottom.php');
?>
</body>
</html>
