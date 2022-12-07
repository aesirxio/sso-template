<?php
/**
 * @package     Joomla.Site
 * @subpackage  Templates.AesirX
 *
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Layout\LayoutHelper;

require_once JPATH_THEMES . '/' . $this->template . '/helper.php';

tplRedwebHelper::setMetadata();

?>

<!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
    <head>
        <%= htmlWebpackPlugin.tags.headTags %>
        <jdoc:include type="head" />
    </head>
    <body class="loading <?php echo tplRedwebHelper::setBodySuffix(); ?>" data-spy="scroll">
        <header id="header" class="position-fixed w-100 start-0 top-0 bg-white">
            <div class="container">
                <div class="row align-items-center">
                <?php if ($this->countModules('logo')) : ?>
                    <div id="logo" class="col-lg-3">
                        <jdoc:include type="modules" name="logo" style="xhtml" />
                    </div>
                <?php endif; ?>

            </div>
        </header>

        <div class="body-wrap">
            <?php if ($this->countModules('above-main')) : ?>
                <jdoc:include type="modules" name="above-main" style="xhtml" />
            <?php endif; ?>

            <!-- Main -->
            <main>
                <div class="container">
                <?php if ($this->countModules('above-content')) : ?>
                    <jdoc:include type="modules" name="above-content" style="xhtml" />
                <?php endif; ?>

                <jdoc:include type="message" />
                <jdoc:include type="component" />

                <?php if ($this->countModules('below-content')) : ?>
                    <jdoc:include type="modules" name="below-content" style="xhtml" />
                <?php endif; ?>
                </div>
            </main>

            <?php if ($this->countModules('below-main')) : ?>
            <div class="container">
                <jdoc:include type="modules" name="below-main" style="xhtml" />
            </div>
            <?php endif; ?>

            <!-- Footer -->
            <footer class="bg-red text-white pt-5">

            </footer>
        </div>

        <jdoc:include type="modules" name="debug" style="xhtml" />

        <?php tplRedwebHelper::loadManifest(); ?>
    </body>
</html>
