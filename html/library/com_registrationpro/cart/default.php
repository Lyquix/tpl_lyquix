<?php
defined('_JEXEC') or die('Restricted access');

JHTML::_('behavior.tooltip');
JHTML::_('behavior.modal' );
JHTML::_('behavior.calendar');
$registrationproHelper = new registrationproHelper;
$registrationproHelper->add_regpro_frontend_scripts(array('regpro'),array());

$document = JFactory::getDocument();

//add css and js to document
$document->addScript(REGPRO_BASE_URL.'/assets/javascript/formcheck/lang/en.js');
$document->addScript(REGPRO_BASE_URL.'/assets/javascript/formcheck/formcheck.js');
$document->addStyleSheet(REGPRO_BASE_URL.'/assets/javascript/formcheck/theme/classic/formcheck.css');
?>
<script language="javascript">
	var $fvalidate_flag = 0;

	function remove_cart_session_item(sid,eid) {
		var f = document.cartform;
		f.action.value 		= 'remove_cart_session_item';
		f.session_id.value 	= sid;
		f.event_id.value 	= eid;
		f.submit();
	}


	function remove_cart_item(tid,eid) {
		var f = document.cartform;
		f.action.value 		= 'remove_cart_item';
		f.ticket_id.value 	= tid;
		f.event_id.value 	= eid;
		f.submit();
	}

	function cart_qty_update(tid,eid) {
		var f = document.cartform;
		f.action.value = 'update_cart_qty';
		f.ticket_id.value 	= tid;
		f.event_id.value 	= eid;
		f.submit();
	}

	function update_cart() {
		var f = document.cartform;
		f.action.value = 'update_cart';
		f.submit();
	}

	function frm_cart_submit()
	{
		var f = document.cartform;

		if(f.coupon_code.value == ""){
			alert("<?php echo JText::_('EVENT_CART_MSG_COUPON_EMPTY'); ?>");
			return false;
		}

		update_cart();
		return false;
	}
	 window.addEvent('domready', function(){
		new FormCheck('regproDetails');
	 });

	 function onformsubmit()
	 {
	 }

	function check(checkbox, submit) {
		if(document.regproDetails.agrement.checked == true){
			submit.disabled = false;
		} else {
			submit.disabled = true;
			//alert("Please check terms and condition");
			return false;
		}
	}
</script>



<h1><?php echo JText::_('EVENT_CART_HEADING'); ?></h1>

<div id="ajaxmessagebox_frontend"></div>





<div class="event-cart">
<?php
if($this->cart) {

	if(!empty($this->cart['error_message'])) echo "<div class='alert alert'>",$this->cart['error_message'],"</div>";

	if(!empty($this->cart['success_message'])) echo "<div class='alert alert-success'>",$this->cart['success_message'],"</div>";

?>
	<div id="listcart">
	<?php

		if($this->row->message != "") echo '<div class="alert alert">'.$this->row->message.'</div>'; // error message

		// display event discount message if applied
		if(is_array($this->cart['event_discounts']) && count($this->cart['event_discounts'] > 0)) discount_message($this->cart, $this->regproConfig);
		// end

		// display cart
		tickets_cart($this->cart, $this->row, $this->regproConfig, $this->cart_form_action);

		//check terms and conditions for all events
		$this->row->terms_conditions = $this->checktermsandconditions($this->cart['eventids']);

		// display forms
		manage_registration_form($this->cart, $this->row, $this->regproConfig, $this->action);
	?>
	</div>
<?php
}
else {
?>
	<p><?php echo JText::_('EVENT_CART_MSG_EMPTY'); ?></p>
<?php
}
?>
</div>










<?php
/* BEGIN functions for this view */
/* ***************************** */


