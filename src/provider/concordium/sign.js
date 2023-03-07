import React, { useState } from 'react';
import logo from './../../images/concordium.png';
import useWallet from '../../hook/useWallet';
import { toast } from 'react-toastify';
const SignMessageConcordium = ({ account, connection }) => {
  const [loading, setLoading] = useState(false);
  const wallet = 'concordium';

  const { getWalletNonce, verifySignature } = useWallet(wallet, account);

  const handleConnect = async () => {
    setLoading(true);
    const nonce = await getWalletNonce();
    if (nonce) {
      try {
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

    setLoading(false);
  };
  return (
    <>
      <p className="text-break">
        <span className="fw-semibold">Connected Account:</span> ${account}
      </p>
      <button
        className="btn btn-secondary bg-secondary fw-semibold text-white"
        onClick={handleConnect}
      >
        <img className="me-2" width={20} height={21} src={logo} alt="logo-concordium" />

        {loading ? 'Waiting...' : 'Sign in via Concordium'}
      </button>
    </>
  );
};

export default SignMessageConcordium;
