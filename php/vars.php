<?php
/**
 * vers.php - Initialize variables
 *
 * @version     2.3.2
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
$cdnjs_url = 'https://cdnjs.cloudflare.com/ajax/libs/';

// Check if we are on the home page
$home = false;
$menu = $app -> getMenu();
if($menu -> getActive() == $menu -> getDefault($menu -> getActive() -> language)){
	$home = true;
}