function tickets_cart($cart, $row, $regproConfig, $from_action)
{
	global $Itemid;
	/*$session = &JFactory::getSession();
	$cart =& $session->get('cart');*/
	//echo"<pre>";print_r($row);
	//echo"<pre>";print_r($cart);	exit;

	$arr_qty = range(1, $regproConfig['quantitylimit']);
	$tkt_qty = 0;
	//echo"<pre>";print_r($arr_qty);

?>
			<form name="cartform" id="cartform" action="<?php echo $from_action; ?>" method="post" onsubmit="return frm_cart_submit();">
			<?php
			// loop to arrange all the tickets event wise
			foreach($cart['eventids'] as $ekey => $evalue){ ?>
				<h3><?php echo ucfirst(registrationproHelper::getEventName($evalue)); ?></h3>
				<table border="0" cellpadding="5" cellspacing="0" width="100%" class="cart-event-tickets">
					<thead>
						<tr>
							<th class="item">Item</th>
							<th class="price">Price</th>
							<th class="tax">Tax</th>
							<th class="qty">Qty</th>
							<th class="total">Total</th>
							<th class="remove">Remove</th>
						</tr>
					</thead>
					<tbody>
				<?php
				foreach($cart['ticktes'] as $tkey=>$tvalue) {

					if($evalue == $tvalue->regpro_dates_id) {

						if ( $tvalue->qty > 1 && $showbox == 1) $showbox = 1;else $showbox = 0;

						if($tvalue->product_quantity > 0){
							// check if ticket quantity is avaliable or not
							$ticket_avaliable_qty = $tvalue->product_quantity - $tvalue->product_quantity_sold;

							$tkt_qty = range(1, $ticket_avaliable_qty);
						}
						else $tkt_qty = $arr_qty;

			?>
						<tr>
							<td class="item"><?php echo $cart['ticktes'][$tkey]->product_name; ?></td>
							<td class="price"><?php echo $cart['currency_sign'].number_format($cart['ticktes'][$tkey]->product_price,2); ?></td>
							<td class="tax"><?php echo $cart['currency_sign'].number_format($cart['ticktes'][$tkey]->tax_price,2); ?></td>
							<td class="qty"><select name="qty[<?php echo $cart['ticktes'][$tkey]->id; ?>]" onchange="return cart_qty_update(<?php echo $cart['ticktes'][$tkey]->id; ?>);" style="width:55px;">
							<?php
								foreach($tkt_qty as $qkey => $qvalue)
								{
									if($cart['ticktes'][$tkey]->qty == $qvalue){
										$selected = "selected";
									}else{
										$selected = "";
									}
							 ?>
									<option value="<?php echo $qvalue;?>" <?php echo $selected; ?>><?php echo $qvalue;?></option>
							 <?php
								}
							 ?>
							</select></td>
							<td class="total"><?php echo $cart['currency_sign'].number_format($cart['ticktes'][$tkey]->total_amount,2); ?></td>
							<td class="remove"><a href="javascript: void(0);" onclick="return remove_cart_item(<?php echo $cart['ticktes'][$tkey]->id; ?>,<?php echo $cart['ticktes'][$tkey]->regpro_dates_id; ?>);"><img src="/templates/pbf/images/trash.png" border="0" alt="<?php echo JText::_('EVENT_CART_TICKETS_BTN_REMOVE'); ?>" title="<?php echo JText::_('EVENT_CART_TICKETS_BTN_REMOVE'); ?>" /></a></td>
						</tr>
			<?php
					}
				}

			}
			?>
					</tbody>
				</table>

			<?php
			if($regproConfig['enable_discount_code'] == 1) { ?>
				<div class="discount-coupon">
					<strong>Coupon Code:</strong>
					<input type="text" name="coupon_code" value="" size="10" />
					<input type="submit" class="button" value="Apply Coupon"/>
				</div>
			<?php
			}
			?>
				<table border="0" cellpadding="5" cellspacing="0" class="cart-total">
					<tbody>
						<?php
						if($cart['discount'] > 0 || $cart['group_discount'] > 0 || $cart['early_discount'] > 0) {
						?>
								<tr>
									<th><?php echo JText::_('EVENT_CART_TICKETS_LBL_SUBTOTAL'); ?>:</th>
									<td><?php echo $cart['currency_sign'].number_format($cart['sub_total'],2); ?></td>
								</tr>
						<?php
						}
						if($cart['discount'] > 0) {
						?>
								<tr>
									<th><?php echo JText::_('EVENT_CART_TICKETS_LBL_DISCOUNT'); ?>:</th>
									<td><?php echo '-'. $cart['currency_sign'].number_format($cart['discount'],2); ?></td>
								</tr>
						<?php
						}
						if($cart['group_discount'] > 0 || $cart['early_discount'] > 0){
						?>
								<tr>
									<th><?php echo JText::_('EVENT_CART_TICKETS_LBL_DISCOUNT'); ?>:</th>
									<td><?php echo ' - '.$cart['currency_sign'].number_format($cart['both_discounts'],2); ?></td>
								</tr>
						<?php
						}
						?>
						<tr>
							<th><?php echo JText::_('EVENT_CART_TICKETS_HEAD_TOTAL'); ?>:</th>
							<td><?php echo $cart['currency_sign'].number_format($cart['grand_total'],2); ?></td>
						</tr>
					</tbody>
				</table>
				<input type="hidden" name="action" value="" />
				<input type="hidden" name="ticket_id" value="" />
				<input type="hidden" name="event_id" value="" />
				<input type="hidden" name="did" value="<?php echo $row->did; ?>" />
				<input type="hidden" NAME="Itemid" value="<?php echo $Itemid ; ?>">
			</form>
			<div class="clr"></div>
	<?php
	if($regproConfig['multiple_registration_button'] == 1) { ?>
			<p><a href="<?php echo JRoute::_('index.php?option=com_registrationpro&view=events&Itemid='.$Itemid); ?>">Register for multiple events</a></p>
	<?php
	}
}

