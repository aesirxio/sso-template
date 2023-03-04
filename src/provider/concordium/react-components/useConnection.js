import { useEffect, useState } from 'react';

/**
 * Hook for managing a connection and exposing its state.
 * The connection is automatically pruned from the state when it disconnects.
 * @param connectedAccounts Mapping from open connections to their selected accounts or the empty string if there isn't one.
 * @param genesisHashes Mapping from open connections to the hash of the genesis block for the chain that the selected accounts of the connections live on.
 */
export function useConnection(connectedAccounts, genesisHashes) {
  const [connection, setConnection] = useState();
  useEffect(() => {
    // Unset disconnected connection.
    if (connection && !connectedAccounts.has(connection)) {
      setConnection(undefined);
    }
  }, [connectedAccounts]);
  return {
    connection,
    setConnection,
    genesisHash: connection && genesisHashes.get(connection),
    account: connection && connectedAccounts.get(connection),
  };
}
