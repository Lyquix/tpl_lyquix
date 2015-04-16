<?php
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
