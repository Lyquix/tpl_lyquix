<?php
/**
 * favicon.inc.php - Includes favicons
 *
 * @version     1.0.10
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2017 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

// use http://www.favicon-generator.org/ to generate all these versions
$favicons_sizes = [57,60,72,76,114,120,144,152,180];
foreach($favicons_sizes as $favicon_size) {
	$favicon_size = $favicon_size . 'x' . $favicon_size;
	if(file_exists($tmpl_path . '/images/favicon/apple-icon-' . $favicon_size . '.png')) {
		echo '<link rel="apple-touch-icon" sizes="' . $favicon_size . '" href="' . $tmpl_url . '/images/favicon/apple-icon-' . $favicon_size . '.png">' . "\n" ;
	}
}
if(file_exists($tmpl_path . '/images/favicon/android-icon-192x192.png')): ?>
<link rel="icon" type="image/png" sizes="192x192"  href="<?php echo $tmpl_url; ?>/images/favicon/android-icon-192x192.png">
<?php endif;
if(file_exists($tmpl_path . '/images/favicon/favicon.ico')): ?>
<link rel="shortcut icon" type="image/vnd.microsoft.icon" href="<?php echo $tmpl_url; ?>/images/favicon/favicon.ico">
<?php endif;
if(file_exists($tmpl_path . '/images/favicon/favicon-32x32.png')): ?>
<link rel="icon" type="image/png" sizes="32x32" href="<?php echo $tmpl_url; ?>/images/favicon/favicon-32x32.png">
<?php endif;
if(file_exists($tmpl_path . '/images/favicon/favicon-96x96.png')): ?>
<link rel="icon" type="image/png" sizes="96x96" href="<?php echo $tmpl_url; ?>/images/favicon/favicon-96x96.png">
<?php endif;
if(file_exists($tmpl_path . '/images/favicon/favicon-16x16.png')): ?>
<link rel="icon" type="image/png" sizes="16x16" href="<?php echo $tmpl_url; ?>/images/favicon/favicon-16x16.png">
<?php endif; ?>