/**
 * @package     AesirX
 * @subpackage  SSO
 *
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
import './app.scss';

import React from 'react';
import ProviderLogin from '../provider';
import { createRoot } from 'react-dom/client';
const container = document.getElementById('providerlogin');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<ProviderLogin />);
