import React, { useEffect, useState } from 'react';
import SignMessageConcordium from './sign';
import ConnectConcordium from './connect';

import { TESTNET, MAINNET } from '../config';
import { WithWalletConnector } from './react-components/WithWalletConnector';
import { useConnection } from './react-components/useConnection';
import { useConnect } from './react-components/useConnect';
import { withJsonRpcClient } from '@aesirx/wallet-connectors';
import { toast } from 'react-toastify';
import logo from './../../images/concordium.png';

const Concordium = () => {
  return (
    <WithWalletConnector network={MAINNET}>
      {(props) => <ConcordiumApp {...props} />}
    </WithWalletConnector>
  );
};

const ConcordiumApp = (props) => {
  const {
    activeConnectorType,
    activeConnector,
    activeConnectorError,
    network,
    connectedAccounts,
    genesisHashes,
    setActiveConnectorType,
  } = props;

  const { connection, setConnection, account, genesisHash } = useConnection(
    connectedAccounts,
    genesisHashes
  );

  const { connect, connectError } = useConnect(activeConnector, setConnection);

  const [rpcGenesisHash, setRpcGenesisHash] = useState();
  const [rpcError, setRpcError] = useState('');

  useEffect(() => {
    if (connection) {
      setRpcGenesisHash(undefined);
      withJsonRpcClient(connection, async (rpc) => {
        const status = await rpc.getConsensusStatus();
        return status.genesisBlock;
      })
        .then((hash) => {
          if (
            process.env.REACT_APP_CONCORDIUM_NETWORK === 'testnet' &&
            hash !== TESTNET.genesisHash
          ) {
            throw new Error(`Please change the network to Testnet in Wallet`);
          }

          if (
            process.env.REACT_APP_CONCORDIUM_NETWORK === 'mainnet' &&
            hash !== MAINNET.genesisHash
          ) {
            throw new Error(`Please change the network to Mainnet in Wallet`);
          }
          setRpcGenesisHash(hash);

          setRpcError('');
        })
        .catch((err) => {
          setRpcGenesisHash(undefined);
          toast(err.message);
          setRpcError(err.message);
        });
    }
  }, [connection, genesisHash, network]);

  useEffect(() => {
    if (activeConnector) {
      connect();
    }
  }, [activeConnector]);

  useEffect(() => {
    if (connectError) {
      toast(connectError);
    }
  }, [connectError]);

  const handleOnConnect = async (connectorType) => {
    await setActiveConnectorType(connectorType);
  };

  return (
    <>
      {activeConnectorError && <div>Connector error: {activeConnectorError}.</div>}

      {!account || rpcError ? (
        <ConnectConcordium
          handleOnConnect={handleOnConnect}
          activeConnectorError={activeConnectorError}
          activeConnectorType={activeConnectorType}
          activeConnector={activeConnector}
        />
      ) : (
        <>
          {rpcGenesisHash ? (
            <SignMessageConcordium account={account} connection={connection} />
          ) : (
            <div className="p-2 bg-white border fw-semibold text-center rounded-2">
              <div className="pb-2">Connect to Concordium</div>
              <div className="d-flex">
                <button className="btn btn-secondary bg-secondary fw-semibold text-white w-50 py-3">
                  <span
                    className="spinner-border spinner-border-sm me-1"
                    role="status"
                    aria-hidden="true"
                  ></span>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {rpcError && (
        <div variant="warning" className="mt-1">
          RPC error: {rpcError}
        </div>
      )}
    </>
  );
};

export default Concordium;
