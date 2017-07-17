<?php 
/**
 * head-top.inc.php - Includes for top of <head> tag
 *
 * @version     1.0.3
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2017 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */
?>
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<?php 
// Adds search engine domain validation strings to home page only
if($home) {
	echo $this->params->get('google_site_verification') ? '<meta name="google-site-verification" content="' . htmlentities($this->params->get('google_site_verification')) . '" />' . "\n" : '';
	echo $this->params->get('msvalidate') ? '<meta name="msvalidate.01" content="' . htmlentities($this->params->get('msvalidate')) . '" />' . "\n" : '';
	echo $this->params->get('p_domain_verify') ? '<meta name="p:domain_verify" content="' . htmlentities($this->params->get('p_domain_verify')) . '"/>' . "\n" : '';
	echo '<link href="' . JURI::root() . '" rel="canonical" />' . "\n";
} 
// Add og:title and og:description tags if not already set
if(!$doc -> getMetaData('og:title')) $doc->addCustomTag('<meta property="og:title" content="' . htmlentities($doc -> getTitle()) . '" />');
if(!$doc -> getMetaData('og:description')) $doc->addCustomTag('<meta property="og:description" content="' . htmlentities($doc -> getDescription()) . '" />');
?>