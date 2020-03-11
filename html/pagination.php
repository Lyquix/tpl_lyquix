<?php
/**
 * pagination.php - Custom pagination rendering
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

function pagination_list_footer($list){
	$html .= '<div class="pagination">';
	$html .= '<div class="pageslinks">' . $list['pageslinks'] . '</div>';
	$html .= '<div class="pagescounter">Page <span class="currpage">' . (1 + $list['limitstart'] / $list['limit']) . '</span> of <span class="totalpages">' . ceil($list['total'] / $list['limit']) . '</span></div>';
	$html .= '</div>';
	return $html;
}

function pagination_list_render($list){
	// Calculate to display range of pages
	$currentPage = 1;
	$range = 1;
	$step = 5;
	foreach ($list['pages'] as $k => $page){
		if (!$page['active']){
			$currentPage = $k;
		}
	}
	if ($currentPage >= $step){
		if ($currentPage % $step == 0){
			$range = ceil($currentPage / $step) + 1;
		}
		else{
			$range = ceil($currentPage / $step);
		}
	}

	$html = '<ul>';
	$html .= $list['start']['data'];
	$html .= $list['previous']['data'];

	foreach ($list['pages'] as $k => $page){
		if (in_array($k, range($range * $step - ($step + 1), $range * $step))){
			if (($k % $step == 0 || $k == $range * $step - ($step + 1)) && $k != $currentPage && $k != $range * $step - $step){
				$page['data'] = preg_replace('#(<a.*?>).*?(</a>)#', '$1...$2', $page['data']);
			}
		}

		$html .= $page['data'];
	}

	$html .= $list['next']['data'];
	$html .= $list['end']['data'];

	$html .= '</ul>';
	return $html;
}

function pagination_item_active(&$item){

	if ($item->text == JText::_('JLIB_HTML_START')){
		$class = 'first';
	}

	if ($item->text == JText::_('JPREV')){
		$class = 'prev';
	}

	if ($item->text == JText::_('JNEXT')){
		$class = 'next';
	}

	if ($item->text == JText::_('JLIB_HTML_END')){
		$class = 'last';
	}

	if(!isset($class))	{
		$display = $item->text;
		$class = 'page';
	}

	return '<li class="active ' . $class . '"><a href="' . $item->link . '">' . $display . '</a></li>';
}

function pagination_item_inactive(&$item) {

	if ($item->text == JText::_('JLIB_HTML_START')){
		$class = 'first';
	}

	if ($item->text == JText::_('JPREV')){
		$class = 'prev';
	}

	if ($item->text == JText::_('JNEXT')){
		$class = 'next';
	}

	if ($item->text == JText::_('JLIB_HTML_END')){
		$class = 'last';
	}

	if(!isset($class))	{
		$display = $item->text;
		$class = 'page';
	}

	return '<li class="inactive ' . $class . '">' . $display . '</li>';

}

