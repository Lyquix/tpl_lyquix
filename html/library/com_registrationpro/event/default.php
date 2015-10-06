<?php
// no direct access
defined('_JEXEC') or die('Restricted access');
?>
<script language="javascript">
	function checkchkbox(script) {		
		var total_products_qty = 0;
		
		if(script == 0){
			var i,j=0,k=0;
			var count = document.regproDetails.elements.length;
			for(i=0;i<count;i++){
				var element = document.regproDetails.elements[i];
				if(element.type == "checkbox" && element.id == "chkIDs"){									
					j = eval(j+1);
					if(element.checked == false){
						k = eval(k+1);
					}
					
					// This condition for calcualte the total selected tickets for maxattendance validation
					if(element.id == "chkIDs" && element.checked == true){
						total_products_qty = parseInt(total_products_qty) + parseInt(document.regproDetails.elements["product_qty["+element.value+"]"].value);
					}
					// end	
				}
			}
	
			if(j == k){
				alert("<?php echo JText::_('PLEASE_SELECT_REGISTRATION_OPTION'); ?>");
				if(document.getElementById("chkIDs"))
					document.getElementById("chkIDs").focus();
				return false;
			}
		}
		else{
		
			var i,j=0,k=0;
			var count = document.regproDetails.elements.length;
						
			for(i=0;i<count;i++){
				var element = document.regproDetails.elements[i];
				if(element.type == "checkbox"){
					if(element.id == "chkIDs" || element.id == "chkIDs_add"){									
						j = eval(j+1);
						if(element.checked == false){
							k = eval(k+1);
						}
						
						// This condition for calcualte the total selected tickets for maxattendance validation
						if(element.id == "chkIDs" && element.checked == true){
							total_products_qty = parseInt(total_products_qty) + parseInt(document.regproDetails.elements["product_qty["+element.value+"]"].value);
						}
						// end
					}
				}
			}
				
			if(j == k){
				alert("<?php echo JText::_('PLEASE_SELECT_ANY_OPTION'); ?>");
				if(document.getElementById("chkIDs"))
					document.getElementById("chkIDs").focus();
				return false;
			}						
		}
						
		// Max attendance validation check
		var availabelSheet	= document.getElementById("availablesheet").value;

		if(availabelSheet!='U'){
			if(total_products_qty > availabelSheet && availabelSheet > 0)
			{
				alert(availabelSheet+'<?php echo JText::_('TOTAL_AVALIABLE_SEATS'); ?>');
				return false;
			}
        }
		// End		
	}					
</script>
<?php
$date = '';		
if($this->row->enddates!=$this->row->dates){
	//format for more than 1 day events
	$date = 	registrationproHelper::getFormatdate($this->regproConfig['formatdate'], $this->row->dates).' '.
			registrationproHelper::getFormatdate($this->regproConfig['formattime'], $this->row->times).'<br />'.
			registrationproHelper::getFormatdate($this->regproConfig['formatdate'], $this->row->enddates).' '.
			registrationproHelper::getFormatdate($this->regproConfig['formattime'], $this->row->endtimes);
}
else{
	//format for 1 day events
	$date = 	registrationproHelper::getFormatdate($this->regproConfig['formatdate'], $this->row->dates).'<br />'.
			registrationproHelper::getFormatdate($this->regproConfig['formattime'], $this->row->times).' - '.
			registrationproHelper::getFormatdate($this->regproConfig['formattime'], $this->row->endtimes);
}
$link = JRoute::_('index.php?option=com_registrationpro&amp;view=event&amp;Itemid='. $this->Itemid .'&amp;did='.$this->row->id);
$title = $this->row->titel;
$venue = $this->row->club;
$url = $this->row->url;
$street = $this->row->street;
$citystate = $this->row->city;
$zip = $this->row->plz;
$country = $this->row->country ? $this->row->country : 'US';
$desc = $this->row->datdescription;
$reg_max = $this->row->max_attendance;
$reg_curr = $this->row->registered;
$reg_avail = $this->row->avaliable;
$currency = $this->regproConfig['currency_sign'];

