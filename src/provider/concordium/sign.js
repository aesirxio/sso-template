import React, { useState } from "react";
import { detectConcordiumProvider } from "@concordium/browser-wallet-api-helpers";
import logo from "./../../images/concordium.png";
import useWallet from "../../hook/useWallet";

const SignMessageConcordium = ({ accountAddress }) => {
  const wallet = "concordium";

  const { getWalletNonce, verifySignature } = useWallet(wallet, accountAddress);

  const handleConnect = async () => {
    const nonce = await getWalletNonce();
    if (nonce) {
      const provider = await detectConcordiumProvider();
      const signature = await provider.signMessage(accountAddress, `${nonce}`);

      if (signature) {
        await verifySignature(wallet, accountAddress, signature);
      }
    }
  };

  return (
    <button className="btn btn-blue" onClick={handleConnect}>
      <img width={20} height={21} src={logo} alt="logo-concordium" />
      Sign in via Concordium
    </button>
  );
};

export default SignMessageConcordium;
