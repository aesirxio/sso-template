import React, { useState } from 'react';
import { useSignMessage } from 'wagmi';
import { verifyMessage } from 'ethers/lib/utils';

import useWallet from '../../hook/useWallet';
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';

const SignMessage = () => {
  const wallet = 'metamask';
  const { address, connector } = useAccount();
  const { getWalletNonce, verifySignature, getAesirXNonce, createAesirXAccount } = useWallet(
    wallet,
    address
  );
  const [status, setStatus] = useState('');
  const [isAccountCreated, setIsAccountCreated] = useState(true);

  const { isLoading, signMessage } = useSignMessage({
    async onSuccess(data, variables) {
      const address = verifyMessage(variables.message, data);
      if (variables?.method === 'create') {
        const aesirXID = await createAesirXAccount(wallet, address, data);
        if (aesirXID) {
          setIsAccountCreated(true);
        }
      } else {
        await verifySignature(wallet, address, data);
      }
    },
    async onError(error) {
      toast(error?.message);
    },
  });

  const handleSignMessage = async () => {
    setStatus('connect');
    const nonce = await getWalletNonce();

    if (nonce) {
      setStatus('sign');
      signMessage({ message: `${nonce}` });
    } else {
      setIsAccountCreated(false);
    }
  };

  const handleCreateAccount = async () => {
    try {
      const nonce = await getAesirXNonce(wallet, address);
      if (nonce) {
        signMessage({ message: `${nonce}`, method: 'create' });
      }
    } catch (error) {
      throw error;
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
      {!isAccountCreated && (
        <>
          <div className="mt-4 mb-2 text-danger">
            Your wallet is not connected any AesirX account.
          </div>
          <button
            type="button"
            className="btn btn-white fw-semibold border mb-4"
            disabled={isLoading}
            onClick={handleCreateAccount}
          >
            {isLoading ? (
              <div className="d-flex align-items-center">
                <span
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span className="ms-1">{`Creating account...`}</span>
              </div>
            ) : (
              <>Create AesirX SSO</>
            )}
          </button>
        </>
      )}
    </>
  );
};

export default SignMessage;