// Manage registration form
function manage_registration_form($cart, $row, $regproConfig, $form_action) {
		global $Itemid;

		$database	= JFactory::getDBO();
		$my	= JFactory::getUser();
	?>
		<form name="regproDetails" id="regproDetails" class="fValidator-form" action="<?php echo $form_action; ?>" method="post" enctype="multipart/form-data">
		<?php

		if($cart) {
			//display form data here
				//loop ticket first display batch fields
				$total_qty = 0;

				//there is check for ticket quantities
				$total_qty = $cart['total_tqty'];

				if(!empty($total_qty)){ ?>
					<h3>Registration Forms</h3>
					<div id="errors"></div>
				<?php
				}


				######### Start Registration forms #################
					$formcounter = 0;
					// loop to arrange all the tickets event wise
					foreach($cart['eventids'] as $ekey => $evalue){

						//$formcounter = 0;
						foreach($cart['ticktes'] as $tkey=>$tvalue){

							if($cart['ticktes'][$tkey]->type == "E" && $evalue == $cart['ticktes'][$tkey]->regpro_dates_id){

								$groupregistration = 0;

								// get form id to get the form and fields data for every ticket
								$formid = registrationproHelper::getEventFormId($cart['ticktes'][$tkey]->regpro_dates_id);

								// get form and fields according to event id
								$form_model = new regpro_forms($formid);
								$fields 	= $form_model->getFields();

								// get event date
								$event_date = registrationproHelper::getEventInfo($cart['ticktes'][$tkey]->regpro_dates_id);
								$event_date = registrationproHelper::getFormatdate($regproConfig['formatdate'], $event_date->dates);

								$showMandatoryNotice = false;

								if($regproConfig['cbintegration'] == 1){
									// Check CB Integration setting and get CB data
									if(registrationproHelper::chkCB() && !empty($my->id)){
										$fields		= $form_model->getCBfields();
										$cb_exists	= 1;
									}
								}elseif($regproConfig['cbintegration'] == 2) {
									// Check Joomsocial Integration setting and get joomfish fields data
									if(registrationproHelper::chkJoomsocial() && !empty($my->id)){
										$fields		= $form_model->getJoomsocialfields();
										$cb_exists	= 1;
									}
								}else{
									$cb_exists	= 0;
								}
								// end

								if(is_array($cart['groupregistrations']) && count($cart['groupregistrations']) > 0 ){
									foreach($cart['groupregistrations'] as $gkey => $gvalue){
										if($gvalue == $cart['ticktes'][$tkey]->regpro_dates_id){
											$groupregistration = 1;
										}
									}
								}

								//echo "<pre>";print_r($fields); exit;

								//if($cart['allowgroup'] == 1){
								if($groupregistration == 1){ ?>
									<p><strong><?php echo ucwords($cart['ticktes'][$tkey]->product_name); ?></strong> &mdash;
									<em><?php echo $event_date; ?></em></p>
									<table border="0" cellpadding="5" cellspacing="0" width="100%" class="event-cart-form">
									<?php
									foreach ($fields as $key=>$field){
										if ($field->validation_rule) {
											$showMandatoryNotice = true;
											$checkFields[$field->validation_rule][] = $field->name;
										}

										// get the title of CB filed and assign to form element for display proper titie in reports and confirmation emails
										if($field->cbfeild_id > 0){
											$field->name = getLangDefinition($field->title);
										}
										// end

										if($cart["ticktes"][$tkey]->id <= 0){
											$cart["ticktes"][$tkey]->id = date('jnis');
										}

										regpro_forms_html::parseFields($field,'['.$cart["ticktes"][$tkey]->id.']',$row->form[$field->name][$payment_details->id][$i],$formcounter,$cart['ticktes'][$tkey]->id);
									}
									?>
									<input type="hidden" name="form[regpro_event_id][][<?php echo $cart["ticktes"][$tkey]->id; ?>]" value="<?php echo $cart["ticktes"][$tkey]->regpro_dates_id; ?>"/>
									<input type="hidden" name="users_tickets[ticket_ids][][0]" value="<?php echo $cart["ticktes"][$tkey]->id; ?>"/>
									<?php
									//break;
									$formcounter++;
								}
								else{
									?>
									<p><strong><?php echo ucwords($cart['ticktes'][$tkey]->product_name); ?></strong> &mdash;
									<em><?php echo $event_date; ?></em></p>
									<table border="0" cellpadding="5" cellspacing="0" width="100%" class="event-cart-form">
									<?php
									for($i=0;$i<$cart['ticktes'][$tkey]->qty;$i++){
										?>
										<tr>
											<td colspan="2" class="attendee_heading">Attendee #<?php echo $formcounter+1; ?></td>
										</tr>
										<?php
										foreach ($fields as $key=>$field){
											if ($field->validation_rule) {
												$showMandatoryNotice = true;
												$checkFields[$field->validation_rule][] = $field->name;
											}

											// get the title of CB filed and assign to form element for display proper titie in reports and confirmation emails
											if($field->cbfeild_id > 0){
												$field->name = getLangDefinition($field->title);
											}
											// end

											regpro_forms_html::parseFields($field,$conditional_fields,'['.$cart["ticktes"][$tkey]->id.']',$row->form[$field->name][$payment_details->id][$i],$formcounter,$cart['ticktes'][$tkey]->id,$k);
										}
										if($formcounter == 0 && $cart['ticktes'][$tkey]->qty > 1) {
											echo '<tr><td></td><td colspan="2"><span class="copyattendees">Copy to all attendees</span></td></tr>';
										}
									?>
									<input type="hidden" name="form[regpro_event_id][][<?php echo $cart["ticktes"][$tkey]->id; ?>]" value="<?php echo $cart["ticktes"][$tkey]->regpro_dates_id; ?>"/>
									<input type="hidden" name="users_tickets[ticket_ids][][<?php echo $i; ?>]" value="<?php echo $cart["ticktes"][$tkey]->id; ?>"/>
									<?php
										$formcounter++;
									}
								}
								?>
								</table>
								<script>
								// function to copy first attendee info to all attendees
								jQuery(document).ready(function(){
									if(jQuery('span.copyattendees').length>0){
										jQuery('span.copyattendees').click(function(){
											jQuery('form#regproDetails input[type=text]').each(function(){
												var matches = this.name.match(/(.*?)\[(.*)\]\[(.*)\]\[(.*)\]/);
												if(matches[3]!=0){
													this.value = jQuery('input[name="'+matches[1]+'['+matches[2]+']'+'[0]'+'['+matches[4]+']"]').val();
												}
											});
											jQuery('form#regproDetails select').each(function(){
												var matches = this.name.match(/(.*?)\[(.*)\]\[(.*)\]\[(.*)\]/);
												if(matches[3]!=0){
													jQuery(this).val(jQuery('select[name="'+matches[1]+'['+matches[2]+']'+'[0]'+'['+matches[4]+']"] option:selected').val());
												}
											});
										});
									}
								});
								</script>
								<?php

							}
						}
					}
				############# End Registration forms section #################

				?><p><strong>Note:</strong> all fields marked with <span style="color:red">*</span> are mandatory</p><?php

				echo '<input type="hidden" name="quantity" value="'.$total_qty.'">';
				// show payment method list
				//if($cart['grand_total'] > 0){
				/*if($cart['free_event'] == 0){
					echo '<div class="event-payment-methods">';
					if($regproConfig['multiple_registration_button'] == 1) {
						regpro_html::list_payment_methods();
					}
					else{
						regpro_html::list_event_payment_methods($cart['event_payment_method']);
					}
					echo '</div>';
				}*/
				// end
				?>

			<?php if($row->allowgroup == 1){ ?>
			<input type="hidden" NAME="allowgroupregistration" id="allowgroupregistration" value="1">
			<?php } ?>
			<input type="hidden" NAME="Itemid" value="<?php echo $Itemid ; ?>">
			<input type="hidden" NAME="rdid" value="<?php echo $row->did ; ?>">
			<input type="hidden" NAME="func" value="details">
			<input type="hidden" name="notify" checked value="1">
			<input type="hidden" name="step" value="3">
			<input type="hidden" name="did" value="<?php echo $row->did;?>"></td>

			<?php

				if($regproConfig['event_terms_and_conditions'] == 1){

					if(!empty($row->terms_conditions)){
						$eventids = implode(",",$cart['eventids']);
						?>
						<p><label><input type="checkbox" name="agrement" onClick="check(this, document.regproDetails.submit)" /> I accept the <a href="void(0);" onclick="window.open('<?php echo JRoute::_('index.php?option=com_registrationpro&view=event&tmpl=component&layout=terms_and_conditions&eventids='.$eventids); ?>','','width=500, height=500, scrollbars=1,resizable=0,menubar=0,toolbar=0,status=0'); return false;">Terms and Conditions</a></label></p>
						<?php
					}
					else{
					?>
						<p><label><input type="checkbox" name="agrement" onClick="check(this, document.regproDetails.submit)" /> I accept the Terms and Conditions</label></p>
					<?php
					}
				}
			?>

			<tr>
				<td colspan="3" height="4px"><img src="<?php echo REGPRO_IMG_PATH; ?>/blank.png" border="0" /></td>
			</tr>

			<tr>
				<td align="left" colspan="2">
					<?php if($regproConfig['event_terms_and_conditions'] == 1){ ?>
						<input type="submit" name="submit" class="regpro_button" disabled="disabled" value="Continue"></td>
					<?php }else{ ?>
						<input type="submit" name="submit" class="regpro_button" value="Continue"></td>
					<?php }?>
				<td>&nbsp;</td>
			</tr>
			</table>
	<?php
		}
	?>
		</form>
<?php
}

