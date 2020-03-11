<?php
/**
 * message.php - Custom system messages rendering
 *
 * @version     1.0.10
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2017 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

// No direct access
defined('_JEXEC') or die;

function renderMessage($msgList) {
	$buffer  = null;

	if (is_array($msgList)) {
		$buffer .= '<div id="system-message">';
		foreach ($msgList as $type => $msgs) {
			if (count($msgs)) {
				$buffer .= '<div class="alert alert-' . strtolower($type) . '">';
				$buffer .= '<a class="close" data-dismiss="alert">&#x2715;</a>';
				$buffer .= '<h4>' . JText::_($type) . '</h4>';
				foreach ($msgs as $msg) {
					$buffer .= '<p>' . $msg . '</p>';
				}
				$buffer .= '</div>';
			}
		}

		$buffer .= '</div>';
		return $buffer;
	}
}
