<?php
/**
 * @package     AesirX
 * @subpackage  SSO
 *
 * @copyright   Copyright (C) 2022 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Helper\ModuleHelper;
use Joomla\CMS\Uri\Uri;
use Joomla\Registry\Registry as CMSRegistry;

require_once __DIR__ . '/vendor/autoload.php';
/**
 * AesirX template helper.
 *
 * @package    Joomla.Site
 * @subpackage Template.AesirX
 *
 * @since   1.0.0
 */
class TplRedwebHelper
{
    /**
     * scripts variable
     *
     * @var array
     */
    private static $scripts = array();

    /**
     * styles variable
     *
     * @var array
     */
    private static $styles = array();

    /**
     * easirCategory variable
     *
     * @var string
     */
    private static $easirCategory = "";

    /**
     * Method to get Template
     *
     * @access public
     *
     * @return mixed
     * @throws Exception
     */
    public static function template()
    {
        return Factory::getApplication()->getTemplate();
    }

    /**
     * Method to get current Page Option
     *
     * @access public
     *
     * @return mixed
     * @since 1.0
     */
    public static function getPageOption()
    {
        return Factory::getApplication()->input->getCmd('option', '');
    }

    /**
     * Method to get current Page View
     *
     * @access public
     *
     * @return mixed
     * @since 1.0
     */
    public static function getPageView()
    {
        return Factory::getApplication()->input->getCmd('view', '');
    }

    /**
     * Method to get current Page Layout
     *
     * @access public
     *
     * @return mixed
     * @since version
     */
    public static function getPageLayout()
    {
        $layout = self::getAesirLayout();

        if ($layout) {
            return $layout;
        }

        return Factory::getApplication()->input->getCmd('layout', 'default');
    }

    /**
     * Method to get current Page Task
     *
     * @access public
     *
     * @return mixed
     * @since 1.0
     */
    public static function getPageTask()
    {
        return Factory::getApplication()->input->getCmd('task', '');
    }

    /**
     * Method to get the current Menu Item ID
     *
     * @access public
     *
     * @return integer
     * @since 1.0
     */
    public static function getItemId()
    {
        return Factory::getApplication()->input->getInt('Itemid');
    }

    /**
     * Method to get PageClass set with Menu Item
     *
     * @return mixed
     * @since  1.0
     */
    public static function getPageClass()
    {
        $activeMenu = Factory::getApplication()->getMenu()->getActive();
        $pageclass  = ($activeMenu) ? $activeMenu->params->get('pageclass_sfx', '') : '';

        return $pageclass;
    }

    /**
     * Method to determine whether the current page is the Joomla! homepage
     *
     * @access public
     *
     * @return boolean
     * @since  1.0
     */
    public static function isHome()
    {
        // Fetch the active menu-item
        $activeMenu = Factory::getApplication()->getMenu()->getActive();

        // Return whether this active menu-item is home or not
        return (bool) ($activeMenu) ? $activeMenu->home : false;
    }

    /**
     * Method to fetch the current path
     *
     * @access public
     *
     * @param   string $output Output type
     *
     * @return mixed
     * @since  1.0
     */
    public static function getPath($output = 'array')
    {
        $path = Uri::getInstance()->getPath();
        $path = preg_replace('/^\//', '', $path);

        if ($output == 'array') {
            $path = explode('/', $path);

            return $path;
        }

        return $path;
    }

    /**
     * Generate a list of useful CSS classes for the body
     *
     * @access public
     *
     * @return boolean
     * @since  1.0
     */
    public static function setBodySuffix()
    {
        $classes   = array();
        $classes[] = 'option-' . self::getPageOption();
        $classes[] = 'view-' . self::getPageView();
        $classes[] = 'layout-' . self::getPageLayout();
        $classes[] = self::getPageTask() ? 'task-' . self::getPageTask() : 'no-task';
        $classes[] = 'itemid-' . self::getItemId();
        $classes[] = self::getPageClass();
        $classes[] = self::isHome() ? 'path-home' : 'path-' . implode('-', self::getPath('array'));

        return implode(' ', $classes);
    }

    /**
     * Method to manually override the META-generator
     *
     * @access public
     *
     * @param   string $generator Generator
     *
     * @return void
     *
     * @since  1.0
     */
    public static function setGenerator($generator)
    {
        Factory::getDocument()->setGenerator($generator);
    }

    /**
     * Method to get the current sitename
     *
     * @access public
     *
     * @return string
     * @since  1.0
     */
    public static function getSitename()
    {
        return Factory::getConfig()->get('sitename');
    }

