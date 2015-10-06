<?php 
/**
* @version v2.6	
* @package Registration Pro Latest Events
* @copyright (C) 2009 Joomlashowroom.com
* @license GPL 2009 Joomlashowroom.com 
*/

// no direct access
defined('_JEXEC') or die('Restricted access');
if (empty($rows)) {
	echo JText::_('No Events'); 
} 
else {
	$k = 0;
	for ($i=0; $i < count( $rows ); $i++){
		if ($k < $mcount){
			$row = $rows[$i];
			//%link_start%,%link_end%,%id%, %title%, %location%, %category%, %start_date%, %start_time%, %end_date%, %end_time%, %description%, %image%, %registration_start%, %registration_stop%, %event_status%
			$format_html = $format;
			$format_html = str_replace('%link_start%',"<a href='".JRoute::_("index.php?option=com_registrationpro&Itemid=$Itemid&view=event&did=$row->id")."'>",$format_html);
			$format_html = str_replace('%link_end%','</a>',$format_html);
			$format_html = str_replace('%id%',$row->id,$format_html);
			$format_html = str_replace('%title%',$row->titel,$format_html);
			$format_html = str_replace('%location%',$row->club.', '.$row->city,$format_html);
			$format_html = str_replace('%category%',$row->catname,$format_html);
			$format_html = str_replace('%start_date%',date($formatdate,strtotime($row->dates)),$format_html);
			$format_html = str_replace('%start_time%',date($formattime,strtotime($row->times)),$format_html);
			$format_html = str_replace('%end_date%',date($formatdate,strtotime($row->enddates)),$format_html);
			$format_html = str_replace('%end_time%',date($formattime,strtotime($row->endtimes)),$format_html);
			$format_html = str_replace('%description%',$row->datdescription,$format_html);
			$format_html = str_replace('%shortdescription%',$row->shortdescription,$format_html);
			$format_html = str_replace('%image%',$row->datimage,$format_html);
			$format_html = str_replace('%registration_start%',date($formatdate,strtotime($row->regstart)),$format_html);
			$format_html = str_replace('%registration_stop%',date($formatdate,strtotime($row->regstop)),$format_html);
			$format_html = str_replace('%event_status%',JText::_('MODULE_EVENTS_STATUS_'.$row->status),$format_html);
			echo $format_html;
		}
		$k++;
	}
}
?>
<a class="readmore" href="<?php echo JRoute::_("index.php?option=com_registrationpro&Itemid=$Itemid"); ?>">View All Events</a>