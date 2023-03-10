<?php
/**
 * @package     Redcore
 * @subpackage  Layouts
 *
 * @copyright   Copyright (C) 2008 - 2021 redWEB.dk. All rights reserved.
 * @license     GNU General Public License version 2 or later, see LICENSE.
 *
 */

defined('JPATH_REDCORE') or die;
$formName = !empty($displayData['options']['formName']) ? $displayData['options']['formName'] : 'adminForm';
$formId = !empty($displayData['options']['formId']) ? $displayData['options']['formId'] : 'adminForm';
$formAlign = !empty($displayData['options']['formAlign']) ? $displayData['options']['formAlign'] : 'form-horizontal';
$formAction = !empty($displayData['options']['formAction']) ? $displayData['options']['formAction'] : '';
$clientId = !empty($displayData['options']['clientId']) ? $displayData['options']['clientId'] : JFactory::getConfig()->get('sitename', 'API');
$scopes = !empty($displayData['options']['scopes']) ? $displayData['options']['scopes'] : array();
$column = 0;

?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<%= htmlWebpackPlugin.tags.headTags %>

</head>
<body class="p-5">
<form action="<?php echo $formAction; ?>" method="post" name="<?php echo $formName; ?>" id="<?php echo $formId; ?>" class="<?php echo $formAlign; ?>">
	<div class="container"><h1>Welcome to AesirX SSO</h1>

	<p><?php echo JText::sprintf('LIB_REDCORE_API_OAUTH2_SERVER_AUTHORIZE_CLIENT_BODY', "AesirX", "AesirX"); ?></p>

	<p><?php echo JText::sprintf('LIB_REDCORE_API_OAUTH2_SERVER_AUTHORIZE_CLIENT_FOOTER', "AesirX"); ?></p>
<div style="text-align: center">
	<input
		type="submit"
		name="authorized"
		class="btn btn-lg btn-success"
		value="<?php echo JText::_('LIB_REDCORE_API_OAUTH2_SERVER_AUTHORIZE_CLIENT_YES'); ?>"
		/>
	<input type="submit" name="authorized" class="btn btn-lg btn-danger" value="<?php echo JText::_('JCANCEL'); ?>" />
</div>
</div>
</form>


</body>
</html>
