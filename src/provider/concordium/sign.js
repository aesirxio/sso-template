import React, { useState } from "react";
import { detectConcordiumProvider } from "@concordium/browser-wallet-api-helpers";
import logo from "./../../images/concordium.png";
import useNonce from "../../hook/useNonce";
import { toast } from "react-toastify";

const SignMessageConcordium = ({ accountAddress }) => {
  const { getWalletNonce, verifySignature } = useNonce(
    "concordium",
    accountAddress
  );

  const handleConnect = async () => {
    const nonce = await getWalletNonce();
    if (nonce) {
      const provider = await detectConcordiumProvider();
      const signature = await provider.signMessage(accountAddress, nonce);

      if (signature[0]) {
        await verifySignature(address, signature[0][0]);
      }
    } else {
      toast("Your wallet is not registered");
    }
  };

  return (
    <>
      <button className="btn btn-primary" onClick={handleConnect}>
        <img width={40} src={logo} alt="logo-concordium" />
        Login via Concordium
      </button>
    </>
  );
};

export default SignMessageConcordium;
