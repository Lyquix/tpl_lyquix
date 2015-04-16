<?php
defined('_JEXEC') or die;

/**
 * This is a file to add template specific chrome to pagination rendering.
 *
 * pagination_list_footer
 * 	Input variable $list is an array with offsets:
 * 		$list[limit]		: int
 * 		$list[limitstart]	: int
 * 		$list[total]		: int
 * 		$list[limitfield]	: string
 * 		$list[pagescounter]	: string
 * 		$list[pageslinks]	: string
 *
 * pagination_list_render
 * 	Input variable $list is an array with offsets:
 * 		$list[all]
 * 			[data]		: string
 * 			[active]	: boolean
 * 		$list[start]
 * 			[data]		: string
 * 			[active]	: boolean
 * 		$list[previous]
 * 			[data]		: string
 * 			[active]	: boolean
 * 		$list[next]
 * 			[data]		: string
 * 			[active]	: boolean
 * 		$list[end]
 * 			[data]		: string
 * 			[active]	: boolean
 * 		$list[pages]
 * 			[{PAGE}][data]		: string
 * 			[{PAGE}][active]	: boolean
 *
 * pagination_item_active
 * 	Input variable $item is an object with fields:
 * 		$item->base	: integer
 * 		$item->link	: string
 * 		$item->text	: string
 *
 * pagination_item_inactive
 * 	Input variable $item is an object with fields:
 * 		$item->base	: integer
 * 		$item->link	: string
 * 		$item->text	: string
 *
 * This gives template designers ultimate control over how pagination is rendered.
 *
 * NOTE: If you override pagination_item_active OR pagination_item_inactive you MUST override them both
 */
 
function pagination_list_footer($list){
	$html .= '<div class="pagination">';
	$html .= '<div class="pageslinks">' . $list['pageslinks'] . '</div>';
	//$html .= '<div class="pagescounter">Page <span class="currpage">' . (1 + $list['limitstart'] / $list['limit']) . '</span> of <span class="totalpages">' . ceil($list['total'] / $list['limit']) . '</span></div>';
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

