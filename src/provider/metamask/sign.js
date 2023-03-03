import React, { useRef } from 'react';
import { useSignMessage } from 'wagmi';
import { verifyMessage } from 'ethers/lib/utils';

import useWallet from '../../hook/useWallet';
import { useAccount } from 'wagmi';

const SignMessage = () => {
  const wallet = 'metamask';
  const { address, connector } = useAccount();
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
        className="btn btn-white bg-white border fw-semibold"
        onClick={handleSignMessage}
      >
        {isLoading ? 'Waiting for signing...' : 'Sign in'} via {connector?.name}
      </button>
    </>
  );
};

export default SignMessage;
