import React, { useState } from 'react';
import logo from './../../images/concordium.png';
import useWallet from '../../hook/useWallet';
import { toast } from 'react-toastify';
import { shortenString } from '../../utils/shortenString';
import axios from 'axios';
const SignMessageConcordium = ({ account, connection }) => {
  const [status, setStatus] = useState('');
  const [isAccountCreated, setIsAccountCreated] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const wallet = 'concordium';

  const { getWalletNonce, verifySignature } = useWallet(wallet, account);

  const handleConnect = async () => {
    setStatus('connect');
    const nonce = await getWalletNonce();
    if (nonce) {
      try {
        setStatus('sign');
        const signature = await connection.signMessage(account, `${nonce}`);
        let convertedSignature =
          typeof signature === 'object' && signature !== null ? signature : JSON.parse(signature);

        if (signature) {
          await verifySignature(wallet, account, convertedSignature);
        }
      } catch (error) {
        toast(error.message);
      }
    } else {
      setIsAccountCreated(false);
    }
    setStatus('');
  };

  const handleCreateAccount = async () => {
    try {
      setIsCreating(true);
      const nonce = (
        await axios.post(
          `${window.location.origin}/index.php?webserviceClient=site&webserviceVersion=1.0.0&option=reditem&view=item_wallet_requests_66&api=hal`,
          { public_address: account, wallet: 'concordium' },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      ).data?.nonce;

      const signature = await connection.signMessage(account, String(nonce));
      const signedNonce =
        typeof signature === 'object' && signature !== null ? signature : JSON.parse(signature);
      try {
        const aesirXID = (
          await axios.post(
            `${window.location.origin}/index.php?webserviceClient=site&webserviceVersion=1.0.0&option=reditem&view=item_wallet_requests_66&task=validateSignature&api=hal`,
            { public_address: account, wallet: 'concordium', signature: signedNonce },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        ).data?.result?.id;
        if (aesirXID) {
          setIsAccountCreated(true);
          if (signedNonce) {
            await verifySignature(wallet, account, signedNonce);
          }
        }
      } catch (error) {
        toast(error.message);
      }
      setIsCreating(false);
    } catch (error) {
      setIsCreating(false);
      throw error;
    }
  };
  return (
    <>
      <p className="text-break">
        <span className="fw-semibold">Connected Account:</span>
        <span className="ms-1">{account && shortenString(account)}</span>
      </p>
      <button
        className="btn btn-secondary bg-secondary fw-semibold text-white"
        onClick={handleConnect}
      >
        {status ? (
          <div className="d-flex align-items-center">
            <span
              className="spinner-border spinner-border-sm me-1"
              role="status"
              aria-hidden="true"
            ></span>
            <span className="ms-1">
              {status === 'sign'
                ? 'Please sign message on the wallet'
                : `Please wait to connect...`}
            </span>
          </div>
        ) : (
          <>
            <img className="me-2" width={20} height={21} src={logo} alt="logo-concordium" />
            Sign in via Concordium
          </>
        )}
      </button>
      {!isAccountCreated && (
        <>
          <div className="mt-4 mb-2 text-danger">
            Your wallet is not connected any AesirX account.
          </div>
          <button
            type="button"
            className="btn btn-secondary fw-semibold text-white"
            disabled={isCreating}
            onClick={handleCreateAccount}
          >
            {isCreating ? (
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

export default SignMessageConcordium;
