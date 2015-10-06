<?php
/**
 * @author     Daniel Dimitrov - compojoom.com
 * @date       : 09.07.12
 *
 * @copyright  Copyright (C) 2008 - 2012 compojoom.com . All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE
 */

defined('_JEXEC') or die('Restricted access');

$moduleId = $module->id;

if ($params->get('jquery', 1))
{
	CompojoomHtmlBehavior::jquery();
}

JHtml::_('behavior.formvalidation');
JHtml::script('media/mod_cmc/js/cmc.js');
JHtml::_('stylesheet', 'media/mod_cmc/css/cmc.css');

if ($params->get('bootstrap_form', 1))
{
	JHtml::_('stylesheet', 'media/mod_cmc/css/bootstrap-form.css');
}

$document = JFactory::getDocument();
$script = 'jQuery(document).ready(function() {
    new cmc("#cmc-signup-form-' . $moduleId . '");
});';

$document->addScriptDeclaration($script);
?>

<div id="cmc-signup-<?php echo $moduleId; ?>" class="cmc-signup">
	<div class="cmc-error alert alert-error" style="display:none"></div>
	<div class="cmc-saved" style="display:none">
		<?php echo JText::_($params->get('thankyou')); ?>
	</div>
	<form action="<?php echo JRoute::_('index.php?option=com_cmc&format=raw&task=subscription.save'); ?>" method="post"
	      id="cmc-signup-form-<?php echo $moduleId; ?>"
	      class="form-validate"
	      name="cmc<?php echo $moduleId; ?>">


		<div class="row-fluid">
			<?php $fieldsets = $form->getFieldsets('cmc'); ?>

			<?php foreach ($fieldsets as $key => $value): ?>
				<div class="span12">
					<?php $fields = $form->getFieldset($key); ?>

					<?php foreach ($fields as $field) : ?>
						<div class="control-group">
							<div class="control-label">
								<?php echo $field->label; ?>
							</div>
							<div class="controls">
								<?php echo $field->input; ?>
							</div>
						</div>
					<?php endforeach; ?>
				</div>
			<?php endforeach; ?>
		</div>

		<div class="row-fluid">
			<?php $fieldsets = $form->getFieldsets('cmc_groups'); ?>
			<?php foreach ($fieldsets as $key => $value) : ?>
				<div class="span12">

					<?php $fields = $form->getFieldset($key); ?>

					<?php foreach ($fields as $field) : ?>
						<div class="control-group">
							<div class="control-label">
								<?php echo $field->label; ?>
							</div>
							<div class="controls">
								<?php echo $field->input; ?>
								<?php if ($field->fieldname == 'EMAIL') : ?>
									<div class="help-inline alert alert-error cmc-exist hide">
										<?php echo JText::sprintf('MOD_CMC_YOU_ARE_ALREADY_SUBSCRIBED', ''); ?>
										<a href=""><?php echo JText::_('MOD_CMC_CLICK_HERE_TO_UPDATE'); ?></a>
									</div>
								<?php endif; ?>
							</div>
						</div>
					<?php endforeach; ?>
				</div>
			<?php endforeach; ?>
		</div>

		<div class="row-fluid">
			<?php $fieldsets = $form->getFieldsets('cmc_interests'); ?>
			<?php foreach ($fieldsets as $key => $value) : ?>
				<div class="span12">

					<?php $fields = $form->getFieldset($key); ?>

					<?php foreach ($fields as $field) : ?>
						<div class="control-group">
							<div class="control-label">
								<?php echo $field->label; ?>
							</div>
							<div class="controls">
								<?php echo $field->input; ?>
							</div>
						</div>
					<?php endforeach; ?>
				</div>
			<?php endforeach; ?>
		</div>


		<input type="hidden" class="cmc_exist" name="<?php echo $form->getFormControl(); ?>[exists]" value="0" />

		<?php echo JHTML::_('form.token'); ?>

		<?php if ($params->get('outro-text-1')) : ?>
			<div id="outro1_<?php echo $moduleId; ?>" class="outro1">
				<p class="outro"><?php echo JText::_($params->get('outro-text-1')); ?></p>
			</div>
		<?php endif; ?>

		<button class="btn btn-primary">
			<?php echo JText::_('MOD_CMC_SUBSCRIBE'); ?>
			<img width="16" height="16" class="cmc-spinner" style="display: none;"
			     src="<?php echo JURI::root(); ?>media/mod_cmc/images/loading-bubbles.svg">
		</button>

		<?php if ($params->get('outro-text-2')) : ?>
			<div id="outro2_<?php echo $moduleId; ?>" class="outro2">
				<p class="outro"><?php echo JText::_($params->get('outro-text-2')); ?></p>
			</div>
		<?php endif; ?>
	</form>
</div>
