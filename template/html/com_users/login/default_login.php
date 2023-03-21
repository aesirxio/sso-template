<?php
/**
 * @package     AesirX
 * @subpackage  SSO
 *
 * @copyright   Copyright (C) 2022 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

use Joomla\CMS\Factory;
use Joomla\Uri\Uri;

defined('_JEXEC') or die;

JHtml::_('behavior.keepalive');
JHtml::_('behavior.formvalidator');
// Get params
$params         = JFactory::getApplication()->get("themeParams");
$logo           = $params->get('logo');
?>
<div class="body-login<?php echo $this->pageclass_sfx; ?> ">
	<?php if ($this->params->get('show_page_heading')) : ?>
		<div class="page-header">
			<h1>
				<?php echo $this->escape($this->params->get('page_heading')); ?>
			</h1>
		</div>
	<?php endif; ?>
	<?php if (($this->params->get('logindescription_show') == 1 && str_replace(' ', '', $this->params->get('login_description')) != '') || $this->params->get('login_image') != '') : ?>
		<div class="login-description">
	<?php endif; ?>
	<?php if ($this->params->get('logindescription_show') == 1) : ?>
		<?php echo $this->params->get('login_description'); ?>
	<?php endif; ?>
	<?php if ($this->params->get('login_image') != '') : ?>
		<img src="<?php echo $this->escape($this->params->get('login_image')); ?>" class="login-image" alt="<?php echo JText::_('COM_USERS_LOGIN_IMAGE_ALT'); ?>" />
	<?php endif; ?>
	<?php if (($this->params->get('logindescription_show') == 1 && str_replace(' ', '', $this->params->get('login_description')) != '') || $this->params->get('login_image') != '') : ?>
		</div>
	<?php endif; ?>
	<h1 class="fw-semibold">
		Welcome to<div class="logo-login"><div class="custom"><img src="<?php echo $this->baseurl; ?>/<?php echo htmlspecialchars($logo, ENT_QUOTES); ?>"  alt="<?php echo htmlspecialchars($this->params->get('sitetitle')); ?>" /></div></div>SSO
		<br/>Sign In to getting started.
	</h1>
	<div class="login">
	<div class="masklogin" id="providerlogin">
		<div class="position-relative text-center">
			<span class="spinner-border spinner-border-lg me-1 text-secondary text-center"
				role="status"
				aria-hidden="true">
			</span>
		</div>
	</div>
		<?php
		$input = Factory::getApplication()->input;
		$showRegularLogin = true;

		$return = $input->getBase64('return');

		if ($return)
		{
			$returnUri = new Uri(base64_decode($return));

			if (is_array($returnUri->getVar('login'))
				&& !in_array('regular', $returnUri->getVar('login')))
			{
				$showRegularLogin = false;
			}
		}

		if ($showRegularLogin):
		?>
	<div class="txt_or my-3"><span class="font-inter fw-medium bg-white px-3 py-2 d-inline-block">OR</span></div>
	<form action="<?php echo JRoute::_('index.php?option=com_users&task=user.login'); ?>" method="post" class="form-validate form-horizontal well">
		<fieldset>
			<?php echo $this->form->renderFieldset('credentials'); ?>
			<?php if ($this->tfa) : ?>
				<?php echo $this->form->renderField('secretkey'); ?>
			<?php endif; ?>
			<?php if (JPluginHelper::isEnabled('system', 'remember')) : ?>
				<div class="control-group form-checkbox">
					<div class="control-label">
						<label for="remember">
							<?php echo JText::_('COM_USERS_LOGIN_REMEMBER_ME'); ?>
						</label>
					</div>
					<div class="controls">
						<input id="remember" type="checkbox" name="remember" class="inputbox" value="yes" />
					</div>
				</div>
			<?php endif; ?>
			<p>Don't have an account? Register <a href="https://aesirx.io/" target="_blank">here</a></p>
			<div class="control-group mb-0">
				<div class="controls">
					<button type="submit" class="btn btn-success bg-success text-white text-uppercase fw-bold">
						<?php echo JText::_('JLOGIN'); ?>
					</button>
				</div>
			</div>
			<?php $return = $this->form->getValue('return', '', $this->params->get('login_redirect_url', $this->params->get('login_redirect_menuitem'))); ?>
			<input type="hidden" name="return" value="<?php echo base64_encode($return); ?>" />
			<?php echo JHtml::_('form.token'); ?>
		</fieldset>
	</form>
		<?php endif; ?>
	</div>
</div>
