import React from 'react';
import Metamask from './metamask';

import Concordium from './concordium';
import ToastComponent from '../components/Toast';

const ProviderLogin = () => {
  const urlParams = new URLSearchParams(window.location.search);
  let login = ['concordium', 'metamask', 'regular'];

  if (urlParams.has('return')) {
    login = new URL(atob(urlParams.get('return'))).searchParams.getAll('login[]');
  }

  const hasMetamask = login.includes('metamask');
  const hasConcordium = login.includes('concordium');

  return (
    <>
      {hasMetamask && (
        <div className="control-group mb-3">
          <Metamask />
        </div>
      )}

      {hasConcordium && (
        <div className="control-group mb-3">
          <Concordium />
        </div>
      )}

      <ToastComponent />
    </>
  );
};

export default ProviderLogin;
