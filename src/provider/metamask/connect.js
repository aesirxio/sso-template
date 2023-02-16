import React from 'react';
import Logometamask from './../../images/Icon.png';

import { useConnect } from 'wagmi';

const ConnectMetamask = () => {
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  return (
    <div>
      {connectors.map(
        (connector) =>
          connector.ready && (
            <button
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => connect({ connector })}
              className="btn btn-primary"
            >
              <img src={Logometamask} alt="logo-metamask" />
              Connect to {connector.name}
              {isLoading && connector.id === pendingConnector?.id && ' (connecting)'}
            </button>
          )
      )}
    </div>
  );
};

export default ConnectMetamask;