// Run content plugins on description
$article = new JObject();
$article->text = $desc;
$dispatcher = JDispatcher::getInstance();
JPluginHelper::importPlugin( 'content' );
$results = $dispatcher->trigger('onPrepareContent', array (& $article, array(), 0));
$desc=  $article->text; 
?>
<h1><?php echo ucwords($this->row->titel); ?></h1>
<div class="events-icons">
	<?php if(!empty($tickets)): ?><div class="registration"><a href="#registration" class="readmore">Register Now</a></div><?php endif; ?>
<!--	<div class="outlook"><a href="<?php echo JRoute::_('index.php?option=com_registrationpro&view=event&layout=vcs&task=addoutlook&did='.$this->row->did.'&Itemid='.$this->Itemid); ?>">Add To Outlook Calendar</a></div>
	<div class="cart"><a href="<?php echo JRoute::_('index.php?option=com_registrationpro&controller=cart&task=cart&Itemid='.$this->Itemid); ?>">Your Cart</a></div>
	<div class="clr"></div>-->
</div>
<div class="event-details">
	<p class="date"><?php echo $date; ?></p>
	<?php if($street!='' and $citystate!='' and $zip!='' and $country!=''): ?>
	<div class="map"><a href="//maps.google.com/maps?q=<?php echo urlencode($street.', '.$citystate.', '.$zip.', '.$country); ?>" target="_blank"><img src="//maps.google.com/maps/api/staticmap?center=<?php echo urlencode($street.', '.$citystate.', '.$zip.', '.$country); ?>&zoom=16&size=300x200&maptype=roadmap&markers=size:mid%7Ccolor:orange%7C|<?php echo urlencode($street.', '.$citystate.', '.$zip.', '.$country); ?>&sensor=false" width="300" height="200" style="border:1px solid #ccc;" alt="" /></a></div>
	<?php endif; ?>
	<?php if($venue != ''): ?>
	<p><strong><?php echo $venue; ?></strong>
	<?php if($street != '') echo '<br />'.$street.'<br />'.$citystate.', '.$zip; 
	if($url != '') echo '<br /><a href="'.$url.'" target="_blank">'.$url.'</a>'; ?>
	</p>
	<?php endif; ?>
	<?php if($street!='' and $citystate!='' and $zip!='' and $country!=''): ?>
	<p><a href="//maps.google.com/maps?q=<?php echo urlencode($street.', '.$citystate.', '.$zip.', '.$country); ?>" target="_blank">Get Directions in Google Maps</a></p>
	<?php endif; ?>
	<div class="clr"></div>
</div>
<div class="event-description">
	<?php echo $desc; ?>
</div>
<div class="event-tickets">
	<a name="registration"></a>
	<form name="regproDetails" id="regproDetails"  action="<?php echo $this->action; ?>" method="post">
	<?php
	/*
	if($this->tickets && $this->row->registra && $this->row->message == "") fn_tickets_listing($this->row, $this->regproConfig, $this->tickets);
	if(is_array($this->this_event_discounts) && count($this->this_event_discounts) > 0) fn_tickets_discounts_details($this->this_event_discounts, $this->regproConfig);
	*/
	
	
	// event discount details	
	if(is_array($this->this_event_discounts) && count($this->this_event_discounts) > 0){
		fn_tickets_discounts_details($this->this_event_discounts, $this->regproConfig);
	}
	
	
	// event tickets listing
	if($this->tickets && $this->row->registra && $this->row->message == ""){
		if($this->formStatus != 0){
			fn_tickets_listing($this->row, $this->regproConfig, $this->tickets);
		}
		else{
			echo JText::_('FORMS_DISABLED'); 
		}
	}
	
	?>
	<?php echo JHTML::_( 'form.token' ); ?>	
	</form>
</div>
<?php 
if($this->row->shw_attendees==1): ?>
	<h2>Event Attendees</h2>
	<iframe src="<?php echo JRoute::_('index.php?option=com_registrationpro&view=attendees&tmpl=component&did='.$this->row->did); ?>" width="100%" name="event-attendees" frameborder="0" vspace="0" hspace="0" marginwidth="0" marginheight="0" scrolling="no" noresize></iframe>
<?php endif;


