import React from "react";

import { useConnect } from "wagmi";

const ConnectMetamask = () => {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

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
              {connector.name}
              {isLoading &&
                connector.id === pendingConnector?.id &&
                " (connecting)"}
            </button>
          )
      )}
    </div>
  );
};

export default ConnectMetamask;
