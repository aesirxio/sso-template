import React from "react";
import Metamask from "./metamask";
import { WagmiConfig, createClient } from "wagmi";
import { getDefaultProvider } from "ethers";

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
});

const ProviverLogin = () => {
  return (
    <>
      <WagmiConfig client={client}>
        <Metamask />
      </WagmiConfig>
    </>
  );
};

export default ProviverLogin;