function fn_tickets_listing($row, $regproConfig, $tickets) {
	global $Itemid;
	$my = JFactory::getUser();
	$arr_qty = range(1, $regproConfig['quantitylimit']);
	if(!empty($tickets)){
		// check cart session if ticket id is already exist in the array for javascript validation
		$session = JFactory::getSession();
		$cart = $session->get('cart');
		$script_flag = 0;
		$event_tickets_avaliable = 1; // flag to display the continue button
		if(is_array($cart)){
			if(is_array($cart['ticktes'])){
				
				foreach($cart['ticktes'] as $tkey => $tvalue){
					foreach($tickets as $ttkey => $ttvalue){
						if($tvalue->type == 'E'){
							if($tvalue->id == $ttvalue->id){
								$script_flag = 1;
								$ttvalue->cart_qty = $tvalue->qty; // for minus ticket qty from cart session to calulate avaliable ticket
							}
						}
						if($tvalue->type == 'A'){
							if($tvalue->id == $ttvalue->id){
								$ttvalue->cart_qty = $tvalue->qty; // for minus ticket qty from cart session to calulate avaliable ticket
							}
						}
					}
				}
			}
		}
		// end										
		?>		
		<h2>Registration and Sponsorship Options</h2>	
		<table border="0" cellpadding="5" cellspacing="0" width="100%" class="registration-options">
			<thead>
				<tr>
					<th class="description">Description</th>
					<th class="price">Price</th>
					<th class="qty">Qty</th>
					<th class="add">Add</th>
				</tr>
			</thead>
			<tbody>
			<?php
				$flag_add = 0;					
				$tkt_qty = 0;
				$ticket_avaliable_flag = 0;
				$event_ticket_total_records = 0;
				foreach ($tickets as $product){
					if($product->type == "E"){	
						
						$event_ticket_total_records++; // count total event tickets record
						
						$ticket_avaliable_qty = 0;																															
						if($product->product_quantity > 0){								
							// check if ticket quantity is avaliable or not
							$ticket_avaliable_qty = $product->product_quantity - $product->product_quantity_sold - $product->cart_qty;
							$tkt_qty = range(1, $ticket_avaliable_qty);
						}
						else{
							$ticket_avaliable_qty = 1;
							$tkt_qty = $arr_qty;
						}
						
						if($ticket_avaliable_qty > 0){
			?>							
				<tr>
					<td class="description"><strong><?php echo $product->product_name;?></strong>
						<?php if($product->product_description) echo "<br />".$product->product_description; ?>									
					</td>
					<td class="price"><?php 
							if($product->total_price==0) echo  JText::_('EVENTS_REGISTRA_FREE');
							else echo $regproConfig['currency_sign'],'&nbsp;',number_format($product->total_price,2);
						?>
					</td>
					<td class="qty"> 									
						<select name="product_qty[<?php echo $product->id; ?>]" id="product_qty">
						<?php foreach($tkt_qty as $qkey => $qvalue) { ?>
							<option value="<?php echo $qvalue;?>"><?php echo $qvalue;?></option>
						<?php } ?>
						</select>
					</td>
					<td class="add"><input type="checkbox" id="chkIDs" name="product_id[<?php echo $product->id;?>]" value="<?php echo $product->id;?>"></td>
				</tr>
				<input type="hidden" name="productids[]" id="productids[]" value="<?php echo $product->id;?>" />
			<?php
						}
						else { $ticket_avaliable_flag++ ; }
					}
					else { $flag_add = 1; }												
				}
				
				//echo $ticket_avaliable_flag;
				
				// if all tickets quantity is full, then display this message
				if($ticket_avaliable_flag ==  $event_ticket_total_records){	
					$event_tickets_avaliable = 0;				
			?>
				<tr>
					<td colspan="4" class="no-tickets"><?php echo JText::_('EVENTS_REGISTRA_NO_TICKET_AVILIABLE'); ?></td>
				</tr>
			<?php
				}
			?>
			</tbody>
		</table>
		
	<?php
	if($flag_add == 1){
	?>
		<h2>Other Event Items</h2>
		<table border="0" cellpadding="5" cellspacing="0" width="100%" class="registration-options">
			<thead>
				<tr>
					<th class="description">Description</th>
					<th class="price">Price</th>
					<th class="qty">Qty</th>
					<th class="add">Add</th>
				</tr>
			</thead>
			<tbody>
	<?php					
		$tkt_qty = 0;
		$ticket_avaliable_flag = 0;
		$additional_ticket_total_records = 0;
		foreach ($tickets as $product){
			if($product->type == "A"){
			
				$additional_ticket_total_records++; // count total additional tickets record
				
				$ticket_avaliable_qty = 0;
				if($product->product_quantity > 0){								
					// check if ticket quantity is avaliable or not
					$ticket_avaliable_qty = $product->product_quantity - $product->product_quantity_sold - $product->cart_qty;
																				
					$tkt_qty = range(1, $ticket_avaliable_qty);
				}
				else{
					$ticket_avaliable_qty = 1;
					$tkt_qty = $arr_qty;
				}	
				if($ticket_avaliable_qty > 0){													
	?>
				<tr>
					<td class="description"><strong><?php echo $product->product_name;?></strong>
						<?php if($product->product_description) echo "<br />".$product->product_description; ?>
					</td>
					<td class="price"><?php 
							if($product->total_price==0) echo  JText::_('EVENTS_REGISTRA_FREE');
							else echo $regproConfig['currency_sign'],'&nbsp;',number_format($product->total_price,2);
						?>
					</td>
					<td class="qty">								
						<select name="product_qty_add[<?php echo $product->id; ?>]">
						<?php foreach($tkt_qty as $qkey => $qvalue) { ?>
							<option value="<?php echo $qvalue;?>"><?php echo $qvalue;?></option>
						 <?php } ?>
						</select>
					</td>
					<td class="add"><input type="checkbox" id="chkIDs_add" name="product_id_add[<?php echo $product->id;?>]" value="<?php echo $product->id;?>"></td>
				</tr>					
				<input type="hidden" name="productids[]" id="productids[]" value="<?php echo $product->id;?>" />
				<?php						
				}
				else { $ticket_avaliable_flag++ ; }
			}
		}
		// if all tickets quantity is full, then display this message
		if($ticket_avaliable_flag ==  $additional_ticket_total_records){					
		?>
				<tr>
					<td colspan="4" class="no-tickets"><?php echo JText::_('EVENTS_REGISTRA_NO_TICKET_AVILIABLE'); ?></td>
				</tr>
		<?php
		}
		?>
			</tbody>
		</table>
	<?php 
	}
	if(isset($row->form)){
		if(!empty($row->form)){
			foreach ($row->form as $form_field=>$form_field_value){ ?>
				<input type="hidden" name="form[<?php echo $form_field; ?>]" value="<?php echo $form_field_value; ?>" />
			<?php
			}
		}
	}
	$gid = (int) $my->get('aid', 0);
	// Filter by access level.
	$user	= JFactory::getUser();
	$groups	= $user->getAuthorisedViewLevels();
	//echo $row->eventaccess, "<br>"; echo $gid;
	$loginmsg = JText::_('EVENTS_REGISTRA_LOGIN');
	$event_access = 1;		
	//if($row->eventaccess > 0 && empty($my->id)){									
	if($row->eventaccess > 0){		
		/*if($gid >= $row->eventaccess) $event_access = 1;
		else {				
			$event_access = 0;
			if($row->eventaccess == 2) $loginmsg = JText::_('EVENTS_REGISTRA_SPECIAL_LOGIN');						
		}*/
		if(in_array($row->eventaccess, $groups)){
			$event_access = 1;
		}
		else{				
			$event_access = 0;
			if($row->eventaccess == 3){
				$loginmsg = JText::_('EVENTS_REGISTRA_SPECIAL_LOGIN');
			}						
		}															
	}
	else $event_access = 1;
	if($event_access == 0) echo '<div class="regpro_error">'.$loginmsg.'</div>';
	else {
					
	// Group registration option
	if($row->allowgroup == 1){		
		if($row->force_groupregistration == 1){		
		?>						
		<input type="hidden" name="chkgroupregistration" id="chkgroupregistration" value="1" />
		<?php
		}
		else {
		?>		
		<p><input type="checkbox" name="chkgroupregistration" id="chkgroupregistration" value="1" /> Check if registering a group</p>
		<?php 
			}
		} 		
		if($event_tickets_avaliable > 0){ ?>
		<input type="hidden" NAME="option" value="com_registrationpro" />
		<input type="hidden" name="step" value="1" /> 										
		<input type="hidden" name="detailshow" value="No" /> 										
		<input type="hidden" name="did" value="<?php echo $row->did;?>" />
		<input type="hidden" NAME="Itemid" value="<?php echo $Itemid; ?>" />
		<input type="hidden" NAME="rdid" value="<?php echo $row->did; ?>" />
		<input type="hidden" NAME="func" value="details" />
		<input type="hidden" name="availablesheet" id="availablesheet" value="<?php echo $row->avaliable; ?>">
		<!--<input type="submit" class="regpro_button" name="submit" <?php echo $onclick; ?> value="<?php echo  JText::_('EVENTS_DETAIL_PAGE_BUTTON');?>" />-->
		<p align="right"><input type="submit" name="submit" onclick="return checkchkbox(<?php echo $script_flag; ?>);" value="Continue" /></p>
<?php
			}
		}
	}
}



