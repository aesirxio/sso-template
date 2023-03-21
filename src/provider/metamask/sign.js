import React, { useRef, useState } from 'react';
import { useSignMessage } from 'wagmi';
import { verifyMessage } from 'ethers/lib/utils';

import useWallet from '../../hook/useWallet';
import { useAccount } from 'wagmi';

const SignMessage = () => {
  const wallet = 'metamask';
  const { address, connector } = useAccount();
  const { getWalletNonce, verifySignature } = useWallet(wallet, address);
  const [status, setStatus] = useState('');

  const { isLoading, signMessage } = useSignMessage({
    async onSuccess(data, variables) {
      const address = verifyMessage(variables.message, data);
      await verifySignature(wallet, address, data);
    },
  });

  const handleSignMessage = async () => {
    setStatus('connect');
    const nonce = await getWalletNonce();

    if (nonce) {
      setStatus('sign');
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
        {isLoading ? (
          <div className="d-flex align-items-center">
            <span
              className="spinner-border spinner-border-sm me-1"
              role="status"
              aria-hidden="true"
            ></span>
            <span className="ms-1">
              {status === 'sign'
                ? `Please sign message via ${connector?.name}`
                : `Please wait to connect... via ${connector?.name}`}
            </span>
          </div>
        ) : (
          <>Sign in via {connector?.name}</>
        )}
      </button>
    </>
  );
};

export default SignMessage;
