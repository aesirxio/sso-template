/**
 * @package     AesirX
 * @subpackage  SSO
 *
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
import "./app.scss";

import React from "react";
import ReactDOM from "react-dom";
import ProviverLogin from "../provider";

const el = document.getElementById("providerlogin");
ReactDOM.render(<ProviverLogin />, el);
