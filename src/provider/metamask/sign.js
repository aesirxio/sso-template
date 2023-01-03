import React, { useRef } from "react";
import { useSignMessage } from "wagmi";
import { verifyMessage } from "ethers/lib/utils";

import Logometamask from "./../../images/Icon.png";
import useWallet from "../../hook/useWallet";
import { useAccount } from "wagmi";

const SignMessage = () => {
  const wallet = "metamask";
  const { address } = useAccount();
  const { getWalletNonce, verifySignature } = useWallet(wallet, address);

  const { isLoading, signMessage } = useSignMessage({
    async onSuccess(data, variables) {
      const address = verifyMessage(variables.message, data);

      await verifySignature(wallet, address, data);
    },
  });

  const handleSignMessage = async () => {
    const nonce = await getWalletNonce();

    if (nonce) {
      signMessage({ message: `${nonce}` });
    }
  };

  return (
    <>
      <button
        disabled={isLoading}
        className="btn btn-primary"
        onClick={handleSignMessage}
      >
        <img src={Logometamask} alt="logo-metamask" />
        Sign in via MetaMask
      </button>
    </>
  );
};

export default SignMessage;
