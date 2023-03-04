import React, { useEffect, useState } from 'react';
import SignMessageConcordium from './sign';
import ConnectConcordium from './connect';

import { TESTNET, MAINNET } from '../config';
import { WithWalletConnector } from './react-components/WithWalletConnector';
import { useConnection } from './react-components/useConnection';
import { useConnect } from './react-components/useConnect';
import { withJsonRpcClient } from '@aesirx/wallet-connectors';
import { toast } from 'react-toastify';

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

  const { connect } = useConnect(activeConnector, setConnection);

  const [, setRpcGenesisHash] = useState();
  const [rpcError, setRpcError] = useState('');

  useEffect(() => {
    if (connection) {
      setRpcGenesisHash(undefined);
      withJsonRpcClient(connection, async (rpc) => {
        const status = await rpc.getConsensusStatus();
        return status.genesisBlock;
      })
        .then((hash) => {
          if (process.env.concordiumNetwork === 'testnet' && hash !== TESTNET.genesisHash) {
            throw new Error(`Please change the network to Testnet in Wallet`);
          }

          if (process.env.concordiumNetwork === 'mainnet' && hash !== MAINNET.genesisHash) {
            throw new Error(`Please change the network to Mainnet in Wallet`);
          }
          setRpcGenesisHash(hash);

          setRpcError('');
        })
        .catch((err) => {
          setRpcGenesisHash(undefined);
          toast(err.message);
          setRpcError(errorString(err));
        });
    }
  }, [connection, genesisHash, network]);

  useEffect(() => {
    if (activeConnector) {
      connect();
    }
  }, [activeConnector]);

  const handleOnConnect = async (connectorType) => {
    await setActiveConnectorType(connectorType);
  };

  return (
    <>
      {activeConnectorError && <div>Connector error: {activeConnectorError}.</div>}
      {!activeConnectorError && activeConnectorType && !activeConnector && 'Loading'}

      {!account ? (
        <ConnectConcordium handleOnConnect={handleOnConnect} />
      ) : (
        <SignMessageConcordium account={account} connection={connection} />
      )}

      {rpcError && <div variant="warning">RPC error: {rpcError}</div>}
    </>
  );
};

export default Concordium;
