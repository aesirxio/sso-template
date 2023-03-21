import React, { useState } from 'react';
import logo from './../../images/concordium.png';
import useWallet from '../../hook/useWallet';
import { toast } from 'react-toastify';
import { shortenString } from '../../utils/shortenString';
const SignMessageConcordium = ({ account, connection }) => {
  const [status, setStatus] = useState('');
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
    }
    setStatus('');
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
    </>
  );
};

export default SignMessageConcordium;
