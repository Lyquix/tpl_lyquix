<?php
defined('_JEXEC') or die('Restricted access');
?>
<?php
if(count( $this->rows )>0) {
	echo '<p>There are '.count($this->rows).' attendees registered for this event.</p><ul class="attendee-list">';
	$k = 0;
	for ($i=0, $n=count( $this->rows ); $i < $n; $i++) {
		$row = &$this->rows[$i];
	?>
	<li><?php echo $row->firstname.' '.$row->lastname; ?></li>
	<?php 
		$k = 1 - $k; 
	}
	echo '</ul>';
}
else echo '<p>There are no attendees registered for this event.</p>';
?>
