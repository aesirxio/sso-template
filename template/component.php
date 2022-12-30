<?php
/**
 * @package     AesirX
 * @subpackage  SSO
 *
 * @copyright   Copyright (C) 2022 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;

require_once JPATH_THEMES . '/' . $this->template . '/helper.php';

tplRedwebHelper::setMetadata();

?>

<!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
    <head>
        <%= htmlWebpackPlugin.tags.headTags %>
        <jdoc:include type="head" />
    </head>

    <body class="contentpane">
        <jdoc:include type="message" />
        <jdoc:include type="component" />

        <%= htmlWebpackPlugin.tags.bodyTags %>
    </body>
</html>
