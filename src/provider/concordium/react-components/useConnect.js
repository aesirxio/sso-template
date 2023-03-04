import { useCallback, useState } from 'react';
import { errorString } from './error';

/**
 * Hook that exposes a function for initiating a connection on the provided {@link connector} and,
 * if successful, store the resulting connection in {@link setConnection}.
 * The hook also exposes the status of the connection progress and error if initiation failed.
 * @param connector The connector from which new connections are to be initiated.
 * @param setConnection The setter function to which new connections are passed.
 */
export function useConnect(connector, setConnection) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectError, setConnectError] = useState('');
  const connect = useCallback(() => {
    if (!connector) {
      throw new Error('no connector to connect from');
    }
    setIsConnecting(true);
    connector
      .connect()
      .then((c) => {
        if (c) {
          setConnection(c);
          setConnectError('');
        }
      })
      .catch((e) => setConnectError(errorString(e)))
      .finally(() => setIsConnecting(false));
  }, [connector, setConnection]);
  return { connect, isConnecting, connectError };
}