    /**
     * Method to set some Meta data
     *
     * @access public
     *
     * @return void
     * @since  1.0
     */
    public static function setMetadata()
    {
        $doc    = Factory::getDocument();

        $doc->setHtml5(true);
        $doc->setMetaData('X-UA-Compatible', 'IE=edge', true);
        $doc->setMetaData('viewport', 'width=device-width, initial-scale=1, shrink-to-fit=no');
        $doc->addHeadLink(Uri::current(), 'canonical', 'rel');
    }

    /**
     * Method to set manifest
     *
     * @access public
     *
     * @return void
     * @since  1.0
     */
    public static function loadManifest()
    {
        $doc    = Factory::getDocument();
        $manifest = file_get_contents(JPATH_THEMES . '/' . Factory::getDocument()->template . '/assets-manifest.json');
        $json = json_decode($manifest, true);

        $criticalPath = JPATH_THEMES . '/' . Factory::getDocument()->template . '/css/critical.css';

        if (file_exists($criticalPath)) {
            $doc->addStyleDeclaration(file_get_contents($criticalPath));
        }

        // Index
        self::addScript($json, 'app');

        // Home or page
        if (self::isHome()) {
            $name = 'views.homepage';
        } else {
            $name = self::getPageOption() . '.' . self::getPageView() . '.' . self::getPageLayout();
        }

        self::addScript($json, $name);

        // Modules
        $modules = ModuleHelper::getModuleList();

        if (count($modules) > 0) {
            foreach ($modules as $module) {
                $params = new CMSRegistry($module->params);

                if (empty($module->position)) {
                    continue;
                }

                $name = 'modules.' . $module->module . '.' . $module->position;

                self::addScript($json, $name);

                if (!empty($params->get('moduleclass_sfx', ''))) {
                    $sfx = preg_replace('/\s+/', '', $params->get('moduleclass_sfx', ''));
                    $name .= '.' . $sfx;

                    self::addScript($json, $name);
                }
            }
        }

        if (self::$scripts) {
            foreach (self::$scripts as $script) {
                $doc->addScript($script, "text/javascript", true);
            }
        }

        if (self::$styles) {
            foreach (self::$styles as $i => $style) {
                $doc->addCustomTag('<link href="' . $style . '" rel="preload" as="style" onload="this.onload=null;this.rel=\'stylesheet\'" />');
            }
        }
    }

    /**
     * Method to set script
     *
     * @access public
     *
     * @return void
     * @since  1.0
     */
    private static function addScript($json, $name)
    {
        $entrypoints = $json['entrypoints'];

        if (isset($entrypoints[$name]['assets']['css'])) {
            $css = $entrypoints[$name]['assets']['css'];

            foreach ($css as $item) {
                self::$styles[md5($item)] =  $item;
            }
        }

        if (isset($entrypoints[$name]['assets']['js'])) {
            $js = $entrypoints[$name]['assets']['js'];

            foreach ($js as $item) {
                self::$scripts[md5($item)] =  $item;
            }
        }

        $detect = new \Detection\MobileDetect;

        if (isset($json[$name . '-tablet.css']) && $detect->isTablet()) {
            self::$styles[md5($name . '-tablet.css')] = $json[$name . '-tablet.css'];
        }

        if (isset($json[$name . '-desktop.css']) && !$detect->isMobile() && !$detect->isTablet()) {
            if (isset($json[$name . '-tablet.css'])) {
                self::$styles[md5($name . '-tablet.css')] = $json[$name . '-tablet.css'];
            }

            self::$styles[md5($name . '-desktop.css')] = $json[$name . '-desktop.css'];
        }
    }

    /**
     * Load the active category.
     *
     * @return  self
     *
     * @throws  Exception
     */
    private static function getActiveAesirCategory()
    {
        $app = Factory::getApplication();

        $categoryId = $app->input->getInt('id', 0);

        if (!$categoryId) {
            return false;
        }

        $category = ReditemEntityCategory::load($categoryId);

        if ($category->canView()) {
            return $category;
        }

        return false;
    }

    /**
     * Get the layout.
     *
     * @return  string  The layout name
     *
     * @throws  Exception
     */
    private static function getAesirLayout()
    {
        $option = self::getPageOption();

        if ($option != 'com_reditem') {
            return false;
        }

        $app = Factory::getApplication();
        $id = $app->input->getInt('id', 0);

        if (!$id) {
            return false;
        }

        $view = self::getPageView();
        $entity = null;

        if (in_array($view, array('category_items', 'category_descendant_items'))) {
            $entity = ReditemEntityCategory::load($id);

            return $entity->layout ?? 'default';
        } elseif (in_array($view, array('itemdetail', 'item'))) {
            $entity = ReditemEntityItem::load($id);

            return $entity->layout ?? 'default';
        } elseif (in_array($view, array('type_items'))) {
            $menus          = $app->getMenu();
            $activeMenu     = $menus->getActive()->params;

            return $activeMenu->get('layout', 'default');
        }

        return false;
    }
}
