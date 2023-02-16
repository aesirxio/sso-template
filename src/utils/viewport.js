/**
 * @package     AesirX
 * @subpackage  SSO
 *
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

const breakpoints = require('./breakpoints.js');

export var viewport = 'mobile';

Object.keys(breakpoints).map(function (screen) {
  Object.keys(breakpoints[screen]).map(function (breakpoint) {
    if (window.innerWidth > parseInt(breakpoints[screen][breakpoint])) {
      viewport = screen;
    }
  });
});

export function loadStyle(name) {
  if (joomlaOptions[name + '-' + viewport + '.css']) {
    var body = document.querySelector('body');

    var style = document.createElement('link');
    style.href = joomlaOptions[name + '-' + viewport + '.css'];
    style.type = 'text/css';
    style.rel = 'stylesheet';
    body.append(style);
  }
}
