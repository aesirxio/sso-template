import { Component } from 'react';
import {
  Network,
  WalletConnection,
  WalletConnectionDelegate,
  WalletConnector,
} from '@aesirx/wallet-connectors';
import { errorString } from './error';

/**
 * Produce a {@link ConnectorType} that creates a new connector instance on activation
 * and disconnects the existing one on deactivation.
 * This is the simplest connection type and should be used unless there's a reason not to.
 * @param create Factory function for creating new connector instances.
 */
export function ephemeralConnectorType(create) {
  return {
    activate: create,
    deactivate: (w, c) => c.disconnect(),
  };
}

/**
 * The internal state of the component.
 */

function updateMapEntry(map, key, value) {
  const res = new Map(map);
  if (key !== undefined) {
    if (value !== undefined) {
      res.set(key, value);
    } else {
      res.delete(key);
    }
  }
  return res;
}

/**
 * React component that helps managing wallet connections
 * by introducing a notion of "active" {@link WalletConnector} and {@link WalletConnection},
 * and maintaining their states as part of its own component state.
 * This allows child components to access all relevant information in a reactive manner
 * and provides methods for managing the active connection.
 *
 * The component implements {@link WalletConnectionDelegate} and passes itself to all {@link WalletConnector}s
 * that it initializes.
 * This allows it to receive events from the underlying clients.
 * Once it receives an event for the active {@link WalletConnection},
 * it performs the relevant updates to its component state which then bubble down to child components.
 *
 * This component significantly reduces the complexity of integrating with wallets,
 * even if one only needs to support a single protocol and network.
 */
// TODO Rename to WalletConnectionManager?
export class WithWalletConnector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeConnectorType: undefined,
      activeConnector: undefined,
      activeConnectorError: '',
      genesisHashes: new Map(),
      connectedAccounts: new Map(),
    };
  }

  /**
   * @see WalletConnectionProps.setActiveConnectorType
   */
  setActiveConnectorType = (type) => {
    console.debug("WithWalletConnector: calling 'setActiveConnectorType'", {
      type,
      state: this.state,
    });
    const { network } = this.props;
    const { activeConnectorType, activeConnector } = this.state;
    this.setState({
      activeConnectorType: type,
      activeConnector: undefined,
      activeConnectorError: '',
    });
    if (activeConnectorType && activeConnector) {
      activeConnectorType.deactivate(this, activeConnector).catch((err) =>
        this.setState((state) => {
          // Don't set error if user switched connector type since initializing this connector.
          // It's OK to show it if the user switched away and back...
          if (state.activeConnectorType !== type) {
            return state;
          }
          return { ...state, activeConnectorError: errorString(err) };
        })
      );
    }
    if (type) {
      type
        .activate(this, network)
        .then((connector) => {
          console.log('WithWalletConnector: setting active connector', { connector });
          // Switch the connector (type) back in case the user changed it since initiating the connection.
          this.setState({
            activeConnectorType: type,
            activeConnector: connector,
            activeConnectorError: '',
          });
        })
        .catch((err) =>
          this.setState((state) => {
            if (state.activeConnectorType !== type) {
              return state;
            }
            return { ...state, activeConnectorError: errorString(err) };
          })
        );
    }
  };

  onAccountChanged = (connection, address) => {
    console.debug("WithWalletConnector: calling 'onAccountChanged'", {
      connection,
      address,
      state: this.state,
    });
    this.setState((state) => ({
      ...state,
      connectedAccounts: updateMapEntry(state.connectedAccounts, connection, address || ''),
    }));
  };

  onChainChanged = (connection, genesisHash) => {
    console.debug("WithWalletConnector: calling 'onChainChanged'", {
      connection,
      genesisHash,
      state: this.state,
    });
    this.setState((state) => ({
      ...state,
      genesisHashes: updateMapEntry(state.genesisHashes, connection, genesisHash),
    }));
  };

  onConnected = (connection, address) => {
    console.debug("WithWalletConnector: calling 'onConnected'", { connection, state: this.state });
    this.onAccountChanged(connection, address);
  };

  onDisconnected = (connection) => {
    console.debug("WithWalletConnector: calling 'onDisconnected'", {
      connection,
      state: this.state,
    });
    this.setState((state) => ({
      ...state,
      connectedAccounts: updateMapEntry(state.connectedAccounts, connection, undefined),
    }));
  };

  render() {
    const { children, network } = this.props;
    return children({
      ...this.state,
      network,
      setActiveConnectorType: this.setActiveConnectorType,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.network !== this.props.network) {
      // Reset active connector and connection when user changes network.
      // In the future there may be a mechanism for negotiating with the wallet.
      this.setActiveConnectorType(undefined);
    }
  }

  componentWillUnmount() {
    // TODO Disconnect everything?
  }
}
