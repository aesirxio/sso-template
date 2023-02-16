import React from 'react';
import Metamask from './metamask';
import { WagmiConfig, createClient } from 'wagmi';
import { getDefaultProvider } from 'ethers';
import Concordium from './concordium';
import ToastComponent from '../components/Toast';

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
});

const ProviverLogin = () => {
  return (
    <>
      <div className="control-group">
        <WagmiConfig client={client}>
          <Metamask />
        </WagmiConfig>
      </div>
      <div className="control-group">
        <Concordium />
      </div>
      <ToastComponent />
    </>
  );
};

export default ProviverLogin;
