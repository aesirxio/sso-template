import React from "react";

import ConnectMetamask from "./connect";
import SignMessage from "./sign";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const Metamask = () => {
  const { isConnected } = useAccount();

  return isConnected ? <SignMessage /> : <ConnectMetamask />;
};

export default Metamask;
