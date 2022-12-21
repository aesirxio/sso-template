import React, { useEffect, useState } from "react";
import { detectConcordiumProvider } from "@concordium/browser-wallet-api-helpers";
import ConnectConcordium from "./connect";
import SignMessageConcordium from "./sign";

const Concordium = () => {
  const [accountAddress, setAccountAddress] = useState();

  const handleConnect = async () => {
    const provider = await detectConcordiumProvider();
    const accountAddress = await provider.connect();

    if (accountAddress) {
      setAccountAddress(accountAddress);
    }
  };

  useEffect(() => {
    (async () => {
      const provider = await detectConcordiumProvider();
      const accountAddress = await provider.getMostRecentlySelectedAccount();

      if (accountAddress) {
        setAccountAddress(accountAddress);
      }
    })();
  }, []);

  return accountAddress ? (
    <SignMessageConcordium accountAddress={accountAddress} />
  ) : (
    <ConnectConcordium handleConnect={handleConnect} />
  );
};

export default Concordium;