// notification box for early/group discount box
function discount_message($cart, $regproConfig)
{
	$registrationproHelper = new registrationproHelper;
	foreach($cart['ticktes'] as $tkey => $tvalue)
	{
		if(count($tvalue->event_discount_id) > 0){
			foreach($tvalue->event_discount_id as $tdkey => $tdvalue)
			{
				foreach($cart['event_discounts'] as $dkey => $dvalue)
				{
					if($tdvalue == $dvalue->id && $dvalue->discount_name == "G"){
?>
						<div class="alert alert-success">
							<?php
								echo sprintf(JText::_('EVENTS_GROUP_DISCOUNT_MESSAGE'),$tvalue->product_name);
							?>
							<?php
								if($dvalue->discount_type == 'A'){
									echo $regproConfig['currency_sign'].$dvalue->discount_amount;
								}else{
									echo $dvalue->discount_amount." %";
								}
							?>
						</div>
<?php
					}

					if($tdvalue == $dvalue->id && $dvalue->discount_name == "E"){
?>
						<div class="regpro_outline">
						<div class="alert alert-success">
							<?php echo sprintf(JText::_('EVENTS_EARLY_DISCOUNT_MESSAGE'),$tvalue->product_name); //echo JText::_('EVENTS_EARLY_DISCOUNT_MESSAGE')." "; ?>
							<?php
								if($dvalue->discount_type == 'A'){
									echo $regproConfig['currency_sign'].$dvalue->discount_amount;
								}else{
									echo $dvalue->discount_amount." %";
								}
							?>
						</div>
						</div>
<?php
					}
				}
			}
		}
	}
}
/* END functions for this view */
/* *************************** */
?>