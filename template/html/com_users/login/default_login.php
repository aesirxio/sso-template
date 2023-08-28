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
	<h1 class="fw-semibold">
		Welcome to<div class="logo-login"><div class="custom"><img src="<?php echo $this->baseurl; ?>/<?php echo htmlspecialchars($logo, ENT_QUOTES); ?>"  alt="<?php echo htmlspecialchars($this->params->get('sitetitle')); ?>" /></div></div>
		<br/>Sign in to get started.
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
	</div>
</div>
