<?php
// no direct access
defined('_JEXEC') or die('Restricted access');
?>
<h1><?php 
$active = JFactory::getApplication()->getMenu()->getActive();
echo $active->title;
?></h1>
<?php if($this->regproConfig['introtext']): ?>
<div class="events-intro"><?php echo $this->regproConfig['introtext']; ?></div>
<?php endif; ?>
<!--
<div class="events-icons">
	<div class="cart"><a href="<?php echo JRoute::_('index.php?option=com_registrationpro&controller=cart&task=cart&Itemid='. $this->Itemid); ?>">Your Cart</a></div>
</div>
-->
<?php
$currdate = JFactory::getDate();
$currdate = $currdate->format('Ymd');
$nextevents = '';
$pastevents = '';
echo "<!-- \n"; print_r($this); echo "\n-->\n";
// cycle through events
foreach ($this->rows as $row) {
	echo "<!-- ".$row->dates." ".$row->times." -->\n";
	$date = '';		
	if($row->enddates!=$row->dates){
		//format for more than 1 day events
		$date = 	registrationproHelper::getFormatdate($this->regproConfig['formatdate'], $row->dates).' '.
				registrationproHelper::getFormatdate($this->regproConfig['formattime'], $row->times).'<br />'.
				registrationproHelper::getFormatdate($this->regproConfig['formatdate'], $row->enddates).' '.
				registrationproHelper::getFormatdate($this->regproConfig['formattime'], $row->endtimes);
	}
	else{
		//format for 1 day events
		$date = 	registrationproHelper::getFormatdate($this->regproConfig['formatdate'], $row->dates).'<br />'.
				registrationproHelper::getFormatdate($this->regproConfig['formattime'], $row->times).' - '.
				registrationproHelper::getFormatdate($this->regproConfig['formattime'], $row->endtimes);
	}
	$link = JRoute::_('index.php?option=com_registrationpro&amp;view=event&amp;Itemid='. $this->Itemid .'&amp;did='.$row->id);
	$title = $row->titel;
	$venue = $row->club;
	$url = $row->url;
	$street = $row->street;
	$citystate = $row->city;
	$zip = $row->plz;
	$country = $row->country;
	$desc = $row->shortdescription;
	
	if(str_replace('-','',$row->dates)-$currdate>=0) {
		$event = '<div class="event"><h3><a href="'.$link.'">'.$title.'</a></h3><p class="date">'.$date.'</p>';
		if($venue != '') {
			$event .= '<p><strong>'.$venue.'</strong>';
			if($street != '') {
				$event .= '<br />'.$street.'<br />'.$citystate.', '.$zip;
			}
			if($url != '') {
				$event .= '<br /><a href="'.$url.'" target="_blank">'.$url.'</a>';
			}
			$event .= '</p>';
		}
		if($desc != '') {
			$event.= $desc;
		}
		$event .= '<a href="'.$link.'" class="readmore">View Details and Register</a></div>';
		$nextevents = $nextevents.$event;
	}
	else {
		$event = '<div class="event"><h3><a href="'.$link.'">'.$title.'</a></h3><p class="date">'.$date.'</p>';
		if($desc != '') {
			$event.= $desc;
		}
		$event .= '<a href="'.$link.'" class="readmore">View Details</a></div>';
		$prevevents = $event.$prevevents;
	}
	
}
if($nextevents): ?>
<h2>Upcoming Events</h2>
<div class="events-list"><?php echo $nextevents; ?></div>
<? endif;
if($prevevents): ?>
<h2>Past Events</h2>
<div class="events-list"><?php echo $prevevents; ?></div>
<? endif; ?>