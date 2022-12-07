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
                <?php if ($this->countModules('main-menu')) : ?>
                    <div class="w-auto ps-5">
                        <jdoc:include type="modules" name="main-menu" style="xhtml" />
                    </div>
                <?php endif; ?>
                <button class="me-3 ms-auto w-auto btn btn-primary rounded-pill px-4 py-2 text-uppercase fw-bold" data-toggle="modal" data-target="#loginForm">Log ind</button>
                <?php if ($this->countModules('top-right')) : ?>
                    <div id="top-right" class="ms-auto">
                        <jdoc:include type="modules" name="top-right" style="xhtml" />
                    </div>
                <?php endif; ?>
                </div>
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
                <div class="container">
                    <div id="footer-wrap" class="pt-3 pb-5 row">
                        <div class="col-lg-3">{modulepos footer-logo}</div>
                        <div class="col-lg-9">
                            <div class="d-lg-flex gap-4 justify-content-between">
                                <jdoc:include type="modules" name="footer" style="xhtml" />
                            </div>
                        </div>
                        <div class="text-end">
                            <a class="f-merri text-white text-decoration-none fw-bold d-inline-flex align-items-center" href="#" id="scroll-top">
                                Til toppen
                                <span class="ms-3 d-inline-flex justify-content-center align-items-center bg-white text-danger rounded-circle"></span>
                            </a>
                        </div>
                    </div>
                    <div id="copyright">
                        <div class="f-merri py-4 d-flex align-items-center justify-content-between">
                            <jdoc:include type="modules" name="copyright" style="xhtml" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="loginForm" tabindex="-1" role="dialog" aria-labelledby="loginFormTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content border-0">
                    <div class="modal-body px-4 pb-5 pt-4 shadow-lg">
                        <span class="close ms-auto" data-dismiss="modal" aria-label="Close" aria-hidden="true">&times;</span>
                        <jdoc:include type="modules" name="modal" style="xhtml" />
                    </div>
                </div>
            </div>
        </div>

        <jdoc:include type="modules" name="debug" style="xhtml" />

        <?php tplRedwebHelper::loadManifest(); ?>
    </body>
</html>
