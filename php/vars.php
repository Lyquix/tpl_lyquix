<?php
/**
 * vers.php - Initialize variables
 *
 * @version     2.0.0-beta-4
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

$doc = JFactory::getDocument();
$app = JFactory::getApplication();
$site_abs_url = JURI::root();
$site_rel_url = JURI::root(true);
$tmpl_url = $site_rel_url . '/templates/' . $this -> template;
$tmpl_path = JPATH_BASE . '/templates/' . $this -> template;
$cdnjs_url = 'http' . (array_key_exists('HTTPS', $_SERVER) ? 's' : '') . '://cdnjs.cloudflare.com/ajax/libs/';

// Check if we are on the home page
$home = false;
if(JRequest::getVar('Itemid') == $app -> getMenu() -> getDefault() -> id){
	$home = true;
}
