import React, { useEffect, useState } from 'react';
import SignMessageConcordium from './sign';
import ConnectConcordium from './connect';

import { TESTNET, MAINNET } from '../config';
import {
  useConnection,
  useConnect,
  withJsonRpcClient,
  WithWalletConnector,
} from '@concordium/react-components';

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
          setRpcGenesisHash(hash);
          setRpcError('');
        })
        .catch((err) => {
          setRpcGenesisHash(undefined);
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

  console.log('connection', connection);

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