function fn_tickets_discounts_details($this_event_discounts, $regproConfig) {
	$jdate 	= &JFactory::getDate(); // get date object
	
	//$current_date = $jdate->toFormat('%Y-%m-%d');
	
	$current_date = registrationproHelper::getCurrent_date("%Y-%m-%d");
	
	// group registration discount details																	
	foreach($this_event_discounts as $key=>$value){
											
		if($value->discount_name == "G"){
			
			if($gcnt > 1){ }else{ $gcnt = 1;}	
			
			if($gcnt == 1){
	?>	
	<h3><img src="/templates/pbfhome/images/label_sale.png" width="24" height="24" border="0" align="absbottom" /> Group Discounts</h3>
	<table border="0" cellpadding="5" cellspacing="0" width="100%" class="ticket-discounts">
		<thead>
			<tr>
				<th>Minimum Number of Tickets</th>
				<th>Discount per Ticket</th>
			</tr>
		</thead>
		<tbody>
	<?php	} ?>
										
			<tr>
				<td><?php echo $value->min_tickets;?></td>
				<td><?php 
				//echo number_format($value->discount_amount,2)." %";
				if($value->discount_type == 'P') echo number_format($value->discount_amount,2)." %";
				if($value->discount_type == 'A') echo $regproConfig['currency_sign']."&nbsp;".number_format($value->discount_amount,2);
				?></td>
			</tr>						
	<?php 
			$gcnt = $gcnt+1;
		}
	}
	
	if($gcnt >= 1){
	?>
		</tbody>
	</table>
			
	
	<?php
	}
			
	// early registration discount details
	foreach($this_event_discounts as $key=>$value){
					
		//if($value->discount_name == "E" && $value->early_discount_date >= date('Y-m-d')){
		if($value->discount_name == "E" && $value->early_discount_date >= $current_date){
			
			if($ecnt > 1){ }else{ $ecnt = 1;}
			
			if($ecnt == 1){
	?>		
	<h3><img src="/templates/pbfhome/images/label_sale.png" width="24" height="24" border="0" align="absbottom" /> Early Registration Discounts</h3>
	<table border="0" cellpadding="5" cellspacing="0" width="100%" class="ticket-discounts">
		<thead>
			<tr>
				<th>Register By</td>
				<th>Discount per Ticket</th>
			</tr>
		</thead>
		<tbody>
	<?php	} ?>
			<tr>
				<td><?php echo registrationproHelper::getFormatdate($regproConfig['formatdate'], $value->early_discount_date); ?></td>
				<td><?php
				if($value->discount_type == 'P') echo number_format($value->discount_amount,2)." %";
				if($value->discount_type == 'A') echo $regproConfig['currency_sign']."&nbsp;".number_format($value->discount_amount,2);
				?></td>
			</tr>	
<?php	
			$ecnt = $ecnt+1;	
		}
	}
	
	if($ecnt >= 1){
		?>
				
		</tbody>
	</table>
				
<?php
	}
}
?>